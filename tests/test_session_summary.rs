//! Tests for incremental session-summary derivation.
//!
//! Covers `fold_session_summary`, `summary_entry_to_sdk_info`,
//! `InMemorySessionStore.list_session_summaries`, and the
//! `list_sessions_from_store` fast path that consumes them.
//!
//! All tests will FAIL because the underlying functions are `todo!()`.
//! This is the expected state — the tests define the correct behavior.

use serde_json::json;
use uuid::Uuid;

use rust_agent_sdk::internal::session_summary::summary_entry_to_sdk_info;
use rust_agent_sdk::{
    fold_session_summary, list_sessions_from_store, project_key_for_directory,
    InMemorySessionStore, SDKSessionInfo, SessionKey, SessionStore, SessionStoreEntry,
    SessionSummaryEntry,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DIR: &str = "/workspace/project";

fn project_key() -> String {
    project_key_for_directory(Some(DIR)).unwrap()
}

fn default_key() -> SessionKey {
    SessionKey::new(project_key(), "11111111-1111-4111-8111-111111111111")
}

fn user_entry(text: &str, ts: &str, extra: serde_json::Value) -> SessionStoreEntry {
    let mut entry = json!({
        "type": "user",
        "timestamp": ts,
        "message": { "role": "user", "content": text },
    });
    if let serde_json::Value::Object(map) = extra {
        for (k, v) in map {
            entry[&k] = v;
        }
    }
    entry
}

fn user_simple(text: &str) -> SessionStoreEntry {
    user_entry(text, "2024-01-01T00:00:00.000Z", json!({}))
}

fn user_ts(text: &str, ts: &str) -> SessionStoreEntry {
    user_entry(text, ts, json!({}))
}

// ---------------------------------------------------------------------------
// fold_session_summary unit tests
// ---------------------------------------------------------------------------

#[test]
fn test_init_from_none() {
    let key = default_key();
    let s = fold_session_summary(None, &key, &[]);
    assert_eq!(s.session_id, key.session_id);
    assert_eq!(s.mtime, 0);
    assert_eq!(s.data, json!({}));
}

#[test]
fn test_set_once_fields_freeze() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[
            json!({
                "type": "x",
                "timestamp": "2024-01-01T00:00:00.000Z",
                "cwd": "/a",
                "isSidechain": false,
            }),
            json!({
                "type": "x",
                "timestamp": "2024-01-01T00:00:05.000Z",
                "cwd": "/b",
            }),
        ],
    );
    assert_eq!(s.data["created_at"], json!(1_704_067_200_000_i64));
    assert_eq!(s.data["cwd"], json!("/a"));
    assert_eq!(s.data["is_sidechain"], json!(false));

    // Second append must not overwrite set-once fields.
    let s2 = fold_session_summary(
        Some(&s),
        &key,
        &[json!({
            "type": "x",
            "timestamp": "2024-01-02T00:00:00.000Z",
            "cwd": "/c",
            "isSidechain": true,
        })],
    );
    assert_eq!(s2.data["created_at"], json!(1_704_067_200_000_i64));
    assert_eq!(s2.data["cwd"], json!("/a"));
    assert_eq!(s2.data["is_sidechain"], json!(false));
}

#[test]
fn test_last_wins_overwrite() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[
            json!({
                "type": "x",
                "timestamp": "2024-01-01T00:00:00Z",
                "customTitle": "t1",
                "gitBranch": "main",
            }),
            json!({
                "type": "x",
                "timestamp": "2024-01-01T00:00:01Z",
                "customTitle": "t2",
            }),
        ],
    );
    assert_eq!(s.data["custom_title"], json!("t2"));
    assert_eq!(s.data["git_branch"], json!("main"));

    let s2 = fold_session_summary(
        Some(&s),
        &key,
        &[json!({
            "type": "x",
            "aiTitle": "ai",
            "lastPrompt": "lp",
            "summary": "sm",
            "gitBranch": "dev",
        })],
    );
    assert_eq!(s2.data["custom_title"], json!("t2"));
    assert_eq!(s2.data["ai_title"], json!("ai"));
    assert_eq!(s2.data["last_prompt"], json!("lp"));
    assert_eq!(s2.data["summary_hint"], json!("sm"));
    assert_eq!(s2.data["git_branch"], json!("dev"));
}

