//! Tests for session mutation functions (rename, tag, delete, fork).
//!
//! Ported from Python: tests/test_session_mutations.py
//! All tests will FAIL because the underlying functions are `todo!()`.

use rust_agent_sdk::{
    delete_session, fork_session, rename_session, tag_session,
    // Store-backed (async)
    delete_session_via_store, fork_session_via_store,
    rename_session_via_store, tag_session_via_store,
    // Types
    InMemorySessionStore, SessionKey, SessionStore,
};
use rust_agent_sdk::internal::sessions::sanitize_path;
use serde_json::json;
use serial_test::serial;
use std::path::PathBuf;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Creates a temporary config dir with a `projects/` subdirectory and sets
/// `CLAUDE_CONFIG_DIR` so the SDK finds it.
fn setup_config_dir(tmp: &tempfile::TempDir) -> PathBuf {
    let config_dir = tmp.path().join(".claude");
    std::fs::create_dir_all(config_dir.join("projects")).unwrap();
    std::env::set_var("CLAUDE_CONFIG_DIR", &config_dir);
    config_dir
}

/// Creates the project directory using the real `sanitize_path` function,
/// matching the SDK's directory naming so `find_project_dir` can find it.
fn make_project_dir(config_dir: &std::path::Path, project_path: &str) -> PathBuf {
    let sanitized = sanitize_path(project_path);
    let project_dir = config_dir.join("projects").join(&sanitized);
    std::fs::create_dir_all(&project_dir).unwrap();
    project_dir
}

/// Creates a `.jsonl` session file with two lines (user + assistant).
/// Returns `(session_id, file_path)`.
fn make_session_file(
    project_dir: &std::path::Path,
    session_id: Option<&str>,
    first_prompt: &str,
) -> (String, PathBuf) {
    let sid = session_id
        .map(String::from)
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let file_path = project_dir.join(format!("{sid}.jsonl"));
    let lines = format!(
        "{}\n{}\n",
        serde_json::to_string(&json!({
            "type": "user",
            "message": { "role": "user", "content": first_prompt }
        }))
        .unwrap(),
        serde_json::to_string(&json!({
            "type": "assistant",
            "message": { "role": "assistant", "content": "Hi!" }
        }))
        .unwrap(),
    );
    std::fs::write(&file_path, &lines).unwrap();
    (sid, file_path)
}

/// Creates a session file with proper uuid/parentUuid chains.
/// Returns `(session_id, file_path, vec_of_message_uuids)`.
fn make_transcript_session(
    project_dir: &std::path::Path,
    session_id: Option<&str>,
    num_turns: usize,
) -> (String, PathBuf, Vec<String>) {
    let sid = session_id
        .map(String::from)
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let file_path = project_dir.join(format!("{sid}.jsonl"));
    let mut uuids: Vec<String> = Vec::new();
    let mut lines: Vec<String> = Vec::new();
    let mut parent_uuid: Option<String> = None;

    for i in 0..num_turns {
        // User message
        let user_uuid = uuid::Uuid::new_v4().to_string();
        uuids.push(user_uuid.clone());
        lines.push(
            serde_json::to_string(&json!({
                "type": "user",
                "uuid": user_uuid,
                "parentUuid": parent_uuid,
                "sessionId": sid,
                "timestamp": "2026-03-01T00:00:00Z",
                "message": {
                    "role": "user",
                    "content": format!("Turn {} question", i + 1),
                },
            }))
            .unwrap(),
        );
        parent_uuid = Some(user_uuid);

        // Assistant message
        let asst_uuid = uuid::Uuid::new_v4().to_string();
        uuids.push(asst_uuid.clone());
        lines.push(
            serde_json::to_string(&json!({
                "type": "assistant",
                "uuid": asst_uuid,
                "parentUuid": parent_uuid,
                "sessionId": sid,
                "timestamp": "2026-03-01T00:00:00Z",
                "message": {
                    "role": "assistant",
                    "content": [{ "type": "text", "text": format!("Turn {} answer", i + 1) }],
                },
            }))
            .unwrap(),
        );
        parent_uuid = Some(asst_uuid);
    }

    std::fs::write(&file_path, lines.join("\n") + "\n").unwrap();
    (sid, file_path, uuids)
}

/// Helper to build `SessionStoreEntry` values for pre-populating stores.
fn store_entries_for_session(first_prompt: &str) -> Vec<serde_json::Value> {
    vec![
        json!({
            "type": "user",
            "message": { "role": "user", "content": first_prompt }
        }),
        json!({
            "type": "assistant",
            "message": { "role": "assistant", "content": "Hi!" }
        }),
    ]
}

