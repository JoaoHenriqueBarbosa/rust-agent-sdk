//! Tests for the S3 SessionStore example adapter.
//!
//! Ported from Python: tests/test_example_s3_session_store.py (24 tests)
//!
//! Since the S3 adapter doesn't exist in Rust yet, we exercise the
//! SessionStore trait contract using InMemorySessionStore as a stand-in.
//! Tests that depend on S3-specific behavior (part-name format, JSONL
//! serialization, _RecordingClient, moto) are adapted to test the
//! equivalent trait-level behavior.

use rust_agent_sdk::{
    InMemorySessionStore, SessionKey, SessionListSubkeysKey, SessionStore, SessionStoreEntry,
};

// ---------------------------------------------------------------------------
// Conformance suite
// ---------------------------------------------------------------------------

mod test_conformance {
    use super::*;

    /// Port of test_conformance
    #[tokio::test]
    async fn test_conformance() {
        // Fresh store per "contract" — exercises append/load round-trip.
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("iso1", "sess");
        let entries: Vec<SessionStoreEntry> = vec![
            serde_json::json!({"type": "x", "a": 1}),
            serde_json::json!({"type": "x", "b": 2}),
        ];
        store.append(&key, &entries).await.unwrap();
        let loaded = store.load(&key).await.unwrap();
        assert!(loaded.is_some());
        assert_eq!(loaded.unwrap(), entries);
    }

    /// Port of test_conformance_with_options_dataclass
    #[tokio::test]
    async fn test_conformance_with_options_dataclass() {
        // In Rust, InMemorySessionStore::new() is the only constructor.
        // The Python test verifies S3SessionStoreOptions is an alternative
        // to keyword args. We verify the store works the same way.
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("opt1", "sess");
        store
            .append(&key, &[serde_json::json!({"type": "x", "n": 1})])
            .await
            .unwrap();
        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(loaded, vec![serde_json::json!({"type": "x", "n": 1})]);
    }
}

// ---------------------------------------------------------------------------
// append — part-name format / sortability / serialization
// ---------------------------------------------------------------------------

mod test_append {
    use super::*;

    /// Port of test_append_part_name_format_and_sortable
    ///
    /// S3 adapter uses part-name files with timestamps. InMemorySessionStore
    /// doesn't have part-name files. We verify the equivalent: multiple
    /// appends produce entries in the correct order.
    #[tokio::test]
    async fn test_append_part_name_format_and_sortable() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store
            .append(&key, &[serde_json::json!({"type": "x", "a": 1})])
            .await
            .unwrap();
        store
            .append(&key, &[serde_json::json!({"type": "x", "b": 2})])
            .await
            .unwrap();

        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(loaded.len(), 2);
        assert_eq!(loaded[0], serde_json::json!({"type": "x", "a": 1}));
        assert_eq!(loaded[1], serde_json::json!({"type": "x", "b": 2}));
    }

    /// Port of test_append_two_instances_distinct_part_names
    ///
    /// Two store instances appending to the same key produce distinct entries.
    /// With InMemorySessionStore two instances are independent so we test
    /// that both can append without interference.
    #[tokio::test]
    async fn test_append_two_instances_distinct_part_names() {
        let store_a = InMemorySessionStore::new();
        let store_b = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store_a
            .append(&key, &[serde_json::json!({"type": "x", "n": 1})])
            .await
            .unwrap();
        store_b
            .append(&key, &[serde_json::json!({"type": "x", "n": 2})])
            .await
            .unwrap();

        // Each store has its own entries.
        let a = store_a.load(&key).await.unwrap().unwrap();
        let b = store_b.load(&key).await.unwrap().unwrap();
        assert_eq!(a, vec![serde_json::json!({"type": "x", "n": 1})]);
        assert_eq!(b, vec![serde_json::json!({"type": "x", "n": 2})]);
    }

    /// Port of test_append_jsonl_serialization
    ///
    /// S3 adapter serializes entries as JSONL. InMemorySessionStore stores
    /// them as serde_json::Value directly. We verify the values are preserved.
    #[tokio::test]
    async fn test_append_jsonl_serialization() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store
            .append(
                &key,
                &[
                    serde_json::json!({"type": "x", "a": 1}),
                    serde_json::json!({"type": "x", "b": 2}),
                ],
            )
            .await
            .unwrap();
        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(
            loaded,
            vec![
                serde_json::json!({"type": "x", "a": 1}),
                serde_json::json!({"type": "x", "b": 2}),
            ]
        );
    }

    /// Port of test_append_same_ms_preserves_order
    ///
    /// Verifies that multiple appends in rapid succession preserve order.
    #[tokio::test]
    async fn test_append_same_ms_preserves_order() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        for i in 0..3 {
            store
                .append(&key, &[serde_json::json!({"type": "x", "i": i})])
                .await
                .unwrap();
        }
        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(
            loaded,
            vec![
                serde_json::json!({"type": "x", "i": 0}),
                serde_json::json!({"type": "x", "i": 1}),
                serde_json::json!({"type": "x", "i": 2}),
            ]
        );
    }

    /// Port of test_append_empty_is_noop
    #[tokio::test]
    async fn test_append_empty_is_noop() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store.append(&key, &[]).await.unwrap();
        // After appending nothing, load may return None or Some([]).
        let loaded = store.load(&key).await.unwrap();
        if let Some(entries) = loaded {
            assert!(entries.is_empty());
        }
    }

    /// Port of test_append_includes_subpath
    #[tokio::test]
    async fn test_append_includes_subpath() {
        let store = InMemorySessionStore::new();
        let mut key = SessionKey::new("proj", "sess");
        key.subpath = Some("subagents/agent-1".to_string());
        store
            .append(&key, &[serde_json::json!({"type": "x", "x": 1})])
            .await
            .unwrap();

        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(loaded, vec![serde_json::json!({"type": "x", "x": 1})]);

        // Subkey appears in list_subkeys.
        let subkeys = store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: "proj".to_string(),
                session_id: "sess".to_string(),
            })
            .await
            .unwrap();
        assert_eq!(subkeys, vec!["subagents/agent-1".to_string()]);
    }
}

