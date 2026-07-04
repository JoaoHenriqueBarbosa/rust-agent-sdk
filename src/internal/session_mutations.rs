use std::collections::HashMap;
use std::fs;
use std::io::{self, Write};
use std::path::{Path, PathBuf};

use chrono::Utc;
use serde_json::json;

use crate::errors::{ClaudeSDKError, Result};
use crate::types::{ForkSessionResult, SessionKey, SessionStore, SessionStoreEntry};

use super::sessions::{
    canonicalize_path, extract_first_prompt_from_head, extract_last_json_string_field,
    find_project_dir, get_projects_dir, get_worktree_paths, project_key_for_directory,
    validate_uuid, LITE_READ_BUF_SIZE,
};

// ---------------------------------------------------------------------------
// Ordered JSON helper
// ---------------------------------------------------------------------------

/// Build a compact JSON object string with keys in insertion order.
/// Uses IndexMap-backed serde_json::Map to preserve order.
fn ordered_json(pairs: &[(&str, serde_json::Value)]) -> String {
    // Build the string manually to guarantee key order and compact format.
    let mut parts: Vec<String> = Vec::with_capacity(pairs.len());
    for (key, value) in pairs {
        let v = serde_json::to_string(value).unwrap();
        parts.push(format!("{}:{}", serde_json::to_string(key).unwrap(), v));
    }
    format!("{{{}}}", parts.join(","))
}

// ---------------------------------------------------------------------------
// Transcript types considered for fork
// ---------------------------------------------------------------------------

const TRANSCRIPT_TYPES: &[&str] = &["user", "assistant", "attachment", "system", "progress"];

// ---------------------------------------------------------------------------
// Unicode sanitization
// ---------------------------------------------------------------------------

/// Check if a character belongs to a "dangerous" Unicode category.
/// Covers: Cf (format), Co (private use area), plus explicit ranges
/// matching the Python/TS implementations.
fn should_strip_char(c: char) -> bool {
    // Explicit ranges (matching Python _UNICODE_STRIP_RE)
    if matches!(c,
        '\u{200b}'..='\u{200f}' | // Zero-width spaces, LTR/RTL marks
        '\u{202a}'..='\u{202e}' | // Directional formatting characters
        '\u{2066}'..='\u{2069}' | // Directional isolates
        '\u{feff}'              | // Byte order mark
        '\u{e000}'..='\u{f8ff}'   // Basic Multilingual Plane private use
    ) {
        return true;
    }

    // Python strips Cf (format), Co (private use), Cn (unassigned) categories.
    // Since Rust doesn't have unicodedata.category(), check known ranges.
    // Cf characters not in the explicit ranges above:
    if matches!(c,
        '\u{200c}'..='\u{200d}' | // ZWNJ, ZWJ
        '\u{00ad}'              | // Soft hyphen
        '\u{061c}'              | // Arabic letter mark
        '\u{180e}'              | // Mongolian vowel separator
        '\u{2060}'..='\u{2064}' | // Word joiner, invisible operators
        '\u{206a}'..='\u{206f}' | // Deprecated formatting
        '\u{fff9}'..='\u{fffb}' | // Interlinear annotation anchors
        '\u{F0000}'..='\u{FFFFD}' | // Supplementary Private Use Area-A (Co)
        '\u{100000}'..='\u{10FFFD}'  // Supplementary Private Use Area-B (Co)
    ) {
        return true;
    }

    false
}

fn sanitize_unicode(value: &str) -> String {
    let mut current = value.to_string();
    for _ in 0..10 {
        let previous = current.clone();
        // NFKC normalization
        current = unicode_normalization::UnicodeNormalization::nfkc(&*current).collect();
        // Strip dangerous characters
        current = current.chars().filter(|c| !should_strip_char(*c)).collect();
        if current == previous {
            break;
        }
    }
    current
}

// ---------------------------------------------------------------------------
// Local file mutations
// ---------------------------------------------------------------------------

pub fn rename_session(session_id: &str, title: &str, directory: Option<&str>) -> Result<()> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }
    let stripped = title.trim();
    if stripped.is_empty() {
        return Err(ClaudeSDKError::sdk("title must be non-empty"));
    }

    let data = format!(
        "{}\n",
        ordered_json(&[
            ("type", json!("custom-title")),
            ("customTitle", json!(stripped)),
            ("sessionId", json!(session_id)),
        ])
    );

    append_to_session(session_id, &data, directory)
}

