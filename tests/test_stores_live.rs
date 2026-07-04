//! Live conformance tests for the Postgres and Redis session stores.
//!
//! These require real servers and are `#[ignore]`d by default. Run with:
//!
//! ```bash
//! # Postgres on :5433, Redis on :6380 (see README)
//! RUST_AGENT_SDK_TEST_PG=postgres://postgres:test@127.0.0.1:5433/sessions \
//! RUST_AGENT_SDK_TEST_REDIS=redis://127.0.0.1:6380 \
//!   cargo test --features postgres,redis-store --test test_stores_live -- --ignored
//! ```
//!
//! Each test uses a unique project_key so runs stay isolated within a shared
//! server, and cleans up after itself via `delete`.

#![cfg(any(feature = "postgres", feature = "redis-store"))]

use rust_agent_sdk::{SessionKey, SessionListSubkeysKey, SessionStore, SessionStoreEntry};

fn e(n: i64) -> SessionStoreEntry {
    serde_json::json!({ "type": "x", "n": n })
}

/// A monotonically-unique project key so parallel/repeat runs don't collide.
fn unique_project(tag: &str) -> String {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    format!("test-{tag}-{nanos}")
}

/// Run the core SessionStore contracts against a live store, scoped to `proj`.
/// Mirrors the conformance suite's required + optional contracts.
async fn run_contracts(store: &dyn SessionStore, proj: &str) {
    let main = SessionKey::new(proj, "sess");
    let sub1 = SessionKey {
        project_key: proj.to_string(),
        session_id: "sess".to_string(),
        subpath: Some("subagents/agent-1".to_string()),
    };
    let sub2 = SessionKey {
        project_key: proj.to_string(),
        session_id: "sess".to_string(),
        subpath: Some("subagents/agent-2".to_string()),
    };

    // Contract: append then load preserves entries and order.
    store.append(&main, &[e(2), e(1)]).await.unwrap();
    assert_eq!(store.load(&main).await.unwrap().unwrap(), vec![e(2), e(1)]);

    // Contract: appends are additive in call order.
    store.append(&main, &[e(3)]).await.unwrap();
    assert_eq!(
        store.load(&main).await.unwrap().unwrap(),
        vec![e(2), e(1), e(3)]
    );

    // Contract: append([]) is a no-op.
    store.append(&main, &[]).await.unwrap();
    assert_eq!(store.load(&main).await.unwrap().unwrap().len(), 3);

    // Contract: unknown key loads as None.
    let unknown = SessionKey::new(proj, "does-not-exist");
    assert!(store.load(&unknown).await.unwrap().is_none());

    // Contract: subpath keys are independent of the main transcript.
    store.append(&sub1, &[e(10)]).await.unwrap();
    store.append(&sub2, &[e(20)]).await.unwrap();
    assert_eq!(store.load(&sub1).await.unwrap().unwrap(), vec![e(10)]);
    assert_eq!(store.load(&sub2).await.unwrap().unwrap(), vec![e(20)]);
    assert_eq!(store.load(&main).await.unwrap().unwrap().len(), 3);

    // Contract: list_sessions returns the project's main sessions, excludes
    // subagent subpaths, and carries epoch-ms mtimes (> 1e12).
    let sessions = store.list_sessions(proj).await.unwrap();
    assert_eq!(sessions.len(), 1);
    assert_eq!(sessions[0].session_id, "sess");
    assert!(
        sessions[0].mtime > 1_000_000_000_000,
        "mtime must be epoch-ms, got {}",
        sessions[0].mtime
    );

    // Contract: list_subkeys returns the subpaths, excluding the main.
    let mut subkeys = store
        .list_subkeys(&SessionListSubkeysKey {
            project_key: proj.to_string(),
            session_id: "sess".to_string(),
        })
        .await
        .unwrap();
    subkeys.sort();
    assert_eq!(subkeys, vec!["subagents/agent-1", "subagents/agent-2"]);

    // Contract: targeted delete removes only that subkey.
    store.delete(&sub1).await.unwrap();
    assert!(store.load(&sub1).await.unwrap().is_none());
    assert_eq!(store.load(&sub2).await.unwrap().unwrap(), vec![e(20)]);
    let subkeys_after = store
        .list_subkeys(&SessionListSubkeysKey {
            project_key: proj.to_string(),
            session_id: "sess".to_string(),
        })
        .await
        .unwrap();
    assert_eq!(subkeys_after, vec!["subagents/agent-2"]);

    // Contract: deleting the main cascades to all subkeys.
    store.delete(&main).await.unwrap();
    assert!(store.load(&main).await.unwrap().is_none());
    assert!(store.load(&sub2).await.unwrap().is_none());
    assert!(store
        .list_subkeys(&SessionListSubkeysKey {
            project_key: proj.to_string(),
            session_id: "sess".to_string(),
        })
        .await
        .unwrap()
        .is_empty());
    assert!(store.list_sessions(proj).await.unwrap().is_empty());
}

#[cfg(feature = "postgres")]
#[tokio::test]
#[ignore = "requires a live Postgres (set RUST_AGENT_SDK_TEST_PG)"]
async fn postgres_conformance() {
    use rust_agent_sdk::PostgresSessionStore;
    let url = std::env::var("RUST_AGENT_SDK_TEST_PG")
        .expect("set RUST_AGENT_SDK_TEST_PG to a Postgres connection string");
    let store = PostgresSessionStore::connect(&url, None)
        .await
        .expect("connect + create schema");
    run_contracts(&store, &unique_project("pg")).await;
}

#[cfg(feature = "redis-store")]
#[tokio::test]
#[ignore = "requires a live Redis (set RUST_AGENT_SDK_TEST_REDIS)"]
async fn redis_conformance() {
    use rust_agent_sdk::RedisSessionStore;
    let url = std::env::var("RUST_AGENT_SDK_TEST_REDIS")
        .expect("set RUST_AGENT_SDK_TEST_REDIS to a Redis URL");
    let store = RedisSessionStore::connect(&url, Some("test")).expect("open redis");
    run_contracts(&store, &unique_project("redis")).await;
}
