//! Tests for session listing, retrieval, messages, subagents, and internal helpers.
//!
//! All tests will FAIL because the underlying functions are `todo!()`.
//! This is the expected state — the tests define the correct behavior.

use std::fs;
use std::path::{Path, PathBuf};

use serde_json::json;
use serial_test::serial;
use tempfile::TempDir;
use uuid::Uuid;

use rust_agent_sdk::internal::sessions::{
    extract_json_string_field, extract_last_json_string_field, sanitize_path, simple_hash,
    validate_uuid,
};
use rust_agent_sdk::{
    get_session_info, get_session_messages, get_subagent_messages, list_sessions, list_subagents,
    SDKSessionInfo, SessionMessage,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Sets CLAUDE_CONFIG_DIR and creates the base structure.
/// Returns (TempDir, config_dir path).
fn setup_config_dir() -> (TempDir, PathBuf) {
    let tmp = TempDir::new().unwrap();
    let config_dir = tmp.path().join(".claude");
    fs::create_dir_all(config_dir.join("projects")).unwrap();
    std::env::set_var("CLAUDE_CONFIG_DIR", config_dir.to_str().unwrap());
    (tmp, config_dir)
}

fn make_project_dir(config_dir: &Path, project_path: &str) -> PathBuf {
    let sanitized = sanitize_path(project_path);
    let project_dir = config_dir.join("projects").join(sanitized);
    fs::create_dir_all(&project_dir).unwrap();
    project_dir
}

#[allow(clippy::too_many_arguments)]
fn make_session_file(
    project_dir: &Path,
    session_id: Option<&str>,
    first_prompt: &str,
    summary: Option<&str>,
    custom_title: Option<&str>,
    git_branch: Option<&str>,
    cwd: Option<&str>,
    is_sidechain: bool,
    is_meta_only: bool,
    mtime: Option<f64>,
) -> (String, PathBuf) {
    let sid = session_id
        .map(|s| s.to_string())
        .unwrap_or_else(|| Uuid::new_v4().to_string());
    let file_path = project_dir.join(format!("{}.jsonl", sid));

    let mut lines: Vec<String> = Vec::new();

    // First entry: user message
    let mut first_entry = json!({
        "type": "user",
        "message": {"role": "user", "content": first_prompt},
    });
    if let Some(c) = cwd {
        first_entry["cwd"] = json!(c);
    }
    if let Some(b) = git_branch {
        first_entry["gitBranch"] = json!(b);
    }
    if is_sidechain {
        first_entry["isSidechain"] = json!(true);
    }
    if is_meta_only {
        first_entry["isMeta"] = json!(true);
    }
    lines.push(first_entry.to_string());

    // Assistant response
    lines.push(
        json!({
            "type": "assistant",
            "message": {"role": "assistant", "content": "Hi there!"},
        })
        .to_string(),
    );

    // Tail metadata
    let mut tail_entry = json!({"type": "summary"});
    if let Some(s) = summary {
        tail_entry["summary"] = json!(s);
    }
    if let Some(t) = custom_title {
        tail_entry["customTitle"] = json!(t);
    }
    if let Some(b) = git_branch {
        tail_entry["gitBranch"] = json!(b);
    }
    lines.push(tail_entry.to_string());

    let content = lines.join("\n") + "\n";
    fs::write(&file_path, &content).unwrap();

    if let Some(mt) = mtime {
        let t = filetime::FileTime::from_unix_time(mt as i64, 0);
        filetime::set_file_mtime(&file_path, t).unwrap();
    }

    (sid, file_path)
}

/// Shorthand for the common case.
fn make_session_simple(project_dir: &Path, first_prompt: &str) -> (String, PathBuf) {
    make_session_file(
        project_dir,
        None,
        first_prompt,
        None,
        None,
        None,
        None,
        false,
        false,
        None,
    )
}

fn make_transcript_entry(
    entry_type: &str,
    entry_uuid: &str,
    parent_uuid: Option<&str>,
    session_id: &str,
    content: Option<serde_json::Value>,
    extras: serde_json::Map<String, serde_json::Value>,
) -> serde_json::Value {
    let mut entry = json!({
        "type": entry_type,
        "uuid": entry_uuid,
        "parentUuid": parent_uuid,
        "sessionId": session_id,
    });
    if let Some(c) = content {
        let role = if entry_type == "user" || entry_type == "assistant" {
            entry_type
        } else {
            "user"
        };
        entry["message"] = json!({"role": role, "content": c});
    }
    if let serde_json::Value::Object(ref mut map) = entry {
        for (k, v) in extras {
            map.insert(k, v);
        }
    }
    entry
}

fn make_transcript_entry_simple(
    entry_type: &str,
    entry_uuid: &str,
    parent_uuid: Option<&str>,
    session_id: &str,
    content: &str,
) -> serde_json::Value {
    make_transcript_entry(
        entry_type,
        entry_uuid,
        parent_uuid,
        session_id,
        Some(json!(content)),
        serde_json::Map::new(),
    )
}

fn write_transcript(project_dir: &Path, session_id: &str, entries: &[serde_json::Value]) -> PathBuf {
    let file_path = project_dir.join(format!("{}.jsonl", session_id));
    let lines: Vec<String> = entries.iter().map(|e| e.to_string()).collect();
    fs::write(&file_path, lines.join("\n") + "\n").unwrap();
    file_path
}

fn make_session_with_subagents(
    config_dir: &Path,
    project_path: &str,
    agent_ids: &[&str],
) -> (String, PathBuf) {
    let real_path = fs::canonicalize(project_path).unwrap_or_else(|_| PathBuf::from(project_path));
    let project_dir = make_project_dir(config_dir, real_path.to_str().unwrap());
    let (sid, _) = make_session_simple(&project_dir, "Hello Claude");
    let subagents_dir = project_dir.join(&sid).join("subagents");
    fs::create_dir_all(&subagents_dir).unwrap();
    for agent_id in agent_ids {
        let agent_file = subagents_dir.join(format!("agent-{}.jsonl", agent_id));
        fs::write(
            &agent_file,
            json!({"type": "user", "uuid": "u", "parentUuid": null}).to_string() + "\n",
        )
        .unwrap();
    }
    (sid, subagents_dir)
}

// ---------------------------------------------------------------------------
// TestHelpers
// ---------------------------------------------------------------------------

mod test_helpers {
    use super::*;

    #[test]
    #[serial]
    fn test_validate_uuid_valid() {
        assert!(validate_uuid("550e8400-e29b-41d4-a716-446655440000").is_some());
        assert!(validate_uuid("550E8400-E29B-41D4-A716-446655440000").is_some());
    }

    #[test]
    #[serial]
    fn test_validate_uuid_invalid() {
        assert_eq!(validate_uuid("not-a-uuid"), None);
        assert_eq!(validate_uuid(""), None);
        assert_eq!(validate_uuid("550e8400-e29b-41d4-a716"), None);
    }

    #[test]
    #[serial]
    fn test_sanitize_path_basic() {
        assert_eq!(sanitize_path("/Users/foo/my-project"), "-Users-foo-my-project");
        assert_eq!(sanitize_path("plugin:name:server"), "plugin-name-server");
    }

    #[test]
    #[serial]
    fn test_sanitize_path_long() {
        let long_path = "/x".repeat(150); // 300 chars
        let result = sanitize_path(&long_path);
        assert!(result.len() > 200); // truncated + hash
        assert!(result.starts_with("-x-x"));
        // The hash suffix is appended after the 200-char prefix
        assert!(result[200..].contains('-'));
    }

    #[test]
    #[serial]
    fn test_simple_hash_deterministic() {
        assert_eq!(simple_hash("hello"), simple_hash("hello"));
        assert_ne!(simple_hash("hello"), simple_hash("world"));
    }

    #[test]
    #[serial]
    fn test_simple_hash_zero() {
        assert_eq!(simple_hash(""), "0");
    }

    #[test]
    #[serial]
    fn test_extract_json_string_field_simple() {
        let text = r#"{"foo":"bar","baz":"qux"}"#;
        assert_eq!(extract_json_string_field(text, "foo"), Some("bar".to_string()));
        assert_eq!(extract_json_string_field(text, "baz"), Some("qux".to_string()));
        assert_eq!(extract_json_string_field(text, "missing"), None);
    }

    #[test]
    #[serial]
    fn test_extract_json_string_field_with_space() {
        let text = r#"{"foo": "bar"}"#;
        assert_eq!(extract_json_string_field(text, "foo"), Some("bar".to_string()));
    }

    #[test]
    #[serial]
    fn test_extract_json_string_field_escaped() {
        let text = r#"{"foo":"bar\"baz"}"#;
        let result = extract_json_string_field(text, "foo");
        assert_eq!(result, Some(r#"bar"baz"#.to_string()));
    }

    #[test]
    #[serial]
    fn test_extract_last_json_string_field() {
        let text = "{\"summary\":\"first\"}\n{\"summary\":\"second\"}\n{\"summary\":\"third\"}";
        assert_eq!(
            extract_last_json_string_field(text, "summary"),
            Some("third".to_string())
        );
    }

    // NOTE: _extract_first_prompt_from_head and _read_session_lite / _parse_session_info_from_lite
    // are Python-only internal helpers not exposed in the Rust crate. The tests that use them
    // in Python are covered indirectly through the public API tests below.
    // The following tests port the behavior by testing through the public API where applicable.

    #[test]
    #[serial]
    fn test_extract_first_prompt_simple() {
        // Tested indirectly via list_sessions — a session with a plain user message
        // should have first_prompt = the content string.
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/test/prompt-simple");
        make_session_file(
            &project_dir,
            None,
            "Hello!",
            None,
            None,
            None,
            None,
            false,
            false,
            None,
        );
        let sessions = list_sessions(None, None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("Hello!"));
    }

    #[test]
    #[serial]
    fn test_extract_first_prompt_skips_meta() {
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/test/prompt-skips-meta");
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));
        let lines = vec![
            json!({"type": "user", "isMeta": true, "message": {"content": "meta"}}).to_string(),
            json!({"type": "user", "message": {"content": "real prompt"}}).to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions = list_sessions(None, None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("real prompt"));
    }

    #[test]
    #[serial]
    fn test_extract_first_prompt_skips_tool_result() {
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/test/prompt-skips-tool-result");
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));
        let lines = vec![
            json!({
                "type": "user",
                "message": {"content": [{"type": "tool_result", "content": "x"}]},
            })
            .to_string(),
            json!({"type": "user", "message": {"content": "actual prompt"}}).to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions = list_sessions(None, None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("actual prompt"));
    }

    #[test]
    #[serial]
    fn test_extract_first_prompt_content_blocks() {
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/test/prompt-content-blocks");
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));
        let lines = vec![
            json!({
                "type": "user",
                "message": {"content": [{"type": "text", "text": "block prompt"}]},
            })
            .to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions = list_sessions(None, None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("block prompt"));
    }

    #[test]
    #[serial]
    fn test_extract_first_prompt_command_fallback() {
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/test/prompt-command-fallback");
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));
        let lines = vec![
            json!({
                "type": "user",
                "message": {"content": "<command-name>/help</command-name>stuff"},
            })
            .to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions = list_sessions(None, None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("/help"));
    }

    #[test]
    #[serial]
    fn test_extract_first_prompt_empty() {
        // An empty file yields no first_prompt
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/test/prompt-empty");
        let sid = Uuid::new_v4().to_string();
        fs::write(project_dir.join(format!("{}.jsonl", sid)), "").unwrap();
        let sessions = list_sessions(None, None, 0, false).unwrap();
        // Empty file should be filtered out
        assert!(sessions.is_empty());
    }
}

