//! Exercises the SessionStore conformance contracts against `InMemorySessionStore`,
//! plus options-validation and project-key tests.
//!
//! Ported from Python: tests/test_session_store_conformance.py (21 tests)
//!
//! Live conformance tests for the Postgres and Redis backends live in
//! `tests/test_stores_live.rs` (feature-gated, `#[ignore]`d).

use rust_agent_sdk::{
    project_key_for_directory, ClaudeAgentOptions, ClaudeSDKError, InMemorySessionStore,
    SessionKey, SessionListSubkeysKey, SessionStore, SessionStoreEntry,
};

use rust_agent_sdk::internal::session_store_validation::validate_session_store_options;

fn make_key() -> SessionKey {
    SessionKey::new("proj", "sess")
}

// ===========================================================================
// TestInMemorySessionStore
// ===========================================================================

mod test_in_memory_session_store {
    use super::*;

    // NOTE: run_session_store_conformance is not yet ported to Rust.
    // We test the contracts directly against InMemorySessionStore.

    #[tokio::test]
    async fn test_conformance_append_then_load() {
        let store = InMemorySessionStore::new();
        let key = make_key();
        let entries = vec![serde_json::json!({"n": 1}), serde_json::json!({"n": 2})];
        store.append(&key, &entries).await.unwrap();
        let loaded = store.load(&key).await.unwrap();
        assert!(loaded.is_some());
        assert_eq!(loaded.unwrap(), entries);
    }

    #[tokio::test]
    async fn test_conformance_append_is_additive() {
        let store = InMemorySessionStore::new();
        let key = make_key();
        store
            .append(&key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        store
            .append(&key, &[serde_json::json!({"n": 2})])
            .await
            .unwrap();
        let loaded = store.load(&key).await.unwrap().unwrap();
        assert_eq!(loaded.len(), 2);
        assert_eq!(loaded[0]["n"], 1);
        assert_eq!(loaded[1]["n"], 2);
    }

    #[tokio::test]
    async fn test_conformance_load_returns_none_for_unknown() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("unknown", "unknown");
        let loaded = store.load(&key).await.unwrap();
        assert!(loaded.is_none());
    }

