use std::collections::{HashMap, HashSet};
use std::fs;
use std::os::unix::fs::MetadataExt;
use std::path::{Path, PathBuf};

use chrono::DateTime;

use crate::errors::Result;
use crate::types::{
    SDKSessionInfo, SessionKey, SessionMessage, SessionMessageType, SessionStore,
    SessionSummaryEntry,
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

pub(crate) const LITE_READ_BUF_SIZE: usize = 65536;
const MAX_SANITIZED_LENGTH: usize = 200;

// Transcript entry types that carry uuid + parentUuid chain links.
const TRANSCRIPT_ENTRY_TYPES: &[&str] = &["user", "assistant", "progress", "system", "attachment"];

// ---------------------------------------------------------------------------
// Internal helpers (pub for integration tests)
// ---------------------------------------------------------------------------

pub fn sanitize_path(name: &str) -> String {
    let sanitized: String = name
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '-' })
        .collect();
    if sanitized.len() <= MAX_SANITIZED_LENGTH {
        return sanitized;
    }
    let h = simple_hash(name);
    format!("{}-{}", &sanitized[..MAX_SANITIZED_LENGTH], h)
}

pub fn simple_hash(s: &str) -> String {
    let mut h: i64 = 0;
    for ch in s.chars() {
        let char_code = ch as u32 as i64;
        h = (h << 5).wrapping_sub(h).wrapping_add(char_code);
        // Emulate JS `hash |= 0` (coerce to 32-bit signed int)
        h = h & 0xFFFF_FFFF;
        if h >= 0x8000_0000 {
            h -= 0x1_0000_0000;
        }
    }
    h = h.abs();
    if h == 0 {
        return "0".to_string();
    }
    const DIGITS: &[u8] = b"0123456789abcdefghijklmnopqrstuvwxyz";
    let mut out = Vec::new();
    let mut n = h;
    while n > 0 {
        out.push(DIGITS[(n % 36) as usize]);
        n /= 36;
    }
    out.reverse();
    String::from_utf8(out).unwrap()
}

pub fn validate_uuid(maybe_uuid: &str) -> Option<String> {
    // Pattern: 8-4-4-4-12 hex chars, case insensitive
    let bytes = maybe_uuid.as_bytes();
    if bytes.len() != 36 {
        return None;
    }
    let groups = [8, 4, 4, 4, 12];
    let mut pos = 0;
    for (i, &len) in groups.iter().enumerate() {
        if i > 0 {
            if bytes[pos] != b'-' {
                return None;
            }
            pos += 1;
        }
        for _ in 0..len {
            if pos >= bytes.len() {
                return None;
            }
            if !bytes[pos].is_ascii_hexdigit() {
                return None;
            }
            pos += 1;
        }
    }
    Some(maybe_uuid.to_string())
}

fn unescape_json_string(raw: &str) -> String {
    if !raw.contains('\\') {
        return raw.to_string();
    }
    let quoted = format!("\"{}\"", raw);
    match serde_json::from_str::<String>(&quoted) {
        Ok(s) => s,
        Err(_) => raw.to_string(),
    }
}

pub fn extract_json_string_field(text: &str, key: &str) -> Option<String> {
    let patterns = [format!("\"{}\":\"", key), format!("\"{}\": \"", key)];
    for pattern in &patterns {
        if let Some(idx) = text.find(pattern) {
            let value_start = idx + pattern.len();
            let rest = &text[value_start..];
            let mut i = 0;
            let bytes = rest.as_bytes();
            while i < bytes.len() {
                if bytes[i] == b'\\' {
                    i += 2;
                    continue;
                }
                if bytes[i] == b'"' {
                    return Some(unescape_json_string(&rest[..i]));
                }
                i += 1;
            }
        }
    }
    None
}

pub fn extract_last_json_string_field(text: &str, key: &str) -> Option<String> {
    let patterns = [format!("\"{}\":\"", key), format!("\"{}\": \"", key)];
    let mut last_value: Option<String> = None;
    for pattern in &patterns {
        let mut search_from = 0;
        loop {
            match text[search_from..].find(pattern) {
                None => break,
                Some(rel_idx) => {
                    let idx = search_from + rel_idx;
                    let value_start = idx + pattern.len();
                    let rest = &text[value_start..];
                    let bytes = rest.as_bytes();
                    let mut i = 0;
                    while i < bytes.len() {
                        if bytes[i] == b'\\' {
                            i += 2;
                            continue;
                        }
                        if bytes[i] == b'"' {
                            last_value = Some(unescape_json_string(&rest[..i]));
                            break;
                        }
                        i += 1;
                    }
                    search_from = value_start + i + 1;
                }
            }
        }
    }
    last_value
}

// ---------------------------------------------------------------------------
// Config directories
// ---------------------------------------------------------------------------

fn get_claude_config_home_dir() -> PathBuf {
    if let Ok(config_dir) = std::env::var("CLAUDE_CONFIG_DIR") {
        return PathBuf::from(config_dir);
    }
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    PathBuf::from(home).join(".claude")
}

pub fn get_projects_dir(
    env_override: Option<&std::collections::HashMap<String, String>>,
) -> PathBuf {
    if let Some(env) = env_override {
        if let Some(config_dir) = env.get("CLAUDE_CONFIG_DIR") {
            if !config_dir.is_empty() {
                return PathBuf::from(config_dir).join("projects");
            }
        }
    }
    get_claude_config_home_dir().join("projects")
}

fn get_default_projects_dir() -> PathBuf {
    get_projects_dir(None)
}

fn get_project_dir(project_path: &str) -> PathBuf {
    get_default_projects_dir().join(sanitize_path(project_path))
}

pub(crate) fn canonicalize_path(d: &str) -> String {
    use unicode_normalization::UnicodeNormalization;
    let resolved = match fs::canonicalize(d) {
        Ok(r) => r.to_string_lossy().to_string(),
        Err(_) => d.to_string(),
    };
    // Apply NFC normalization (#46) to match Python's unicodedata.normalize("NFC", ...)
    resolved.nfc().collect()
}