fn store_transcript_entries(
    sid: &str,
    num_turns: usize,
) -> (Vec<serde_json::Value>, Vec<String>) {
    let mut entries = Vec::new();
    let mut uuids = Vec::new();
    let mut parent_uuid: Option<String> = None;

    for i in 0..num_turns {
        let user_uuid = uuid::Uuid::new_v4().to_string();
        uuids.push(user_uuid.clone());
        entries.push(json!({
            "type": "user",
            "uuid": user_uuid,
            "parentUuid": parent_uuid,
            "sessionId": sid,
            "timestamp": "2026-03-01T00:00:00Z",
            "message": {
                "role": "user",
                "content": format!("Turn {} question", i + 1),
            },
        }));
        parent_uuid = Some(user_uuid);

        let asst_uuid = uuid::Uuid::new_v4().to_string();
        uuids.push(asst_uuid.clone());
        entries.push(json!({
            "type": "assistant",
            "uuid": asst_uuid,
            "parentUuid": parent_uuid,
            "sessionId": sid,
            "timestamp": "2026-03-01T00:00:00Z",
            "message": {
                "role": "assistant",
                "content": [{ "type": "text", "text": format!("Turn {} answer", i + 1) }],
            },
        }));
        parent_uuid = Some(asst_uuid);
    }

    (entries, uuids)
}

// ---------------------------------------------------------------------------
// _try_append() tests
// ---------------------------------------------------------------------------

mod test_try_append {
    use super::*;

    #[test]
    #[serial]
    fn test_append_to_existing_file() {
        let tmp = tempfile::tempdir().unwrap();
        let f = tmp.path().join("test.jsonl");
        std::fs::write(&f, "line1\n").unwrap();

        // _try_append is internal; we test it indirectly via rename_session.
        // For a direct port, we assume a pub(crate) or test-accessible fn.
        // Since it's todo!(), we call rename_session on a real file to exercise append.
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello Claude");

        rename_session(&sid, "New Title", Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["type"], "custom-title");
        assert_eq!(entry["customTitle"], "New Title");
    }

    #[test]
    #[serial]
    fn test_missing_file_returns_false() {
        // When the session file doesn't exist, rename_session should error (FileNotFound).
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        make_project_dir(&config_dir, "/some/project");

        let sid = uuid::Uuid::new_v4().to_string();
        let result = rename_session(&sid, "title", None);
        assert!(result.is_err());
    }

    #[test]
    #[serial]
    fn test_missing_parent_dir_returns_false() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        // No project dirs at all — just a bare projects/ dir
        let sid = uuid::Uuid::new_v4().to_string();
        let result = rename_session(&sid, "title", None);
        assert!(result.is_err());
    }

    #[test]
    #[serial]
    fn test_zero_byte_file_returns_false() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/some/project");

        let sid = uuid::Uuid::new_v4().to_string();
        let stub = project_dir.join(format!("{sid}.jsonl"));
        std::fs::write(&stub, "").unwrap();

        // 0-byte should be skipped, so rename fails with not-found
        let result = rename_session(&sid, "title", None);
        assert!(result.is_err());
        // Stub must not have been modified
        assert_eq!(std::fs::read_to_string(&stub).unwrap(), "");
    }

    #[test]
    #[serial]
    fn test_multiple_appends() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        rename_session(&sid, "Title1", Some(project_path.to_str().unwrap())).unwrap();
        rename_session(&sid, "Title2", Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        // Original 2 lines + 2 appended = 4
        assert_eq!(lines.len(), 4);
    }
}

// ---------------------------------------------------------------------------
// rename_session() tests
// ---------------------------------------------------------------------------

mod test_rename_session {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let _config_dir = setup_config_dir(&tmp);

        let result = rename_session("not-a-uuid", "title", None);
        assert!(result.is_err());
        let err_msg = result.unwrap_err().to_string();
        assert!(err_msg.contains("Invalid session_id"), "got: {err_msg}");