    #[tokio::test]
    async fn test_conformance_list_sessions() {
        let store = InMemorySessionStore::new();
        store
            .append(&SessionKey::new("p", "s1"), &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        store
            .append(&SessionKey::new("p", "s2"), &[serde_json::json!({"n": 2})])
            .await
            .unwrap();

        let sessions = store.list_sessions("p").await.unwrap();
        let ids: std::collections::HashSet<_> =
            sessions.iter().map(|s| s.session_id.clone()).collect();
        assert!(ids.contains("s1"));
        assert!(ids.contains("s2"));
        assert_eq!(ids.len(), 2);
    }

    #[tokio::test]
    async fn test_conformance_delete() {
        let store = InMemorySessionStore::new();
        let key = SessionKey::new("p", "s1");
        store
            .append(&key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        assert!(store.load(&key).await.unwrap().is_some());

        store.delete(&key).await.unwrap();
        assert!(store.load(&key).await.unwrap().is_none());
    }

    #[tokio::test]
    async fn test_conformance_list_subkeys() {
        let store = InMemorySessionStore::new();
        let mut key = SessionKey::new("p", "s1");
        key.subpath = Some("subagents/agent-a".to_string());
        store
            .append(&key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();

        let subkeys = store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: "p".to_string(),
                session_id: "s1".to_string(),
            })
            .await
            .unwrap();
        assert!(subkeys.contains(&"subagents/agent-a".to_string()));
    }

    #[tokio::test]
    async fn test_conformance_with_async_factory() {
        // Mirrors Python test: factory returns a store, then run conformance.
        async fn make() -> InMemorySessionStore {
            InMemorySessionStore::new()
        }
        let store = make().await;
        let key = make_key();
        store
            .append(&key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        let loaded = store.load(&key).await.unwrap();
        assert!(loaded.is_some());
        assert_eq!(loaded.unwrap(), vec![serde_json::json!({"n": 1})]);
    }

    #[tokio::test]
    async fn test_skip_optional_suppresses_contracts() {
        // A store implementing only required methods works for append/load.
        struct MinimalStore {
            data: std::sync::Mutex<std::collections::HashMap<String, Vec<SessionStoreEntry>>>,
        }

        impl MinimalStore {
            fn new() -> Self {
                Self {
                    data: std::sync::Mutex::new(std::collections::HashMap::new()),
                }
            }
            fn key_str(key: &SessionKey) -> String {
                format!(
                    "{}/{}/{}",
                    key.project_key,
                    key.session_id,
                    key.subpath.as_deref().unwrap_or("")
                )
            }
        }

        #[async_trait::async_trait]
        impl SessionStore for MinimalStore {
            async fn append(
                &self,
                key: &SessionKey,
                entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                let k = Self::key_str(key);
                self.data
                    .lock()
                    .unwrap()
                    .entry(k)
                    .or_default()
                    .extend(entries.iter().cloned());
                Ok(())
            }
            async fn load(
                &self,
                key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                let k = Self::key_str(key);
                Ok(self.data.lock().unwrap().get(&k).cloned())
            }
        }

        let store = MinimalStore::new();
        let key = make_key();
        store
            .append(&key, &[serde_json::json!({"x": 1})])
            .await
            .unwrap();
        let loaded = store.load(&key).await.unwrap();
        assert_eq!(loaded.unwrap(), vec![serde_json::json!({"x": 1})]);

        // Optional methods should return errors (default impl).
        assert!(store.list_sessions("proj").await.is_err());
        assert!(store.delete(&key).await.is_err());
        assert!(store
            .list_subkeys(&SessionListSubkeysKey {
                project_key: "proj".to_string(),
                session_id: "sess".to_string(),
            })
            .await
            .is_err());
    }

    #[tokio::test]
    async fn test_auto_skips_unimplemented_optionals() {
        // Optional contracts auto-skip when the store doesn't override them.
        // Same as above but with a store that implements SessionStore trait.
        struct MinimalStore2 {
            data: std::sync::Mutex<std::collections::HashMap<String, Vec<SessionStoreEntry>>>,
        }

        impl MinimalStore2 {
            fn new() -> Self {
                Self {
                    data: std::sync::Mutex::new(std::collections::HashMap::new()),
                }
            }
            fn key_str(key: &SessionKey) -> String {
                format!(
                    "{}/{}/{}",
                    key.project_key,
                    key.session_id,
                    key.subpath.as_deref().unwrap_or("")
                )
            }
        }

        #[async_trait::async_trait]
        impl SessionStore for MinimalStore2 {
            async fn append(
                &self,
                key: &SessionKey,
                entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                let k = Self::key_str(key);
                self.data
                    .lock()
                    .unwrap()
                    .entry(k)
                    .or_default()
                    .extend(entries.iter().cloned());
                Ok(())
            }
            async fn load(
                &self,
                key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                let k = Self::key_str(key);
                Ok(self.data.lock().unwrap().get(&k).cloned())
            }
        }

        let store = MinimalStore2::new();
        let key = make_key();
        store
            .append(&key, &[serde_json::json!({"x": 1})])
            .await
            .unwrap();
        let loaded = store.load(&key).await.unwrap();
        assert_eq!(loaded.unwrap(), vec![serde_json::json!({"x": 1})]);

        // No skip_optional passed — default impl should return errors.
        assert!(store.list_sessions("proj").await.is_err());
    }

    #[test]
    fn test_store_implements_is_canonical_probe() {
        // InMemorySessionStore implements all SessionStore methods.
        let _store = InMemorySessionStore::new();
        // In Rust, trait implementation is checked at compile time.
        // We verify InMemorySessionStore can be used as &dyn SessionStore.
        let store_ref: &dyn SessionStore = &_store;
        let _ = store_ref; // Compiles = implements SessionStore
    }

    #[tokio::test]
    async fn test_get_entries_helper() {
        let store = InMemorySessionStore::new();
        let key = make_key();
        assert!(store.get_entries(&key).is_empty());

        store
            .append(
                &key,
                &[serde_json::json!({"n": 1}), serde_json::json!({"n": 2})],
            )
            .await
            .unwrap();
        assert_eq!(
            store.get_entries(&key),
            vec![serde_json::json!({"n": 1}), serde_json::json!({"n": 2})]
        );

        // Returns a copy — mutating the result must not affect the store.
        let mut copy = store.get_entries(&key);
        copy.push(serde_json::json!({"n": 999}));
        assert_eq!(
            store.get_entries(&key),
            vec![serde_json::json!({"n": 1}), serde_json::json!({"n": 2})]
        );
    }

    #[tokio::test]
    async fn test_size_helper_counts_main_transcripts_only() {
        let store = InMemorySessionStore::new();
        assert_eq!(store.size(), 0);
        store
            .append(&SessionKey::new("p", "a"), &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        store
            .append(&SessionKey::new("p", "b"), &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        let mut sub_key = SessionKey::new("p", "a");
        sub_key.subpath = Some("sub/x".to_string());
        store
            .append(&sub_key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        // size() counts main transcripts only (keys without subpath)
        // InMemorySessionStore stores all keys; size() should count 2 main + 1 sub = 3 total keys,
        // but per Python semantics it should be 2. We match the Python assertion.
        assert_eq!(store.size(), 2);
    }

    #[tokio::test]
    async fn test_clear_helper() {
        let store = InMemorySessionStore::new();
        let key = make_key();
        store
            .append(&key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();
        let mut sub_key = key.clone();
        sub_key.subpath = Some("sub/x".to_string());
        store
            .append(&sub_key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();

        store.clear();
        assert_eq!(store.size(), 0);
        assert!(store.load(&key).await.unwrap().is_none());
        assert!(store.list_sessions("proj").await.unwrap().is_empty());
    }

    #[tokio::test]
    async fn test_load_returns_copy() {
        let store = InMemorySessionStore::new();
        let key = make_key();
        store
            .append(&key, &[serde_json::json!({"n": 1})])
            .await
            .unwrap();

        let mut loaded = store.load(&key).await.unwrap().unwrap();
        loaded.push(serde_json::json!({"n": 999}));
        assert_eq!(
            store.load(&key).await.unwrap().unwrap(),
            vec![serde_json::json!({"n": 1})]
        );
    }
}

// ===========================================================================
// TestSessionStoreOptionsValidation
// ===========================================================================

mod test_session_store_options_validation {
    use super::*;

    #[test]
    fn test_no_store_is_always_valid() {
        let opts = ClaudeAgentOptions {
            continue_conversation: true,
            enable_file_checkpointing: true,
            ..Default::default()
        };
        validate_session_store_options(&opts).unwrap();
    }

    #[test]
    fn test_valid_store_passes() {
        let opts = ClaudeAgentOptions {
            session_store: Some(Box::new(InMemorySessionStore::new())),
            ..Default::default()
        };
        validate_session_store_options(&opts).unwrap();
    }

    #[test]
    fn test_continue_conversation_requires_list_sessions() {
        struct MinimalStore;

        #[async_trait::async_trait]
        impl SessionStore for MinimalStore {
            async fn append(
                &self,
                _key: &SessionKey,
                _entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                Ok(())
            }
            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let opts = ClaudeAgentOptions {
            session_store: Some(Box::new(MinimalStore)),
            continue_conversation: true,
            ..Default::default()
        };
        let result = validate_session_store_options(&opts);
        assert!(result.is_err());
        let err = result.unwrap_err().to_string();
        assert!(err.contains("list_sessions"), "got: {err}");
    }

    #[test]
    fn test_continue_conversation_ok_when_store_implements_list_sessions() {
        let opts = ClaudeAgentOptions {
            session_store: Some(Box::new(InMemorySessionStore::new())),
            continue_conversation: true,
            ..Default::default()
        };
        validate_session_store_options(&opts).unwrap();
    }

    #[test]
    fn test_continue_with_resume_and_store_lacking_list_sessions() {
        struct MinimalStore;

        #[async_trait::async_trait]
        impl SessionStore for MinimalStore {
            async fn append(
                &self,
                _key: &SessionKey,
                _entries: &[SessionStoreEntry],
            ) -> Result<(), ClaudeSDKError> {
                Ok(())
            }
            async fn load(
                &self,
                _key: &SessionKey,
            ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
                Ok(None)
            }
        }

        let opts = ClaudeAgentOptions {
            session_store: Some(Box::new(MinimalStore)),
            continue_conversation: true,
            resume: Some("00000000-0000-4000-8000-000000000000".to_string()),
            ..Default::default()
        };
        // When resume is explicitly set, continue=true should not require list_sessions.
        validate_session_store_options(&opts).unwrap();
    }

    #[test]
    fn test_rejects_file_checkpointing_combo() {
        let opts = ClaudeAgentOptions {
            session_store: Some(Box::new(InMemorySessionStore::new())),
            enable_file_checkpointing: true,
            ..Default::default()
        };
        let result = validate_session_store_options(&opts);
        assert!(result.is_err());
        let err = result.unwrap_err().to_string();
        assert!(err.contains("enable_file_checkpointing"), "got: {err}");
    }
}

// ===========================================================================
// TestProjectKeyForDirectory
// ===========================================================================

mod test_project_key_for_directory {
    use super::*;

    #[test]
    fn test_defaults_to_cwd() {
        let key_none = project_key_for_directory(None).unwrap();
        let cwd = std::env::current_dir().unwrap();
        let key_cwd = project_key_for_directory(Some(cwd.to_str().unwrap())).unwrap();
        assert_eq!(key_none, key_cwd);
    }

    #[test]
    fn test_sanitizes_path() {
        let key = project_key_for_directory(Some("/tmp/my project!")).unwrap();
        assert!(!key.contains('/'));
        assert!(!key.contains(' '));
        assert!(!key.contains('!'));
    }

    #[test]
    fn test_stable_for_same_path() {
        assert_eq!(
            project_key_for_directory(Some("/a/b/c")).unwrap(),
            project_key_for_directory(Some("/a/b/c")).unwrap()
        );
    }

    #[test]
    fn test_relative_dir_resolved_to_absolute_before_hashing() {
        use rust_agent_sdk::internal::sessions::sanitize_path;

        let key = project_key_for_directory(Some(".")).unwrap();
        let abs = std::env::current_dir()
            .unwrap()
            .to_string_lossy()
            .to_string();
        let expected = sanitize_path(&abs);
        assert_eq!(key, expected);
        assert_ne!(key, sanitize_path("."));
    }

    #[test]
    fn test_nfc_normalizes_decomposed_unicode() {
        let tmp = tempfile::tempdir().unwrap();
        // NFC: é as single codepoint U+00E9
        let nfc_name = "caf\u{00e9}";
        // NFD: e + combining acute accent U+0301
        let nfd_name = "cafe\u{0301}";
        let nfc_path = tmp.path().join(nfc_name);
        let nfd_path = tmp.path().join(nfd_name);
        std::fs::create_dir_all(&nfc_path).ok();

        // On most filesystems, these will resolve to the same path.
        // The key must be the same regardless of the Unicode form used.
        let key_nfc = project_key_for_directory(Some(nfc_path.to_str().unwrap())).unwrap();
        let key_nfd = project_key_for_directory(Some(nfd_path.to_str().unwrap())).unwrap();
        assert_eq!(key_nfc, key_nfd);
    }

    #[test]
    fn test_long_path_uses_portable_djb2_suffix() {
        use rust_agent_sdk::internal::sessions::simple_hash;

        let long_segment = "a".repeat(300);
        let long_dir = format!("/{long_segment}");
        // Resolve to absolute (it already is)
        let key = project_key_for_directory(Some(&long_dir)).unwrap();
        let resolved = std::path::Path::new(&long_dir)
            .canonicalize()
            .unwrap_or_else(|_| std::path::PathBuf::from(&long_dir));
        let hash_suffix = simple_hash(resolved.to_str().unwrap());
        assert!(key.ends_with(&format!("-{hash_suffix}")));
    }
}