pub(crate) fn find_project_dir(project_path: &str) -> Option<PathBuf> {
    let exact = get_project_dir(project_path);
    if exact.is_dir() {
        return Some(exact);
    }

    let sanitized = sanitize_path(project_path);
    if sanitized.len() <= MAX_SANITIZED_LENGTH {
        return None;
    }

    let prefix = &sanitized[..MAX_SANITIZED_LENGTH];
    let projects_dir = get_default_projects_dir();
    if let Ok(entries) = fs::read_dir(&projects_dir) {
        for entry in entries.flatten() {
            if entry.path().is_dir()
                && entry
                    .file_name()
                    .to_string_lossy()
                    .starts_with(&format!("{}-", prefix))
            {
                return Some(entry.path());
            }
        }
    }
    None
}

// ---------------------------------------------------------------------------
// First prompt extraction
// ---------------------------------------------------------------------------

pub fn matches_skip_pattern(s: &str) -> bool {
    if s.starts_with("<local-command-stdout>")
        || s.starts_with("<session-start-hook>")
        || s.starts_with("<tick>")
        || s.starts_with("<goal>")
        || s.starts_with("[Request interrupted by user")
    {
        return true;
    }
    // Check for ide_opened_file or ide_selection patterns (entire string)
    let trimmed = s.trim();
    if trimmed.starts_with("<ide_opened_file>") && trimmed.ends_with("</ide_opened_file>") {
        return true;
    }
    if trimmed.starts_with("<ide_selection>") && trimmed.ends_with("</ide_selection>") {
        return true;
    }
    false
}

pub fn extract_command_name(s: &str) -> Option<String> {
    let start_tag = "<command-name>";
    let end_tag = "</command-name>";
    let start = s.find(start_tag)?;
    let after_start = start + start_tag.len();
    let end = s[after_start..].find(end_tag)?;
    Some(s[after_start..after_start + end].to_string())
}

pub(crate) fn extract_first_prompt_from_head(head: &str) -> String {
    let mut command_fallback = String::new();

    for line in head.lines() {
        if !line.contains("\"type\":\"user\"") && !line.contains("\"type\": \"user\"") {
            continue;
        }
        if line.contains("\"tool_result\"") {
            continue;
        }
        if line.contains("\"isMeta\":true") || line.contains("\"isMeta\": true") {
            continue;
        }
        if line.contains("\"isCompactSummary\":true") || line.contains("\"isCompactSummary\": true")
        {
            continue;
        }

        let entry: serde_json::Value = match serde_json::from_str(line) {
            Ok(v) => v,
            Err(_) => continue,
        };

        if entry.get("type").and_then(|v| v.as_str()) != Some("user") {
            continue;
        }

        let message = match entry.get("message") {
            Some(m) if m.is_object() => m,
            _ => continue,
        };

        let content = match message.get("content") {
            Some(c) => c,
            None => continue,
        };

        let mut texts: Vec<String> = Vec::new();
        if let Some(s) = content.as_str() {
            texts.push(s.to_string());
        } else if let Some(arr) = content.as_array() {
            for block in arr {
                if block.get("type").and_then(|v| v.as_str()) == Some("text") {
                    if let Some(t) = block.get("text").and_then(|v| v.as_str()) {
                        texts.push(t.to_string());
                    }
                }
            }
        }

        for raw in &texts {
            let result = raw.replace('\n', " ");
            let result = result.trim().to_string();
            if result.is_empty() {
                continue;
            }

            if let Some(cmd) = extract_command_name(&result) {
                if command_fallback.is_empty() {
                    command_fallback = cmd;
                }
                continue;
            }

            if matches_skip_pattern(&result) {
                continue;
            }

            if result.chars().count() > 200 {
                let truncated: String = result.chars().take(200).collect();
                let truncated = truncated.trim_end();
                return format!("{truncated}\u{2026}");
            }
            return result;
        }
    }

    command_fallback
}

// ---------------------------------------------------------------------------
// Lite session file reading
// ---------------------------------------------------------------------------

struct LiteSessionFile {
    mtime: i64,
    size: i64,
    head: String,
    tail: String,
}

fn read_session_lite(file_path: &Path) -> Option<LiteSessionFile> {
    let file = fs::File::open(file_path).ok()?;
    let metadata = file.metadata().ok()?;
    let size = metadata.size() as i64;
    let mtime_secs = metadata.mtime();
    let mtime = mtime_secs * 1000;

    if size == 0 {
        return None;
    }

    let content = fs::read(file_path).ok()?;
    if content.is_empty() {
        return None;
    }

    let head_end = std::cmp::min(LITE_READ_BUF_SIZE, content.len());
    let head = String::from_utf8_lossy(&content[..head_end]).to_string();

    let tail_offset = if content.len() > LITE_READ_BUF_SIZE {
        content.len() - LITE_READ_BUF_SIZE
    } else {
        0
    };
    let tail = if tail_offset == 0 {
        head.clone()
    } else {
        String::from_utf8_lossy(&content[tail_offset..]).to_string()
    };

    Some(LiteSessionFile {
        mtime,
        size,
        head,
        tail,
    })
}

// ---------------------------------------------------------------------------
// Parse session info from lite read
// ---------------------------------------------------------------------------