// ---------------------------------------------------------------------------
// TestListSessions
// ---------------------------------------------------------------------------

mod test_list_sessions {
    use super::*;

    #[test]
    #[serial]
    fn test_empty_projects_dir() {
        let (_tmp, _config_dir) = setup_config_dir();
        assert_eq!(list_sessions(None, None, 0, false).unwrap(), vec![]);
    }

    #[test]
    #[serial]
    fn test_no_config_dir() {
        let tmp = TempDir::new().unwrap();
        let nonexistent = tmp.path().join("nonexistent");
        std::env::set_var("CLAUDE_CONFIG_DIR", nonexistent.to_str().unwrap());
        assert_eq!(list_sessions(None, None, 0, false).unwrap(), vec![]);
    }

    #[test]
    #[serial]
    fn test_single_session() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("my-project");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _) = make_session_file(
            &project_dir,
            None,
            "What is 2+2?",
            None,
            None,
            Some("main"),
            Some(project_path.to_str().unwrap()),
            false,
            false,
            None,
        );

        let sessions = list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        let s = &sessions[0];
        assert_eq!(s.session_id, sid);
        assert_eq!(s.first_prompt.as_deref(), Some("What is 2+2?"));
        assert_eq!(s.summary, "What is 2+2?"); // no custom title or summary → first prompt
        assert_eq!(s.git_branch.as_deref(), Some("main"));
        assert_eq!(s.cwd.as_deref(), Some(project_path.to_str().unwrap()));
        assert!(s.file_size.unwrap_or(0) > 0);
        assert!(s.last_modified > 0);
        assert!(s.custom_title.is_none());
    }

    #[test]
    #[serial]
    fn test_custom_title_wins_summary() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        make_session_file(
            &project_dir,
            None,
            "original question",
            Some("auto summary"),
            Some("My Custom Title"),
            None,
            None,
            false,
            false,
            None,
        );

        let sessions = list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].summary, "My Custom Title");
        assert_eq!(sessions[0].custom_title.as_deref(), Some("My Custom Title"));
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("original question"));
    }

    #[test]
    #[serial]
    fn test_summary_wins_first_prompt() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        make_session_file(
            &project_dir,
            None,
            "question",
            Some("better summary"),
            None,
            None,
            None,
            false,
            false,
            None,
        );

        let sessions = list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].summary, "better summary");
        assert!(sessions[0].custom_title.is_none());
    }

    #[test]
    #[serial]
    fn test_multiple_sessions_sorted_by_mtime() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        let (sid_old, _) = make_session_file(
            &project_dir, None, "old", None, None, None, None, false, false, Some(1000.0),
        );
        let (sid_new, _) = make_session_file(
            &project_dir, None, "new", None, None, None, None, false, false, Some(3000.0),
        );
        let (sid_mid, _) = make_session_file(
            &project_dir, None, "mid", None, None, None, None, false, false, Some(2000.0),
        );

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 3);
        let ids: Vec<&str> = sessions.iter().map(|s| s.session_id.as_str()).collect();
        assert_eq!(ids, vec![&sid_new, &sid_mid, &sid_old]);
        // Verify mtime conversion to milliseconds
        assert_eq!(sessions[0].last_modified, 3_000_000);
        assert_eq!(sessions[1].last_modified, 2_000_000);
        assert_eq!(sessions[2].last_modified, 1_000_000);
    }

    #[test]
    #[serial]
    fn test_limit() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        for i in 0..5 {
            make_session_file(
                &project_dir,
                None,
                &format!("prompt {}", i),
                None,
                None,
                None,
                None,
                false,
                false,
                Some(1000.0 + i as f64),
            );
        }

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), Some(2), 0, false).unwrap();
        assert_eq!(sessions.len(), 2);
        assert!(sessions[0].last_modified >= sessions[1].last_modified);
    }

    #[test]
    #[serial]
    fn test_offset_pagination() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        for i in 0..5 {
            make_session_file(
                &project_dir,
                None,
                &format!("prompt {}", i),
                None,
                None,
                None,
                None,
                false,
                false,
                Some(1000.0 + i as f64),
            );
        }

        let pp = project_path.to_str().unwrap();

        // Get page 1 (first 2)
        let page1 = list_sessions(Some(pp), Some(2), 0, false).unwrap();
        assert_eq!(page1.len(), 2);

        // Get page 2 (next 2)
        let page2 = list_sessions(Some(pp), Some(2), 2, false).unwrap();
        assert_eq!(page2.len(), 2);

        // Pages should have different sessions
        let page1_ids: std::collections::HashSet<&str> =
            page1.iter().map(|s| s.session_id.as_str()).collect();
        let page2_ids: std::collections::HashSet<&str> =
            page2.iter().map(|s| s.session_id.as_str()).collect();
        assert!(page1_ids.is_disjoint(&page2_ids));

        // Page 1 should be newer than page 2
        assert!(page1[0].last_modified > page2[0].last_modified);

        // Offset beyond available returns empty
        let page_empty = list_sessions(Some(pp), None, 100, false).unwrap();
        assert!(page_empty.is_empty());
    }

    #[test]
    #[serial]
    fn test_filters_sidechain_sessions() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        make_session_simple(&project_dir, "normal");
        make_session_file(
            &project_dir, None, "sidechain", None, None, None, None, true, false, None,
        );

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("normal"));
    }

    #[test]
    #[serial]
    fn test_filters_empty_sessions() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        // A session with only meta messages → no first_prompt, no summary
        make_session_file(
            &project_dir, None, "ignored meta", None, None, None, None, false, true, None,
        );
        make_session_simple(&project_dir, "real content");

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("real content"));
    }

    #[test]
    #[serial]
    fn test_filters_non_uuid_filenames() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        fs::write(
            project_dir.join("not-a-uuid.jsonl"),
            json!({"type": "user", "message": {"content": "x"}}).to_string() + "\n",
        )
        .unwrap();
        make_session_simple(&project_dir, "valid session");

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("valid session"));
    }

    #[test]
    #[serial]
    fn test_ignores_non_jsonl_files() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        fs::write(project_dir.join("README.md"), "not a session").unwrap();
        make_session_simple(&project_dir, "session");

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
    }

    #[test]
    #[serial]
    fn test_list_all_sessions() {
        let (_tmp, config_dir) = setup_config_dir();
        let proj1 = make_project_dir(&config_dir, "/some/path/one");
        let proj2 = make_project_dir(&config_dir, "/some/path/two");

        make_session_file(
            &proj1, None, "from proj1", None, None, None, None, false, false, Some(1000.0),
        );
        make_session_file(
            &proj2, None, "from proj2", None, None, None, None, false, false, Some(2000.0),
        );

        let sessions = list_sessions(None, None, 0, false).unwrap();
        assert_eq!(sessions.len(), 2);
        // Sorted newest first
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("from proj2"));
        assert_eq!(sessions[1].first_prompt.as_deref(), Some("from proj1"));
    }

    #[test]
    #[serial]
    fn test_list_all_sessions_dedupes() {
        let (_tmp, config_dir) = setup_config_dir();
        let proj1 = make_project_dir(&config_dir, "/path/one");
        let proj2 = make_project_dir(&config_dir, "/path/two");

        let shared_sid = Uuid::new_v4().to_string();
        make_session_file(
            &proj1,
            Some(&shared_sid),
            "older",
            None,
            None,
            None,
            None,
            false,
            false,
            Some(1000.0),
        );
        make_session_file(
            &proj2,
            Some(&shared_sid),
            "newer",
            None,
            None,
            None,
            None,
            false,
            false,
            Some(2000.0),
        );

        let sessions = list_sessions(None, None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("newer"));
        assert_eq!(sessions[0].last_modified, 2_000_000);
    }

    #[test]
    #[serial]
    fn test_nonexistent_project_dir() {
        let (tmp, _config_dir) = setup_config_dir();
        let project_path = tmp.path().join("never-used");
        fs::create_dir_all(&project_path).unwrap();
        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions, vec![]);
    }

    #[test]
    #[serial]
    fn test_empty_file_filtered() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        let sid = Uuid::new_v4().to_string();
        fs::write(project_dir.join(format!("{}.jsonl", sid)), "").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions, vec![]);
    }

    #[test]
    #[serial]
    fn test_include_worktrees_disabled() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("main-proj");
        fs::create_dir_all(&project_path).unwrap();
        let canonical = fs::canonicalize(&project_path).unwrap();

        let main_dir = make_project_dir(&config_dir, canonical.to_str().unwrap());
        make_session_simple(&main_dir, "main session");

        // Create another "worktree-like" project dir that should NOT be scanned
        let other_dir = make_project_dir(
            &config_dir,
            &format!("{}-worktree", canonical.to_str().unwrap()),
        );
        make_session_simple(&other_dir, "worktree session");

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].first_prompt.as_deref(), Some("main session"));
    }

    #[test]
    #[serial]
    fn test_limit_zero_returns_all() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        for i in 0..3 {
            make_session_file(
                &project_dir,
                None,
                &format!("p{}", i),
                None,
                None,
                None,
                None,
                false,
                false,
                None,
            );
        }

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), Some(0), 0, false).unwrap();
        assert_eq!(sessions.len(), 3);
    }

    #[test]
    #[serial]
    fn test_cwd_from_head_fallback_to_project_path() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let canonical = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, canonical.to_str().unwrap());

        // Session without cwd field
        make_session_simple(&project_dir, "no cwd field");

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(
            sessions[0].cwd.as_deref(),
            Some(canonical.to_str().unwrap())
        );
    }

    #[test]
    #[serial]
    fn test_git_branch_from_tail_preferred() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));
        let lines = vec![
            json!({
                "type": "user",
                "message": {"content": "hello"},
                "gitBranch": "old-branch",
            })
            .to_string(),
            json!({"type": "summary", "gitBranch": "new-branch"}).to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].git_branch.as_deref(), Some("new-branch"));
    }
}