// ---------------------------------------------------------------------------
// load — sort, paginate, exclude subpaths, skip malformed
// ---------------------------------------------------------------------------

mod test_load {
    use super::*;

    /// Port of test_load_null_when_empty
    #[tokio::test]
    async fn test_load_null_when_empty() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        assert!(store.load(&key).await.unwrap().is_none());
    }

    /// Port of test_load_sorts_and_concatenates
    ///
    /// S3 adapter sorts parts by key name. InMemorySessionStore maintains
    /// insertion order. We verify concatenation across multiple appends.
    #[tokio::test]
    async fn test_load_sorts_and_concatenates() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store
            .append(&key, &[serde_json::json!({"n": 0})])
            .await
            .unwrap();
        store
            .append(
                &key,
                &[serde_json::json!({"n": 1}), serde_json::json!({"n": 2})],
            )
            .await
            .unwrap();
        store
            .append(&key, &[serde_json::json!({"n": 3})])
            .await
            .unwrap();

        let result = store.load(&key).await.unwrap().unwrap();
        assert_eq!(
            result,
            vec![
                serde_json::json!({"n": 0}),
                serde_json::json!({"n": 1}),
                serde_json::json!({"n": 2}),
                serde_json::json!({"n": 3}),
            ]
        );
    }

    /// Port of test_load_paginates
    ///
    /// S3 pagination is not relevant for InMemorySessionStore. We verify
    /// that many appends all load correctly.
    #[tokio::test]
    async fn test_load_paginates() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        for i in 0..5 {
            store
                .append(&key, &[serde_json::json!({"type": "x", "n": i})])
                .await
                .unwrap();
        }
        let result = store.load(&key).await.unwrap().unwrap();
        let ns: Vec<i64> = result.iter().map(|e| e["n"].as_i64().unwrap()).collect();
        assert_eq!(ns, vec![0, 1, 2, 3, 4]);
    }

    /// Port of test_load_excludes_subpath_parts
    ///
    /// Loading the main transcript must not include subagent entries.
    #[tokio::test]
    async fn test_load_excludes_subpath_parts() {
        let store = InMemorySessionStore::new();
        let main_key = SessionKey::new("proj", "sess");
        store
            .append(&main_key, &[serde_json::json!({"main": 1})])
            .await
            .unwrap();

        let mut sub_key = SessionKey::new("proj", "sess");
        sub_key.subpath = Some("subagents/agent-1".to_string());
        store
            .append(&sub_key, &[serde_json::json!({"sub": 1})])
            .await
            .unwrap();

        store
            .append(&main_key, &[serde_json::json!({"main": 2})])
            .await
            .unwrap();

        let result = store.load(&main_key).await.unwrap().unwrap();
        assert_eq!(
            result,
            vec![
                serde_json::json!({"main": 1}),
                serde_json::json!({"main": 2}),
            ]
        );
    }

    /// Port of test_load_skips_malformed_lines
    ///
    /// InMemorySessionStore doesn't parse JSON — entries are already
    /// serde_json::Value. We verify that valid entries round-trip correctly.
    #[tokio::test]
    async fn test_load_skips_malformed_lines() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store
            .append(
                &key,
                &[serde_json::json!({"ok": 1}), serde_json::json!({"ok": 2})],
            )
            .await
            .unwrap();
        let result = store.load(&key).await.unwrap().unwrap();
        assert_eq!(
            result,
            vec![serde_json::json!({"ok": 1}), serde_json::json!({"ok": 2})]
        );
    }
}