fn parse_session_info_from_lite(
    session_id: &str,
    lite: &LiteSessionFile,
    project_path: Option<&str>,
) -> Option<SDKSessionInfo> {
    let head = &lite.head;
    let tail = &lite.tail;
    let mtime = lite.mtime;
    let size = lite.size;

    // Check first line for sidechain sessions
    let first_line = head.lines().next().unwrap_or("");
    if first_line.contains("\"isSidechain\":true") || first_line.contains("\"isSidechain\": true") {
        return None;
    }

    // customTitle wins over aiTitle
    let custom_title = extract_last_json_string_field(tail, "customTitle")
        .or_else(|| extract_last_json_string_field(head, "customTitle"))
        .or_else(|| extract_last_json_string_field(tail, "aiTitle"))
        .or_else(|| extract_last_json_string_field(head, "aiTitle"));
    let custom_title = custom_title.filter(|s| !s.is_empty());

    let first_prompt_raw = extract_first_prompt_from_head(head);
    let first_prompt = if first_prompt_raw.is_empty() {
        None
    } else {
        Some(first_prompt_raw)
    };

    let summary = custom_title
        .clone()
        .or_else(|| extract_last_json_string_field(tail, "lastPrompt"))
        .or_else(|| extract_last_json_string_field(tail, "summary"))
        .or_else(|| first_prompt.clone());

    // Skip metadata-only sessions
    let summary = summary?;
    if summary.is_empty() {
        return None;
    }

    let git_branch = extract_last_json_string_field(tail, "gitBranch")
        .or_else(|| extract_json_string_field(head, "gitBranch"));
    let git_branch = git_branch.filter(|s| !s.is_empty());

    let session_cwd =
        extract_json_string_field(head, "cwd").or_else(|| project_path.map(|s| s.to_string()));
    let session_cwd = session_cwd.filter(|s| !s.is_empty());

    // Scope tag extraction to {"type":"tag"} lines
    let tag_line = tail
        .lines()
        .rev()
        .find(|ln| ln.starts_with("{\"type\":\"tag\""));
    let tag =
        tag_line.and_then(|ln| extract_last_json_string_field(ln, "tag").filter(|s| !s.is_empty()));

    // created_at from first ISO timestamp in head
    let created_at = extract_json_string_field(head, "timestamp")
        .and_then(|ts| parse_iso_timestamp_to_millis(&ts));

    Some(SDKSessionInfo {
        session_id: session_id.to_string(),
        summary,
        last_modified: mtime,
        file_size: Some(size),
        custom_title,
        first_prompt,
        git_branch,
        cwd: session_cwd,
        tag,
        created_at,
    })
}

fn parse_iso_timestamp_to_millis(ts: &str) -> Option<i64> {
    // Try parsing with trailing Z
    let normalized = if ts.ends_with('Z') {
        ts.replace('Z', "+00:00")
    } else {
        ts.to_string()
    };
    let dt = DateTime::parse_from_rfc3339(&normalized).ok()?;
    Some(dt.timestamp_millis())
}

// ---------------------------------------------------------------------------
// Git worktree detection
// ---------------------------------------------------------------------------

pub(crate) fn get_worktree_paths(cwd: &str) -> Vec<String> {
    let output = std::process::Command::new("git")
        .args(["worktree", "list", "--porcelain"])
        .current_dir(cwd)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .output();

    let output = match output {
        Ok(o) if o.status.success() => o,
        _ => return Vec::new(),
    };

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut paths = Vec::new();
    for line in stdout.lines() {
        if let Some(path) = line.strip_prefix("worktree ") {
            paths.push(path.to_string());
        }
    }
    paths
}

// ---------------------------------------------------------------------------
// Read sessions from directory
// ---------------------------------------------------------------------------

fn read_sessions_from_dir(project_dir: &Path, project_path: Option<&str>) -> Vec<SDKSessionInfo> {
    let entries = match fs::read_dir(project_dir) {
        Ok(e) => e,
        Err(_) => return Vec::new(),
    };

    let mut results = Vec::new();
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        if !name.ends_with(".jsonl") {
            continue;
        }
        let stem = &name[..name.len() - 6];
        let session_id = match validate_uuid(stem) {
            Some(id) => id,
            None => continue,
        };
        let lite = match read_session_lite(&entry.path()) {
            Some(l) => l,
            None => continue,
        };
        if let Some(info) = parse_session_info_from_lite(&session_id, &lite, project_path) {
            results.push(info);
        }
    }
    results
}

fn deduplicate_by_session_id(sessions: Vec<SDKSessionInfo>) -> Vec<SDKSessionInfo> {
    let mut by_id: HashMap<String, SDKSessionInfo> = HashMap::new();
    for s in sessions {
        let existing = by_id.get(&s.session_id);
        if existing.is_none() || s.last_modified > existing.unwrap().last_modified {
            by_id.insert(s.session_id.clone(), s);
        }
    }
    by_id.into_values().collect()
}

fn apply_sort_limit_offset(
    mut sessions: Vec<SDKSessionInfo>,
    limit: Option<usize>,
    offset: usize,
) -> Vec<SDKSessionInfo> {
    sessions.sort_by(|a, b| b.last_modified.cmp(&a.last_modified));
    if offset > 0 {
        if offset >= sessions.len() {
            return Vec::new();
        }
        sessions = sessions[offset..].to_vec();
    }
    if let Some(limit) = limit {
        if limit > 0 && sessions.len() > limit {
            sessions.truncate(limit);
        }
    }
    sessions
}

// ---------------------------------------------------------------------------
// Local file-backed session listing
// ---------------------------------------------------------------------------

fn list_sessions_for_project(
    directory: &str,
    limit: Option<usize>,
    offset: usize,
    include_worktrees: bool,
) -> Vec<SDKSessionInfo> {
    let canonical_dir = canonicalize_path(directory);

    let worktree_paths = if include_worktrees {
        get_worktree_paths(&canonical_dir)
    } else {
        Vec::new()
    };

    // No worktrees (or scanning disabled) — just scan single dir
    if worktree_paths.len() <= 1 {
        let project_dir = match find_project_dir(&canonical_dir) {
            Some(d) => d,
            None => return Vec::new(),
        };
        let sessions = read_sessions_from_dir(&project_dir, Some(&canonical_dir));
        return apply_sort_limit_offset(sessions, limit, offset);
    }

    // Worktree-aware scanning
    let projects_dir = get_default_projects_dir();
    let mut indexed: Vec<(String, String)> = worktree_paths
        .iter()
        .map(|wt| {
            let sanitized = sanitize_path(wt);
            (wt.clone(), sanitized)
        })
        .collect();
    indexed.sort_by(|a, b| b.1.len().cmp(&a.1.len()));

    let all_dirents: Vec<PathBuf> = match fs::read_dir(&projects_dir) {
        Ok(entries) => entries
            .flatten()
            .filter(|e| e.path().is_dir())
            .map(|e| e.path())
            .collect(),
        Err(_) => {
            let project_dir = match find_project_dir(&canonical_dir) {
                Some(d) => d,
                None => return apply_sort_limit_offset(Vec::new(), limit, offset),
            };
            let sessions = read_sessions_from_dir(&project_dir, Some(&canonical_dir));
            return apply_sort_limit_offset(sessions, limit, offset);
        }
    };

    let mut all_sessions: Vec<SDKSessionInfo> = Vec::new();
    let mut seen_dirs: HashSet<String> = HashSet::new();

    // Always include the user's actual directory
    if let Some(canonical_project_dir) = find_project_dir(&canonical_dir) {
        if let Some(dir_base) = canonical_project_dir.file_name() {
            seen_dirs.insert(dir_base.to_string_lossy().to_string());
        }
        let sessions = read_sessions_from_dir(&canonical_project_dir, Some(&canonical_dir));
        all_sessions.extend(sessions);
    }

    for entry in &all_dirents {
        let dir_name = match entry.file_name() {
            Some(n) => n.to_string_lossy().to_string(),
            None => continue,
        };
        if seen_dirs.contains(&dir_name) {
            continue;
        }

        for (wt_path, prefix) in &indexed {
            let is_match = dir_name == *prefix
                || (prefix.len() >= MAX_SANITIZED_LENGTH
                    && dir_name.starts_with(&format!("{}-", &prefix[..MAX_SANITIZED_LENGTH])));
            if is_match {
                seen_dirs.insert(dir_name.clone());
                let sessions = read_sessions_from_dir(entry, Some(wt_path));
                all_sessions.extend(sessions);
                break;
            }
        }
    }

    let deduped = deduplicate_by_session_id(all_sessions);
    apply_sort_limit_offset(deduped, limit, offset)
}