// ---------------------------------------------------------------------------
// TestSDKSessionInfoType
// ---------------------------------------------------------------------------

mod test_sdk_session_info_type {
    use super::*;

    #[test]
    #[serial]
    fn test_creation_required_fields() {
        let info = SDKSessionInfo {
            session_id: "abc".to_string(),
            summary: "test".to_string(),
            last_modified: 1000,
            file_size: Some(42),
            custom_title: None,
            first_prompt: None,
            git_branch: None,
            cwd: None,
            tag: None,
            created_at: None,
        };
        assert_eq!(info.session_id, "abc");
        assert_eq!(info.summary, "test");
        assert_eq!(info.last_modified, 1000);
        assert_eq!(info.file_size, Some(42));
        assert!(info.custom_title.is_none());
        assert!(info.first_prompt.is_none());
        assert!(info.git_branch.is_none());
        assert!(info.cwd.is_none());
    }

    #[test]
    #[serial]
    fn test_creation_all_fields() {
        let info = SDKSessionInfo {
            session_id: "abc".to_string(),
            summary: "test".to_string(),
            last_modified: 1000,
            file_size: Some(42),
            custom_title: Some("title".to_string()),
            first_prompt: Some("prompt".to_string()),
            git_branch: Some("main".to_string()),
            cwd: Some("/foo".to_string()),
            tag: None,
            created_at: None,
        };
        assert_eq!(info.custom_title.as_deref(), Some("title"));
        assert_eq!(info.first_prompt.as_deref(), Some("prompt"));
        assert_eq!(info.git_branch.as_deref(), Some("main"));
        assert_eq!(info.cwd.as_deref(), Some("/foo"));
    }
}

