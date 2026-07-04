use std::collections::HashMap;
use std::sync::{Arc, Mutex as StdMutex};

use crate::errors::Result;
use crate::internal::session_store::file_path_to_session_key;
use crate::types::{SessionKey, SessionStore, SessionStoreEntry};

/// Maximum pending entries before triggering an eager flush.
pub const MAX_PENDING_ENTRIES: usize = 500;

/// Maximum pending bytes before triggering an eager flush.
pub const MAX_PENDING_BYTES: usize = 1 << 20; // 1 MiB

pub const SEND_TIMEOUT_SECONDS: f64 = 60.0;

const MIRROR_APPEND_MAX_ATTEMPTS: usize = 3;
const MIRROR_APPEND_BACKOFF_S: &[f64] = &[0.2, 0.8];

struct MirrorEntry {
    file_path: String,
    entries: Vec<SessionStoreEntry>,
    bytes: usize,
}

/// On-error callback type: receives the session key (if resolvable) and error message.
pub type OnErrorCallback = Box<
    dyn Fn(Option<SessionKey>, String) -> futures::future::BoxFuture<'static, ()> + Send + Sync,
>;

struct BatcherInner {
    store: Box<dyn SessionStore>,
    projects_dir: String,
    on_error: OnErrorCallback,
    send_timeout: f64,
    pending: StdMutex<Vec<MirrorEntry>>,
    pending_entry_count: StdMutex<usize>,
    pending_byte_count: StdMutex<usize>,
    flush_lock: tokio::sync::Mutex<()>,
}

/// Accumulates transcript_mirror frames and flushes them to a SessionStore.
pub struct TranscriptMirrorBatcher {
    inner: Arc<BatcherInner>,
    max_pending_entries: usize,
    max_pending_bytes: usize,
}

impl TranscriptMirrorBatcher {
    pub fn new(
        store: Box<dyn SessionStore>,
        projects_dir: &str,
        on_error: OnErrorCallback,
    ) -> Self {
        Self {
            inner: Arc::new(BatcherInner {
                store,
                projects_dir: projects_dir.to_string(),
                on_error,
                send_timeout: SEND_TIMEOUT_SECONDS,
                pending: StdMutex::new(Vec::new()),
                pending_entry_count: StdMutex::new(0),
                pending_byte_count: StdMutex::new(0),
                flush_lock: tokio::sync::Mutex::new(()),
            }),
            max_pending_entries: MAX_PENDING_ENTRIES,
            max_pending_bytes: MAX_PENDING_BYTES,
        }
    }

    pub fn with_thresholds(
        store: Box<dyn SessionStore>,
        projects_dir: &str,
        on_error: OnErrorCallback,
        max_pending_entries: usize,
        max_pending_bytes: usize,
    ) -> Self {
        Self {
            inner: Arc::new(BatcherInner {
                store,
                projects_dir: projects_dir.to_string(),
                on_error,
                send_timeout: SEND_TIMEOUT_SECONDS,
                pending: StdMutex::new(Vec::new()),
                pending_entry_count: StdMutex::new(0),
                pending_byte_count: StdMutex::new(0),
                flush_lock: tokio::sync::Mutex::new(()),
            }),
            max_pending_entries,
            max_pending_bytes,
        }
    }

    pub fn enqueue(&self, file_path: &str, entries: &[SessionStoreEntry]) {
        let size = serde_json::to_string(entries).map(|s| s.len()).unwrap_or(0);
        let should_eager_flush;
        {
            let mut pending = self.inner.pending.lock().unwrap();
            pending.push(MirrorEntry {
                file_path: file_path.to_string(),
                entries: entries.to_vec(),
                bytes: size,
            });
            let mut ec = self.inner.pending_entry_count.lock().unwrap();
            *ec += entries.len();
            let mut bc = self.inner.pending_byte_count.lock().unwrap();
            *bc += size;

            should_eager_flush = *ec > self.max_pending_entries || *bc > self.max_pending_bytes;
        }

        if should_eager_flush {
            let inner = self.inner.clone();
            tokio::spawn(async move {
                drain(&inner).await;
            });
        }
    }

    pub async fn flush(&self) -> Result<()> {
        drain(&self.inner).await;
        Ok(())
    }

    pub async fn close(&self) -> Result<()> {
        match self.flush().await {
            Ok(()) => Ok(()),
            Err(e) => {
                eprintln!("[TranscriptMirrorBatcher] close flush failed: {}", e);
                Ok(())
            }
        }
    }
}

async fn drain(inner: &BatcherInner) {
    // Detach pending buffer before acquiring lock
    let items: Vec<MirrorEntry> = {
        let mut pending = inner.pending.lock().unwrap();
        let items = std::mem::take(&mut *pending);
        *inner.pending_entry_count.lock().unwrap() = 0;
        *inner.pending_byte_count.lock().unwrap() = 0;
        items
    };

    let mut errors: Vec<(SessionKey, String)> = Vec::new();

    {
        let _guard = inner.flush_lock.lock().await;

        if items.is_empty() {
            return;
        }

        do_flush(inner, &items, &mut errors).await;
    }

    // Report errors after releasing the lock
    for (key, msg) in errors {
        let _ = (inner.on_error)(Some(key), msg).await;
    }
}

async fn do_flush(
    inner: &BatcherInner,
    items: &[MirrorEntry],
    errors: &mut Vec<(SessionKey, String)>,
) {
    // Coalesce by file_path preserving first-seen order
    let mut by_path: HashMap<String, Vec<SessionStoreEntry>> = HashMap::new();
    let mut order: Vec<String> = Vec::new();
    for item in items {
        if let Some(bucket) = by_path.get_mut(&item.file_path) {
            bucket.extend(item.entries.clone());
        } else {
            order.push(item.file_path.clone());
            by_path.insert(item.file_path.clone(), item.entries.clone());
        }
    }

    for file_path in &order {
        let entries = match by_path.get(file_path) {
            Some(e) if !e.is_empty() => e,
            _ => continue,
        };

        let key = match file_path_to_session_key(file_path, &inner.projects_dir) {
            Some(k) => k,
            None => continue,
        };

        let mut last_err: Option<String> = None;
        let mut succeeded = false;

        for attempt in 0..MIRROR_APPEND_MAX_ATTEMPTS {
            if attempt > 0 {
                let delay_s = MIRROR_APPEND_BACKOFF_S
                    .get(attempt - 1)
                    .copied()
                    .unwrap_or(0.8);
                tokio::time::sleep(std::time::Duration::from_secs_f64(delay_s)).await;
            }

            let result = tokio::time::timeout(
                std::time::Duration::from_secs_f64(inner.send_timeout),
                inner.store.append(&key, entries),
            )
            .await;

            match result {
                Ok(Ok(())) => {
                    succeeded = true;
                    break;
                }
                Ok(Err(e)) => {
                    last_err = Some(format!("{}", e));
                }
                Err(_timeout) => {
                    last_err = Some("timeout".to_string());
                    // Don't retry on timeout
                    break;
                }
            }
        }

        if !succeeded {
            if let Some(err) = last_err {
                errors.push((key, err));
            }
        }
    }
}