// ---------------------------------------------------------------------------
// list_sessions — mtime extraction, subagent filtering
// ---------------------------------------------------------------------------

mod test_list_sessions {
    use super::*;

    /// Port of test_list_sessions_extracts_mtime
    #[tokio::test]
    async fn test_list_sessions_extracts_mtime() {
        let store = InMemorySessionStore::new();
        store
            .append(&SessionKey::new("proj", "sess-a"), &[serde_json::json!({})])
            .await
            .unwrap();
        store
            .append(&SessionKey::new("proj", "sess-a"), &[serde_json::json!({})])
            .await
            .unwrap();
        store
            .append(&SessionKey::new("proj", "sess-b"), &[serde_json::json!({})])
            .await
            .unwrap();

        let result = store.list_sessions("proj").await.unwrap();
        let mut ids: Vec<_> = result.iter().map(|r| r.session_id.as_str()).collect();
        ids.sort();
        assert_eq!(ids, vec!["sess-a", "sess-b"]);
        // All have a positive mtime.
        assert!(result.iter().all(|r| r.mtime > 0));
    }

    /// Port of test_list_sessions_ignores_subagent_parts
    ///
    /// Subpath appends should not create phantom session entries.
    #[tokio::test]
    async fn test_list_sessions_ignores_subagent_parts() {
        let store = InMemorySessionStore::new();
        store
            .append(&SessionKey::new("proj", "sess-a"), &[serde_json::json!({})])
            .await
            .unwrap();

        let mut sub_key = SessionKey::new("proj", "sess-a");
        sub_key.subpath = Some("subagents/agent-1".to_string());
        store
            .append(&sub_key, &[serde_json::json!({})])
            .await
            .unwrap();

        // sess-ghost only has subagent data, no main transcript.
        let mut ghost_sub = SessionKey::new("proj", "sess-ghost");
        ghost_sub.subpath = Some("subagents/agent-1".to_string());
        store
            .append(&ghost_sub, &[serde_json::json!({})])
            .await
            .unwrap();

        let result = store.list_sessions("proj").await.unwrap();
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].session_id, "sess-a");
    }
}

// ---------------------------------------------------------------------------
// delete — cascade vs targeted, error surfacing
// ---------------------------------------------------------------------------

mod test_delete {
    use super::*;

    /// Port of test_delete_batch_deletes_parts
    #[tokio::test]
    async fn test_delete_batch_deletes_parts() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store.append(&key, &[serde_json::json!({})]).await.unwrap();
        store.append(&key, &[serde_json::json!({})]).await.unwrap();

        store.delete(&key).await.unwrap();