// ---------------------------------------------------------------------------
// TestGetSessionMessages
// ---------------------------------------------------------------------------

mod test_get_session_messages {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id() {
        let (_tmp, _config_dir) = setup_config_dir();
        assert_eq!(
            get_session_messages("not-a-uuid", None, None, 0).unwrap(),
            vec![]
        );
        assert_eq!(
            get_session_messages("", None, None, 0).unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_nonexistent_session() {
        let (_tmp, _config_dir) = setup_config_dir();
        let sid = Uuid::new_v4().to_string();
        assert_eq!(
            get_session_messages(&sid, None, None, 0).unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_no_config_dir() {
        let tmp = TempDir::new().unwrap();
        let nonexistent = tmp.path().join("nonexistent");
        std::env::set_var("CLAUDE_CONFIG_DIR", nonexistent.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        assert_eq!(
            get_session_messages(&sid, None, None, 0).unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_simple_chain() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();
        let u2 = Uuid::new_v4().to_string();
        let a2 = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hello"),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hi!"),
            make_transcript_entry_simple("user", &u2, Some(&a1), &sid, "thanks"),
            make_transcript_entry_simple("assistant", &a2, Some(&u2), &sid, "welcome"),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 4);

        // Chronological order: root → leaf
        assert_eq!(messages[0].type_, "user");
        assert_eq!(messages[0].uuid, u1);
        assert_eq!(messages[0].session_id, sid);
        assert_eq!(messages[0].message, json!({"role": "user", "content": "hello"}));
        assert!(messages[0].parent_tool_use_id.is_none());

        assert_eq!(messages[1].type_, "assistant");
        assert_eq!(messages[1].uuid, a1);
        assert_eq!(messages[1].message, json!({"role": "assistant", "content": "hi!"}));

        assert_eq!(messages[2].type_, "user");
        assert_eq!(messages[2].uuid, u2);

        assert_eq!(messages[3].type_, "assistant");
        assert_eq!(messages[3].uuid, a2);
    }

    #[test]
    #[serial]
    fn test_filters_meta_messages() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let meta = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let mut meta_extras = serde_json::Map::new();
        meta_extras.insert("isMeta".to_string(), json!(true));

        let entries = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hello"),
            make_transcript_entry(
                "user",
                &meta,
                Some(&u1),
                &sid,
                Some(json!("meta")),
                meta_extras,
            ),
            make_transcript_entry_simple("assistant", &a1, Some(&meta), &sid, "hi"),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        // Only u1 and a1 visible (meta filtered out)
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, u1);
        assert_eq!(messages[1].uuid, a1);
    }

    #[test]
    #[serial]
    fn test_filters_non_user_assistant_from_chain() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let prog = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hello"),
            make_transcript_entry("progress", &prog, Some(&u1), &sid, None, serde_json::Map::new()),
            make_transcript_entry_simple("assistant", &a1, Some(&prog), &sid, "hi"),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        // progress is walked through the chain but filtered from output
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, u1);
        assert_eq!(messages[1].uuid, a1);
    }

    #[test]
    #[serial]
    fn test_keeps_compact_summary() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let mut compact_extras = serde_json::Map::new();
        compact_extras.insert("isCompactSummary".to_string(), json!(true));

        let entries = vec![
            make_transcript_entry(
                "user",
                &u1,
                None,
                &sid,
                Some(json!("compact summary")),
                compact_extras,
            ),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hi"),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, u1); // compact summary kept
    }

    #[test]
    #[serial]
    fn test_limit_and_offset() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        // Build a chain of 6 messages: u→a→u→a→u→a
        let uuids: Vec<String> = (0..6).map(|_| Uuid::new_v4().to_string()).collect();
        let entries: Vec<serde_json::Value> = uuids
            .iter()
            .enumerate()
            .map(|(i, uid)| {
                let parent = if i > 0 { Some(uuids[i - 1].as_str()) } else { None };
                let entry_type = if i % 2 == 0 { "user" } else { "assistant" };
                make_transcript_entry_simple(entry_type, uid, parent, &sid, &format!("m{}", i))
            })
            .collect();
        write_transcript(&project_dir, &sid, &entries);

        let pp = project_path.to_str().unwrap();

        // No limit/offset
        let all_msgs = get_session_messages(&sid, Some(pp), None, 0).unwrap();
        assert_eq!(all_msgs.len(), 6);

        // limit=2
        let page = get_session_messages(&sid, Some(pp), Some(2), 0).unwrap();
        assert_eq!(page.len(), 2);
        assert_eq!(page[0].uuid, uuids[0]);
        assert_eq!(page[1].uuid, uuids[1]);

        // offset=2, limit=2
        let page = get_session_messages(&sid, Some(pp), Some(2), 2).unwrap();
        assert_eq!(page.len(), 2);
        assert_eq!(page[0].uuid, uuids[2]);
        assert_eq!(page[1].uuid, uuids[3]);

