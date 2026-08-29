use chrono::DateTime;
use serde_json::json;

use crate::types::{SDKSessionInfo, SessionKey, SessionStoreEntry, SessionSummaryEntry};

use super::sessions::{extract_command_name, matches_skip_pattern};

// Map of JSONL entry keys -> SessionSummaryEntry data keys for last-wins string
// fields. Each appended entry overwrites the previous value when present.
const LAST_WINS_FIELDS: &[(&str, &str)] = &[
    ("customTitle", "custom_title"),
    ("aiTitle", "ai_title"),
    ("lastPrompt", "last_prompt"),
    ("summary", "summary_hint"),
    ("gitBranch", "git_branch"),
];

/// Parse an ISO-8601 timestamp string to Unix epoch milliseconds.
fn iso_to_epoch_ms(val: &serde_json::Value) -> Option<i64> {
    let ts = val.as_str()?;
    let normalized = if ts.ends_with('Z') {
        ts.replace('Z', "+00:00")
    } else {
        ts.to_string()
    };
    let dt = DateTime::parse_from_rfc3339(&normalized).ok()?;
    Some(dt.timestamp_millis())
}

/// Extract text strings from a `type=="user"` entry's message content.
fn entry_text_blocks(entry: &serde_json::Value) -> Vec<String> {
    let message = match entry.get("message") {
        Some(m) if m.is_object() => m,
        _ => return Vec::new(),
    };
    let content = match message.get("content") {
        Some(c) => c,
        None => return Vec::new(),
    };
    let mut texts = Vec::new();
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
    texts
}

/// Replicate `_extract_first_prompt_from_head` for a single parsed entry.
///
/// Mutates `data` in place: sets `first_prompt` + `first_prompt_locked`
/// on a real match, or stashes a `command_fallback` for slash-command
/// messages.
fn fold_first_prompt(
    data: &mut serde_json::Map<String, serde_json::Value>,
    entry: &serde_json::Value,
) {
    if data.get("first_prompt_locked").and_then(|v| v.as_bool()) == Some(true) {
        return;
    }
    if entry.get("type").and_then(|v| v.as_str()) != Some("user") {
        return;
    }
    if entry.get("isMeta").and_then(|v| v.as_bool()) == Some(true) {
        return;
    }
    if entry.get("isCompactSummary").and_then(|v| v.as_bool()) == Some(true) {
        return;
    }
    // Skip tool_result-carrying user messages.
    if let Some(message) = entry.get("message") {
        if message.is_object() {
            if let Some(content) = message.get("content") {
                if let Some(arr) = content.as_array() {
                    if arr.iter().any(|b| {
                        b.is_object()
                            && b.get("type").and_then(|v| v.as_str()) == Some("tool_result")
                    }) {
                        return;
                    }
                }
            }
        }
    }

    for raw in entry_text_blocks(entry) {
        let result = raw.replace('\n', " ");
        let result = result.trim();
        if result.is_empty() {
            continue;
        }

        if let Some(cmd) = extract_command_name(result) {
            if !data.contains_key("command_fallback") {
                data.insert("command_fallback".to_string(), json!(cmd));
            }
            continue;
        }

        if matches_skip_pattern(result) {
            continue;
        }

        // Python: result[:200].rstrip() + "…"
        let final_result = if result.chars().count() > 200 {
            let truncated: String = result.chars().take(200).collect();
            let truncated = truncated.trim_end();
            format!("{truncated}\u{2026}")
        } else {
            result.to_string()
        };

        data.insert("first_prompt".to_string(), json!(final_result));
        data.insert("first_prompt_locked".to_string(), json!(true));
        return;
    }
}