        let result = rename_session("", "title", None);
        assert!(result.is_err());
        let err_msg = result.unwrap_err().to_string();
        assert!(err_msg.contains("Invalid session_id"), "got: {err_msg}");
    }

    #[test]
    #[serial]
    fn test_empty_title_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _) = make_session_file(&project_dir, None, "Hello");

        let dir = project_path.to_str().unwrap();

        let result = rename_session(&sid, "", Some(dir));
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("title must be non-empty"));

        let result = rename_session(&sid, "   ", Some(dir));
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("title must be non-empty"));

        let result = rename_session(&sid, "\n\t", Some(dir));
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("title must be non-empty"));
    }

    #[test]
    #[serial]
    fn test_session_not_found_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        make_project_dir(&config_dir, real_path.to_str().unwrap());

        let sid = uuid::Uuid::new_v4().to_string();
        let result = rename_session(&sid, "title", Some(project_path.to_str().unwrap()));
        assert!(result.is_err());
    }

    #[test]
    #[serial]
    fn test_no_projects_dir_raises() {
        let tmp = tempfile::tempdir().unwrap();
        std::env::set_var("CLAUDE_CONFIG_DIR", tmp.path().join("nonexistent"));

        let sid = uuid::Uuid::new_v4().to_string();
        let result = rename_session(&sid, "title", None);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("no projects directory"));
    }

    #[test]
    #[serial]
    fn test_appends_custom_title_entry() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello Claude");

        rename_session(&sid, "My New Title", Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["type"], "custom-title");
        assert_eq!(entry["customTitle"], "My New Title");
        assert_eq!(entry["sessionId"], sid);
    }

    #[test]
    #[serial]
    fn test_title_trimmed_before_storing() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        rename_session(&sid, "  Trimmed Title  ", Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["customTitle"], "Trimmed Title");
    }

    #[test]
    #[serial]
    fn test_search_all_projects() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/some/project");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        rename_session(&sid, "Found Without Dir", None).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["customTitle"], "Found Without Dir");
    }

    #[test]
    #[serial]
    fn test_skips_zero_byte_stub() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);

        let proj_a = make_project_dir(&config_dir, "/aaa/project");
        let proj_z = make_project_dir(&config_dir, "/zzz/project");

        let sid = uuid::Uuid::new_v4().to_string();
        // 0-byte stub in first dir
        std::fs::write(proj_a.join(format!("{sid}.jsonl")), "").unwrap();
        // Real file in second dir
        make_session_file(&proj_z, Some(&sid), "real");

        rename_session(&sid, "New Title", None).unwrap();

        // Stub untouched
        assert_eq!(
            std::fs::read_to_string(proj_a.join(format!("{sid}.jsonl"))).unwrap(),
            ""
        );
        // Real file has the entry
        let real_content =
            std::fs::read_to_string(proj_z.join(format!("{sid}.jsonl"))).unwrap();
        assert!(real_content.contains("\"customTitle\":\"New Title\""));
    }

    #[test]
    #[serial]
    fn test_compact_json_format() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        rename_session(&sid, "Title", Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        // Compact JSON: no spaces after : or ,
        let expected = format!(
            r#"{{"type":"custom-title","customTitle":"Title","sessionId":"{sid}"}}"#
        );
        assert_eq!(*lines.last().unwrap(), expected);
    }
}

// ---------------------------------------------------------------------------
// tag_session() tests
// ---------------------------------------------------------------------------

mod test_tag_session {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let _config_dir = setup_config_dir(&tmp);

        let result = tag_session("not-a-uuid", Some("tag"), None);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));

        let result = tag_session("", Some("tag"), None);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));
    }

    #[test]
    #[serial]
    fn test_empty_tag_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _) = make_session_file(&project_dir, None, "Hello");

        let dir = project_path.to_str().unwrap();

        let result = tag_session(&sid, Some(""), Some(dir));
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("tag must be non-empty"));

        let result = tag_session(&sid, Some("   "), Some(dir));
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("tag must be non-empty"));
    }

    #[test]
    #[serial]
    fn test_session_not_found_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        make_project_dir(&config_dir, real_path.to_str().unwrap());

        let sid = uuid::Uuid::new_v4().to_string();
        let result = tag_session(&sid, Some("tag"), Some(project_path.to_str().unwrap()));
        assert!(result.is_err());
    }

    #[test]
    #[serial]
    fn test_appends_tag_entry() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("experiment"), Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["type"], "tag");
        assert_eq!(entry["tag"], "experiment");
        assert_eq!(entry["sessionId"], sid);
    }

    #[test]
    #[serial]
    fn test_tag_trimmed() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("  my-tag  "), Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "my-tag");
    }

    #[test]
    #[serial]
    fn test_none_clears_tag() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        let dir = project_path.to_str().unwrap();
        tag_session(&sid, Some("original-tag"), Some(dir)).unwrap();
        tag_session(&sid, None, Some(dir)).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["type"], "tag");
        assert_eq!(entry["tag"], "");
        assert_eq!(entry["sessionId"], sid);
    }

    #[test]
    #[serial]
    fn test_last_wins() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        let dir = project_path.to_str().unwrap();
        tag_session(&sid, Some("first"), Some(dir)).unwrap();
        tag_session(&sid, Some("second"), Some(dir)).unwrap();
        tag_session(&sid, Some("third"), Some(dir)).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let last_entry: serde_json::Value =
            serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(last_entry["tag"], "third");

        // All three tag entries present
        let tag_lines: Vec<serde_json::Value> = lines
            .iter()
            .filter_map(|line| {
                let v: serde_json::Value = serde_json::from_str(line).ok()?;
                if v["type"] == "tag" { Some(v) } else { None }
            })
            .collect();
        assert_eq!(tag_lines.len(), 3);
    }

    #[test]
    #[serial]
    fn test_compact_json_format() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("mytag"), Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let expected = format!(r#"{{"type":"tag","tag":"mytag","sessionId":"{sid}"}}"#);
        assert_eq!(*lines.last().unwrap(), expected);
    }

    #[test]
    #[serial]
    fn test_unicode_sanitization() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        // Tag with zero-width space and BOM embedded
        let dirty_tag = "clean\u{200b}tag\u{feff}";
        tag_session(&sid, Some(dirty_tag), Some(project_path.to_str().unwrap())).unwrap();

        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "cleantag");
    }

    #[test]
    #[serial]
    fn test_sanitization_rejects_pure_invisible() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _) = make_session_file(&project_dir, None, "Hello");

        let result = tag_session(
            &sid,
            Some("\u{200b}\u{200c}\u{feff}"),
            Some(project_path.to_str().unwrap()),
        );
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("tag must be non-empty"));
    }
}