pub fn tag_session(session_id: &str, tag: Option<&str>, directory: Option<&str>) -> Result<()> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }

    let tag_value = match tag {
        Some(t) => {
            let sanitized = sanitize_unicode(t);
            let sanitized = sanitized.trim();
            if sanitized.is_empty() {
                return Err(ClaudeSDKError::sdk(
                    "tag must be non-empty (use None to clear)",
                ));
            }
            sanitized.to_string()
        }
        None => String::new(),
    };

    let data = format!(
        "{}\n",
        ordered_json(&[
            ("type", json!("tag")),
            ("tag", json!(tag_value)),
            ("sessionId", json!(session_id)),
        ])
    );

    append_to_session(session_id, &data, directory)
}

pub fn delete_session(session_id: &str, directory: Option<&str>) -> Result<()> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }

    let path = find_session_file(session_id, directory).ok_or_else(|| {
        if let Some(dir) = directory {
            ClaudeSDKError::sdk(format!(
                "Session {session_id} not found in project directory for {dir}"
            ))
        } else {
            ClaudeSDKError::sdk(format!("Session {session_id} not found"))
        }
    })?;

    match fs::remove_file(&path) {
        Ok(()) => {}
        Err(e) if e.kind() == io::ErrorKind::NotFound => {
            return Err(ClaudeSDKError::sdk(format!(
                "Session {session_id} not found"
            )));
        }
        Err(e) => {
            return Err(ClaudeSDKError::sdk(format!(
                "Failed to delete session file: {e}"
            )));
        }
    }

    // Subagent transcripts live in a sibling {session_id}/ dir; often absent.
    let subagent_dir = path.parent().unwrap().join(session_id);
    let _ = fs::remove_dir_all(subagent_dir);

    Ok(())
}

pub fn fork_session(
    session_id: &str,
    directory: Option<&str>,
    up_to_message_id: Option<&str>,
    title: Option<&str>,
) -> Result<ForkSessionResult> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }
    if let Some(msg_id) = up_to_message_id {
        if validate_uuid(msg_id).is_none() {
            return Err(ClaudeSDKError::sdk(format!(
                "Invalid up_to_message_id: {msg_id}"
            )));
        }
    }

    let (file_path, project_dir) =
        find_session_file_with_dir(session_id, directory).ok_or_else(|| {
            if let Some(dir) = directory {
                ClaudeSDKError::sdk(format!(
                    "Session {session_id} not found in project directory for {dir}"
                ))
            } else {
                ClaudeSDKError::sdk(format!("Session {session_id} not found"))
            }
        })?;

    let content = fs::read(&file_path)
        .map_err(|e| ClaudeSDKError::sdk(format!("Failed to read session file: {e}")))?;
    if content.is_empty() {
        return Err(ClaudeSDKError::sdk(format!(
            "Session {session_id} has no messages to fork"
        )));
    }

    let (transcript, content_replacements) = parse_fork_transcript(&content, session_id);

    let derive_title = || -> Option<String> {
        let buf_len = content.len();
        let head_end = std::cmp::min(buf_len, LITE_READ_BUF_SIZE);
        let head = String::from_utf8_lossy(&content[..head_end]);
        let tail_start = if buf_len > LITE_READ_BUF_SIZE {
            buf_len - LITE_READ_BUF_SIZE
        } else {
            0
        };
        let tail = String::from_utf8_lossy(&content[tail_start..]);

        extract_last_json_string_field(&tail, "customTitle")
            .or_else(|| extract_last_json_string_field(&head, "customTitle"))
            .or_else(|| extract_last_json_string_field(&tail, "aiTitle"))
            .or_else(|| extract_last_json_string_field(&head, "aiTitle"))
            .or_else(|| {
                let p = extract_first_prompt_from_head(&head);
                if p.is_empty() {
                    None
                } else {
                    Some(p)
                }
            })
    };

    let (forked_session_id, lines) = build_fork_lines(
        transcript,
        &content_replacements,
        session_id,
        up_to_message_id,
        title,
        &derive_title,
    )?;

    let fork_path = project_dir.join(format!("{forked_session_id}.jsonl"));

    // Write with O_CREAT | O_EXCL semantics (create_new)
    let write_data = format!("{}\n", lines.join("\n"));
    let mut file = fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&fork_path)
        .map_err(|e| ClaudeSDKError::sdk(format!("Failed to create fork file: {e}")))?;

    // Set permissions to 0o600
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = file.set_permissions(fs::Permissions::from_mode(0o600));
    }

    file.write_all(write_data.as_bytes())
        .map_err(|e| ClaudeSDKError::sdk(format!("Failed to write fork file: {e}")))?;

    Ok(ForkSessionResult {
        session_id: forked_session_id,
    })
}