/// Incrementally fold a session summary from a batch of entries.
pub fn fold_session_summary(
    prev: Option<&SessionSummaryEntry>,
    key: &SessionKey,
    entries: &[SessionStoreEntry],
) -> SessionSummaryEntry {
    let (session_id, mtime, mut data_map) = if let Some(prev) = prev {
        let map = prev.data.as_object().cloned().unwrap_or_default();
        (prev.session_id.clone(), prev.mtime, map)
    } else {
        (key.session_id.clone(), 0, serde_json::Map::new())
    };

    for entry in entries {
        // is_sidechain: set-once (Python: data["is_sidechain"] = entry.get("isSidechain") is True)
        if !data_map.contains_key("is_sidechain") {
            let val = entry
                .get("isSidechain")
                .and_then(|v| v.as_bool())
                .unwrap_or(false);
            data_map.insert("is_sidechain".to_string(), json!(val));
        }

        // created_at: set-once, first parseable timestamp
        if !data_map.contains_key("created_at") {
            if let Some(ts) = entry.get("timestamp") {
                if let Some(ms) = iso_to_epoch_ms(ts) {
                    data_map.insert("created_at".to_string(), json!(ms));
                }
            }
        }

        // cwd: set-once
        if !data_map.contains_key("cwd") {
            if let Some(cwd) = entry.get("cwd").and_then(|v| v.as_str()) {
                if !cwd.is_empty() {
                    data_map.insert("cwd".to_string(), json!(cwd));
                }
            }
        }

        // First prompt extraction
        fold_first_prompt(&mut data_map, entry);

        // Last-wins string fields
        for &(src, dst) in LAST_WINS_FIELDS {
            if let Some(val) = entry.get(src).and_then(|v| v.as_str()) {
                data_map.insert(dst.to_string(), json!(val));
            }
        }

        // Tag handling: only for type=="tag" entries
        if entry.get("type").and_then(|v| v.as_str()) == Some("tag") {
            if let Some(tag_val) = entry.get("tag").and_then(|v| v.as_str()) {
                if !tag_val.is_empty() {
                    data_map.insert("tag".to_string(), json!(tag_val));
                } else {
                    data_map.remove("tag");
                }
            } else {
                data_map.remove("tag");
            }
        }
    }

    SessionSummaryEntry {
        session_id,
        mtime,
        data: serde_json::Value::Object(data_map),
    }
}

/// Convert a SessionSummaryEntry to an SDKSessionInfo.
///
/// Returns `None` for sidechain sessions or sessions with no extractable
/// summary, matching `_parse_session_info_from_lite`'s filtering.
pub fn summary_entry_to_sdk_info(
    entry: &SessionSummaryEntry,
    project_path: Option<&str>,
) -> Option<SDKSessionInfo> {
    let data = entry.data.as_object()?;

    if data.get("is_sidechain").and_then(|v| v.as_bool()) == Some(true) {
        return None;
    }

    let first_prompt_locked = data
        .get("first_prompt_locked")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);
    let first_prompt = if first_prompt_locked {
        data.get("first_prompt")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
    } else {
        data.get("command_fallback")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
    };
    // Filter out empty strings
    let first_prompt = first_prompt.filter(|s| !s.is_empty());

    let custom_title_str = data
        .get("custom_title")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty());
    let ai_title_str = data
        .get("ai_title")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty());
    let custom_title = custom_title_str.or(ai_title_str).map(|s| s.to_string());

    let summary = custom_title
        .clone()
        .or_else(|| {
            data.get("last_prompt")
                .and_then(|v| v.as_str())
                .filter(|s| !s.is_empty())
                .map(|s| s.to_string())
        })
        .or_else(|| {
            data.get("summary_hint")
                .and_then(|v| v.as_str())
                .filter(|s| !s.is_empty())
                .map(|s| s.to_string())
        })
        .or_else(|| first_prompt.clone());

    let summary = summary?;

    let cwd = data
        .get("cwd")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string())
        .or_else(|| project_path.map(|s| s.to_string()));

    let git_branch = data
        .get("git_branch")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string());
    let tag = data
        .get("tag")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string());
    let created_at = data.get("created_at").and_then(|v| v.as_i64());

    Some(SDKSessionInfo {
        session_id: entry.session_id.clone(),
        summary,
        last_modified: entry.mtime,
        file_size: None,
        custom_title,
        first_prompt,
        git_branch,
        cwd,
        tag,
        created_at,
    })
}