        // offset only (no limit)
        let page = get_session_messages(&sid, Some(pp), None, 4).unwrap();
        assert_eq!(page.len(), 2);
        assert_eq!(page[0].uuid, uuids[4]);
        assert_eq!(page[1].uuid, uuids[5]);

        // limit=0 returns all (TS: limit > 0 check)
        let page = get_session_messages(&sid, Some(pp), Some(0), 0).unwrap();
        assert_eq!(page.len(), 6);

        // offset beyond end
        let page = get_session_messages(&sid, Some(pp), None, 100).unwrap();
        assert_eq!(page, vec![]);
    }

    #[test]
    #[serial]
    fn test_picks_main_chain_over_sidechain() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let root = Uuid::new_v4().to_string();
        let main_leaf = Uuid::new_v4().to_string();
        let side_leaf = Uuid::new_v4().to_string();

        let mut side_extras = serde_json::Map::new();
        side_extras.insert("isSidechain".to_string(), json!(true));

        let entries = vec![
            make_transcript_entry_simple("user", &root, None, &sid, "root"),
            make_transcript_entry_simple("assistant", &main_leaf, Some(&root), &sid, "main"),
            make_transcript_entry(
                "assistant",
                &side_leaf,
                Some(&root),
                &sid,
                Some(json!("side")),
                side_extras,
            ),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, root);
        assert_eq!(messages[1].uuid, main_leaf);
    }

    #[test]
    #[serial]
    fn test_picks_latest_leaf_by_file_position() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let root = Uuid::new_v4().to_string();
        let old_leaf = Uuid::new_v4().to_string();
        let new_leaf = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &root, None, &sid, "root"),
            make_transcript_entry_simple("assistant", &old_leaf, Some(&root), &sid, "old"),
            make_transcript_entry_simple("assistant", &new_leaf, Some(&root), &sid, "new"),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, root);
        // new_leaf has higher file position → chosen
        assert_eq!(messages[1].uuid, new_leaf);
    }

    #[test]
    #[serial]
    fn test_terminal_non_message_walked_back() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();
        let prog = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hi"),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hello"),
            make_transcript_entry("progress", &prog, Some(&a1), &sid, None, serde_json::Map::new()),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, u1);
        assert_eq!(messages[1].uuid, a1);
    }

    #[test]
    #[serial]
    fn test_corrupt_lines_skipped() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let lines = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hi").to_string(),
            "not valid json {{{".to_string(),
            "".to_string(),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hello").to_string(),
        ];
        fs::write(
            project_dir.join(format!("{}.jsonl", sid)),
            lines.join("\n") + "\n",
        )
        .unwrap();

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 2);
    }

    #[test]
    #[serial]
    fn test_search_all_projects_when_no_dir() {
        let (_tmp, config_dir) = setup_config_dir();
        let _proj1 = make_project_dir(&config_dir, "/path/one");
        let proj2 = make_project_dir(&config_dir, "/path/two");

        let sid = Uuid::new_v4().to_string();
        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hi"),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hello"),
        ];
        write_transcript(&proj2, &sid, &entries);

        let messages = get_session_messages(&sid, None, None, 0).unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, u1);
    }

    #[test]
    #[serial]
    fn test_cycle_detection() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        // a1 → u1 → a1 (cycle!)
        let entries = vec![
            make_transcript_entry_simple("user", &u1, Some(&a1), &sid, "hi"),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hello"),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        // No terminals found (both are parents) → returns empty
        assert_eq!(messages, vec![]);
    }

    #[test]
    #[serial]
    fn test_empty_transcript_file() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        fs::write(project_dir.join(format!("{}.jsonl", sid)), "").unwrap();
        assert_eq!(
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_ignores_non_transcript_types() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let lines = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hi").to_string(),
            json!({"type": "summary", "summary": "A nice chat"}).to_string(),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hello").to_string(),
        ];
        fs::write(
            project_dir.join(format!("{}.jsonl", sid)),
            lines.join("\n") + "\n",
        )
        .unwrap();

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 2);
    }
}

// ---------------------------------------------------------------------------
// TestBuildConversationChain
// ---------------------------------------------------------------------------
// NOTE: _build_conversation_chain is a Python-internal helper. In Rust, this
// logic is tested indirectly through get_session_messages. We port the test
// semantics via that public API.

mod test_build_conversation_chain {
    use super::*;

    #[test]
    #[serial]
    fn test_empty_input() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        fs::write(project_dir.join(format!("{}.jsonl", sid)), "").unwrap();

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages, vec![]);
    }

    #[test]
    #[serial]
    fn test_single_entry() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let u1 = Uuid::new_v4().to_string();

        let entries = vec![make_transcript_entry_simple("user", &u1, None, &sid, "hi")];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages.len(), 1);
        assert_eq!(messages[0].uuid, u1);
    }

    #[test]
    #[serial]
    fn test_linear_chain() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let a = Uuid::new_v4().to_string();
        let b = Uuid::new_v4().to_string();
        let c = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &a, None, &sid, "a"),
            make_transcript_entry_simple("assistant", &b, Some(&a), &sid, "b"),
            make_transcript_entry_simple("user", &c, Some(&b), &sid, "c"),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        let ids: Vec<&str> = messages.iter().map(|m| m.uuid.as_str()).collect();
        assert_eq!(ids, vec![a.as_str(), b.as_str(), c.as_str()]);
    }

    #[test]
    #[serial]
    fn test_only_progress_entries_returns_empty() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();

        let a = Uuid::new_v4().to_string();
        let b = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry("progress", &a, None, &sid, None, serde_json::Map::new()),
            make_transcript_entry("progress", &b, Some(&a), &sid, None, serde_json::Map::new()),
        ];
        write_transcript(&project_dir, &sid, &entries);

        let messages =
            get_session_messages(&sid, Some(project_path.to_str().unwrap()), None, 0).unwrap();
        assert_eq!(messages, vec![]);
    }
}

// ---------------------------------------------------------------------------
// TestSessionMessageType
// ---------------------------------------------------------------------------

mod test_session_message_type {
    use super::*;

    #[test]
    #[serial]
    fn test_creation() {
        let msg = SessionMessage {
            type_: rust_agent_sdk::types::SessionMessageType::User,
            uuid: "abc".to_string(),
            session_id: "sess".to_string(),
            message: json!({"role": "user", "content": "hi"}),
            parent_tool_use_id: None,
        };
        assert_eq!(msg.type_, "user");
        assert_eq!(msg.uuid, "abc");
        assert_eq!(msg.session_id, "sess");
        assert_eq!(msg.message, json!({"role": "user", "content": "hi"}));
        assert!(msg.parent_tool_use_id.is_none());
    }
}

// ---------------------------------------------------------------------------
// TestTagExtraction
// ---------------------------------------------------------------------------

mod test_tag_extraction {
    use super::*;