// ---------------------------------------------------------------------------
// SessionStore-backed mutations (async)
// ---------------------------------------------------------------------------

/// Compute a project key from a directory path for store-backed operations.
fn store_project_key(directory: Option<&str>) -> String {
    project_key_for_directory(directory).unwrap_or_default()
}

fn iso_now() -> String {
    Utc::now().format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string()
}

pub async fn rename_session_via_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    title: &str,
    directory: Option<&str>,
) -> Result<()> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }
    let stripped = title.trim();
    if stripped.is_empty() {
        return Err(ClaudeSDKError::sdk("title must be non-empty"));
    }
    let project_key = store_project_key(directory);
    let key = SessionKey::new(project_key, session_id);
    let entry = json!({
        "type": "custom-title",
        "customTitle": stripped,
        "sessionId": session_id,
        "uuid": uuid::Uuid::new_v4().to_string(),
        "timestamp": iso_now(),
    });
    session_store.append(&key, &[entry]).await?;
    Ok(())
}

pub async fn tag_session_via_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    tag: Option<&str>,
    directory: Option<&str>,
) -> Result<()> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }

    let tag_value = match tag {
        Some(t) => {
            let sanitized = sanitize_unicode(t);
            let sanitized_trimmed = sanitized.trim().to_string();
            if sanitized_trimmed.is_empty() {
                return Err(ClaudeSDKError::sdk(
                    "tag must be non-empty (use None to clear)",
                ));
            }
            sanitized_trimmed
        }
        None => String::new(),
    };

    let project_key = store_project_key(directory);
    let key = SessionKey::new(project_key, session_id);
    let entry = json!({
        "type": "tag",
        "tag": tag_value,
        "sessionId": session_id,
        "uuid": uuid::Uuid::new_v4().to_string(),
        "timestamp": iso_now(),
    });
    session_store.append(&key, &[entry]).await?;
    Ok(())
}

pub async fn delete_session_via_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    directory: Option<&str>,
) -> Result<()> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }
    if !session_store.has_delete() {
        return Ok(());
    }
    let project_key = store_project_key(directory);
    let key = SessionKey::new(project_key, session_id);

    // Best-effort: ignore errors from stores that don't implement delete
    let _ = session_store.delete(&key).await;
    Ok(())
}