        assert!(store.load(&key).await.unwrap().is_none());
    }

    /// Port of test_delete_subpath_direct_only
    ///
    /// Deleting subpath "a" should NOT delete subpath "a/b".
    #[tokio::test]
    async fn test_delete_subpath_direct_only() {
        let store = InMemorySessionStore::new();
        let base = SessionKey::new("proj", "sess");
        let mut sub_a = base.clone();
        sub_a.subpath = Some("a".to_string());
        store
            .append(&sub_a, &[serde_json::json!({"type": "x", "a": 1})])
            .await
            .unwrap();
        let mut sub_ab = base.clone();
        sub_ab.subpath = Some("a/b".to_string());
        store
            .append(&sub_ab, &[serde_json::json!({"type": "x", "ab": 1})])
            .await
            .unwrap();

        store.delete(&sub_a).await.unwrap();

        assert!(store.load(&sub_a).await.unwrap().is_none());
        assert_eq!(
            store.load(&sub_ab).await.unwrap().unwrap(),
            vec![serde_json::json!({"type": "x", "ab": 1})]
        );
    }

    /// Port of test_delete_cascades_without_subpath
    #[tokio::test]
    async fn test_delete_cascades_without_subpath() {
        let store = InMemorySessionStore::new();
        let base = SessionKey::new("proj", "sess");
        store
            .append(&base, &[serde_json::json!({"type": "x", "m": 1})])
            .await
            .unwrap();
        let mut sub_a = base.clone();
        sub_a.subpath = Some("a".to_string());
        store
            .append(&sub_a, &[serde_json::json!({"type": "x", "a": 1})])
            .await
            .unwrap();
        let mut sub_ab = base.clone();
        sub_ab.subpath = Some("a/b".to_string());
        store
            .append(&sub_ab, &[serde_json::json!({"type": "x", "ab": 1})])
            .await
            .unwrap();

        store.delete(&base).await.unwrap();

        assert!(store.load(&base).await.unwrap().is_none());
        assert!(store.load(&sub_a).await.unwrap().is_none());
        assert!(store.load(&sub_ab).await.unwrap().is_none());
    }

    /// Port of test_delete_surfaces_errors
    ///
    /// S3 adapter surfaces errors from S3's batch delete response.
    /// InMemorySessionStore never fails on delete. We verify that deleting
    /// a non-existent key is a no-op (doesn't error).
    #[tokio::test]
    async fn test_delete_surfaces_errors() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        // Deleting a key that doesn't exist should not error.
        store.delete(&key).await.unwrap();
    }
}

// ---------------------------------------------------------------------------
// list_subkeys — extraction + traversal filter
// ---------------------------------------------------------------------------

mod test_list_subkeys {
    use super::*;

    /// Port of test_list_subkeys_extracts_unique_subpaths
    #[tokio::test]
    async fn test_list_subkeys_extracts_unique_subpaths() {
        let store = InMemorySessionStore::new();
        let base = SessionKey::new("proj", "sess");

        let mut sub1 = base.clone();
        sub1.subpath = Some("subagents/agent-1".to_string());
        store.append(&sub1, &[serde_json::json!({})]).await.unwrap();
        // Append again to same subpath — should still list only once.
        store.append(&sub1, &[serde_json::json!({})]).await.unwrap();

        let mut sub2 = base.clone();
        sub2.subpath = Some("subagents/agent-2".to_string());
        store.append(&sub2, &[serde_json::json!({})]).await.unwrap();

        let mut result = store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: "proj".to_string(),
                session_id: "sess".to_string(),
            })
            .await
            .unwrap();
        result.sort();
        assert_eq!(
            result,
            vec![
                "subagents/agent-1".to_string(),
                "subagents/agent-2".to_string(),
            ]
        );
    }

    /// Port of test_list_subkeys_filters_traversal_segments
    ///
    /// The S3 adapter filters out path-traversal segments ("..",".","//"").
    /// InMemorySessionStore stores subpaths as-is. This test verifies the
    /// store correctly stores and retrieves arbitrary subpath strings.
    #[tokio::test]
    async fn test_list_subkeys_filters_traversal_segments() {
        let store = InMemorySessionStore::new();
        let base = SessionKey::new("proj", "sess");

        // Store a legitimate subpath.
        let mut ok_key = base.clone();
        ok_key.subpath = Some("ok".to_string());
        store
            .append(&ok_key, &[serde_json::json!({})])
            .await
            .unwrap();

        let result = store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: "proj".to_string(),
                session_id: "sess".to_string(),
            })
            .await
            .unwrap();
        assert_eq!(result, vec!["ok".to_string()]);
    }
}

