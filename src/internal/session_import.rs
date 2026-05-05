use std::fs;
use std::io::{BufRead, BufReader};
use std::path::{Path, PathBuf};

use crate::errors::Result;
use crate::types::{SessionKey, SessionStore, SessionStoreEntry};

use super::sessions::{resolve_session_file_path, validate_uuid};

/// Maximum entries per batch for import.
pub const MAX_PENDING_ENTRIES: usize = 500;

/// Maximum bytes per batch (1 MiB).
const MAX_PENDING_BYTES: usize = 1 << 20;

/// Import a local session to a SessionStore.
pub async fn import_session_to_store(
    session_id: &str,
    store: &dyn SessionStore,
    directory: Option<&str>,
    include_subagents: bool,
    batch_size: usize,
) -> Result<()> {
    if validate_uuid(session_id).is_none() {
        return Err(crate::errors::ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }

    let resolved = resolve_session_file_path(session_id, directory).ok_or_else(|| {
        crate::errors::ClaudeSDKError::sdk(format!("Session {session_id} not found"))
    })?;

    // project_key from the on-disk project directory name
    let project_key = resolved
        .parent()
        .and_then(|p| p.file_name())
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();

    let batch_size = if batch_size <= 0 { MAX_PENDING_ENTRIES } else { batch_size };

    let main_key = SessionKey::new(&project_key, session_id);
    append_jsonl_file_in_batches(&resolved, &main_key, store, batch_size).await?;

    if !include_subagents {
        return Ok(());
    }

    // Subagent transcripts: <projectDir>/<sessionId>/subagents/**
    let session_dir = resolved.with_extension("");
    let subagents_dir = session_dir.join("subagents");

    for file_path in collect_jsonl_files(&subagents_dir) {
        // subpath is relative to session_dir, '/'-joined, sans .jsonl
        let rel = file_path.strip_prefix(&session_dir).unwrap_or(&file_path);
        let mut parts: Vec<String> = rel
            .components()
            .map(|c| c.as_os_str().to_string_lossy().to_string())
            .collect();
        if let Some(last) = parts.last_mut() {
            if last.ends_with(".jsonl") {
                *last = last[..last.len() - ".jsonl".len()].to_string();
            }
        }
        let subpath = parts.join("/");

        let sub_key = SessionKey {
            project_key: project_key.clone(),
            session_id: session_id.to_string(),
            subpath: Some(subpath),
        };
        append_jsonl_file_in_batches(&file_path, &sub_key, store, batch_size).await?;

        // Import .meta.json sidecar if it exists
        let stem = file_path.file_name().unwrap().to_string_lossy();
        let meta_name = format!(
            "{}.meta.json",
            &stem[..stem.len() - ".jsonl".len()]
        );
        let meta_path = file_path.with_file_name(meta_name);
        if let Ok(meta_content) = fs::read_to_string(&meta_path) {
            if let Ok(meta) = serde_json::from_str::<serde_json::Value>(&meta_content) {
                let mut meta_entry = serde_json::Map::new();
                meta_entry.insert("type".to_string(), serde_json::json!("agent_metadata"));
                if let Some(obj) = meta.as_object() {
                    for (k, v) in obj {
                        meta_entry.insert(k.clone(), v.clone());
                    }
                }
                let meta_entry = serde_json::Value::Object(meta_entry);
                store.append(&sub_key, &[meta_entry]).await?;
            }
        }
    }

    Ok(())
}

/// Stream-read a JSONL file line-by-line, flushing to `store.append()` in
/// batches of `batch_size` entries (or `MAX_PENDING_BYTES`, whichever first).
async fn append_jsonl_file_in_batches(
    file_path: &Path,
    key: &SessionKey,
    store: &dyn SessionStore,
    batch_size: usize,
) -> Result<()> {
    let file = fs::File::open(file_path).map_err(|e| {
        crate::errors::ClaudeSDKError::sdk(format!("Failed to open {}: {}", file_path.display(), e))
    })?;
    let reader = BufReader::new(file);

    let mut batch: Vec<SessionStoreEntry> = Vec::new();
    let mut nbytes: usize = 0;

    for line_result in reader.lines() {
        let line = line_result.map_err(|e| {
            crate::errors::ClaudeSDKError::sdk(format!("Read error: {e}"))
        })?;
        if line.is_empty() {
            continue;
        }
        let entry: SessionStoreEntry = serde_json::from_str(&line).map_err(|e| {
            crate::errors::ClaudeSDKError::sdk(format!("JSON parse error: {e}"))
        })?;
        nbytes += line.len();
        batch.push(entry);

        if batch.len() >= batch_size || nbytes >= MAX_PENDING_BYTES {
            store.append(key, &batch).await?;
            batch.clear();
            nbytes = 0;
        }
    }

    if !batch.is_empty() {
        store.append(key, &batch).await?;
    }

    Ok(())
}

/// Recursively yield all `*.jsonl` file paths under `base_dir`.
/// Sorted per directory for deterministic order across platforms.
fn collect_jsonl_files(base_dir: &Path) -> Vec<PathBuf> {
    let mut results = Vec::new();
    collect_jsonl_files_recursive(base_dir, &mut results);
    results
}

fn collect_jsonl_files_recursive(dir: &Path, results: &mut Vec<PathBuf>) {
    let entries = match fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return,
    };
    let mut dirents: Vec<fs::DirEntry> = entries.flatten().collect();
    dirents.sort_by_key(|e| e.file_name());

    for entry in dirents {
        let path = entry.path();
        if path.is_dir() {
            collect_jsonl_files_recursive(&path, results);
        } else if path.is_file() {
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                if name.ends_with(".jsonl") {
                    results.push(path);
                }
            }
        }
    }
}