fn list_all_sessions(limit: Option<usize>, offset: usize) -> Vec<SDKSessionInfo> {
    let projects_dir = get_default_projects_dir();

    let project_dirs: Vec<PathBuf> = match fs::read_dir(&projects_dir) {
        Ok(entries) => entries
            .flatten()
            .filter(|e| e.path().is_dir())
            .map(|e| e.path())
            .collect(),
        Err(_) => return Vec::new(),
    };

    let mut all_sessions: Vec<SDKSessionInfo> = Vec::new();
    for project_dir in &project_dirs {
        all_sessions.extend(read_sessions_from_dir(project_dir, None));
    }

    let deduped = deduplicate_by_session_id(all_sessions);
    apply_sort_limit_offset(deduped, limit, offset)
}

pub fn list_sessions(
    directory: Option<&str>,
    limit: Option<usize>,
    offset: usize,
    include_worktrees: bool,
) -> Result<Vec<SDKSessionInfo>> {
    if let Some(dir) = directory {
        Ok(list_sessions_for_project(
            dir,
            limit,
            offset,
            include_worktrees,
        ))
    } else {
        Ok(list_all_sessions(limit, offset))
    }
}

// ---------------------------------------------------------------------------
// get_session_info
// ---------------------------------------------------------------------------

pub fn get_session_info(
    session_id: &str,
    directory: Option<&str>,
) -> Result<Option<SDKSessionInfo>> {
    let uuid = match validate_uuid(session_id) {
        Some(u) => u,
        None => return Ok(None),
    };
    let file_name = format!("{}.jsonl", uuid);

    if let Some(dir) = directory {
        let canonical = canonicalize_path(dir);
        if let Some(project_dir) = find_project_dir(&canonical) {
            let path = project_dir.join(&file_name);
            if let Some(lite) = read_session_lite(&path) {
                return Ok(parse_session_info_from_lite(&uuid, &lite, Some(&canonical)));
            }
        }

        // Worktree fallback
        let worktree_paths = get_worktree_paths(&canonical);
        for wt in &worktree_paths {
            if *wt == canonical {
                continue;
            }
            if let Some(wt_project_dir) = find_project_dir(wt) {
                let path = wt_project_dir.join(&file_name);
                if let Some(lite) = read_session_lite(&path) {
                    return Ok(parse_session_info_from_lite(&uuid, &lite, Some(wt)));
                }
            }
        }

        return Ok(None);
    }

    // No directory — search all project directories
    let projects_dir = get_default_projects_dir();
    let dirents = match fs::read_dir(&projects_dir) {
        Ok(e) => e,
        Err(_) => return Ok(None),
    };
    for entry in dirents.flatten() {
        if !entry.path().is_dir() {
            continue;
        }
        let path = entry.path().join(&file_name);
        if let Some(lite) = read_session_lite(&path) {
            return Ok(parse_session_info_from_lite(&uuid, &lite, None));
        }
    }
    Ok(None)
}

// ---------------------------------------------------------------------------
// get_session_messages
// ---------------------------------------------------------------------------

type TranscriptEntry = serde_json::Value;

fn try_read_session_file(project_dir: &Path, file_name: &str) -> Option<String> {
    fs::read_to_string(project_dir.join(file_name)).ok()
}

fn read_session_file(session_id: &str, directory: Option<&str>) -> Option<String> {
    let file_name = format!("{}.jsonl", session_id);

    if let Some(dir) = directory {
        let canonical_dir = canonicalize_path(dir);

        if let Some(project_dir) = find_project_dir(&canonical_dir) {
            if let Some(content) = try_read_session_file(&project_dir, &file_name) {
                if !content.is_empty() {
                    return Some(content);
                }
            }
        }

        // Try worktree paths
        let worktree_paths = get_worktree_paths(&canonical_dir);
        for wt in &worktree_paths {
            if *wt == canonical_dir {
                continue;
            }
            if let Some(wt_project_dir) = find_project_dir(wt) {
                if let Some(content) = try_read_session_file(&wt_project_dir, &file_name) {
                    if !content.is_empty() {
                        return Some(content);
                    }
                }
            }
        }

        return None;
    }

    // No directory — search all project dirs
    let projects_dir = get_default_projects_dir();
    let dirents = match fs::read_dir(&projects_dir) {
        Ok(e) => e,
        Err(_) => return None,
    };
    for entry in dirents.flatten() {
        if let Some(content) = try_read_session_file(&entry.path(), &file_name) {
            if !content.is_empty() {
                return Some(content);
            }
        }
    }
    None
}

fn parse_transcript_entries(content: &str) -> Vec<TranscriptEntry> {
    let mut entries = Vec::new();
    for line in content.lines() {
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
        if TRANSCRIPT_ENTRY_TYPES.contains(&entry_type)
            && entry.get("uuid").and_then(|v| v.as_str()).is_some()
        {
            entries.push(entry);
        }
    }
    entries
}