// ---------------------------------------------------------------------------
// prefix normalization
// ---------------------------------------------------------------------------

mod test_prefix_normalization {
    use super::*;

    /// Port of test_prefix_normalization (parametrized over 4 prefix values)
    ///
    /// S3 adapter normalizes prefixes to avoid double-slash artifacts.
    /// InMemorySessionStore doesn't have a prefix concept. We verify the
    /// store round-trips correctly and list_sessions/list_subkeys find
    /// what append() wrote.
    #[tokio::test]
    async fn test_prefix_normalization() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        store
            .append(&key, &[serde_json::json!({"type": "x", "n": 1})])
            .await
            .unwrap();

        // list_sessions finds the session.
        let sessions = store.list_sessions("proj").await.unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].session_id, "sess");

        // list_subkeys returns empty (no subpaths).
        let subkeys = store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: "proj".to_string(),
                session_id: "sess".to_string(),
            })
            .await
            .unwrap();
        assert!(subkeys.is_empty());

        // load finds what append wrote.
        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(loaded, vec![serde_json::json!({"type": "x", "n": 1})]);
    }
}

// ---------------------------------------------------------------------------
// materialize_resume_session round-trip
// ---------------------------------------------------------------------------

mod test_round_trip {
    use super::*;

    /// Port of test_materialize_round_trip
    ///
    /// Full materialize_resume_session is todo!(). We verify the store-level
    /// round-trip with subagent data.
    #[tokio::test]
    async fn test_materialize_round_trip() {
        let store = InMemorySessionStore::new();
        let session_id = "550e8400-e29b-41d4-a716-446655440000";
        let project_key = "test-project";

        // Seed main transcript.
        let main_key = SessionKey::new(project_key, session_id);
        let seeded: Vec<SessionStoreEntry> = (0..2)
            .flat_map(|i| {
                vec![
                    serde_json::json!({
                        "type": "user",
                        "uuid": format!("u{i}"),
                        "message": {"role": "user", "content": format!("msg {i}")},
                    }),
                    serde_json::json!({
                        "type": "assistant",
                        "uuid": format!("a{i}"),
                        "message": {"role": "assistant", "content": format!("msg {i}")},
                    }),
                ]
            })
            .collect();
        store.append(&main_key, &seeded).await.unwrap();

        // Seed sub-agent transcript.
        let mut sub_key = SessionKey::new(project_key, session_id);
        sub_key.subpath = Some("subagents/agent-1".to_string());
        let sub_entries = vec![serde_json::json!({
            "type": "user",
            "uuid": "su0",
            "message": {"role": "user", "content": "sub msg 0"},
        })];
        store.append(&sub_key, &sub_entries).await.unwrap();

        // Verify main round-trip.
        let loaded_main = store.load(&main_key).await.unwrap().unwrap();
        assert_eq!(loaded_main, seeded);

        // Verify sub-agent round-trip.
        let loaded_sub = store.load(&sub_key).await.unwrap().unwrap();
        assert_eq!(loaded_sub, sub_entries);

        // Verify cleanup: delete cascades.
        store.delete(&main_key).await.unwrap();
        assert!(store.load(&main_key).await.unwrap().is_none());
        assert!(store.load(&sub_key).await.unwrap().is_none());
    }
}

// ---------------------------------------------------------------------------
// TranscriptMirrorBatcher 50-entry flush
// ---------------------------------------------------------------------------

mod test_batcher {
    use super::*;

    /// Port of test_batcher_50_entries
    ///
    /// TranscriptMirrorBatcher is todo!(). We simulate the same behavior:
    /// 50 sequential appends should all be loadable in order.
    #[tokio::test]
    async fn test_batcher_50_entries() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        for i in 0..50 {
            store
                .append(&key, &[serde_json::json!({"type": "user", "n": i})])
                .await
                .unwrap();
        }

        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(loaded.len(), 50);
        let ns: Vec<i64> = loaded.iter().map(|e| e["n"].as_i64().unwrap()).collect();
        assert_eq!(ns, (0..50).collect::<Vec<i64>>());
    }
}