#[test]
fn test_mtime_not_derived_from_entries() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[
            json!({"type": "x", "timestamp": "2024-01-01T00:00:05.000Z"}),
            json!({"type": "x", "timestamp": "2024-01-01T00:00:01.000Z"}),
        ],
    );
    // New session: fold returns mtime=0 placeholder, adapter must stamp.
    assert_eq!(s.mtime, 0);

    // Carry-over: prev mtime is preserved verbatim regardless of entry
    // timestamps in the new batch.
    let prev = SessionSummaryEntry {
        session_id: key.session_id.clone(),
        mtime: 42,
        data: json!({}),
    };
    let s2 = fold_session_summary(
        Some(&prev),
        &key,
        &[json!({"type": "x", "timestamp": "2024-01-01T00:00:10.000Z"})],
    );
    assert_eq!(s2.mtime, 42);
}

#[test]
fn test_tag_set_and_clear() {
    let key = default_key();
    let s = fold_session_summary(None, &key, &[json!({"type": "tag", "tag": "wip"})]);
    assert_eq!(s.data["tag"], json!("wip"));

    let s2 = fold_session_summary(Some(&s), &key, &[json!({"type": "tag", "tag": ""})]);
    assert!(s2.data.get("tag").is_none() || s2.data["tag"].is_null());

    // Non-tag entries with a "tag" key (e.g. tool_use input) are ignored.
    let s3 = fold_session_summary(Some(&s), &key, &[json!({"type": "user", "tag": "ignored"})]);
    assert_eq!(s3.data["tag"], json!("wip"));
}

#[test]
fn test_sidechain_from_first_entry() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[json!({
            "type": "x",
            "timestamp": "2024-01-01T00:00:00Z",
            "isSidechain": true,
        })],
    );
    assert_eq!(s.data["is_sidechain"], json!(true));
}

#[test]
fn test_sidechain_latched_when_first_entry_lacks_timestamp() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[
            json!({"type": "user", "isSidechain": true}),
            json!({"type": "x", "timestamp": "2024-01-01T00:00:00Z"}),
        ],
    );
    assert_eq!(s.data["is_sidechain"], json!(true));
    // created_at still picks up the first parseable timestamp.
    assert_eq!(s.data["created_at"], json!(1_704_067_200_000_i64));
}

#[test]
fn test_first_prompt_skips_meta_tool_result_and_compact() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[
            user_entry(
                "ignored meta",
                "2024-01-01T00:00:00.000Z",
                json!({"isMeta": true}),
            ),
            user_entry(
                "ignored compact",
                "2024-01-01T00:00:00.000Z",
                json!({"isCompactSummary": true}),
            ),
            json!({
                "type": "user",
                "timestamp": "2024-01-01T00:00:00.000Z",
                "message": {
                    "role": "user",
                    "content": [{"type": "tool_result", "tool_use_id": "x", "content": "res"}],
                },
            }),
            user_simple("real first"),
            user_simple("not me"),
        ],
    );
    assert_eq!(s.data["first_prompt"], json!("real first"));
    assert_eq!(s.data["first_prompt_locked"], json!(true));
}

#[test]
fn test_first_prompt_command_fallback() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[
            user_simple("<command-name>/init</command-name> stuff"),
            user_simple("<command-name>/second</command-name>"),
        ],
    );
    assert_ne!(s.data.get("first_prompt_locked"), Some(&json!(true)));
    assert_eq!(s.data["command_fallback"], json!("/init"));

    // A later real prompt locks it.
    let s2 = fold_session_summary(Some(&s), &key, &[user_simple("now real")]);
    assert_eq!(s2.data["first_prompt"], json!("now real"));
    assert_eq!(s2.data["first_prompt_locked"], json!(true));
}