fn build_conversation_chain(entries: &[TranscriptEntry]) -> Vec<TranscriptEntry> {
    if entries.is_empty() {
        return Vec::new();
    }

    // Index by uuid
    let mut by_uuid: HashMap<&str, &TranscriptEntry> = HashMap::new();
    for entry in entries {
        if let Some(uuid) = entry.get("uuid").and_then(|v| v.as_str()) {
            by_uuid.insert(uuid, entry);
        }
    }

    // Build entry position index
    let mut entry_index: HashMap<&str, usize> = HashMap::new();
    for (i, entry) in entries.iter().enumerate() {
        if let Some(uuid) = entry.get("uuid").and_then(|v| v.as_str()) {
            entry_index.insert(uuid, i);
        }
    }

    // Find terminal messages (not pointed to by any parentUuid)
    let mut parent_uuids: HashSet<&str> = HashSet::new();
    for entry in entries {
        if let Some(parent) = entry.get("parentUuid").and_then(|v| v.as_str()) {
            parent_uuids.insert(parent);
        }
    }

    let terminals: Vec<&TranscriptEntry> = entries
        .iter()
        .filter(|e| {
            let uuid = e.get("uuid").and_then(|v| v.as_str()).unwrap_or("");
            !parent_uuids.contains(uuid)
        })
        .collect();

    // From each terminal, walk back to find nearest user/assistant leaf
    let mut leaves: Vec<&TranscriptEntry> = Vec::new();
    for terminal in &terminals {
        let mut walk_cur: Option<&TranscriptEntry> = Some(terminal);
        let mut walk_seen: HashSet<&str> = HashSet::new();
        while let Some(cur) = walk_cur {
            let uid = cur.get("uuid").and_then(|v| v.as_str()).unwrap_or("");
            if walk_seen.contains(uid) {
                break;
            }
            walk_seen.insert(uid);
            let cur_type = cur.get("type").and_then(|v| v.as_str()).unwrap_or("");
            if cur_type == "user" || cur_type == "assistant" {
                leaves.push(cur);
                break;
            }
            walk_cur = cur
                .get("parentUuid")
                .and_then(|v| v.as_str())
                .and_then(|p| by_uuid.get(p).copied());
        }
    }

    if leaves.is_empty() {
        return Vec::new();
    }

    // Pick leaf from main chain (not sidechain/team/meta)
    let main_leaves: Vec<&&TranscriptEntry> = leaves
        .iter()
        .filter(|leaf| {
            let is_sidechain = leaf
                .get("isSidechain")
                .and_then(|v| v.as_bool())
                .unwrap_or(false);
            let has_team = leaf.get("teamName").and_then(|v| v.as_str()).is_some();
            let is_meta = leaf
                .get("isMeta")
                .and_then(|v| v.as_bool())
                .unwrap_or(false);
            !is_sidechain && !has_team && !is_meta
        })
        .collect();

    let pick_best = |candidates: &[&TranscriptEntry]| -> TranscriptEntry {
        let mut best = candidates[0];
        let mut best_idx: i64 = candidates[0]
            .get("uuid")
            .and_then(|v| v.as_str())
            .and_then(|u| entry_index.get(u))
            .map(|&i| i as i64)
            .unwrap_or(-1);
        for &cur in &candidates[1..] {
            let cur_idx = cur
                .get("uuid")
                .and_then(|v| v.as_str())
                .and_then(|u| entry_index.get(u))
                .map(|&i| i as i64)
                .unwrap_or(-1);
            if cur_idx > best_idx {
                best = cur;
                best_idx = cur_idx;
            }
        }
        best.clone()
    };

    let leaf = if !main_leaves.is_empty() {
        let refs: Vec<&TranscriptEntry> = main_leaves.iter().map(|&&e| e).collect();
        pick_best(&refs)
    } else {
        pick_best(&leaves)
    };

    // Walk from leaf to root via parentUuid
    let mut chain: Vec<TranscriptEntry> = Vec::new();
    let mut chain_seen: HashSet<String> = HashSet::new();
    let _chain_cur: Option<&TranscriptEntry> = Some(&leaf);

    // We need to handle the leaf specially since it's owned
    let leaf_uuid = leaf
        .get("uuid")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    chain_seen.insert(leaf_uuid);
    chain.push(leaf.clone());

    let mut next_parent = leaf.get("parentUuid").and_then(|v| v.as_str());
    while let Some(parent_uuid) = next_parent {
        if chain_seen.contains(parent_uuid) {
            break;
        }
        match by_uuid.get(parent_uuid) {
            Some(parent_entry) => {
                chain_seen.insert(parent_uuid.to_string());
                chain.push((*parent_entry).clone());
                next_parent = parent_entry.get("parentUuid").and_then(|v| v.as_str());
            }
            None => break,
        }
    }

    chain.reverse();
    chain
}

fn is_visible_message(entry: &TranscriptEntry) -> bool {
    let entry_type = entry.get("type").and_then(|v| v.as_str()).unwrap_or("");
    if entry_type != "user" && entry_type != "assistant" {
        return false;
    }
    if entry
        .get("isMeta")
        .and_then(|v| v.as_bool())
        .unwrap_or(false)
    {
        return false;
    }
    if entry
        .get("isSidechain")
        .and_then(|v| v.as_bool())
        .unwrap_or(false)
    {
        return false;
    }
    entry.get("teamName").and_then(|v| v.as_str()).is_none()
}

fn to_session_message(entry: &TranscriptEntry) -> SessionMessage {
    let entry_type = entry.get("type").and_then(|v| v.as_str()).unwrap_or("user");
    let msg_type = if entry_type == "user" {
        SessionMessageType::User
    } else {
        SessionMessageType::Assistant
    };
    SessionMessage {
        type_: msg_type,
        uuid: entry
            .get("uuid")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        session_id: entry
            .get("sessionId")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        message: entry
            .get("message")
            .cloned()
            .unwrap_or(serde_json::Value::Null),
        parent_tool_use_id: None,
    }
}

fn entries_to_session_messages(
    entries: &[TranscriptEntry],
    limit: Option<usize>,
    offset: usize,
) -> Vec<SessionMessage> {
    let chain = build_conversation_chain(entries);
    let visible: Vec<&TranscriptEntry> = chain.iter().filter(|e| is_visible_message(e)).collect();
    let messages: Vec<SessionMessage> = visible.iter().map(|e| to_session_message(e)).collect();

    if let Some(limit) = limit {
        if limit > 0 {
            let end = std::cmp::min(offset + limit, messages.len());
            if offset >= messages.len() {
                return Vec::new();
            }
            return messages[offset..end].to_vec();
        }
    }
    if offset > 0 {
        if offset >= messages.len() {
            return Vec::new();
        }
        return messages[offset..].to_vec();
    }
    messages
}