pub async fn fork_session_via_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    directory: Option<&str>,
    up_to_message_id: Option<&str>,
    title: Option<&str>,
) -> Result<ForkSessionResult> {
    if validate_uuid(session_id).is_none() {
        return Err(ClaudeSDKError::sdk(format!(
            "Invalid session_id: {session_id}"
        )));
    }
    if let Some(msg_id) = up_to_message_id {
        if validate_uuid(msg_id).is_none() {
            return Err(ClaudeSDKError::sdk(format!(
                "Invalid up_to_message_id: {msg_id}"
            )));
        }
    }

    let project_key = store_project_key(directory);
    let src_key = SessionKey::new(&project_key, session_id);
    let loaded = session_store.load(&src_key).await?;
    let raw =
        loaded.ok_or_else(|| ClaudeSDKError::sdk(format!("Session {session_id} not found")))?;

    // Partition into transcript and content-replacement entries
    let mut transcript: Vec<serde_json::Value> = Vec::new();
    let mut content_replacements: Vec<serde_json::Value> = Vec::new();
    for entry in &raw {
        let entry_type = entry.get("type").and_then(|v| v.as_str()).unwrap_or("");
        if TRANSCRIPT_TYPES.contains(&entry_type)
            && entry.get("uuid").and_then(|v| v.as_str()).is_some()
        {
            transcript.push(entry.clone());
        } else if entry_type == "content-replacement"
            && entry.get("sessionId").and_then(|v| v.as_str()) == Some(session_id)
            && entry
                .get("replacements")
                .and_then(|v| v.as_array())
                .is_some()
        {
            if let Some(arr) = entry.get("replacements").and_then(|v| v.as_array()) {
                content_replacements.extend(arr.iter().cloned());
            }
        }
    }

    let derive_title = || -> Option<String> { derive_title_from_entries(&raw) };

    let (forked_session_id, lines) = build_fork_lines(
        transcript,
        &content_replacements,
        session_id,
        up_to_message_id,
        title,
        &derive_title,
    )?;

    let dst_key = SessionKey::new(&project_key, &forked_session_id);
    // Re-parse lines to objects for store
    let entries: Vec<SessionStoreEntry> = lines
        .iter()
        .map(|line| serde_json::from_str(line).unwrap())
        .collect();
    session_store.append(&dst_key, &entries).await?;

    Ok(ForkSessionResult {
        session_id: forked_session_id,
    })
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

fn find_session_file(session_id: &str, directory: Option<&str>) -> Option<PathBuf> {
    find_session_file_with_dir(session_id, directory).map(|(path, _)| path)
}

fn find_session_file_with_dir(
    session_id: &str,
    directory: Option<&str>,
) -> Option<(PathBuf, PathBuf)> {
    let file_name = format!("{session_id}.jsonl");

    let try_dir = |project_dir: &Path| -> Option<(PathBuf, PathBuf)> {
        let path = project_dir.join(&file_name);
        match fs::metadata(&path) {
            Ok(m) if m.len() > 0 => Some((path, project_dir.to_path_buf())),
            _ => None,
        }
    };

    if let Some(dir) = directory {
        let canonical = canonicalize_path(dir);
        if let Some(project_dir) = find_project_dir(&canonical) {
            if let Some(result) = try_dir(&project_dir) {
                return Some(result);
            }
        }

        let worktree_paths = get_worktree_paths(&canonical);
        for wt in &worktree_paths {
            if *wt == canonical {
                continue;
            }
            if let Some(wt_project_dir) = find_project_dir(wt) {
                if let Some(result) = try_dir(&wt_project_dir) {
                    return Some(result);
                }
            }
        }
        return None;
    }

    // No directory — search all project directories
    let projects_dir = get_projects_dir(None);
    let dirents = fs::read_dir(&projects_dir).ok()?;
    for entry in dirents.flatten() {
        if let Some(result) = try_dir(&entry.path()) {
            return Some(result);
        }
    }
    None
}

/// Try appending data to a session file using O_APPEND semantics.
/// Returns true on success, false if file doesn't exist or is 0-byte.
fn try_append(path: &Path, data: &str) -> std::result::Result<bool, io::Error> {
    let file = match fs::OpenOptions::new().append(true).open(path) {
        Ok(f) => f,
        Err(e) if e.kind() == io::ErrorKind::NotFound => return Ok(false),
        Err(e) => {
            // ENOTDIR also means "not here, keep searching"
            if e.raw_os_error() == Some(libc::ENOTDIR) {
                return Ok(false);
            }
            return Err(e);
        }
    };

    // Check file size — 0-byte stubs should be skipped
    let metadata = file.metadata()?;
    if metadata.len() == 0 {
        return Ok(false);
    }

    let mut writer = io::BufWriter::new(file);
    writer.write_all(data.as_bytes())?;
    writer.flush()?;
    Ok(true)
}

fn append_to_session(session_id: &str, data: &str, directory: Option<&str>) -> Result<()> {
    let file_name = format!("{session_id}.jsonl");

    if let Some(dir) = directory {
        let canonical = canonicalize_path(dir);

        // Try the exact/prefix-matched project directory first.
        if let Some(project_dir) = find_project_dir(&canonical) {
            match try_append(&project_dir.join(&file_name), data) {
                Ok(true) => return Ok(()),
                Ok(false) => {}
                Err(e) => {
                    return Err(ClaudeSDKError::sdk(format!("Failed to append: {e}")));
                }
            }
        }

        // Worktree fallback
        let worktree_paths = get_worktree_paths(&canonical);
        for wt in &worktree_paths {
            if *wt == canonical {
                continue;
            }
            if let Some(wt_project_dir) = find_project_dir(wt) {
                match try_append(&wt_project_dir.join(&file_name), data) {
                    Ok(true) => return Ok(()),
                    Ok(false) => {}
                    Err(e) => {
                        return Err(ClaudeSDKError::sdk(format!("Failed to append: {e}")));
                    }
                }
            }
        }

        return Err(ClaudeSDKError::sdk(format!(
            "Session {session_id} not found in project directory for {dir}"
        )));
    }

    // No directory — search all project directories
    let projects_dir = get_projects_dir(None);
    let dirents = match fs::read_dir(&projects_dir) {
        Ok(e) => e,
        Err(_) => {
            return Err(ClaudeSDKError::sdk(format!(
                "Session {session_id} not found (no projects directory)"
            )));
        }
    };
    for entry in dirents.flatten() {
        match try_append(&entry.path().join(&file_name), data) {
            Ok(true) => return Ok(()),
            Ok(false) => {}
            Err(e) => {
                return Err(ClaudeSDKError::sdk(format!("Failed to append: {e}")));
            }
        }
    }
    Err(ClaudeSDKError::sdk(format!(
        "Session {session_id} not found in any project directory"
    )))
}

// ---------------------------------------------------------------------------
// Fork helpers
// ---------------------------------------------------------------------------

fn parse_fork_transcript(
    content: &[u8],
    session_id: &str,
) -> (Vec<serde_json::Value>, Vec<serde_json::Value>) {
    let text = String::from_utf8_lossy(content);
    let mut transcript: Vec<serde_json::Value> = Vec::new();
    let mut content_replacements: Vec<serde_json::Value> = Vec::new();

    for line in text.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let entry: serde_json::Value = match serde_json::from_str(line) {
            Ok(v) => v,
            Err(_) => continue,
        };
        if !entry.is_object() {
            continue;
        }
        let entry_type = entry.get("type").and_then(|v| v.as_str()).unwrap_or("");
        if TRANSCRIPT_TYPES.contains(&entry_type)
            && entry.get("uuid").and_then(|v| v.as_str()).is_some()
        {
            transcript.push(entry);
        } else if entry_type == "content-replacement"
            && entry.get("sessionId").and_then(|v| v.as_str()) == Some(session_id)
        {
            if let Some(arr) = entry.get("replacements").and_then(|v| v.as_array()) {
                content_replacements.extend(arr.iter().cloned());
            }
        }
    }

    (transcript, content_replacements)
}