// ---------------------------------------------------------------------------
// _sanitize_unicode() tests
// ---------------------------------------------------------------------------

mod test_sanitize_unicode {
    // These test the sanitize_unicode behavior via tag_session, since the
    // internal function is pub(crate). The assertions match the Python tests.

    use super::*;

    // For direct unit tests of sanitize_unicode, we'd need pub(crate) access.
    // Here we validate behavior through the tag_session interface.

    #[test]
    #[serial]
    fn test_passthrough_clean_string() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("hello"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "hello");
    }

    #[test]
    #[serial]
    fn test_strips_zero_width() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj2");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        // zero-width space
        tag_session(&sid, Some("a\u{200b}b"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "ab");
    }

    #[test]
    #[serial]
    fn test_strips_zero_width_non_joiner() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj3");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("a\u{200c}b"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "ab");
    }

    #[test]
    #[serial]
    fn test_strips_zero_width_joiner() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj4");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("a\u{200d}b"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "ab");
    }

    #[test]
    #[serial]
    fn test_strips_bom() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj5");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("\u{feff}hello"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "hello");
    }

    #[test]
    #[serial]
    fn test_strips_directional_marks() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj6");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("a\u{202a}b\u{202c}c"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "abc");
    }

    #[test]
    #[serial]
    fn test_strips_private_use() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj7");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        tag_session(&sid, Some("a\u{e000}b"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "ab");
    }

    #[test]
    #[serial]
    fn test_nfkc_normalization() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj8");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        // Fullwidth 'A' → ASCII 'A'
        tag_session(&sid, Some("\u{ff21}"), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "A");
    }

    #[test]
    #[serial]
    fn test_iterative_converges() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/test/proj9");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        let dirty = format!("a{}b", "\u{200b}".repeat(20));
        tag_session(&sid, Some(&dirty), None).unwrap();
        let content = std::fs::read_to_string(&file_path).unwrap();
        let lines: Vec<&str> = content.trim().split('\n').collect();
        let entry: serde_json::Value = serde_json::from_str(lines.last().unwrap()).unwrap();
        assert_eq!(entry["tag"], "ab");
    }
}

// ---------------------------------------------------------------------------
// delete_session() tests
// ---------------------------------------------------------------------------

mod test_delete_session {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let _config_dir = setup_config_dir(&tmp);

        let result = delete_session("not-a-uuid", None);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));
    }

    #[test]
    #[serial]
    fn test_session_not_found_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let _config_dir = setup_config_dir(&tmp);

        let sid = uuid::Uuid::new_v4().to_string();
        let result = delete_session(&sid, None);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("not found"));
    }

    #[test]
    #[serial]
    fn test_deletes_session_file() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        assert!(file_path.exists());
        delete_session(&sid, Some(project_path.to_str().unwrap())).unwrap();
        assert!(!file_path.exists());
    }

    #[test]
    #[serial]
    fn test_removes_subagent_transcript_dir() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        let subagent_dir = project_dir.join(&sid);
        std::fs::create_dir_all(&subagent_dir).unwrap();
        std::fs::write(
            subagent_dir.join(format!("{}.jsonl", uuid::Uuid::new_v4())),
            "{}\n",
        )
        .unwrap();

        delete_session(&sid, Some(project_path.to_str().unwrap())).unwrap();

        assert!(!file_path.exists());
        assert!(!subagent_dir.exists());
    }

    #[test]
    #[serial]
    fn test_deletes_without_directory() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/any/project");
        let (sid, file_path) = make_session_file(&project_dir, None, "Hello");

        assert!(file_path.exists());
        delete_session(&sid, None).unwrap();
        assert!(!file_path.exists());
    }
}

// ---------------------------------------------------------------------------
// fork_session() tests
// ---------------------------------------------------------------------------

mod test_fork_session {
    use super::*;

    #[test]
    #[serial]
    fn test_invalid_session_id_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let _config_dir = setup_config_dir(&tmp);