pub fn get_session_messages(
    session_id: &str,
    directory: Option<&str>,
    limit: Option<usize>,
    offset: usize,
) -> Result<Vec<SessionMessage>> {
    if validate_uuid(session_id).is_none() {
        return Ok(Vec::new());
    }

    let content = match read_session_file(session_id, directory) {
        Some(c) if !c.is_empty() => c,
        _ => return Ok(Vec::new()),
    };

    let entries = parse_transcript_entries(&content);
    Ok(entries_to_session_messages(&entries, limit, offset))
}

// ---------------------------------------------------------------------------
// Subagent support
// ---------------------------------------------------------------------------

pub fn resolve_session_file_path(session_id: &str, directory: Option<&str>) -> Option<PathBuf> {
    let file_name = format!("{}.jsonl", session_id);

    let stat_candidate = |project_dir: &Path| -> Option<PathBuf> {
        let candidate = project_dir.join(&file_name);
        match fs::metadata(&candidate) {
            Ok(m) if m.len() > 0 => Some(candidate),
            _ => None,
        }
    };

    if let Some(dir) = directory {
        let canonical_dir = canonicalize_path(dir);
        if let Some(project_dir) = find_project_dir(&canonical_dir) {
            if let Some(found) = stat_candidate(&project_dir) {
                return Some(found);
            }
        }
        let worktree_paths = get_worktree_paths(&canonical_dir);
        for wt in &worktree_paths {
            if *wt == canonical_dir {
                continue;
            }
            if let Some(wt_project_dir) = find_project_dir(wt) {
                if let Some(found) = stat_candidate(&wt_project_dir) {
                    return Some(found);
                }
            }
        }
        return None;
    }

    let projects_dir = get_default_projects_dir();
    let dirents = match fs::read_dir(&projects_dir) {
        Ok(e) => e,
        Err(_) => return None,
    };
    for entry in dirents.flatten() {
        if !entry.path().is_dir() {
            continue;
        }
        if let Some(found) = stat_candidate(&entry.path()) {
            return Some(found);
        }
    }
    None
}

fn resolve_subagents_dir(session_id: &str, directory: Option<&str>) -> Option<PathBuf> {
    let resolved = resolve_session_file_path(session_id, directory)?;
    let session_dir = resolved.with_extension("");
    Some(session_dir.join("subagents"))
}

fn collect_agent_files(base_dir: &Path) -> Vec<(String, PathBuf)> {
    let mut results = Vec::new();
    walk_agent_files(base_dir, &mut results);
    results
}

fn walk_agent_files(current_dir: &Path, results: &mut Vec<(String, PathBuf)>) {
    let mut dirents: Vec<fs::DirEntry> = match fs::read_dir(current_dir) {
        Ok(e) => e.flatten().collect(),
        Err(_) => return,
    };
    dirents.sort_by_key(|e| e.file_name());

    for entry in dirents {
        let name = entry.file_name().to_string_lossy().to_string();
        let path = entry.path();
        if path.is_file() && name.starts_with("agent-") && name.ends_with(".jsonl") {
            let agent_id = &name["agent-".len()..name.len() - ".jsonl".len()];
            results.push((agent_id.to_string(), path));
        } else if path.is_dir() {
            walk_agent_files(&path, results);
        }
    }
}

fn build_subagent_chain(entries: &[TranscriptEntry]) -> Vec<TranscriptEntry> {
    if entries.is_empty() {
        return Vec::new();
    }

    let mut by_uuid: HashMap<&str, &TranscriptEntry> = HashMap::new();
    for entry in entries {
        if let Some(uuid) = entry.get("uuid").and_then(|v| v.as_str()) {
            by_uuid.insert(uuid, entry);
        }
    }

    // Find last user/assistant entry
    let leaf = entries.iter().rev().find(|e| {
        let t = e.get("type").and_then(|v| v.as_str()).unwrap_or("");
        t == "user" || t == "assistant"
    });

    let leaf = match leaf {
        Some(l) => l,
        None => return Vec::new(),
    };

    let mut chain: Vec<TranscriptEntry> = Vec::new();
    let mut seen: HashSet<&str> = HashSet::new();
    let mut current: Option<&TranscriptEntry> = Some(leaf);
    while let Some(cur) = current {
        let uid = cur.get("uuid").and_then(|v| v.as_str()).unwrap_or("");
        if seen.contains(uid) {
            break;
        }
        seen.insert(uid);
        chain.push(cur.clone());
        current = cur
            .get("parentUuid")
            .and_then(|v| v.as_str())
            .and_then(|p| by_uuid.get(p).copied());
    }

    chain.reverse();
    chain
}

fn entries_to_subagent_messages(
    entries: &[TranscriptEntry],
    limit: Option<usize>,
    offset: usize,
) -> Vec<SessionMessage> {
    let chain = build_subagent_chain(entries);
    let messages: Vec<SessionMessage> = chain
        .iter()
        .filter(|e| {
            let t = e.get("type").and_then(|v| v.as_str()).unwrap_or("");
            t == "user" || t == "assistant"
        })
        .map(|e| to_session_message(e))
        .collect();

    if let Some(limit) = limit {
        if limit > 0 {
            let end = std::cmp::min(offset + limit, messages.len());
            if offset >= messages.len() {
                return Vec::new();
            }
            return messages[offset..end].to_vec();
        }
    }
    if offset > 0 {
        if offset >= messages.len() {
            return Vec::new();
        }
        return messages[offset..].to_vec();
    }
    messages
}

pub fn list_subagents(session_id: &str, directory: Option<&str>) -> Result<Vec<String>> {
    if validate_uuid(session_id).is_none() {
        return Ok(Vec::new());
    }

    let subagents_dir = match resolve_subagents_dir(session_id, directory) {
        Some(d) => d,
        None => return Ok(Vec::new()),
    };

    Ok(collect_agent_files(&subagents_dir)
        .into_iter()
        .map(|(id, _)| id)
        .collect())
}