fn derive_title_from_entries(raw: &[serde_json::Value]) -> Option<String> {
    let mut custom: Option<String> = None;
    let mut ai: Option<String> = None;
    for e in raw {
        if !e.is_object() {
            continue;
        }
        if let Some(ct) = e.get("customTitle").and_then(|v| v.as_str()) {
            if !ct.is_empty() {
                custom = Some(ct.to_string());
            }
        }
        if let Some(at) = e.get("aiTitle").and_then(|v| v.as_str()) {
            if !at.is_empty() {
                ai = Some(at.to_string());
            }
        }
    }
    if custom.is_some() {
        return custom;
    }
    if ai.is_some() {
        return ai;
    }
    // First-prompt fallback
    let jsonl: String = raw
        .iter()
        .map(|e| serde_json::to_string(e).unwrap_or_default())
        .collect::<Vec<_>>()
        .join("\n")
        + "\n";
    let p = extract_first_prompt_from_head(&jsonl);
    if p.is_empty() {
        None
    } else {
        Some(p)
    }
}

/// Fields to remove from forked entries to avoid leaking source session state.
const STALE_FIELDS: &[&str] = &["teamName", "agentName", "slug", "sourceToolAssistantUUID"];

fn build_fork_lines(
    mut transcript: Vec<serde_json::Value>,
    content_replacements: &[serde_json::Value],
    session_id: &str,
    up_to_message_id: Option<&str>,
    title: Option<&str>,
    derive_title: &dyn Fn() -> Option<String>,
) -> Result<(String, Vec<String>)> {
    // Filter out sidechains
    transcript.retain(|e| {
        !e.get("isSidechain")
            .and_then(|v| v.as_bool())
            .unwrap_or(false)
    });

    if transcript.is_empty() {
        return Err(ClaudeSDKError::sdk(format!(
            "Session {session_id} has no messages to fork"
        )));
    }

    if let Some(cutoff_id) = up_to_message_id {
        let cutoff = transcript
            .iter()
            .position(|e| e.get("uuid").and_then(|v| v.as_str()) == Some(cutoff_id));
        match cutoff {
            Some(idx) => {
                transcript.truncate(idx + 1);
            }
            None => {
                return Err(ClaudeSDKError::sdk(format!(
                    "Message {cutoff_id} not found in session {session_id}"
                )));
            }
        }
    }

    // Build uuid mapping (includes progress entries for parentUuid chain walk)
    let mut uuid_mapping: HashMap<String, String> = HashMap::new();
    for entry in &transcript {
        if let Some(uuid) = entry.get("uuid").and_then(|v| v.as_str()) {
            uuid_mapping.insert(uuid.to_string(), uuid::Uuid::new_v4().to_string());
        }
    }

    // Filter out progress messages from written output
    let writable: Vec<&serde_json::Value> = transcript
        .iter()
        .filter(|e| e.get("type").and_then(|v| v.as_str()) != Some("progress"))
        .collect();

    if writable.is_empty() {
        return Err(ClaudeSDKError::sdk(format!(
            "Session {session_id} has no messages to fork"
        )));
    }

    // Index by uuid for parentUuid chain walking
    let mut by_uuid: HashMap<&str, &serde_json::Value> = HashMap::new();
    for entry in &transcript {
        if let Some(uuid) = entry.get("uuid").and_then(|v| v.as_str()) {
            by_uuid.insert(uuid, entry);
        }
    }

    let forked_session_id = uuid::Uuid::new_v4().to_string();
    let now = iso_now();
    let mut lines: Vec<String> = Vec::new();

    for (i, original) in writable.iter().enumerate() {
        let orig_uuid = original.get("uuid").and_then(|v| v.as_str()).unwrap();
        let new_uuid = uuid_mapping.get(orig_uuid).unwrap();

        // Resolve parentUuid, skipping progress ancestors
        let mut new_parent_uuid: Option<&str> = None;
        let mut parent_id = original.get("parentUuid").and_then(|v| v.as_str());
        while let Some(pid) = parent_id {
            if let Some(parent) = by_uuid.get(pid) {
                if parent.get("type").and_then(|v| v.as_str()) != Some("progress") {
                    new_parent_uuid = uuid_mapping.get(pid).map(|s| s.as_str());
                    break;
                }
                parent_id = parent.get("parentUuid").and_then(|v| v.as_str());
            } else {
                break;
            }
        }

        // Only update timestamp on the last message
        let timestamp = if i == writable.len() - 1 {
            now.clone()
        } else {
            original
                .get("timestamp")
                .and_then(|v| v.as_str())
                .unwrap_or(&now)
                .to_string()
        };

        // Remap logicalParentUuid
        let logical_parent = original.get("logicalParentUuid").and_then(|v| v.as_str());
        let new_logical_parent =
            logical_parent.and_then(|lp| uuid_mapping.get(lp).map(|s| s.as_str()));

        // Build forked entry: spread original, override specific fields
        let mut forked = original.as_object().unwrap().clone();
        forked.insert("uuid".to_string(), json!(new_uuid));
        forked.insert(
            "parentUuid".to_string(),
            match new_parent_uuid {
                Some(p) => json!(p),
                None => serde_json::Value::Null,
            },
        );

        // Handle logicalParentUuid: remap if present, preserve null/missing semantics
        if original.get("logicalParentUuid").is_some() {
            forked.insert(
                "logicalParentUuid".to_string(),
                match new_logical_parent {
                    Some(p) => json!(p),
                    None => serde_json::Value::Null,
                },
            );
        }

        forked.insert("sessionId".to_string(), json!(forked_session_id));
        forked.insert("timestamp".to_string(), json!(timestamp));
        forked.insert("isSidechain".to_string(), json!(false));
        forked.insert(
            "forkedFrom".to_string(),
            json!({
                "sessionId": session_id,
                "messageUuid": orig_uuid,
            }),
        );

        // Remove stale fields
        for key in STALE_FIELDS {
            forked.remove(*key);
        }

        lines.push(serde_json::to_string(&forked).unwrap());
    }

    // Append content-replacement entry if any
    if !content_replacements.is_empty() {
        lines.push(
            serde_json::to_string(&json!({
                "type": "content-replacement",
                "sessionId": forked_session_id,
                "replacements": content_replacements,
                "uuid": uuid::Uuid::new_v4().to_string(),
                "timestamp": now,
            }))
            .unwrap(),
        );
    }

    // Derive title
    let fork_title = title
        .map(|t| t.trim().to_string())
        .filter(|t| !t.is_empty());
    let fork_title = fork_title.unwrap_or_else(|| {
        format!(
            "{} (fork)",
            derive_title().unwrap_or_else(|| "Forked session".to_string())
        )
    });

    lines.push(
        serde_json::to_string(&json!({
            "type": "custom-title",
            "sessionId": forked_session_id,
            "customTitle": fork_title,
            "uuid": uuid::Uuid::new_v4().to_string(),
            "timestamp": now,
        }))
        .unwrap(),
    );

    Ok((forked_session_id, lines))
}