        let result = fork_session("not-a-uuid", None, None, None);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));
    }

    #[test]
    #[serial]
    fn test_session_not_found_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let _config_dir = setup_config_dir(&tmp);

        let sid = uuid::Uuid::new_v4().to_string();
        let result = fork_session(&sid, None, None, None);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("not found"));
    }

    #[test]
    #[serial]
    fn test_invalid_up_to_message_id_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let _config_dir = setup_config_dir(&tmp);

        let sid = uuid::Uuid::new_v4().to_string();
        let result = fork_session(&sid, None, Some("not-valid"), None);
        assert!(result.is_err());
        assert!(
            result
                .unwrap_err()
                .to_string()
                .contains("Invalid up_to_message_id")
        );
    }

    #[test]
    #[serial]
    fn test_fork_creates_new_session() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, _) = make_transcript_session(&project_dir, None, 2);

        let result =
            fork_session(&sid, Some(project_path.to_str().unwrap()), None, None).unwrap();
        assert_ne!(result.session_id, sid);

        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));
        assert!(fork_path.exists());
    }

    #[test]
    #[serial]
    fn test_fork_remaps_uuids() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, original_uuids) = make_transcript_session(&project_dir, None, 2);

        let result =
            fork_session(&sid, Some(project_path.to_str().unwrap()), None, None).unwrap();
        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));

        let content = std::fs::read_to_string(&fork_path).unwrap();
        for line in content.trim().split('\n') {
            let entry: serde_json::Value = serde_json::from_str(line).unwrap();
            let entry_type = entry["type"].as_str().unwrap_or("");
            if entry_type == "user" || entry_type == "assistant" {
                let uuid_val = entry["uuid"].as_str().unwrap();
                assert!(!original_uuids.contains(&uuid_val.to_string()));
                if let Some(parent) = entry["parentUuid"].as_str() {
                    assert!(!original_uuids.contains(&parent.to_string()));
                }
            }
        }
    }

    #[test]
    #[serial]
    fn test_fork_preserves_message_count() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, original_path, _) = make_transcript_session(&project_dir, None, 3);

        let result =
            fork_session(&sid, Some(project_path.to_str().unwrap()), None, None).unwrap();
        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));

        let original_content = std::fs::read_to_string(&original_path).unwrap();
        let original_msg_count = original_content
            .trim()
            .split('\n')
            .filter(|line| {
                let v: serde_json::Value = serde_json::from_str(line).unwrap();
                let t = v["type"].as_str().unwrap_or("");
                t == "user" || t == "assistant"
            })
            .count();

        let fork_content = std::fs::read_to_string(&fork_path).unwrap();
        let fork_msg_count = fork_content
            .trim()
            .split('\n')
            .filter(|line| {
                let v: serde_json::Value = serde_json::from_str(line).unwrap();
                let t = v["type"].as_str().unwrap_or("");
                t == "user" || t == "assistant"
            })
            .count();

        assert_eq!(fork_msg_count, original_msg_count);
    }

    #[test]
    #[serial]
    fn test_fork_up_to_message_id() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, uuids) = make_transcript_session(&project_dir, None, 3);

        // Fork up to the first assistant response (uuid index 1)
        let cutoff_uuid = &uuids[1];
        let result = fork_session(
            &sid,
            Some(project_path.to_str().unwrap()),
            Some(cutoff_uuid),
            None,
        )
        .unwrap();

        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));
        let fork_content = std::fs::read_to_string(&fork_path).unwrap();
        let fork_msg_count = fork_content
            .trim()
            .split('\n')
            .filter(|line| {
                let v: serde_json::Value = serde_json::from_str(line).unwrap();
                let t = v["type"].as_str().unwrap_or("");
                t == "user" || t == "assistant"
            })
            .count();

        // Should have 2 messages (1 user + 1 assistant from first turn)
        assert_eq!(fork_msg_count, 2);
    }

    #[test]
    #[serial]
    fn test_fork_up_to_message_id_not_found_raises() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, _) = make_transcript_session(&project_dir, None, 2);

        let fake_uuid = uuid::Uuid::new_v4().to_string();
        let result = fork_session(
            &sid,
            Some(project_path.to_str().unwrap()),
            Some(&fake_uuid),
            None,
        );
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("not found in session"));
    }

    #[test]
    #[serial]
    fn test_fork_custom_title() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, _) = make_transcript_session(&project_dir, None, 2);

        let result = fork_session(
            &sid,
            Some(project_path.to_str().unwrap()),
            None,
            Some("My Fork"),
        )
        .unwrap();

        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));
        let content = std::fs::read_to_string(&fork_path).unwrap();
        // Find the custom-title entry
        let title_entry = content
            .trim()
            .split('\n')
            .filter_map(|line| {
                let v: serde_json::Value = serde_json::from_str(line).ok()?;
                if v["type"] == "custom-title" { Some(v) } else { None }
            })
            .last()
            .expect("should have a custom-title entry");
        assert_eq!(title_entry["customTitle"], "My Fork");
    }

    #[test]
    #[serial]
    fn test_fork_default_title_has_suffix() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, _) = make_transcript_session(&project_dir, None, 2);

        let result =
            fork_session(&sid, Some(project_path.to_str().unwrap()), None, None).unwrap();

        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));
        let content = std::fs::read_to_string(&fork_path).unwrap();
        let title_entry = content
            .trim()
            .split('\n')
            .filter_map(|line| {
                let v: serde_json::Value = serde_json::from_str(line).ok()?;
                if v["type"] == "custom-title" { Some(v) } else { None }
            })
            .last()
            .expect("should have a custom-title entry");
        let custom_title = title_entry["customTitle"].as_str().unwrap();
        assert!(
            custom_title.ends_with("(fork)"),
            "expected title ending with '(fork)', got: {custom_title}"
        );
    }

    #[test]
    #[serial]
    fn test_fork_session_id_in_entries() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, _) = make_transcript_session(&project_dir, None, 2);

        let result =
            fork_session(&sid, Some(project_path.to_str().unwrap()), None, None).unwrap();
        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));

        let content = std::fs::read_to_string(&fork_path).unwrap();
        for line in content.trim().split('\n') {
            let entry: serde_json::Value = serde_json::from_str(line).unwrap();
            assert_eq!(
                entry["sessionId"].as_str().unwrap(),
                result.session_id,
                "every entry must have the new session ID"
            );
        }
    }

    #[test]
    #[serial]
    fn test_fork_forked_from_field() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());
        let (sid, _, _) = make_transcript_session(&project_dir, None, 2);

        let result =
            fork_session(&sid, Some(project_path.to_str().unwrap()), None, None).unwrap();
        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));

        let content = std::fs::read_to_string(&fork_path).unwrap();
        for line in content.trim().split('\n') {
            let entry: serde_json::Value = serde_json::from_str(line).unwrap();
            let entry_type = entry["type"].as_str().unwrap_or("");
            if entry_type == "user" || entry_type == "assistant" {
                assert_eq!(
                    entry["forkedFrom"]["sessionId"].as_str().unwrap(),
                    sid,
                    "forkedFrom.sessionId must reference original session"
                );
            }
        }
    }

    #[test]
    #[serial]
    fn test_fork_without_directory() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_dir = make_project_dir(&config_dir, "/any/project");
        let (sid, _, _) = make_transcript_session(&project_dir, None, 2);

        let result = fork_session(&sid, None, None, None).unwrap();
        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));
        assert!(fork_path.exists());
    }

    #[test]
    #[serial]
    fn test_fork_clears_stale_fields() {
        let tmp = tempfile::tempdir().unwrap();
        let config_dir = setup_config_dir(&tmp);
        let project_path = tmp.path().join("proj");
        std::fs::create_dir_all(&project_path).unwrap();
        let real_path = std::fs::canonicalize(&project_path).unwrap();
        let project_dir = make_project_dir(&config_dir, real_path.to_str().unwrap());

        let sid = uuid::Uuid::new_v4().to_string();
        let file_path = project_dir.join(format!("{sid}.jsonl"));
        let entry = json!({
            "type": "user",
            "uuid": uuid::Uuid::new_v4().to_string(),
            "parentUuid": null,
            "sessionId": sid,
            "timestamp": "2026-03-01T00:00:00Z",
            "teamName": "test-team",
            "agentName": "test-agent",
            "slug": "test-slug",
            "message": { "role": "user", "content": "Hello" },
        });
        std::fs::write(&file_path, serde_json::to_string(&entry).unwrap() + "\n").unwrap();

        let result =
            fork_session(&sid, Some(project_path.to_str().unwrap()), None, None).unwrap();
        let fork_path = project_dir.join(format!("{}.jsonl", result.session_id));

        let content = std::fs::read_to_string(&fork_path).unwrap();
        for line in content.trim().split('\n') {
            let e: serde_json::Value = serde_json::from_str(line).unwrap();
            if e["type"] == "user" {
                assert!(e.get("teamName").is_none(), "teamName should be removed");
                assert!(e.get("agentName").is_none(), "agentName should be removed");
                assert!(e.get("slug").is_none(), "slug should be removed");
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Store-backed: rename_session_via_store() tests
// ---------------------------------------------------------------------------

mod test_rename_session_via_store {
    use super::*;

    #[tokio::test]
    #[serial]
    async fn test_invalid_session_id_raises() {
        let store = InMemorySessionStore::new();
        let result = rename_session_via_store(&store, "not-a-uuid", "title", None).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));
    }

    #[tokio::test]
    #[serial]
    async fn test_empty_title_raises() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        let result = rename_session_via_store(&store, &sid, "", Some("/proj")).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("title must be non-empty"));

        let result = rename_session_via_store(&store, &sid, "   ", Some("/proj")).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("title must be non-empty"));
    }

    #[tokio::test]
    #[serial]
    async fn test_appends_custom_title_entry() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        rename_session_via_store(&store, &sid, "My Title", Some("/proj")).await.unwrap();

        let entries = store.load(&key).await.unwrap().unwrap();
        let last = entries.last().unwrap();
        assert_eq!(last["type"], "custom-title");
        assert_eq!(last["customTitle"], "My Title");
        assert_eq!(last["sessionId"], sid);
    }

    #[tokio::test]
    #[serial]
    async fn test_title_trimmed() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        rename_session_via_store(&store, &sid, "  Trimmed  ", Some("/proj")).await.unwrap();

        let entries = store.load(&key).await.unwrap().unwrap();
        let last = entries.last().unwrap();
        assert_eq!(last["customTitle"], "Trimmed");
    }

    #[tokio::test]
    #[serial]
    async fn test_compact_json_keys() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        rename_session_via_store(&store, &sid, "Title", Some("/proj")).await.unwrap();

        let entries = store.load(&key).await.unwrap().unwrap();
        let last = entries.last().unwrap();
        // Verify the keys exist (compact serialization detail is internal)
        assert_eq!(last["type"], "custom-title");
        assert_eq!(last["customTitle"], "Title");
        assert_eq!(last["sessionId"], sid);
    }
}

