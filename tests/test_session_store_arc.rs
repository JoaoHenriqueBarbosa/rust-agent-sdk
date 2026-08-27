//! `Arc<T>` forwards the whole `SessionStore` trait — capability probes included.
//!
//! The probes are the part worth a test. Their trait defaults return `false`,
//! and a forwarding impl that forgets one produces no error at all: the store
//! works, and the crate silently skips the code paths that depend on it
//! (`continue_conversation` needs `list_sessions`). A wrapper that lies about
//! its capabilities is worse than one that fails, because there is nothing to
//! debug.

use std::sync::Arc;

use rust_agent_sdk::{
    project_key_for_directory, InMemorySessionStore, SessionKey, SessionStore, SessionStoreEntry,
};
use serde_json::json;

fn key() -> SessionKey {
    SessionKey::new(
        project_key_for_directory(Some("/workspace/project")).unwrap(),
        "s1",
    )
}

#[tokio::test]
async fn an_arc_forwards_reads_and_writes_to_the_inner_store() {
    let inner = Arc::new(InMemorySessionStore::new());
    let entry: SessionStoreEntry = json!({"type": "user"});

    // Written through the Arc…
    let shared: Arc<InMemorySessionStore> = Arc::clone(&inner);
    shared
        .append(&key(), std::slice::from_ref(&entry))
        .await
        .unwrap();

    // …and visible through the inner handle: the Arc is not a separate store.
    let loaded = inner.load(&key()).await.unwrap().unwrap();
    assert_eq!(
        loaded.len(),
        1,
        "the append through the Arc has to reach the same store the caller kept"
    );
}

#[tokio::test]
async fn an_arc_answers_the_capability_probes_for_the_inner_store() {
    let inner = InMemorySessionStore::new();
    let expected = (
        inner.has_list_sessions(),
        inner.has_delete(),
        inner.has_list_subkeys(),
        inner.has_list_session_summaries(),
    );
    let shared = Arc::new(InMemorySessionStore::new());

    // Contract: the probes report the INNER store's capabilities, not the
    // trait defaults. Falling back to `false` here would make the crate avoid
    // features the store actually supports — with no error to trace.
    assert_eq!(
        (
            shared.has_list_sessions(),
            shared.has_delete(),
            shared.has_list_subkeys(),
            shared.has_list_session_summaries(),
        ),
        expected,
        "an Arc must not answer the capability probes for itself"
    );
}