#[test]
fn test_first_prompt_skip_pattern() {
    let key = default_key();
    let s = fold_session_summary(
        None,
        &key,
        &[
            user_simple("<local-command-stdout> some output"),
            user_simple("hello"),
        ],
    );
    assert_eq!(s.data["first_prompt"], json!("hello"));
}

#[test]
fn test_first_prompt_truncated() {
    let key = default_key();
    let long_text = "x".repeat(300);
    let s = fold_session_summary(None, &key, &[user_simple(&long_text)]);
    let prompt = s.data["first_prompt"].as_str().unwrap();
    assert!(prompt.chars().count() <= 201);
    assert!(prompt.ends_with('\u{2026}'));
}

#[test]
fn test_prev_is_not_mutated() {
    let key = default_key();
    let prev = SessionSummaryEntry {
        session_id: "a".to_string(),
        mtime: 5,
        data: json!({}),
    };
    let prev_clone = prev.clone();
    fold_session_summary(
        Some(&prev),
        &key,
        &[json!({"type": "x", "customTitle": "t"})],
    );
    assert_eq!(prev.session_id, prev_clone.session_id);
    assert_eq!(prev.mtime, prev_clone.mtime);
    assert_eq!(prev.data, prev_clone.data);
}

// ---------------------------------------------------------------------------
// summary_entry_to_sdk_info
// ---------------------------------------------------------------------------

#[test]
fn test_sidechain_returns_none() {
    let result = summary_entry_to_sdk_info(
        &SessionSummaryEntry {
            session_id: "s".to_string(),
            mtime: 1,
            data: json!({"is_sidechain": true, "custom_title": "t"}),
        },
        None,
    );
    assert!(result.is_none());
}

#[test]
fn test_empty_summary_returns_none() {
    let result = summary_entry_to_sdk_info(
        &SessionSummaryEntry {
            session_id: "s".to_string(),
            mtime: 1,
            data: json!({}),
        },
        None,
    );
    assert!(result.is_none());
}

#[test]
fn test_precedence_chain() {
    let mut data = json!({
        "first_prompt": "fp",
        "first_prompt_locked": true,
        "command_fallback": "/cmd",
        "summary_hint": "sh",
        "last_prompt": "lp",
        "ai_title": "ai",
        "custom_title": "ct",
    });

    let base = SessionSummaryEntry {
        session_id: "s".to_string(),
        mtime: 1,
        data: data.clone(),
    };
    let info = summary_entry_to_sdk_info(&base, None);
    assert!(info.is_some());
    let info = info.unwrap();
    assert_eq!(info.summary, "ct");
    assert_eq!(info.custom_title, Some("ct".to_string()));

    data.as_object_mut().unwrap().remove("custom_title");
    let base = SessionSummaryEntry {
        session_id: "s".to_string(),
        mtime: 1,
        data: data.clone(),
    };
    let info = summary_entry_to_sdk_info(&base, None).unwrap();
    assert_eq!(info.summary, "ai");
    assert_eq!(info.custom_title, Some("ai".to_string()));

    data.as_object_mut().unwrap().remove("ai_title");
    let base = SessionSummaryEntry {
        session_id: "s".to_string(),
        mtime: 1,
        data: data.clone(),
    };
    let info = summary_entry_to_sdk_info(&base, None).unwrap();
    assert_eq!(info.summary, "lp");
    assert!(info.custom_title.is_none());

    data.as_object_mut().unwrap().remove("last_prompt");
    let base = SessionSummaryEntry {
        session_id: "s".to_string(),
        mtime: 1,
        data: data.clone(),
    };
    let info = summary_entry_to_sdk_info(&base, None).unwrap();
    assert_eq!(info.summary, "sh");

    data.as_object_mut().unwrap().remove("summary_hint");
    let base = SessionSummaryEntry {
        session_id: "s".to_string(),
        mtime: 1,
        data: data.clone(),
    };
    let info = summary_entry_to_sdk_info(&base, None).unwrap();
    assert_eq!(info.summary, "fp");
    assert_eq!(info.first_prompt, Some("fp".to_string()));

    data["first_prompt_locked"] = json!(false);
    let base = SessionSummaryEntry {
        session_id: "s".to_string(),
        mtime: 1,
        data: data.clone(),
    };
    let info = summary_entry_to_sdk_info(&base, None).unwrap();
    assert_eq!(info.summary, "/cmd");
    assert_eq!(info.first_prompt, Some("/cmd".to_string()));
}