    #[test]
    #[serial]
    fn test_tag_extracted_from_tail() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        // Compact JSON (no spaces) — matches CLI's on-disk format
        let lines = vec![
            json!({"type": "user", "message": {"content": "hello"}}).to_string(),
            format!(
                r#"{{"type":"tag","tag":"my-tag","sessionId":"{}"}}"#,
                sid
            ),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].tag.as_deref(), Some("my-tag"));
    }

    #[test]
    #[serial]
    fn test_tag_last_wins() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![
            json!({"type": "user", "message": {"content": "hello"}}).to_string(),
            format!(r#"{{"type":"tag","tag":"first-tag","sessionId":"{}"}}"#, sid),
            format!(r#"{{"type":"tag","tag":"second-tag","sessionId":"{}"}}"#, sid),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].tag.as_deref(), Some("second-tag"));
    }

    #[test]
    #[serial]
    fn test_tag_empty_string_is_none() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![
            json!({"type": "user", "message": {"content": "hello"}}).to_string(),
            format!(r#"{{"type":"tag","tag":"old-tag","sessionId":"{}"}}"#, sid),
            format!(r#"{{"type":"tag","tag":"","sessionId":"{}"}}"#, sid),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert!(sessions[0].tag.is_none());
    }

    #[test]
    #[serial]
    fn test_tag_absent() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        make_session_simple(&project_dir, "hello");

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert!(sessions[0].tag.is_none());
    }

    #[test]
    #[serial]
    fn test_tag_ignores_tool_use_inputs() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![
            json!({"type": "user", "message": {"content": "tag this v1.0"}}).to_string(),
            format!(r#"{{"type":"tag","tag":"real-tag","sessionId":"{}"}}"#, sid),
            // A tool_use entry with a "tag" key in its input — must NOT match.
            json!({
                "type": "assistant",
                "message": {
                    "content": [{
                        "type": "tool_use",
                        "name": "mcp__docker__build",
                        "input": {"tag": "myapp:v2", "context": "."},
                    }],
                },
            })
            .to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].tag.as_deref(), Some("real-tag")); // NOT "myapp:v2"
    }

    #[test]
    #[serial]
    fn test_tag_none_when_only_tool_use_tag() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![
            json!({"type": "user", "message": {"content": "build docker"}}).to_string(),
            json!({
                "type": "assistant",
                "message": {
                    "content": [{
                        "type": "tool_use",
                        "input": {"tag": "prod"},
                    }],
                },
            })
            .to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert!(sessions[0].tag.is_none()); // NOT "prod"
    }

    #[test]
    #[serial]
    fn test_parse_session_info_from_lite_helper() {
        // This Python test directly tests _parse_session_info_from_lite and _read_session_lite.
        // In Rust, these are internal; we test the equivalent behavior through list_sessions
        // with a file that has a tag and cwd.
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![
            json!({
                "type": "user",
                "message": {"content": "test prompt"},
                "cwd": "/workspace",
            })
            .to_string(),
            format!(
                r#"{{"type":"tag","tag":"experiment","sessionId":"{}"}}"#,
                sid
            ),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].session_id, sid);
        assert_eq!(sessions[0].summary, "test prompt");
        assert_eq!(sessions[0].tag.as_deref(), Some("experiment"));
        assert_eq!(sessions[0].cwd.as_deref(), Some("/workspace"));
    }
}

// ---------------------------------------------------------------------------
// TestCreatedAtExtraction
// ---------------------------------------------------------------------------

mod test_created_at_extraction {
    use super::*;

    #[test]
    #[serial]
    fn test_created_at_from_iso_timestamp() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        // 2026-01-15T10:30:00.000Z → epoch 1768473000000 ms
        let lines = vec![
            json!({
                "type": "user",
                "message": {"content": "hello"},
                "timestamp": "2026-01-15T10:30:00.000Z",
            })
            .to_string(),
            json!({
                "type": "assistant",
                "message": {"content": "hi"},
                "timestamp": "2026-01-15T10:35:00.000Z",
            })
            .to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].created_at, Some(1768473000000));
    }

    #[test]
    #[serial]
    fn test_created_at_leq_last_modified() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![json!({
            "type": "user",
            "message": {"content": "hello"},
            "timestamp": "2026-01-01T00:00:00.000Z",
        })
        .to_string()];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();
        // Set mtime to Feb 2026 (well after the Jan timestamp)
        let t = filetime::FileTime::from_unix_time(1769904000, 0);
        filetime::set_file_mtime(&file_path, t).unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert!(sessions[0].created_at.is_some());
        assert!(sessions[0].created_at.unwrap() <= sessions[0].last_modified);
    }

    #[test]
    #[serial]
    fn test_created_at_when_first_line_lacks_timestamp() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![
            json!({"type": "permission-mode", "permissionMode": "acceptEdits"}).to_string(),
            json!({
                "type": "user",
                "message": {"content": "hello"},
                "timestamp": "2026-01-15T10:30:00.000Z",
            })
            .to_string(),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].created_at, Some(1768473000000));
    }

    #[test]
    #[serial]
    fn test_created_at_none_when_missing() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        // _make_session_file doesn't add a timestamp field
        make_session_simple(&project_dir, "no timestamp");

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert!(sessions[0].created_at.is_none());
    }

    #[test]
    #[serial]
    fn test_created_at_none_on_invalid_format() {
        // In Python this tests _read_session_lite + _parse_session_info_from_lite directly.
        // In Rust we test through list_sessions.
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![json!({
            "type": "user",
            "message": {"content": "hello"},
            "timestamp": "not-a-valid-iso-date",
        })
        .to_string()];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert!(sessions[0].created_at.is_none());
    }

    #[test]
    #[serial]
    fn test_created_at_without_z_suffix() {
        // In Python this tests the internal helpers directly.
        // We test through list_sessions.
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![json!({
            "type": "user",
            "message": {"content": "hello"},
            "timestamp": "2026-01-15T10:30:00+00:00",
        })
        .to_string()];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let sessions =
            list_sessions(Some(project_path.to_str().unwrap()), None, 0, false).unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].created_at, Some(1768473000000));
    }

    #[test]
    #[serial]
    fn test_sdksessioninfo_created_at_default() {
        let info = SDKSessionInfo {
            session_id: "abc".to_string(),
            summary: "test".to_string(),
            last_modified: 1000,
            file_size: Some(42),
            custom_title: None,
            first_prompt: None,
            git_branch: None,
            cwd: None,
            tag: None,
            created_at: None,
        };
        assert!(info.created_at.is_none());
    }
}

// ---------------------------------------------------------------------------
// TestGetSessionInfo
// ---------------------------------------------------------------------------

mod test_get_session_info {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id() {
        let (_tmp, _config_dir) = setup_config_dir();
        assert!(get_session_info("not-a-uuid", None).unwrap().is_none());
        assert!(get_session_info("", None).unwrap().is_none());
    }

    #[test]
    #[serial]
    fn test_nonexistent_session() {
        let (_tmp, _config_dir) = setup_config_dir();
        let sid = Uuid::new_v4().to_string();
        assert!(get_session_info(&sid, None).unwrap().is_none());
    }

