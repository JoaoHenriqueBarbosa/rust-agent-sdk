//! Tests for `import_session_to_store` (local JSONL -> SessionStore replay).
//!
//! All tests will FAIL because the underlying functions are `todo!()`.
//! This is the expected state — the tests define the correct behavior.

use std::fs;
use std::path::PathBuf;

use serde_json::json;
use serial_test::serial;
use tempfile::TempDir;

use rust_agent_sdk::{
    import_session_to_store, project_key_for_directory, InMemorySessionStore, SessionKey,
    SessionListSubkeysKey, SessionStore, SessionStoreEntry,
};
use rust_agent_sdk::internal::session_import::MAX_PENDING_ENTRIES;

const SESSION_ID: &str = "550e8400-e29b-41d4-a716-446655440000";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn entry(i: u32) -> SessionStoreEntry {
    json!({
        "type": "user",
        "uuid": format!("u{i}"),
        "timestamp": format!("2026-01-01T00:00:{:02}Z", i),
    })
}

fn write_jsonl(path: &std::path::Path, entries: &[SessionStoreEntry]) {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    let content: String = entries
        .iter()
        .map(|e| serde_json::to_string(e).unwrap())
        .collect::<Vec<_>>()
        .join("\n")
        + "\n";
    fs::write(path, content).unwrap();
}

/// Sets up an isolated ~/.claude/projects/<project_key>/ tree.
/// Returns (TempDir, project_dir, cwd, project_key).
fn setup_env() -> (TempDir, PathBuf, PathBuf, String) {
    let tmp = TempDir::new().unwrap();
    let cwd = tmp.path().join("project");
    fs::create_dir_all(&cwd).unwrap();

    let pk = project_key_for_directory(Some(cwd.to_str().unwrap())).unwrap();

    let config = tmp.path().join("claude_config");
    let project_dir = config.join("projects").join(&pk);
    fs::create_dir_all(&project_dir).unwrap();

    // Set CLAUDE_CONFIG_DIR so the import function finds the right config dir.
    std::env::set_var("CLAUDE_CONFIG_DIR", config.to_str().unwrap());

    (tmp, project_dir, cwd, pk)
}

// ---------------------------------------------------------------------------
// Main transcript import
// ---------------------------------------------------------------------------

#[tokio::test]
#[serial]
async fn test_imports_main_transcript() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    let entries: Vec<SessionStoreEntry> = (0..7).map(entry).collect();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &entries);

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let key = SessionKey::new(&pk, SESSION_ID);
    assert_eq!(store.get_entries(&key), entries);
}

#[tokio::test]
#[serial]
async fn test_batching_calls_append_per_chunk() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    let entries: Vec<SessionStoreEntry> = (0..5).map(entry).collect();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &entries);

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, 2)
        .await
        .unwrap();

    // 5 entries / batch_size 2 -> 3 append() calls (2 + 2 + 1).
    // We verify the final state matches all entries.
    let key = SessionKey::new(&pk, SESSION_ID);
    assert_eq!(store.get_entries(&key), entries);
}

#[tokio::test]
#[serial]
async fn test_skips_blank_lines() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    let path = project_dir.join(format!("{SESSION_ID}.jsonl"));
    let content = format!(
        "{}\n\n{}\n",
        serde_json::to_string(&entry(0)).unwrap(),
        serde_json::to_string(&entry(1)).unwrap(),
    );
    fs::write(&path, content).unwrap();

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let key = SessionKey::new(&pk, SESSION_ID);
    assert_eq!(store.get_entries(&key), vec![entry(0), entry(1)]);
}

#[tokio::test]
#[serial]
async fn test_nonpositive_batch_size_uses_default() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    let entries: Vec<SessionStoreEntry> = (0..3).map(entry).collect();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &entries);

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, 0)
        .await
        .unwrap();

    let key = SessionKey::new(&pk, SESSION_ID);
    assert_eq!(store.get_entries(&key), entries);
}

// ---------------------------------------------------------------------------
// Subagent transcripts
// ---------------------------------------------------------------------------

#[tokio::test]
#[serial]
async fn test_imports_subagent_transcripts_with_subpath() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &[entry(0)]);
    let sub_entries = vec![entry(10), entry(11)];
    write_jsonl(
        &project_dir
            .join(SESSION_ID)
            .join("subagents")
            .join("agent-abc.jsonl"),
        &sub_entries,
    );

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let sub_key = SessionKey {
        project_key: pk.clone(),
        session_id: SESSION_ID.to_string(),
        subpath: Some("subagents/agent-abc".to_string()),
    };
    assert_eq!(store.get_entries(&sub_key), sub_entries);

    let subkeys = store
        .list_subkeys(&SessionListSubkeysKey {
            project_key: pk.clone(),
            session_id: SESSION_ID.to_string(),
        })
        .await
        .unwrap();
    assert_eq!(subkeys, vec!["subagents/agent-abc"]);
}

#[tokio::test]
#[serial]
async fn test_imports_nested_subagent_transcripts() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &[entry(0)]);
    let nested = project_dir
        .join(SESSION_ID)
        .join("subagents")
        .join("workflows")
        .join("run-1");
    write_jsonl(&nested.join("agent-def.jsonl"), &[entry(20)]);

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let sub_key = SessionKey {
        project_key: pk.clone(),
        session_id: SESSION_ID.to_string(),
        subpath: Some("subagents/workflows/run-1/agent-def".to_string()),
    };
    assert_eq!(store.get_entries(&sub_key), vec![entry(20)]);
}