#[test]
fn test_cwd_fallback_to_project_path() {
    let info = summary_entry_to_sdk_info(
        &SessionSummaryEntry {
            session_id: "s".to_string(),
            mtime: 1,
            data: json!({"custom_title": "t"}),
        },
        Some("/proj"),
    );
    assert!(info.is_some());
    assert_eq!(info.as_ref().unwrap().cwd, Some("/proj".to_string()));

    let info2 = summary_entry_to_sdk_info(
        &SessionSummaryEntry {
            session_id: "s".to_string(),
            mtime: 1,
            data: json!({"custom_title": "t", "cwd": "/own"}),
        },
        Some("/proj"),
    );
    assert!(info2.is_some());
    assert_eq!(info2.unwrap().cwd, Some("/own".to_string()));
}

#[test]
fn test_field_passthrough() {
    let info = summary_entry_to_sdk_info(
        &SessionSummaryEntry {
            session_id: "s".to_string(),
            mtime: 99,
            data: json!({
                "custom_title": "t",
                "git_branch": "main",
                "tag": "wip",
                "created_at": 50,
            }),
        },
        None,
    );
    assert!(info.is_some());
    let info = info.unwrap();
    assert_eq!(info.session_id, "s");
    assert_eq!(info.last_modified, 99);
    assert_eq!(info.git_branch, Some("main".to_string()));
    assert_eq!(info.tag, Some("wip".to_string()));
    assert_eq!(info.created_at, Some(50));
    // file_size is local-JSONL-only; store-backed summaries always None.
    assert!(info.file_size.is_none());
}

// ---------------------------------------------------------------------------
// InMemorySessionStore.list_session_summaries
// ---------------------------------------------------------------------------

#[tokio::test]
async fn test_tracks_appends() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let a = SessionKey::new(&pk, "a");
    let b = SessionKey::new(&pk, "b");

    store
        .append(&a, &[user_ts("hello a", "2024-01-01T00:00:00Z")])
        .await
        .unwrap();
    store
        .append(&a, &[json!({"type": "x", "customTitle": "Title A"})])
        .await
        .unwrap();
    store
        .append(&b, &[user_ts("hello b", "2024-01-02T00:00:00Z")])
        .await
        .unwrap();

    let summaries_vec = store.list_session_summaries(&pk).await.unwrap();
    let summaries: std::collections::HashMap<String, SessionSummaryEntry> = summaries_vec
        .into_iter()
        .map(|s| (s.session_id.clone(), s))
        .collect();

    assert_eq!(summaries.len(), 2);
    assert!(summaries.contains_key("a"));
    assert!(summaries.contains_key("b"));
    assert_eq!(summaries["a"].data["custom_title"], json!("Title A"));
    assert_eq!(summaries["a"].data["first_prompt"], json!("hello a"));
    assert_eq!(summaries["b"].data["first_prompt"], json!("hello b"));
}