    #[test]
    #[serial]
    fn test_no_config_dir() {
        let tmp = TempDir::new().unwrap();
        let nonexistent = tmp.path().join("nonexistent");
        std::env::set_var("CLAUDE_CONFIG_DIR", nonexistent.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        assert!(get_session_info(&sid, None).unwrap().is_none());
    }

    #[test]
    #[serial]
    fn test_found_with_directory() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _) = make_session_file(
            &project_dir,
            None,
            "hello",
            None,
            None,
            Some("main"),
            None,
            false,
            false,
            None,
        );

        let info = get_session_info(&sid, Some(project_path.to_str().unwrap()))
            .unwrap()
            .unwrap();
        assert_eq!(info.session_id, sid);
        assert_eq!(info.summary, "hello");
        assert_eq!(info.git_branch.as_deref(), Some("main"));
    }

    #[test]
    #[serial]
    fn test_found_without_directory() {
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/some/project");
        let (sid, _) = make_session_simple(&project_dir, "search all");

        let info = get_session_info(&sid, None).unwrap().unwrap();
        assert_eq!(info.session_id, sid);
        assert_eq!(info.summary, "search all");
    }

    #[test]
    #[serial]
    fn test_returns_none_for_sidechain() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _) = make_session_file(
            &project_dir, None, "sidechain", None, None, None, None, true, false, None,
        );

        assert!(get_session_info(&sid, Some(project_path.to_str().unwrap()))
            .unwrap()
            .is_none());
    }

    #[test]
    #[serial]
    fn test_directory_not_containing_session() {
        let (tmp, config_dir) = setup_config_dir();
        let project_a = tmp.path().join("proj-a");
        let project_b = tmp.path().join("proj-b");
        fs::create_dir_all(&project_a).unwrap();
        fs::create_dir_all(&project_b).unwrap();
        let real_a = fs::canonicalize(&project_a).unwrap();
        let real_b = fs::canonicalize(&project_b).unwrap();
        let dir_a = make_project_dir(&config_dir, real_a.to_str().unwrap());
        make_project_dir(&config_dir, real_b.to_str().unwrap());
        let (sid, _) = make_session_simple(&dir_a, "in A only");

        // Session exists in A but we look in B — should return None
        assert!(get_session_info(&sid, Some(project_b.to_str().unwrap()))
            .unwrap()
            .is_none());
        // But searching all projects finds it
        assert!(get_session_info(&sid, None).unwrap().is_some());
    }

    #[test]
    #[serial]
    fn test_includes_tag() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let sid = Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{}.jsonl", sid));

        let lines = vec![
            json!({"type": "user", "message": {"content": "hello"}}).to_string(),
            format!(r#"{{"type":"tag","tag":"urgent","sessionId":"{}"}}"#, sid),
        ];
        fs::write(&file_path, lines.join("\n") + "\n").unwrap();

        let info = get_session_info(&sid, Some(project_path.to_str().unwrap()))
            .unwrap()
            .unwrap();
        assert_eq!(info.tag.as_deref(), Some("urgent"));
    }

    #[test]
    #[serial]
    fn test_sdksessioninfo_new_fields_defaults() {
        let info = SDKSessionInfo {
            session_id: "abc".to_string(),
            summary: "test".to_string(),
            last_modified: 1000,
            file_size: Some(42),
            custom_title: None,
            first_prompt: None,
            git_branch: None,
            cwd: None,
            tag: None,
            created_at: None,
        };
        assert!(info.tag.is_none());
    }
}

// ---------------------------------------------------------------------------
// TestListSubagents
// ---------------------------------------------------------------------------

mod test_list_subagents {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id() {
        let (_tmp, _config_dir) = setup_config_dir();
        assert_eq!(list_subagents("not-a-uuid", None).unwrap(), Vec::<String>::new());
        assert_eq!(list_subagents("", None).unwrap(), Vec::<String>::new());
    }

    #[test]
    #[serial]
    fn test_nonexistent_session() {
        let (_tmp, _config_dir) = setup_config_dir();
        let sid = Uuid::new_v4().to_string();
        assert_eq!(list_subagents(&sid, None).unwrap(), Vec::<String>::new());
    }

    #[test]
    #[serial]
    fn test_session_exists_no_subagents_dir() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let real_path = fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _) = make_session_simple(&project_dir, "Hello Claude");

        assert_eq!(
            list_subagents(&sid, Some(project_path.to_str().unwrap())).unwrap(),
            Vec::<String>::new()
        );
    }

    #[test]
    #[serial]
    fn test_empty_subagents_dir() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, _) = make_session_with_subagents(&config_dir, project_path.to_str().unwrap(), &[]);

        assert_eq!(
            list_subagents(&sid, Some(project_path.to_str().unwrap())).unwrap(),
            Vec::<String>::new()
        );
    }

    #[test]
    #[serial]
    fn test_happy_path() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, _) = make_session_with_subagents(
            &config_dir,
            project_path.to_str().unwrap(),
            &["abc123", "def456"],
        );

        let mut result = list_subagents(&sid, Some(project_path.to_str().unwrap())).unwrap();
        result.sort();
        assert_eq!(result, vec!["abc123", "def456"]);
    }

    #[test]
    #[serial]
    fn test_ignores_non_agent_files() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, subagents_dir) = make_session_with_subagents(
            &config_dir,
            project_path.to_str().unwrap(),
            &["keep"],
        );
        fs::write(subagents_dir.join("agent-keep.meta.json"), "{}").unwrap();
        fs::write(subagents_dir.join("other.jsonl"), "{}\n").unwrap();
        fs::write(subagents_dir.join("agent-noext"), "{}").unwrap();

        let result = list_subagents(&sid, Some(project_path.to_str().unwrap())).unwrap();
        assert_eq!(result, vec!["keep"]);
    }

    #[test]
    #[serial]
    fn test_recurses_into_subdirectories() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, subagents_dir) = make_session_with_subagents(
            &config_dir,
            project_path.to_str().unwrap(),
            &["top"],
        );
        let nested = subagents_dir.join("workflows").join("run-1");
        fs::create_dir_all(&nested).unwrap();
        fs::write(nested.join("agent-nested.jsonl"), "{}\n").unwrap();

        let mut result = list_subagents(&sid, Some(project_path.to_str().unwrap())).unwrap();
        result.sort();
        assert_eq!(result, vec!["nested", "top"]);
    }

    #[test]
    #[serial]
    fn test_searches_all_projects_without_directory() {
        let (_tmp, config_dir) = setup_config_dir();
        let project_dir = make_project_dir(&config_dir, "/some/project");
        let (sid, _) = make_session_simple(&project_dir, "Hello Claude");
        let subagents_dir = project_dir.join(&sid).join("subagents");
        fs::create_dir_all(&subagents_dir).unwrap();
        fs::write(subagents_dir.join("agent-x.jsonl"), "{}\n").unwrap();

        assert_eq!(list_subagents(&sid, None).unwrap(), vec!["x"]);
    }
}

// ---------------------------------------------------------------------------
// TestGetSubagentMessages
// ---------------------------------------------------------------------------