#[tokio::test]
#[serial]
async fn test_imports_meta_json_sidecar_as_agent_metadata() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &[entry(0)]);
    let sub_dir = project_dir.join(SESSION_ID).join("subagents");
    write_jsonl(&sub_dir.join("agent-abc.jsonl"), &[entry(10)]);
    fs::write(
        sub_dir.join("agent-abc.meta.json"),
        serde_json::to_string(&json!({"agentType": "coder", "worktreePath": "/tmp/wt"})).unwrap(),
    )
    .unwrap();

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let sub_key = SessionKey {
        project_key: pk.clone(),
        session_id: SESSION_ID.to_string(),
        subpath: Some("subagents/agent-abc".to_string()),
    };
    let stored = store.get_entries(&sub_key);
    assert_eq!(stored[0], entry(10));
    assert_eq!(
        stored[1],
        json!({
            "type": "agent_metadata",
            "agentType": "coder",
            "worktreePath": "/tmp/wt",
        })
    );
}

#[tokio::test]
#[serial]
async fn test_include_subagents_false_skips_subagents() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &[entry(0)]);
    write_jsonl(
        &project_dir
            .join(SESSION_ID)
            .join("subagents")
            .join("agent-abc.jsonl"),
        &[entry(10)],
    );

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), false, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let subkeys = store
        .list_subkeys(&SessionListSubkeysKey {
            project_key: pk.clone(),
            session_id: SESSION_ID.to_string(),
        })
        .await
        .unwrap();
    assert!(subkeys.is_empty());
}

#[tokio::test]
#[serial]
async fn test_no_subagents_dir_is_noop() {
    let (_tmp, project_dir, cwd, pk) = setup_env();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &[entry(0)]);

    let store = InMemorySessionStore::new();
    // include_subagents defaults to True; absence of the dir must not raise.
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let key = SessionKey::new(&pk, SESSION_ID);
    assert_eq!(store.get_entries(&key), vec![entry(0)]);
}

// ---------------------------------------------------------------------------
// Validation / errors
// ---------------------------------------------------------------------------

#[tokio::test]
#[serial]
async fn test_invalid_uuid_raises() {
    let store = InMemorySessionStore::new();
    let result = import_session_to_store("../../etc/passwd", &store, None, true, MAX_PENDING_ENTRIES).await;
    assert!(result.is_err());
    let err_msg = format!("{}", result.unwrap_err());
    assert!(
        err_msg.to_lowercase().contains("invalid")
            || err_msg.to_lowercase().contains("session_id"),
        "Expected error about invalid session_id, got: {err_msg}"
    );
}

#[tokio::test]
#[serial]
async fn test_session_not_found_raises() {
    let (_tmp, _project_dir, cwd, _pk) = setup_env();
    let store = InMemorySessionStore::new();
    let result =
        import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES).await;
    assert!(result.is_err());
    let err_msg = format!("{}", result.unwrap_err());
    assert!(
        err_msg.to_lowercase().contains("not found")
            || err_msg.to_lowercase().contains("no such file"),
        "Expected error about session not found, got: {err_msg}"
    );
}

// ---------------------------------------------------------------------------
// Round-trip with file_path_to_session_key
// ---------------------------------------------------------------------------

#[tokio::test]
#[serial]
async fn test_subpath_matches_file_path_to_session_key() {
    use rust_agent_sdk::internal::session_store::file_path_to_session_key;

    let (_tmp, project_dir, cwd, _pk) = setup_env();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &[entry(0)]);
    let sub_file = project_dir
        .join(SESSION_ID)
        .join("subagents")
        .join("agent-xyz.jsonl");
    write_jsonl(&sub_file, &[entry(1)]);

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, Some(cwd.to_str().unwrap()), true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let projects_dir = project_dir.parent().unwrap().to_str().unwrap();
    let expected_main = file_path_to_session_key(
        project_dir.join(format!("{SESSION_ID}.jsonl")).to_str().unwrap(),
        projects_dir,
    );
    let expected_sub = file_path_to_session_key(sub_file.to_str().unwrap(), projects_dir);

    assert!(expected_main.is_some());
    assert!(expected_sub.is_some());
    assert_eq!(store.get_entries(&expected_main.unwrap()), vec![entry(0)]);
    assert_eq!(store.get_entries(&expected_sub.unwrap()), vec![entry(1)]);
}

#[tokio::test]
#[serial]
async fn test_directory_none_keys_from_resolved_path_not_cwd() {
    let (_tmp, project_dir, _cwd, pk) = setup_env();
    write_jsonl(&project_dir.join(format!("{SESSION_ID}.jsonl")), &[entry(0)]);

    let store = InMemorySessionStore::new();
    import_session_to_store(SESSION_ID, &store, None, true, MAX_PENDING_ENTRIES)
        .await
        .unwrap();

    let key = SessionKey::new(&pk, SESSION_ID);
    assert_eq!(store.get_entries(&key), vec![entry(0)]);
}