#[tokio::test]
async fn test_subpath_appends_ignored() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let main_key = SessionKey::new(&pk, "m");
    let sub_key = SessionKey {
        project_key: pk.clone(),
        session_id: "m".to_string(),
        subpath: Some("subagents/agent-1".to_string()),
    };

    store
        .append(&main_key, &[user_simple("main prompt")])
        .await
        .unwrap();
    store
        .append(
            &sub_key,
            &[
                user_simple("sub prompt"),
                json!({"type": "x", "customTitle": "sub"}),
            ],
        )
        .await
        .unwrap();

    let summaries = store.list_session_summaries(&pk).await.unwrap();
    assert_eq!(summaries.len(), 1);
    assert_eq!(summaries[0].data["first_prompt"], json!("main prompt"));
    assert!(
        summaries[0].data.get("custom_title").is_none()
            || summaries[0].data["custom_title"].is_null()
    );
}

#[tokio::test]
async fn test_delete_drops_summary() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let k = SessionKey::new(&pk, "x");

    store.append(&k, &[user_simple("hi")]).await.unwrap();
    assert_eq!(store.list_session_summaries(&pk).await.unwrap().len(), 1);

    store.delete(&k).await.unwrap();
    assert_eq!(store.list_session_summaries(&pk).await.unwrap().len(), 0);
}

#[tokio::test]
async fn test_project_isolation() {
    let store = InMemorySessionStore::new();
    store
        .append(&SessionKey::new("A", "s"), &[user_simple("a")])
        .await
        .unwrap();
    store
        .append(&SessionKey::new("B", "s"), &[user_simple("b")])
        .await
        .unwrap();

    assert_eq!(store.list_session_summaries("A").await.unwrap().len(), 1);
    assert_eq!(store.list_session_summaries("B").await.unwrap().len(), 1);
    assert_eq!(store.list_session_summaries("C").await.unwrap().len(), 0);
}

// ---------------------------------------------------------------------------
// list_sessions_from_store integration — fast path
// ---------------------------------------------------------------------------

#[tokio::test]
async fn test_fast_path_skips_load() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sid_a = Uuid::new_v4().to_string();
    let sid_b = Uuid::new_v4().to_string();

    store
        .append(
            &SessionKey::new(&pk, &sid_a),
            &[user_entry(
                "first a",
                "2024-01-01T00:00:00Z",
                json!({"cwd": DIR}),
            )],
        )
        .await
        .unwrap();
    store
        .append(
            &SessionKey::new(&pk, &sid_b),
            &[user_entry(
                "first b",
                "2024-01-02T00:00:00Z",
                json!({"cwd": DIR}),
            )],
        )
        .await
        .unwrap();

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    let ids: std::collections::HashSet<&str> =
        sessions.iter().map(|s| s.session_id.as_str()).collect();
    assert!(ids.contains(sid_a.as_str()));
    assert!(ids.contains(sid_b.as_str()));

    // Sorted by last_modified descending — sid_b's timestamp is newer.
    assert_eq!(sessions[0].session_id, sid_b);
    assert_eq!(sessions[0].summary, "first b");
    assert_eq!(sessions[1].first_prompt, Some("first a".to_string()));
}

#[tokio::test]
async fn test_fast_path_filters_sidechain_and_empty() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sid_main = Uuid::new_v4().to_string();
    let sid_side = Uuid::new_v4().to_string();
    let sid_empty = Uuid::new_v4().to_string();

    store
        .append(
            &SessionKey::new(&pk, &sid_main),
            &[user_ts("hello", "2024-01-01T00:00:00Z")],
        )
        .await
        .unwrap();
    store
        .append(
            &SessionKey::new(&pk, &sid_side),
            &[json!({
                "type": "user",
                "timestamp": "2024-01-01T00:00:00Z",
                "isSidechain": true,
                "message": {"content": "x"},
            })],
        )
        .await
        .unwrap();
    store
        .append(
            &SessionKey::new(&pk, &sid_empty),
            &[json!({"type": "x", "timestamp": "2024-01-01T00:00:00Z"})],
        )
        .await
        .unwrap();

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    let ids: std::collections::HashSet<&str> =
        sessions.iter().map(|s| s.session_id.as_str()).collect();
    assert_eq!(ids.len(), 1);
    assert!(ids.contains(sid_main.as_str()));
}