// ---------------------------------------------------------------------------
// Store-backed: tag_session_via_store() tests
// ---------------------------------------------------------------------------

mod test_tag_session_via_store {
    use super::*;

    #[tokio::test]
    #[serial]
    async fn test_invalid_session_id_raises() {
        let store = InMemorySessionStore::new();
        let result = tag_session_via_store(&store, "not-a-uuid", Some("tag"), None).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));
    }

    #[tokio::test]
    #[serial]
    async fn test_empty_tag_raises() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        let result = tag_session_via_store(&store, &sid, Some(""), Some("/proj")).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("tag must be non-empty"));

        let result = tag_session_via_store(&store, &sid, Some("   "), Some("/proj")).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("tag must be non-empty"));
    }

    #[tokio::test]
    #[serial]
    async fn test_appends_tag_entry() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        tag_session_via_store(&store, &sid, Some("experiment"), Some("/proj"))
            .await
            .unwrap();

        let entries = store.load(&key).await.unwrap().unwrap();
        let last = entries.last().unwrap();
        assert_eq!(last["type"], "tag");
        assert_eq!(last["tag"], "experiment");
        assert_eq!(last["sessionId"], sid);
    }

    #[tokio::test]
    #[serial]
    async fn test_none_clears_tag() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        tag_session_via_store(&store, &sid, Some("original"), Some("/proj"))
            .await
            .unwrap();
        tag_session_via_store(&store, &sid, None, Some("/proj"))
            .await
            .unwrap();

        let entries = store.load(&key).await.unwrap().unwrap();
        let last = entries.last().unwrap();
        assert_eq!(last["type"], "tag");
        assert_eq!(last["tag"], "");
        assert_eq!(last["sessionId"], sid);
    }

    #[tokio::test]
    #[serial]
    async fn test_unicode_sanitization() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        let dirty_tag = "clean\u{200b}tag\u{feff}";
        tag_session_via_store(&store, &sid, Some(dirty_tag), Some("/proj"))
            .await
            .unwrap();

        let entries = store.load(&key).await.unwrap().unwrap();
        let last = entries.last().unwrap();
        assert_eq!(last["tag"], "cleantag");
    }

    #[tokio::test]
    #[serial]
    async fn test_sanitization_rejects_pure_invisible() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        let result = tag_session_via_store(
            &store,
            &sid,
            Some("\u{200b}\u{200c}\u{feff}"),
            Some("/proj"),
        )
        .await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("tag must be non-empty"));
    }
}

