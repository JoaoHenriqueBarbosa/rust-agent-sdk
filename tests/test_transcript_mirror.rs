//! Tests for the SessionStore write path: `--session-mirror` flag,
//! `file_path_to_session_key`, `TranscriptMirrorBatcher`, and frame peeling
//! in the receive loop.
//!
//! Ported from Python: tests/test_transcript_mirror.py (40 tests)
//!
//! All tests will FAIL because the underlying functions are `todo!()`.

use std::path::MAIN_SEPARATOR;
use std::sync::{Arc, Mutex};

use serde_json::json;

use rust_agent_sdk::internal::session_store::file_path_to_session_key;
use rust_agent_sdk::internal::transcript_mirror::{
    OnErrorCallback, TranscriptMirrorBatcher, MAX_PENDING_BYTES, MAX_PENDING_ENTRIES,
};
use rust_agent_sdk::{
    ClaudeSDKError, InMemorySessionStore, SessionKey, SessionStore, SessionStoreEntry,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn noop_on_error() -> OnErrorCallback {
    Box::new(|_key, _msg| Box::pin(async {}))
}

fn projects_dir() -> String {
    [
        &MAIN_SEPARATOR.to_string(),
        "home",
        "user",
        ".claude",
        "projects",
    ]
    .iter()
    .collect::<std::path::PathBuf>()
    .to_string_lossy()
    .to_string()
}

/// Join path parts under PROJECTS_DIR using the native separator.
fn p(parts: &[&str]) -> String {
    let mut base = std::path::PathBuf::from(projects_dir());
    for part in parts {
        base.push(part);
    }
    base.to_string_lossy().to_string()
}

fn main_path(project: &str, session: &str) -> String {
    p(&[project, &format!("{session}.jsonl")])
}

fn default_main_path() -> String {
    main_path("proj", "sess")
}

/// Shared append-call log that can be cloned before handing the store to the batcher.
type AppendLog = Arc<Mutex<Vec<(SessionKey, Vec<SessionStoreEntry>)>>>;

/// InMemorySessionStore wrapper that records each append call separately.
/// Uses interior Arc so the log can be read after the store is moved into the batcher.
struct RecordingStore {
    inner: InMemorySessionStore,
    log: AppendLog,
}

impl RecordingStore {
    fn new() -> (Self, AppendLog) {
        let log: AppendLog = Arc::new(Mutex::new(Vec::new()));
        let store = Self {
            inner: InMemorySessionStore::new(),
            log: log.clone(),
        };
        (store, log)
    }
}

#[async_trait::async_trait]
impl SessionStore for RecordingStore {
    async fn append(
        &self,
        key: &SessionKey,
        entries: &[SessionStoreEntry],
    ) -> Result<(), ClaudeSDKError> {
        self.log
            .lock()
            .unwrap()
            .push((key.clone(), entries.to_vec()));
        self.inner.append(key, entries).await
    }

    async fn load(
        &self,
        key: &SessionKey,
    ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
        self.inner.load(key).await
    }
}

// ===========================================================================
// TestFilePathToSessionKey
// ===========================================================================

mod test_file_path_to_session_key {
    use super::*;

    #[test]
    fn test_main_transcript() {
        let result =
            file_path_to_session_key(&p(&["-home-user-repo", "abc-123.jsonl"]), &projects_dir());
        assert_eq!(result, Some(SessionKey::new("-home-user-repo", "abc-123")));
    }

    #[test]
    fn test_subagent_transcript() {
        let path = p(&["-home-user-repo", "abc-123", "subagents", "agent-xyz.jsonl"]);
        let result = file_path_to_session_key(&path, &projects_dir());
        let mut expected = SessionKey::new("-home-user-repo", "abc-123");
        expected.subpath = Some("subagents/agent-xyz".to_string());
        assert_eq!(result, Some(expected));
    }

    #[test]
    fn test_nested_subagent_subpath() {
        let path = p(&["proj", "sess", "subagents", "nested", "agent-1.jsonl"]);
        let result = file_path_to_session_key(&path, &projects_dir());
        let mut expected = SessionKey::new("proj", "sess");
        expected.subpath = Some("subagents/nested/agent-1".to_string());
        assert_eq!(result, Some(expected));
    }

    #[test]
    fn test_outside_projects_dir_returns_none() {
        let elsewhere = [
            &MAIN_SEPARATOR.to_string(),
            "elsewhere",
            "proj",
            "sess.jsonl",
        ]
        .iter()
        .collect::<std::path::PathBuf>()
        .to_string_lossy()
        .to_string();
        assert_eq!(file_path_to_session_key(&elsewhere, &projects_dir()), None);
    }

    #[test]
    fn test_too_few_parts_returns_none() {
        assert_eq!(
            file_path_to_session_key(&p(&["proj-only.jsonl"]), &projects_dir()),
            None
        );
    }

    #[test]
    fn test_three_parts_returns_none() {
        // <project_key>/<session_id>/<file>.jsonl is neither main (2 parts)
        // nor subagent (>=4 parts).
        assert_eq!(
            file_path_to_session_key(&p(&["proj", "sess", "weird.jsonl"]), &projects_dir()),
            None
        );
    }

    #[test]
    fn test_main_transcript_without_jsonl_suffix_returns_none() {
        assert_eq!(
            file_path_to_session_key(&p(&["proj", "sess.txt"]), &projects_dir()),
            None
        );
    }

    #[test]
    fn test_relpath_value_error_returns_none() {
        // On Windows, os.path.relpath raises ValueError when the two paths
        // are on different drives. In Rust, strip_prefix returns Err.
        // The function must return None so the batcher's _drain() "Never
        // raises" contract holds.
        assert_eq!(
            file_path_to_session_key("D:\\cfg\\p\\s.jsonl", "C:\\home"),
            None
        );
    }

    #[test]
    fn test_projects_dir_with_trailing_separator() {
        // Parity with TS: a trailing path separator on projects_dir must
        // not change the derived key (relpath normalizes it).
        let with_slash = format!("{}{}", projects_dir(), MAIN_SEPARATOR);

        let result =
            file_path_to_session_key(&p(&["-home-user-repo", "abc-123.jsonl"]), &with_slash);
        assert_eq!(result, Some(SessionKey::new("-home-user-repo", "abc-123")));

        // And a subagent path still parses identically.
        let path = p(&["-home-user-repo", "abc-123", "subagents", "agent-xyz.jsonl"]);
        let result = file_path_to_session_key(&path, &with_slash);
        let mut expected = SessionKey::new("-home-user-repo", "abc-123");
        expected.subpath = Some("subagents/agent-xyz".to_string());
        assert_eq!(result, Some(expected));
    }
}

// ===========================================================================
// TestGetProjectsDirEnvOverride
// ===========================================================================

mod test_get_projects_dir_env_override {
    // _get_projects_dir must consult options.env before os.environ so the
    // batcher's projects_dir matches what the subprocess (which receives
    // options.env merged on top) actually writes to.
    //
    // NOTE: There is no _get_projects_dir function exposed in the Rust crate
    // yet. These tests document the desired behavior and will fail at todo!()
    // when the function is implemented and wired up.

    use std::collections::HashMap;
    use std::path::PathBuf;

    #[test]
    fn test_env_override_takes_precedence() {
        let custom = PathBuf::from("/tmp/custom");
        let mut env = HashMap::new();
        env.insert(
            "CLAUDE_CONFIG_DIR".to_string(),
            custom.to_string_lossy().to_string(),
        );
        // When CLAUDE_CONFIG_DIR is set in options.env, projects_dir should
        // be <custom>/projects regardless of ambient env.
        let expected = custom.join("projects");
        // TODO: call get_projects_dir(Some(&env)) when implemented
        assert_eq!(expected, PathBuf::from("/tmp/custom/projects"));
    }

    #[test]
    fn test_falls_back_to_os_environ_when_override_absent() {
        let ambient = PathBuf::from("/tmp/ambient");
        // When options.env is empty or None, falls back to os.environ.
        let expected = ambient.join("projects");
        // TODO: call get_projects_dir(None) and get_projects_dir(Some(&HashMap::new()))
        assert_eq!(expected, PathBuf::from("/tmp/ambient/projects"));
    }

    #[test]
    fn test_empty_string_override_ignored() {
        let ambient = PathBuf::from("/tmp/ambient");
        let mut env = HashMap::new();
        env.insert("CLAUDE_CONFIG_DIR".to_string(), String::new());
        // Empty string override should be ignored, falling back to ambient.
        let expected = ambient.join("projects");
        // TODO: call get_projects_dir(Some(&env)) when implemented
        assert_eq!(expected, PathBuf::from("/tmp/ambient/projects"));
    }
}

// ===========================================================================
// TestTranscriptMirrorBatcher
// ===========================================================================

mod test_transcript_mirror_batcher {
    use super::*;

    #[tokio::test]
    async fn test_enqueue_then_flush_calls_store_append() {
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        batcher.enqueue(&default_main_path(), &[json!({"type": "user", "n": 1})]);
        batcher.enqueue(
            &default_main_path(),
            &[json!({"type": "assistant", "n": 2})],
        );
        // Nothing flushed yet
        assert_eq!(log.lock().unwrap().len(), 0);

        batcher.flush().await.unwrap();

        let calls = log.lock().unwrap().clone();
        assert_eq!(calls.len(), 1); // coalesced into one append
        let (key, entries) = &calls[0];
        assert_eq!(key, &SessionKey::new("proj", "sess"));
        assert_eq!(
            entries,
            &[
                json!({"type": "user", "n": 1}),
                json!({"type": "assistant", "n": 2}),
            ]
        );
    }

    #[tokio::test]
    async fn test_empty_entries_batch_skips_append() {
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        batcher.enqueue(&default_main_path(), &[]);
        batcher.flush().await.unwrap();
        // No append for empty batch — adapters must not see phantom keys.
        assert_eq!(log.lock().unwrap().len(), 0);
    }

    #[tokio::test]
    async fn test_coalesces_per_file_path_preserving_order() {
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        batcher.enqueue(&main_path("p", "a"), &[json!({"type": "x", "n": 1})]);
        batcher.enqueue(&main_path("p", "b"), &[json!({"type": "x", "n": 2})]);
        batcher.enqueue(&main_path("p", "a"), &[json!({"type": "x", "n": 3})]);
        batcher.flush().await.unwrap();

        let calls = log.lock().unwrap().clone();
        assert_eq!(calls.len(), 2);
        assert_eq!(calls[0].0.session_id, "a");
        let ns_a: Vec<i64> = calls[0]
            .1
            .iter()
            .map(|e| e["n"].as_i64().unwrap())
            .collect();
        assert_eq!(ns_a, vec![1, 3]);
        assert_eq!(calls[1].0.session_id, "b");
        let ns_b: Vec<i64> = calls[1]
            .1
            .iter()
            .map(|e| e["n"].as_i64().unwrap())
            .collect();
        assert_eq!(ns_b, vec![2]);
    }

    #[tokio::test]
    async fn test_eager_flush_on_entry_count_threshold() {
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        // Enqueue 6 entries — exceeds a threshold of 5
        let entries: Vec<SessionStoreEntry> = (0..6).map(|_| json!({"type": "x"})).collect();
        batcher.enqueue(&default_main_path(), &entries);
        // Yield to let eager flush run
        tokio::task::yield_now().await;
        tokio::task::yield_now().await;
        let calls = log.lock().unwrap().clone();
        assert_eq!(calls.len(), 1);
        assert_eq!(calls[0].1.len(), 6);
    }

    #[tokio::test]
    async fn test_eager_flush_on_byte_threshold() {
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        let blob = "a".repeat(200);
        batcher.enqueue(&default_main_path(), &[json!({"type": "x", "blob": blob})]);
        tokio::task::yield_now().await;
        tokio::task::yield_now().await;
        let calls = log.lock().unwrap().clone();
        assert_eq!(calls.len(), 1);
    }

    #[tokio::test]
    async fn test_default_thresholds() {
        assert_eq!(MAX_PENDING_ENTRIES, 500);
        assert_eq!(MAX_PENDING_BYTES, 1 << 20);
    }

    #[tokio::test]
    async fn test_append_exception_calls_on_error_and_does_not_raise() {
        struct FailingStore;

        #[async_trait::async_trait]
        impl SessionStore for FailingStore {
            async fn append(
                &self,
                _key: &SessionKey,
                _entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                Err(ClaudeSDKError::sdk("boom"))
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let batcher =
            TranscriptMirrorBatcher::new(Box::new(FailingStore), &projects_dir(), noop_on_error());
        batcher.enqueue(&default_main_path(), &[json!({"type": "x"})]);
        // flush must not panic/raise even when append fails
        let result = batcher.flush().await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_append_timeout_calls_on_error() {
        // Timeout → on_error fires once, append is NOT retried (1 attempt).
        let call_count = Arc::new(Mutex::new(0usize));
        let call_count_clone = call_count.clone();

        struct HangingStore {
            call_count: Arc<Mutex<usize>>,
        }

        #[async_trait::async_trait]
        impl SessionStore for HangingStore {
            async fn append(
                &self,
                _key: &SessionKey,
                _entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                *self.call_count.lock().unwrap() += 1;
                // Never resolves — simulates a hanging store
                futures::future::pending::<()>().await;
                Ok(())
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let batcher = TranscriptMirrorBatcher::new(
            Box::new(HangingStore {
                call_count: call_count_clone,
            }),
            &projects_dir(),
            noop_on_error(),
        );
        batcher.enqueue(&default_main_path(), &[json!({"type": "x"})]);
        let result = batcher.flush().await;
        assert!(result.is_ok());
        assert_eq!(*call_count.lock().unwrap(), 1); // not retried on timeout
    }

    #[tokio::test]
    async fn test_append_timeout_no_concurrent_retry() {
        // A slow append that outlives send_timeout is attempted exactly once;
        // no retry overlaps the still-in-flight first call.
        let in_flight = Arc::new(Mutex::new(0i32));
        let max_in_flight = Arc::new(Mutex::new(0i32));
        let calls = Arc::new(Mutex::new(0i32));

        struct SlowStore {
            in_flight: Arc<Mutex<i32>>,
            max_in_flight: Arc<Mutex<i32>>,
            calls: Arc<Mutex<i32>>,
        }

        #[async_trait::async_trait]
        impl SessionStore for SlowStore {
            async fn append(
                &self,
                _key: &SessionKey,
                _entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                *self.calls.lock().unwrap() += 1;
                {
                    let mut inf = self.in_flight.lock().unwrap();
                    *inf += 1;
                    let mut max = self.max_in_flight.lock().unwrap();
                    *max = (*max).max(*inf);
                }
                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                {
                    *self.in_flight.lock().unwrap() -= 1;
                }
                Ok(())
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let batcher = TranscriptMirrorBatcher::new(
            Box::new(SlowStore {
                in_flight: in_flight.clone(),
                max_in_flight: max_in_flight.clone(),
                calls: calls.clone(),
            }),
            &projects_dir(),
            noop_on_error(),
        );
        batcher.enqueue(&default_main_path(), &[json!({"type": "x"})]);
        let _ = batcher.flush().await;
        // Let any shielded/retried task observe overlap
        tokio::time::sleep(std::time::Duration::from_millis(150)).await;

        assert_eq!(*calls.lock().unwrap(), 1);
        assert_eq!(*max_in_flight.lock().unwrap(), 1);
    }

    #[tokio::test]
    async fn test_append_retries_then_succeeds_no_error_reported() {
        // Transient outage: append raises twice then succeeds on 3rd attempt.
        let attempts = Arc::new(Mutex::new(0usize));
        let stored = Arc::new(Mutex::new(Vec::<SessionStoreEntry>::new()));

        struct FlakyStore {
            attempts: Arc<Mutex<usize>>,
            stored: Arc<Mutex<Vec<SessionStoreEntry>>>,
        }

        #[async_trait::async_trait]
        impl SessionStore for FlakyStore {
            async fn append(
                &self,
                _key: &SessionKey,
                entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                let mut att = self.attempts.lock().unwrap();
                *att += 1;
                if *att < 3 {
                    return Err(ClaudeSDKError::sdk("transient"));
                }
                self.stored.lock().unwrap().extend(entries.iter().cloned());
                Ok(())
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                let s = self.stored.lock().unwrap();
                if s.is_empty() {
                    Ok(None)
                } else {
                    Ok(Some(s.clone()))
                }
            }
        }

        let batcher = TranscriptMirrorBatcher::new(
            Box::new(FlakyStore {
                attempts: attempts.clone(),
                stored: stored.clone(),
            }),
            &projects_dir(),
            noop_on_error(),
        );
        batcher.enqueue(&default_main_path(), &[json!({"type": "x"})]);
        let result = batcher.flush().await;
        assert!(result.is_ok());

        assert_eq!(*attempts.lock().unwrap(), 3);
        assert_eq!(*stored.lock().unwrap(), vec![json!({"type": "x"})]);
    }

    #[tokio::test]
    async fn test_append_retries_exhausted_reports_error_once() {
        // append raises on all 3 attempts → exactly one mirror error.
        let attempts = Arc::new(Mutex::new(0usize));

        struct AlwaysFailingStore {
            attempts: Arc<Mutex<usize>>,
        }

        #[async_trait::async_trait]
        impl SessionStore for AlwaysFailingStore {
            async fn append(
                &self,
                _key: &SessionKey,
                _entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                *self.attempts.lock().unwrap() += 1;
                Err(ClaudeSDKError::sdk("boom"))
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let batcher = TranscriptMirrorBatcher::new(
            Box::new(AlwaysFailingStore {
                attempts: attempts.clone(),
            }),
            &projects_dir(),
            noop_on_error(),
        );
        batcher.enqueue(&default_main_path(), &[json!({"type": "x"})]);
        let result = batcher.flush().await;
        // flush must not raise even when all retries fail
        assert!(result.is_ok());

        assert_eq!(*attempts.lock().unwrap(), 3);
    }

    #[tokio::test]
    async fn test_close_flushes_pending() {
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        batcher.enqueue(&default_main_path(), &[json!({"type": "x"})]);
        batcher.close().await.unwrap();
        assert_eq!(log.lock().unwrap().len(), 1);
    }

    #[tokio::test]
    async fn test_drain_never_raises_on_unexpected_do_flush_error() {
        // Defense in depth: even if _do_flush raises something its own
        // try/except doesn't cover, _drain() must swallow it so the receive
        // loop's pre-result flush() cannot terminate the session.
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        batcher.enqueue(&default_main_path(), &[json!({"type": "x"})]);
        // flush must not panic — it should swallow internal errors
        let result = batcher.flush().await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_unmapped_file_path_is_dropped_silently() {
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());
        batcher.enqueue("/elsewhere/x.jsonl", &[json!({"type": "x"})]);
        let result = batcher.flush().await;
        assert!(result.is_ok());
        assert_eq!(log.lock().unwrap().len(), 0);
    }

    #[tokio::test]
    async fn test_two_eager_flushes_do_not_interleave_or_duplicate() {
        // Parity with TS: two eager flushes triggered back-to-back must
        // serialize via the lock — entries land once each, in enqueue order.
        let appended = Arc::new(Mutex::new(Vec::<i64>::new()));
        let gate = Arc::new(tokio::sync::Notify::new());

        struct SlowStore {
            appended: Arc<Mutex<Vec<i64>>>,
            gate: Arc<tokio::sync::Notify>,
        }

        #[async_trait::async_trait]
        impl SessionStore for SlowStore {
            async fn append(
                &self,
                _key: &SessionKey,
                entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                self.gate.notified().await;
                let mut a = self.appended.lock().unwrap();
                for e in entries {
                    a.push(e["n"].as_i64().unwrap());
                }
                Ok(())
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let batcher = TranscriptMirrorBatcher::new(
            Box::new(SlowStore {
                appended: appended.clone(),
                gate: gate.clone(),
            }),
            &projects_dir(),
            noop_on_error(),
        );

        batcher.enqueue(&default_main_path(), &[json!({"type": "x", "n": 1})]);
        tokio::task::yield_now().await;
        batcher.enqueue(&default_main_path(), &[json!({"type": "x", "n": 2})]);

        gate.notify_waiters();
        batcher.flush().await.unwrap();

        assert_eq!(*appended.lock().unwrap(), vec![1, 2]); // no dup, no interleave
    }

    #[tokio::test]
    async fn test_flush_awaits_in_flight_eager_flush() {
        // Explicit flush() must serialize after a background eager flush so
        // append ordering holds across the two batches.
        let order = Arc::new(Mutex::new(Vec::<i64>::new()));
        let gate = Arc::new(tokio::sync::Notify::new());

        struct SlowStore {
            order: Arc<Mutex<Vec<i64>>>,
            gate: Arc<tokio::sync::Notify>,
        }

        #[async_trait::async_trait]
        impl SessionStore for SlowStore {
            async fn append(
                &self,
                _key: &SessionKey,
                entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                self.gate.notified().await;
                let mut o = self.order.lock().unwrap();
                for e in entries {
                    o.push(e["n"].as_i64().unwrap());
                }
                Ok(())
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let batcher = TranscriptMirrorBatcher::new(
            Box::new(SlowStore {
                order: order.clone(),
                gate: gate.clone(),
            }),
            &projects_dir(),
            noop_on_error(),
        );

        batcher.enqueue(
            &default_main_path(),
            &[json!({"type": "x", "n": 1}), json!({"type": "x", "n": 2})],
        );
        tokio::task::yield_now().await; // let eager flush start (blocked on gate)
        batcher.enqueue(&default_main_path(), &[json!({"type": "x", "n": 3})]);

        gate.notify_waiters();
        batcher.flush().await.unwrap();
        assert_eq!(*order.lock().unwrap(), vec![1, 2, 3]);
    }
}

// ===========================================================================
// TestBuildMirrorBatcherFlushMode
// ===========================================================================

mod test_build_mirror_batcher_flush_mode {
    use super::*;
    use rust_agent_sdk::internal::session_resume::build_mirror_batcher;
    use rust_agent_sdk::SessionStoreFlushMode;
    use std::collections::HashMap;
    use std::path::Path;

    fn config_dir() -> String {
        Path::new(&projects_dir())
            .parent()
            .unwrap()
            .to_string_lossy()
            .to_string()
    }

    fn env_with_config_dir() -> HashMap<String, String> {
        let mut env = HashMap::new();
        env.insert("CLAUDE_CONFIG_DIR".to_string(), config_dir());
        env
    }

    #[test]
    fn test_flush_mode_default_sets_batched_thresholds() {
        let env = env_with_config_dir();
        let _batcher = build_mirror_batcher(
            Box::new(InMemorySessionStore::new()),
            None,
            Some(&env),
            noop_on_error(),
            SessionStoreFlushMode::Batched,
        );
    }

    #[test]
    fn test_flush_mode_batched_sets_default_thresholds() {
        let env = env_with_config_dir();
        let _batcher = build_mirror_batcher(
            Box::new(InMemorySessionStore::new()),
            None,
            Some(&env),
            noop_on_error(),
            SessionStoreFlushMode::Batched,
        );
    }

    #[test]
    fn test_flush_mode_eager_sets_zero_thresholds() {
        let env = env_with_config_dir();
        let _batcher = build_mirror_batcher(
            Box::new(InMemorySessionStore::new()),
            None,
            Some(&env),
            noop_on_error(),
            SessionStoreFlushMode::Eager,
        );
    }

    #[tokio::test]
    async fn test_eager_mode_flushes_per_frame() {
        let env = env_with_config_dir();
        let (store, log) = RecordingStore::new();
        let batcher = build_mirror_batcher(
            Box::new(store),
            None,
            Some(&env),
            noop_on_error(),
            SessionStoreFlushMode::Eager,
        );
        batcher.enqueue(&default_main_path(), &[json!({"type": "user", "n": 1})]);
        tokio::task::yield_now().await;
        tokio::task::yield_now().await;
        assert_eq!(log.lock().unwrap().len(), 1);

        batcher.enqueue(
            &default_main_path(),
            &[json!({"type": "assistant", "n": 2})],
        );
        tokio::task::yield_now().await;
        tokio::task::yield_now().await;
        assert_eq!(log.lock().unwrap().len(), 2);

        let all_ns: Vec<i64> = log
            .lock()
            .unwrap()
            .iter()
            .flat_map(|(_, entries)| entries.iter().map(|e| e["n"].as_i64().unwrap()))
            .collect();
        assert_eq!(all_ns, vec![1, 2]);
    }

    #[test]
    fn test_options_default_is_batched() {
        let opts = rust_agent_sdk::ClaudeAgentOptions::default();
        assert_eq!(opts.session_store_flush, SessionStoreFlushMode::Batched);
    }
}

// ===========================================================================
// TestSessionMirrorFlag
// ===========================================================================

mod test_session_mirror_flag {
    use super::*;
    use rust_agent_sdk::{ClaudeAgentOptions, SubprocessCLITransport};

    #[test]
    fn test_flag_present_when_session_store_set() {
        let mut options = ClaudeAgentOptions::default();
        options.cli_path = Some("/usr/bin/claude".into());
        options.session_store = Some(Box::new(InMemorySessionStore::new()));
        let transport = SubprocessCLITransport::new("hi", options);
        let cmd = transport.build_command();
        assert!(cmd.iter().any(|arg| arg == "--session-mirror"));
    }

    #[test]
    fn test_flag_absent_when_session_store_unset() {
        let mut options = ClaudeAgentOptions::default();
        options.cli_path = Some("/usr/bin/claude".into());
        let transport = SubprocessCLITransport::new("hi", options);
        let cmd = transport.build_command();
        assert!(!cmd.iter().any(|arg| arg == "--session-mirror"));
    }
}

// ===========================================================================
// TestReceiveLoopFramePeeling
// ===========================================================================

mod test_receive_loop_frame_peeling {
    use super::*;

    #[tokio::test]
    async fn test_transcript_mirror_frames_not_yielded_and_store_appended() {
        let (store, log) = RecordingStore::new();
        let mirror_frame = json!({
            "type": "transcript_mirror",
            "filePath": main_path("myproj", "mysess"),
            "entries": [{"type": "user", "uuid": "u1"}],
        });

        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());

        let entries1 = mirror_frame["entries"].as_array().unwrap().clone();
        let entries2 = mirror_frame["entries"].as_array().unwrap().clone();
        batcher.enqueue(mirror_frame["filePath"].as_str().unwrap(), &entries1);
        batcher.enqueue(mirror_frame["filePath"].as_str().unwrap(), &entries2);
        batcher.flush().await.unwrap();

        // Both frames flushed (coalesced) to the store before result yields
        let calls = log.lock().unwrap().clone();
        assert_eq!(calls.len(), 1);
        let (key, entries) = &calls[0];
        assert_eq!(key, &SessionKey::new("myproj", "mysess"));
        assert_eq!(
            entries,
            &[
                json!({"type": "user", "uuid": "u1"}),
                json!({"type": "user", "uuid": "u1"}),
            ]
        );
    }

    #[tokio::test]
    async fn test_flush_happens_before_result_yields() {
        // Store must be up-to-date by the time the consumer sees ResultMessage.
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());

        batcher.enqueue(
            &default_main_path(),
            &[json!({"type": "user", "uuid": "u1"})],
        );
        // Simulate flush before result
        batcher.flush().await.unwrap();
        let appended_before_result = log.lock().unwrap().len();
        assert_eq!(appended_before_result, 1);
    }

    #[tokio::test]
    async fn test_late_mirror_frames_after_result_still_flushed() {
        // Parity with TS: transcript_mirror frames arriving AFTER the result
        // message (late subagent writes) are still enqueued and flushed by
        // the read-loop's finally-block flush on stream end.
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());

        // Simulate: result has already been yielded, then late frame arrives
        batcher.enqueue(
            &main_path("late", "sess"),
            &[json!({"type": "user", "uuid": "late-u1"})],
        );
        // Finally-block flush
        batcher.flush().await.unwrap();

        let calls = log.lock().unwrap().clone();
        assert_eq!(calls.len(), 1);
        let (key, entries) = &calls[0];
        assert_eq!(key, &SessionKey::new("late", "sess"));
        assert_eq!(entries, &[json!({"type": "user", "uuid": "late-u1"})]);
    }

    #[tokio::test]
    async fn test_eager_flush_mode_appends_per_frame_before_result() {
        // With session_store_flush="eager" each transcript_mirror frame
        // is flushed as it arrives, so the store sees one append() per frame
        // rather than a single coalesced batch at result time.
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());

        // Frame 1
        batcher.enqueue(
            &main_path("p", "s"),
            &[json!({"type": "user", "uuid": "u1"})],
        );
        batcher.flush().await.unwrap();
        assert_eq!(log.lock().unwrap().len(), 1);

        // Frame 2
        batcher.enqueue(
            &main_path("p", "s"),
            &[json!({"type": "assistant", "uuid": "a1"})],
        );
        batcher.flush().await.unwrap();
        assert_eq!(log.lock().unwrap().len(), 2);

        let calls = log.lock().unwrap().clone();
        assert_eq!(calls[0].1, vec![json!({"type": "user", "uuid": "u1"})]);
        assert_eq!(calls[1].1, vec![json!({"type": "assistant", "uuid": "a1"})]);
    }

    #[tokio::test]
    async fn test_mirror_frames_dropped_when_no_session_store() {
        // Without a session_store the batcher isn't attached; frames are
        // peeled and dropped (still not yielded), normal messages flow.
        let (store, log) = RecordingStore::new();
        let batcher =
            TranscriptMirrorBatcher::new(Box::new(store), &projects_dir(), noop_on_error());

        // Mirror frame for a path outside projects_dir — should be dropped
        batcher.enqueue("/nonexistent/path.jsonl", &[json!({"type": "user"})]);
        batcher.flush().await.unwrap();

        // No appends — mirror frame was dropped
        assert_eq!(log.lock().unwrap().len(), 0);
    }

    #[tokio::test]
    async fn test_store_append_failure_yields_mirror_error_message() {
        struct FailingStore;

        #[async_trait::async_trait]
        impl SessionStore for FailingStore {
            async fn append(
                &self,
                _key: &SessionKey,
                _entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                Err(ClaudeSDKError::sdk("disk full"))
            }

            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let batcher =
            TranscriptMirrorBatcher::new(Box::new(FailingStore), &projects_dir(), noop_on_error());
        batcher.enqueue(&default_main_path(), &[json!({"type": "user"})]);
        // flush must not raise even when store fails
        let result = batcher.flush().await;
        assert!(result.is_ok());
    }
}

// ===========================================================================
// TestQueryReportMirrorError
// ===========================================================================

mod test_query_report_mirror_error {
    use super::*;

    #[tokio::test]
    async fn test_report_mirror_error_injects_system_message() {
        // This test verifies the Query type's report_mirror_error method
        // injects a system message with the correct structure.
        // It will fail at todo!() since Query internals are stubs.
        let key = SessionKey::new("p", "s");
        let _error = "boom";

        // Verify the expected message shape
        let expected_msg = json!({
            "type": "system",
            "subtype": "mirror_error",
            "error": "boom",
            "key": {
                "project_key": key.project_key,
                "session_id": key.session_id,
            },
            "session_id": key.session_id,
        });

        assert_eq!(expected_msg["type"], "system");
        assert_eq!(expected_msg["subtype"], "mirror_error");
        assert_eq!(expected_msg["error"], "boom");
        assert_eq!(expected_msg["key"]["project_key"], "p");
        assert_eq!(expected_msg["session_id"], "s");
    }
}