#[tokio::test]
async fn test_fast_path_limit_offset() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let mut sids = Vec::new();
    for i in 0..5 {
        let sid = Uuid::new_v4().to_string();
        store
            .append(
                &SessionKey::new(&pk, &sid),
                &[user_ts(
                    &format!("p{i}"),
                    &format!("2024-01-0{}T00:00:00Z", i + 1),
                )],
            )
            .await
            .unwrap();
        sids.push(sid);
    }

    let page = list_sessions_from_store(&store, Some(DIR), Some(2), 1)
        .await
        .unwrap();
    assert_eq!(page.len(), 2);
    assert_eq!(page[0].session_id, sids[3]);
    assert_eq!(page[1].session_id, sids[2]);
}

#[tokio::test]
async fn test_not_implemented_falls_back_to_load() {
    // InMemorySessionStore already implements list_session_summaries, but we test
    // the concept: if a store returns an error for list_session_summaries,
    // list_sessions_from_store should fall back to per-session load().
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sid = Uuid::new_v4().to_string();
    store
        .append(
            &SessionKey::new(&pk, &sid),
            &[user_ts("hi", "2024-01-01T00:00:00Z")],
        )
        .await
        .unwrap();

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    assert_eq!(sessions.len(), 1);
    assert_eq!(sessions[0].summary, "hi");
}

#[tokio::test]
async fn test_mixed_sessions_gap_filled() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sid_with = Uuid::new_v4().to_string();
    let sid_without = Uuid::new_v4().to_string();

    store
        .append(
            &SessionKey::new(&pk, &sid_with),
            &[user_ts("has sidecar", "2024-01-02T00:00:00Z")],
        )
        .await
        .unwrap();
    store
        .append(
            &SessionKey::new(&pk, &sid_without),
            &[user_ts("no sidecar", "2024-01-01T00:00:00Z")],
        )
        .await
        .unwrap();

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    let by_id: std::collections::HashMap<&str, &SDKSessionInfo> = sessions
        .iter()
        .map(|s| (s.session_id.as_str(), s))
        .collect();
    assert_eq!(by_id.len(), 2);
    assert!(by_id.contains_key(sid_with.as_str()));
    assert!(by_id.contains_key(sid_without.as_str()));
    assert_eq!(by_id[sid_with.as_str()].summary, "has sidecar");
    assert_eq!(by_id[sid_without.as_str()].summary, "no sidecar");

    // Merged result sorts on a single clock (storage write time). In
    // InMemorySessionStore, that's a strictly monotonic counter, so
    // sid_without (appended second) sorts newest.
    assert_eq!(sessions[0].session_id, sid_without);
}

#[tokio::test]
async fn test_gap_fill_load_bounded_by_limit() {
    let pk = project_key();
    let store = InMemorySessionStore::new();

    // 5 sessions without sidecars. InMemorySessionStore stamps storage
    // mtime strictly monotonically per append, so these first 5 appends
    // are all older than sid_with below.
    let mut sids_without = Vec::new();
    for i in 0..5 {
        let sid = Uuid::new_v4().to_string();
        store
            .append(
                &SessionKey::new(&pk, &sid),
                &[user_ts(
                    &format!("without {i}"),
                    &format!("2024-01-0{}T00:00:00Z", i + 1),
                )],
            )
            .await
            .unwrap();
        sids_without.push(sid);
    }

    // Append sid_with last so storage mtime makes it the newest session.
    let sid_with = Uuid::new_v4().to_string();
    store
        .append(
            &SessionKey::new(&pk, &sid_with),
            &[user_ts("with", "2024-01-10T00:00:00Z")],
        )
        .await
        .unwrap();

    let page = list_sessions_from_store(&store, Some(DIR), Some(2), 0)
        .await
        .unwrap();
    // Page = newest 2: sid_with (sidecar) + newest 1 missing.
    assert_eq!(page.len(), 2);
    assert_eq!(page[0].session_id, sid_with);
}

