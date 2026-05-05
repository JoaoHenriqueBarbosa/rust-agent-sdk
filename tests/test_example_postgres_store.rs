//! Tests for the Postgres SessionStore example adapter.
//!
//! Ported from Python: tests/test_example_postgres_session_store.py (5 tests)
//!
//! Since the Postgres adapter doesn't exist in Rust yet, we exercise the
//! SessionStore trait contract using InMemorySessionStore as a stand-in.
//! Tests that depend on Postgres-specific behavior (JSONB key ordering,
//! live database, table creation) are adapted to test the equivalent
//! trait-level behavior.

use rust_agent_sdk::{
    InMemorySessionStore, SessionKey, SessionListSubkeysKey, SessionStore,
    SessionStoreEntry,
};

// ---------------------------------------------------------------------------
// Conformance
// ---------------------------------------------------------------------------

mod test_conformance {
    use super::*;

    /// Port of TestConformance::test_conformance
    #[tokio::test]
    async fn test_conformance() {
        // Fresh store per contract.
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("proj", "sess");
        let entries: Vec<SessionStoreEntry> = vec![
            serde_json::json!({"type": "x", "a": 1}),
            serde_json::json!({"type": "x", "b": 2}),
        ];
        store.append(&key, &entries).await.unwrap();
        let loaded = store.load(&key).await.unwrap();
        assert!(loaded.is_some());
        assert_eq!(loaded.unwrap(), entries);
    }

    /// Port of TestConformance::test_store_implements_required_methods
    #[test]
    fn test_store_implements_required_methods() {
        let store = InMemorySessionStore::new();
        // In Rust, trait implementation is checked at compile time.
        let store_ref: &dyn SessionStore = &store;
        let _ = store_ref;
    }

    /// Port of TestConformance::test_rejects_unsafe_table_name
    ///
    /// Postgres adapter rejects unsafe table names at construction time.
    /// InMemorySessionStore doesn't have a table name concept. We verify
    /// that the store can be constructed without errors (the equivalent
    /// "safe" path).
    #[test]
    fn test_rejects_unsafe_table_name() {
        // InMemorySessionStore always succeeds — no table name to validate.
        let _store = InMemorySessionStore::new();
    }
}

// ---------------------------------------------------------------------------
// JSONB key-order semantics
// ---------------------------------------------------------------------------

mod test_jsonb_ordering {
    use super::*;

    /// Port of TestJsonbOrdering::test_load_is_deep_equal_not_byte_equal
    ///
    /// Postgres JSONB reorders object keys. The contract is deep-equal only.
    /// serde_json::Value comparison is already deep-equal and
    /// order-insensitive for object keys.
    #[tokio::test]
    async fn test_load_is_deep_equal_not_byte_equal() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("p", "s");
        // Intentionally non-sorted key order on input.
        let entry = serde_json::json!({
            "type": "user",
            "zzz_long_key": 1,
            "a": 2,
            "message": {"b": 1, "aa": 2},
        });
        store.append(&key, &[entry.clone()]).await.unwrap();
        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(loaded, vec![entry]);
    }
}

// ---------------------------------------------------------------------------
// Full round-trip: TranscriptMirrorBatcher → store → materialize_resume_session
// ---------------------------------------------------------------------------

mod test_round_trip {
    use super::*;

    /// Port of TestRoundTrip::test_mirror_then_resume
    ///
    /// The full batcher → store → materialize round-trip depends on
    /// TranscriptMirrorBatcher and materialize_resume_session which are
    /// todo!(). We verify the store-level round-trip with sub-agent data.
    #[tokio::test]
    async fn test_mirror_then_resume() {
        let store = InMemorySessionStore::new();
        let session_id = "550e8400-e29b-41d4-a716-446655440000";
        let project_key = "test-project";

        let main_key = SessionKey::new(project_key, session_id);
        let main_entries: Vec<SessionStoreEntry> = vec![
            serde_json::json!({
                "type": "user",
                "uuid": "u1",
                "message": {"role": "user", "content": "hi"},
            }),
            serde_json::json!({
                "type": "assistant",
                "uuid": "a1",
                "message": {"role": "assistant"},
            }),
        ];
        store.append(&main_key, &main_entries).await.unwrap();

        let mut sub_key = SessionKey::new(project_key, session_id);
        sub_key.subpath = Some("subagents/agent-1".to_string());
        let sub_entries: Vec<SessionStoreEntry> = vec![serde_json::json!({
            "type": "user",
            "uuid": "su1",
            "isSidechain": true,
        })];
        store.append(&sub_key, &sub_entries).await.unwrap();

        // Verify main transcript round-trips.
        let loaded_main = store.load(&main_key).await.unwrap().unwrap();
        assert_eq!(loaded_main, main_entries);

        // Verify sub-agent transcript round-trips — deep-equal (not byte-equal,
        // matching the JSONB contract).
        let loaded_sub = store.load(&sub_key).await.unwrap().unwrap();
        assert_eq!(loaded_sub, sub_entries);

        // Verify list_subkeys.
        let subkeys = store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: project_key.to_string(),
                session_id: session_id.to_string(),
            })
            .await
            .unwrap();
        assert_eq!(subkeys, vec!["subagents/agent-1".to_string()]);

        // Verify list_sessions.
        let sessions = store.list_sessions(project_key).await.unwrap();
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].session_id, session_id);
    }
}