// ---------------------------------------------------------------------------
// Store-backed: delete_session_via_store() tests
// ---------------------------------------------------------------------------

mod test_delete_session_via_store {
    use super::*;

    #[tokio::test]
    #[serial]
    async fn test_invalid_session_id_raises() {
        let store = InMemorySessionStore::new();
        let result = delete_session_via_store(&store, "not-a-uuid", None).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));
    }

    #[tokio::test]
    #[serial]
    async fn test_deletes_session() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        store.append(&key, &store_entries_for_session("Hello")).await.unwrap();

        assert!(store.load(&key).await.unwrap().is_some());

        delete_session_via_store(&store, &sid, Some("/proj")).await.unwrap();

        assert!(store.load(&key).await.unwrap().is_none());
    }

    #[tokio::test]
    #[serial]
    async fn test_delete_nonexistent_is_noop() {
        // Per the SessionStore contract, deleting a nonexistent key is a no-op.
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();

        let result = delete_session_via_store(&store, &sid, Some("/proj")).await;
        assert!(result.is_ok());
    }
}

// ---------------------------------------------------------------------------
// Store-backed: fork_session_via_store() tests
// ---------------------------------------------------------------------------

mod test_fork_session_via_store {
    use super::*;

    #[tokio::test]
    #[serial]
    async fn test_invalid_session_id_raises() {
        let store = InMemorySessionStore::new();
        let result = fork_session_via_store(&store, "not-a-uuid", None, None, None).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid session_id"));
    }