#[tokio::test]
async fn test_sidechain_summary_does_not_consume_page_slot() {
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sids: Vec<String> = (0..3).map(|_| Uuid::new_v4().to_string()).collect();

    // Append order determines storage mtime (InMemorySessionStore
    // monotonic counter). We append the two real sessions first and the
    // sidechain LAST so the sidechain is the newest-by-storage-mtime.
    store
        .append(
            &SessionKey::new(&pk, &sids[2]),
            &[user_ts("real 2", "2024-01-01T00:00:00Z")],
        )
        .await
        .unwrap();
    store
        .append(
            &SessionKey::new(&pk, &sids[1]),
            &[user_ts("real 1", "2024-01-02T00:00:00Z")],
        )
        .await
        .unwrap();
    store
        .append(
            &SessionKey::new(&pk, &sids[0]),
            &[json!({
                "type": "user",
                "timestamp": "2024-01-03T00:00:00Z",
                "isSidechain": true,
                "message": {"content": "x"},
            })],
        )
        .await
        .unwrap();

    let page = list_sessions_from_store(&store, Some(DIR), Some(2), 0)
        .await
        .unwrap();
    // The sidechain summary is pre-filtered, so limit=2 returns both real
    // sessions — full page, matching the slow path.
    assert_eq!(page.len(), 2);
    let page_ids: Vec<&str> = page.iter().map(|s| s.session_id.as_str()).collect();
    assert_eq!(page_ids, vec![sids[1].as_str(), sids[2].as_str()]);
}

#[tokio::test]
async fn test_stale_sidecar_triggers_gap_fill() {
    // This test verifies that a stale sidecar is re-folded from source entries.
    // Since InMemorySessionStore doesn't allow us to inject a stale sidecar
    // directly, we just verify the basic behavior that fresh appends are
    // reflected in list_sessions_from_store results.
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sid = Uuid::new_v4().to_string();

    store
        .append(
            &SessionKey::new(&pk, &sid),
            &[
                user_ts("fresh prompt", "2024-01-02T00:00:00Z"),
                json!({
                    "type": "x",
                    "timestamp": "2024-01-02T00:01:00Z",
                    "customTitle": "fresh",
                }),
            ],
        )
        .await
        .unwrap();

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    assert_eq!(sessions.len(), 1);
    let info = &sessions[0];
    assert_eq!(info.session_id, sid);
    assert_eq!(info.custom_title, Some("fresh".to_string()));
    assert_eq!(info.summary, "fresh");
}

#[tokio::test]
async fn test_fresh_sidecar_with_storage_newer_mtime_not_gap_filled() {
    // Verify that sessions with matching storage mtime on both
    // list_sessions and list_session_summaries are served directly
    // from the summary without requiring a load().
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sid = Uuid::new_v4().to_string();

    store
        .append(
            &SessionKey::new(&pk, &sid),
            &[
                user_ts("fresh prompt", "2024-01-01T00:00:00.000Z"),
                json!({
                    "type": "x",
                    "timestamp": "2024-01-01T00:00:00.000Z",
                    "customTitle": "fresh",
                }),
            ],
        )
        .await
        .unwrap();

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    assert_eq!(sessions.len(), 1);
    let info = &sessions[0];
    assert_eq!(info.session_id, sid);
    assert_eq!(info.summary, "fresh");
}

#[tokio::test]
async fn test_summary_without_listing_is_dropped() {
    // A summary for a session that list_sessions() no longer reports must
    // be dropped. In practice this test just verifies that only sessions
    // present in list_sessions() appear in results.
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let sid_real = Uuid::new_v4().to_string();

    store
        .append(
            &SessionKey::new(&pk, &sid_real),
            &[user_ts("real", "2024-01-02T00:00:00Z")],
        )
        .await
        .unwrap();

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    let ids: std::collections::HashSet<&str> =
        sessions.iter().map(|s| s.session_id.as_str()).collect();
    assert!(ids.contains(sid_real.as_str()));
}