pub fn get_subagent_messages(
    session_id: &str,
    agent_id: &str,
    directory: Option<&str>,
    limit: Option<usize>,
    offset: usize,
) -> Result<Vec<SessionMessage>> {
    if validate_uuid(session_id).is_none() {
        return Ok(Vec::new());
    }
    if agent_id.is_empty() {
        return Ok(Vec::new());
    }

    let subagents_dir = match resolve_subagents_dir(session_id, directory) {
        Some(d) => d,
        None => return Ok(Vec::new()),
    };

    let agent_files = collect_agent_files(&subagents_dir);
    let match_file = agent_files.iter().find(|(id, _)| id == agent_id);

    let file_path = match match_file {
        Some((_, path)) => path,
        None => return Ok(Vec::new()),
    };

    let content = match fs::read_to_string(file_path) {
        Ok(c) if !c.is_empty() => c,
        _ => return Ok(Vec::new()),
    };

    let entries = parse_transcript_entries(&content);
    Ok(entries_to_subagent_messages(&entries, limit, offset))
}

// ---------------------------------------------------------------------------
// SessionStore-backed session listing (async)
// ---------------------------------------------------------------------------

pub fn project_key_for_directory(directory: Option<&str>) -> Result<String> {
    let abs_path = match directory {
        Some(d) => canonicalize_path(d),
        None => canonicalize_path("."),
    };
    Ok(sanitize_path(&abs_path))
}

pub async fn list_sessions_from_store(
    session_store: &dyn SessionStore,
    directory: Option<&str>,
    limit: Option<usize>,
    offset: usize,
) -> Result<Vec<SDKSessionInfo>> {
    use crate::internal::session_summary::summary_entry_to_sdk_info;
    use std::collections::HashMap as Map;

    let project_key = project_key_for_directory(directory)?;
    let project_path = directory.map(|d| canonicalize_path(d));
    let project_path_ref = project_path.as_deref();

    let has_list_sessions = session_store.has_list_sessions();
    let has_list_summaries = session_store.has_list_session_summaries();

    // Fast path via list_session_summaries.
    if has_list_summaries {
        let summaries_result = session_store.list_session_summaries(&project_key).await;
        if let Ok(summaries) = summaries_result {
            let listings = if has_list_sessions {
                session_store.list_sessions(&project_key).await?
            } else {
                Vec::new()
            };
            let listing_map: Map<String, i64> = listings
                .iter()
                .map(|e| (e.session_id.clone(), e.mtime))
                .collect();

            let summary_map: Map<String, SessionSummaryEntry> = summaries
                .into_iter()
                .map(|s| (s.session_id.clone(), s))
                .collect();

            // Build slots: fresh summaries get info upfront, stale/missing get None
            struct Slot {
                mtime: i64,
                session_id: Option<String>,
                info: Option<SDKSessionInfo>,
            }
            let mut slots: Vec<Slot> = Vec::new();
            let mut fresh_ids: HashSet<String> = HashSet::new();

            for (s_id, summary) in &summary_map {
                if has_list_sessions {
                    match listing_map.get(s_id) {
                        None => continue, // summary for deleted session
                        Some(&known_mtime) if summary.mtime < known_mtime => continue, // stale
                        _ => {}
                    }
                }
                let info = summary_entry_to_sdk_info(summary, project_path_ref);
                if info.is_none() {
                    fresh_ids.insert(s_id.clone());
                    continue; // sidechain/empty — drop
                }
                slots.push(Slot {
                    mtime: summary.mtime,
                    session_id: None,
                    info,
                });
                fresh_ids.insert(s_id.clone());
            }

            // Add slots for sessions needing gap-fill
            if has_list_sessions {
                for (session_id, &mtime) in &listing_map {
                    if !fresh_ids.contains(session_id) {
                        slots.push(Slot {
                            mtime,
                            session_id: Some(session_id.clone()),
                            info: None,
                        });
                    }
                }
            }

            // Paginate BEFORE gap-fill so load() count is bounded by page size
            slots.sort_by(|a, b| b.mtime.cmp(&a.mtime));
            let page: Vec<Slot> = {
                let after_offset = if offset > 0 {
                    &slots[offset.min(slots.len())..]
                } else {
                    &slots[..]
                };
                let limited = if let Some(l) = limit {
                    if l > 0 {
                        &after_offset[..l.min(after_offset.len())]
                    } else {
                        after_offset
                    }
                } else {
                    after_offset
                };
                limited
                    .iter()
                    .map(|s| Slot {
                        mtime: s.mtime,
                        session_id: s.session_id.clone(),
                        info: s.info.clone(),
                    })
                    .collect()
            };

            // Gap-fill only items in the page
            let mut results: Vec<SDKSessionInfo> = Vec::new();
            for slot in page {
                if let Some(info) = slot.info {
                    results.push(info);
                } else if let Some(sid) = slot.session_id {
                    if let Some(info) = gap_fill_session(
                        session_store,
                        &project_key,
                        &sid,
                        slot.mtime,
                        project_path_ref,
                    )
                    .await
                    {
                        results.push(info);
                    }
                }
            }

            return Ok(results);
        }
    }

    if !has_list_sessions {
        return Err(crate::errors::ClaudeSDKError::sdk(
            "session_store implements neither list_session_summaries() nor \
             list_sessions() -- cannot list sessions. Provide a store with at \
             least one of those methods.",
        ));
    }

    // Slow path: load each session individually.
    let listings = session_store.list_sessions(&project_key).await?;
    let mut infos: Vec<SDKSessionInfo> = Vec::new();
    for listing in &listings {
        if let Some(info) = gap_fill_session(
            session_store,
            &project_key,
            &listing.session_id,
            listing.mtime,
            project_path_ref,
        )
        .await
        {
            infos.push(info);
        }
    }
    Ok(apply_sort_limit_offset(infos, limit, offset))
}

async fn gap_fill_session(
    store: &dyn SessionStore,
    project_key: &str,
    session_id: &str,
    mtime: i64,
    project_path: Option<&str>,
) -> Option<SDKSessionInfo> {
    use crate::internal::session_summary::{fold_session_summary, summary_entry_to_sdk_info};

    let key = SessionKey::new(project_key, session_id);
    let entries = store.load(&key).await.ok()??;
    let mut summary = fold_session_summary(None, &key, &entries);
    summary.mtime = mtime;
    summary_entry_to_sdk_info(&summary, project_path)
}