mod test_get_subagent_messages {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id() {
        let (_tmp, _config_dir) = setup_config_dir();
        assert_eq!(
            get_subagent_messages("not-a-uuid", "abc", None, None, 0).unwrap(),
            vec![]
        );
        assert_eq!(
            get_subagent_messages("", "abc", None, None, 0).unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_empty_agent_id() {
        let (_tmp, _config_dir) = setup_config_dir();
        let sid = Uuid::new_v4().to_string();
        assert_eq!(
            get_subagent_messages(&sid, "", None, None, 0).unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_nonexistent_session() {
        let (_tmp, _config_dir) = setup_config_dir();
        let sid = Uuid::new_v4().to_string();
        assert_eq!(
            get_subagent_messages(&sid, "abc", None, None, 0).unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_nonexistent_agent() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, _) = make_session_with_subagents(
            &config_dir,
            project_path.to_str().unwrap(),
            &["other"],
        );

        assert_eq!(
            get_subagent_messages(&sid, "missing", Some(project_path.to_str().unwrap()), None, 0)
                .unwrap(),
            vec![]
        );
    }

    #[test]
    #[serial]
    fn test_simple_chain() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, subagents_dir) =
            make_session_with_subagents(&config_dir, project_path.to_str().unwrap(), &[]);

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();
        let u2 = Uuid::new_v4().to_string();
        let a2 = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "task"),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "working"),
            make_transcript_entry_simple("user", &u2, Some(&a1), &sid, "continue"),
            make_transcript_entry_simple("assistant", &a2, Some(&u2), &sid, "done"),
        ];
        let agent_file = subagents_dir.join("agent-abc.jsonl");
        let lines: Vec<String> = entries.iter().map(|e| e.to_string()).collect();
        fs::write(&agent_file, lines.join("\n") + "\n").unwrap();

        let messages =
            get_subagent_messages(&sid, "abc", Some(project_path.to_str().unwrap()), None, 0)
                .unwrap();
        assert_eq!(messages.len(), 4);
        let msg_uuids: Vec<&str> = messages.iter().map(|m| m.uuid.as_str()).collect();
        assert_eq!(msg_uuids, vec![u1.as_str(), a1.as_str(), u2.as_str(), a2.as_str()]);
        assert_eq!(messages[0].type_, "user");
        assert_eq!(messages[0].session_id, sid);
        assert_eq!(messages[0].message, json!({"role": "user", "content": "task"}));
        assert!(messages[0].parent_tool_use_id.is_none());
        assert_eq!(messages[3].type_, "assistant");
    }

    #[test]
    #[serial]
    fn test_finds_agent_in_nested_subdirectory() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, subagents_dir) =
            make_session_with_subagents(&config_dir, project_path.to_str().unwrap(), &[]);
        let nested = subagents_dir.join("workflows").join("run-1");
        fs::create_dir_all(&nested).unwrap();

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let entries = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hi"),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "hello"),
        ];
        let lines: Vec<String> = entries.iter().map(|e| e.to_string()).collect();
        fs::write(nested.join("agent-deep.jsonl"), lines.join("\n") + "\n").unwrap();

        let messages =
            get_subagent_messages(&sid, "deep", Some(project_path.to_str().unwrap()), None, 0)
                .unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].uuid, u1);
        assert_eq!(messages[1].uuid, a1);
    }

    #[test]
    #[serial]
    fn test_skips_corrupt_lines() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, subagents_dir) =
            make_session_with_subagents(&config_dir, project_path.to_str().unwrap(), &[]);

        let u1 = Uuid::new_v4().to_string();
        let a1 = Uuid::new_v4().to_string();

        let lines = vec![
            make_transcript_entry_simple("user", &u1, None, &sid, "hi").to_string(),
            "not valid json {".to_string(),
            "".to_string(),
            make_transcript_entry_simple("assistant", &a1, Some(&u1), &sid, "ok").to_string(),
        ];
        fs::write(
            subagents_dir.join("agent-x.jsonl"),
            lines.join("\n") + "\n",
        )
        .unwrap();

        let messages =
            get_subagent_messages(&sid, "x", Some(project_path.to_str().unwrap()), None, 0)
                .unwrap();
        let msg_uuids: Vec<&str> = messages.iter().map(|m| m.uuid.as_str()).collect();
        assert_eq!(msg_uuids, vec![u1.as_str(), a1.as_str()]);
    }

    #[test]
    #[serial]
    fn test_limit_and_offset() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, subagents_dir) =
            make_session_with_subagents(&config_dir, project_path.to_str().unwrap(), &[]);

        let uuids: Vec<String> = (0..6).map(|_| Uuid::new_v4().to_string()).collect();
        let entries: Vec<serde_json::Value> = uuids
            .iter()
            .enumerate()
            .map(|(i, uid)| {
                let parent = if i > 0 { Some(uuids[i - 1].as_str()) } else { None };
                let entry_type = if i % 2 == 0 { "user" } else { "assistant" };
                make_transcript_entry_simple(entry_type, uid, parent, &sid, &format!("m{}", i))
            })
            .collect();
        let lines: Vec<String> = entries.iter().map(|e| e.to_string()).collect();
        fs::write(
            subagents_dir.join("agent-p.jsonl"),
            lines.join("\n") + "\n",
        )
        .unwrap();

        let pp = project_path.to_str().unwrap();

        let all_msgs = get_subagent_messages(&sid, "p", Some(pp), None, 0).unwrap();
        assert_eq!(all_msgs.len(), 6);

        let page = get_subagent_messages(&sid, "p", Some(pp), Some(2), 0).unwrap();
        let page_uuids: Vec<&str> = page.iter().map(|m| m.uuid.as_str()).collect();
        assert_eq!(page_uuids, vec![uuids[0].as_str(), uuids[1].as_str()]);

        let page = get_subagent_messages(&sid, "p", Some(pp), Some(2), 2).unwrap();
        let page_uuids: Vec<&str> = page.iter().map(|m| m.uuid.as_str()).collect();
        assert_eq!(page_uuids, vec![uuids[2].as_str(), uuids[3].as_str()]);

        let page = get_subagent_messages(&sid, "p", Some(pp), None, 4).unwrap();
        let page_uuids: Vec<&str> = page.iter().map(|m| m.uuid.as_str()).collect();
        assert_eq!(page_uuids, vec![uuids[4].as_str(), uuids[5].as_str()]);

        let page = get_subagent_messages(&sid, "p", Some(pp), Some(0), 0).unwrap();
        assert_eq!(page.len(), 6);
    }

    #[test]
    #[serial]
    fn test_empty_agent_file() {
        let (tmp, config_dir) = setup_config_dir();
        let project_path = tmp.path().join("proj");
        fs::create_dir_all(&project_path).unwrap();
        let (sid, subagents_dir) =
            make_session_with_subagents(&config_dir, project_path.to_str().unwrap(), &[]);
        fs::write(subagents_dir.join("agent-empty.jsonl"), "").unwrap();

        assert_eq!(
            get_subagent_messages(&sid, "empty", Some(project_path.to_str().unwrap()), None, 0)
                .unwrap(),
            vec![]
        );
    }
}