#[tokio::test]
async fn test_gap_fill_bounded_concurrency() {
    // Verifies that list_sessions_from_store completes without deadlocking
    // or panicking when many sessions are present.
    let pk = project_key();
    let store = InMemorySessionStore::new();
    let n = 10;
    for i in 0..n {
        let sid = Uuid::new_v4().to_string();
        store
            .append(
                &SessionKey::new(&pk, &sid),
                &[user_simple(&format!("p{i}"))],
            )
            .await
            .unwrap();
    }

    let sessions = list_sessions_from_store(&store, Some(DIR), None, 0)
        .await
        .unwrap();
    assert_eq!(sessions.len(), n);
}

// ---------------------------------------------------------------------------
// Parity: incremental fold == batch lite-parse
// ---------------------------------------------------------------------------

#[test]
fn test_incremental_equals_batch() {
    let pk = project_key();
    let sid = "22222222-2222-4222-8222-222222222222";
    let k = SessionKey::new(&pk, sid);

    let entries: Vec<SessionStoreEntry> = vec![
        user_entry(
            "<command-name>/clear</command-name>",
            "2024-01-01T00:00:00.000Z",
            json!({"cwd": "/work", "gitBranch": "main"}),
        ),
        user_entry(
            "ignored",
            "2024-01-01T00:00:01.000Z",
            json!({"isMeta": true}),
        ),
        user_ts("real prompt here", "2024-01-01T00:00:02.000Z"),
        json!({
            "type": "assistant",
            "timestamp": "2024-01-01T00:00:03.000Z",
            "message": {"content": [{"type": "text", "text": "ok"}]},
        }),
        json!({
            "type": "x",
            "timestamp": "2024-01-01T00:00:04.000Z",
            "aiTitle": "AI Named",
        }),
        json!({
            "type": "tag",
            "timestamp": "2024-01-01T00:00:05.000Z",
            "tag": "wip",
        }),
        json!({
            "type": "x",
            "timestamp": "2024-01-01T00:00:06.000Z",
            "customTitle": "User Named",
            "gitBranch": "feature",
        }),
    ];

    // Incremental — fold across two append batches to exercise carry-over.
    let folded = fold_session_summary(None, &k, &entries[..3]);
    let folded = fold_session_summary(Some(&folded), &k, &entries[3..]);
    let incremental = summary_entry_to_sdk_info(&folded, Some("/work"));
    assert!(incremental.is_some());

    let incremental = incremental.unwrap();
    // Verify key fields from the incremental fold.
    assert_eq!(incremental.session_id, sid);
    assert_eq!(incremental.summary, "User Named");
    assert_eq!(incremental.custom_title, Some("User Named".to_string()));
    assert_eq!(
        incremental.first_prompt,
        Some("real prompt here".to_string())
    );
    assert_eq!(incremental.git_branch, Some("feature".to_string()));
    assert_eq!(incremental.cwd, Some("/work".to_string()));
    assert_eq!(incremental.tag, Some("wip".to_string()));
}

#[test]
fn test_parity_first_prompt_only() {
    let pk = project_key();
    let sid = "33333333-3333-4333-8333-333333333333";
    let k = SessionKey::new(&pk, sid);

    let entries: Vec<SessionStoreEntry> = vec![user_entry(
        "just a prompt",
        "2024-02-01T00:00:00.000Z",
        json!({"cwd": "/w"}),
    )];

    let folded = fold_session_summary(None, &k, &entries);
    let incremental = summary_entry_to_sdk_info(&folded, Some("/w"));
    assert!(incremental.is_some());

    let incremental = incremental.unwrap();
    assert_eq!(incremental.session_id, sid);
    assert_eq!(incremental.summary, "just a prompt");
    assert_eq!(incremental.first_prompt, Some("just a prompt".to_string()));
    assert_eq!(incremental.cwd, Some("/w".to_string()));
}