pub async fn get_session_info_from_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    directory: Option<&str>,
) -> Result<Option<SDKSessionInfo>> {
    use crate::internal::session_summary::{fold_session_summary, summary_entry_to_sdk_info};

    if validate_uuid(session_id).is_none() {
        return Ok(None);
    }

    let project_key = project_key_for_directory(directory)?;
    let project_path = directory.map(|d| canonicalize_path(d));
    let project_path_ref = project_path.as_deref();

    let key = SessionKey::new(&project_key, session_id);
    let loaded = session_store.load(&key).await?;
    let entries = match loaded {
        Some(e) if !e.is_empty() => e,
        _ => return Ok(None),
    };

    let listing_mtime = if session_store.has_list_sessions() {
        session_store
            .list_sessions(&project_key)
            .await
            .unwrap_or_default()
            .iter()
            .find(|e| e.session_id == session_id)
            .map(|e| e.mtime)
            .unwrap_or(0)
    } else {
        0
    };

    let mut summary = fold_session_summary(None, &key, &entries);
    if listing_mtime > 0 {
        summary.mtime = listing_mtime;
    }

    Ok(summary_entry_to_sdk_info(&summary, project_path_ref))
}

pub async fn get_session_messages_from_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    directory: Option<&str>,
    limit: Option<usize>,
    offset: usize,
) -> Result<Vec<SessionMessage>> {
    if validate_uuid(session_id).is_none() {
        return Ok(Vec::new());
    }

    let project_key = project_key_for_directory(directory)?;
    let key = SessionKey::new(&project_key, session_id);
    let loaded = session_store.load(&key).await?;
    let entries = match loaded {
        Some(e) if !e.is_empty() => e,
        _ => return Ok(Vec::new()),
    };

    // Filter to transcript entries (same as parse_transcript_entries but from Value vec)
    let transcript_entries: Vec<TranscriptEntry> = entries
        .into_iter()
        .filter(|entry| {
            let entry_type = entry.get("type").and_then(|v| v.as_str()).unwrap_or("");
            TRANSCRIPT_ENTRY_TYPES.contains(&entry_type)
                && entry.get("uuid").and_then(|v| v.as_str()).is_some()
        })
        .collect();

    Ok(entries_to_session_messages(
        &transcript_entries,
        limit,
        offset,
    ))
}

pub async fn list_subagents_from_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    directory: Option<&str>,
) -> Result<Vec<String>> {
    use crate::types::SessionListSubkeysKey;

    if validate_uuid(session_id).is_none() {
        return Ok(Vec::new());
    }

    if !session_store.has_list_subkeys() {
        return Err(crate::errors::ClaudeSDKError::sdk(
            "session_store does not implement list_subkeys() -- cannot list \
             subagents. Provide a store with a list_subkeys() method.",
        ));
    }

    let project_key = project_key_for_directory(directory)?;
    let subkeys_key = SessionListSubkeysKey {
        project_key,
        session_id: session_id.to_string(),
    };

    let subkeys = session_store.list_subkeys(&subkeys_key).await?;

    let mut agent_ids: Vec<String> = Vec::new();
    let mut seen: HashSet<String> = HashSet::new();

    for subkey in &subkeys {
        if !subkey.starts_with("subagents/") {
            continue;
        }
        // subkeys are like "subagents/agent-abc123" or "subagents/workflows/run-1/agent-nested"
        // Extract agent id from the last path component matching "agent-<id>"
        let last_part = subkey.rsplit('/').next().unwrap_or("");
        if let Some(agent_id) = last_part.strip_prefix("agent-") {
            if !agent_id.is_empty() && seen.insert(agent_id.to_string()) {
                agent_ids.push(agent_id.to_string());
            }
        }
    }

    Ok(agent_ids)
}

pub async fn get_subagent_messages_from_store(
    session_store: &dyn SessionStore,
    session_id: &str,
    agent_id: &str,
    directory: Option<&str>,
    limit: Option<usize>,
    offset: usize,
) -> Result<Vec<SessionMessage>> {
    use crate::types::SessionListSubkeysKey;

    if validate_uuid(session_id).is_none() {
        return Ok(Vec::new());
    }
    if agent_id.is_empty() {
        return Ok(Vec::new());
    }

    let project_key = project_key_for_directory(directory)?;
    let agent_file_suffix = format!("agent-{}", agent_id);

    // Try to find the subpath via list_subkeys first
    let subpath = if session_store.has_list_subkeys() {
        match session_store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: project_key.clone(),
                session_id: session_id.to_string(),
            })
            .await
        {
            Ok(subkeys) => {
                let found = subkeys.into_iter().find(|sk| {
                    let parts: Vec<&str> = sk.rsplitn(2, '/').collect();
                    parts[0] == agent_file_suffix
                });
                match found {
                    Some(sp) => sp,
                    None => return Ok(Vec::new()),
                }
            }
            Err(_) => format!("subagents/{}", agent_file_suffix),
        }
    } else {
        format!("subagents/{}", agent_file_suffix)
    };

    let mut key = SessionKey::new(&project_key, session_id);
    key.subpath = Some(subpath);

    let loaded = session_store.load(&key).await?;
    let entries = match loaded {
        Some(e) if !e.is_empty() => e,
        _ => return Ok(Vec::new()),
    };

    // Drop synthetic agent_metadata entries injected by the mirror hook —
    // they describe the .meta.json sidecar, not transcript lines.
    let transcript: Vec<TranscriptEntry> = entries
        .into_iter()
        .filter(|entry| entry.get("type").and_then(|v| v.as_str()) != Some("agent_metadata"))
        .collect();
    if transcript.is_empty() {
        return Ok(Vec::new());
    }

    // Filter to transcript entry types with uuid
    let transcript_entries: Vec<TranscriptEntry> = transcript
        .into_iter()
        .filter(|entry| {
            let entry_type = entry.get("type").and_then(|v| v.as_str()).unwrap_or("");
            TRANSCRIPT_ENTRY_TYPES.contains(&entry_type)
                && entry.get("uuid").and_then(|v| v.as_str()).is_some()
        })
        .collect();

    Ok(entries_to_subagent_messages(
        &transcript_entries,
        limit,
        offset,
    ))
}