    #[tokio::test]
    #[serial]
    async fn test_invalid_up_to_message_id_raises() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let result =
            fork_session_via_store(&store, &sid, None, Some("not-valid"), None).await;
        assert!(result.is_err());
        assert!(
            result
                .unwrap_err()
                .to_string()
                .contains("Invalid up_to_message_id")
        );
    }

    #[tokio::test]
    #[serial]
    async fn test_session_not_found_raises() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("not found"));
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_creates_new_session() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, _) = store_transcript_entries(&sid, 2);
        store.append(&key, &entries).await.unwrap();

        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None)
                .await
                .unwrap();
        assert_ne!(result.session_id, sid);

        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap();
        assert!(fork_entries.is_some());
        assert!(!fork_entries.unwrap().is_empty());
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_remaps_uuids() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, original_uuids) = store_transcript_entries(&sid, 2);
        store.append(&key, &entries).await.unwrap();

        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None)
                .await
                .unwrap();
        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();

        for entry in &fork_entries {
            let entry_type = entry["type"].as_str().unwrap_or("");
            if entry_type == "user" || entry_type == "assistant" {
                let uuid_val = entry["uuid"].as_str().unwrap();
                assert!(!original_uuids.contains(&uuid_val.to_string()));
                if let Some(parent) = entry["parentUuid"].as_str() {
                    assert!(!original_uuids.contains(&parent.to_string()));
                }
            }
        }
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_preserves_message_count() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, _) = store_transcript_entries(&sid, 3);
        let original_count = entries
            .iter()
            .filter(|e| {
                let t = e["type"].as_str().unwrap_or("");
                t == "user" || t == "assistant"
            })
            .count();
        store.append(&key, &entries).await.unwrap();

        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None)
                .await
                .unwrap();
        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();
        let fork_count = fork_entries
            .iter()
            .filter(|e| {
                let t = e["type"].as_str().unwrap_or("");
                t == "user" || t == "assistant"
            })
            .count();

        assert_eq!(fork_count, original_count);
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_up_to_message_id() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, uuids) = store_transcript_entries(&sid, 3);
        store.append(&key, &entries).await.unwrap();

        let cutoff_uuid = &uuids[1]; // first assistant
        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), Some(cutoff_uuid), None)
                .await
                .unwrap();

        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();
        let fork_count = fork_entries
            .iter()
            .filter(|e| {
                let t = e["type"].as_str().unwrap_or("");
                t == "user" || t == "assistant"
            })
            .count();

        assert_eq!(fork_count, 2);
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_up_to_message_id_not_found() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, _) = store_transcript_entries(&sid, 2);
        store.append(&key, &entries).await.unwrap();

        let fake_uuid = uuid::Uuid::new_v4().to_string();
        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), Some(&fake_uuid), None)
                .await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("not found in session"));
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_custom_title() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, _) = store_transcript_entries(&sid, 2);
        store.append(&key, &entries).await.unwrap();

        let result = fork_session_via_store(
            &store,
            &sid,
            Some("/proj"),
            None,
            Some("My Fork"),
        )
        .await
        .unwrap();

        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();
        let title_entry = fork_entries
            .iter()
            .find(|e| e["type"] == "custom-title")
            .expect("should have a custom-title entry");
        assert_eq!(title_entry["customTitle"], "My Fork");
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_default_title_has_suffix() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, _) = store_transcript_entries(&sid, 2);
        store.append(&key, &entries).await.unwrap();

        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None)
                .await
                .unwrap();

        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();
        let title_entry = fork_entries
            .iter()
            .find(|e| e["type"] == "custom-title")
            .expect("should have a custom-title entry");
        let custom_title = title_entry["customTitle"].as_str().unwrap();
        assert!(
            custom_title.ends_with("(fork)"),
            "expected title ending with '(fork)', got: {custom_title}"
        );
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_session_id_in_entries() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, _) = store_transcript_entries(&sid, 2);
        store.append(&key, &entries).await.unwrap();

        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None)
                .await
                .unwrap();

        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();
        for entry in &fork_entries {
            assert_eq!(
                entry["sessionId"].as_str().unwrap(),
                result.session_id,
                "every entry must have the new session ID"
            );
        }
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_forked_from_field() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let (entries, _) = store_transcript_entries(&sid, 2);
        store.append(&key, &entries).await.unwrap();

        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None)
                .await
                .unwrap();

        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();
        for entry in &fork_entries {
            let entry_type = entry["type"].as_str().unwrap_or("");
            if entry_type == "user" || entry_type == "assistant" {
                assert_eq!(
                    entry["forkedFrom"]["sessionId"].as_str().unwrap(),
                    sid,
                    "forkedFrom.sessionId must reference original session"
                );
            }
        }
    }

    #[tokio::test]
    #[serial]
    async fn test_fork_clears_stale_fields() {
        let store = InMemorySessionStore::new();
        let sid = uuid::Uuid::new_v4().to_string();
        let key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &sid);
        let entry = json!({
            "type": "user",
            "uuid": uuid::Uuid::new_v4().to_string(),
            "parentUuid": null,
            "sessionId": sid,
            "timestamp": "2026-03-01T00:00:00Z",
            "teamName": "test-team",
            "agentName": "test-agent",
            "slug": "test-slug",
            "message": { "role": "user", "content": "Hello" },
        });
        store.append(&key, &[entry]).await.unwrap();

        let result =
            fork_session_via_store(&store, &sid, Some("/proj"), None, None)
                .await
                .unwrap();

        let fork_key = SessionKey::new(rust_agent_sdk::project_key_for_directory(Some("/proj")).unwrap(), &result.session_id);
        let fork_entries = store.load(&fork_key).await.unwrap().unwrap();
        for e in &fork_entries {
            if e["type"] == "user" {
                assert!(e.get("teamName").is_none(), "teamName should be removed");
                assert!(e.get("agentName").is_none(), "agentName should be removed");
                assert!(e.get("slug").is_none(), "slug should be removed");
            }
        }
    }
}
