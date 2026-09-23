//! Utilitários de teste para quem escreve extensões da crate.
//!
//! Porte de `claude_agent_sdk.testing` do SDK Python. As asserções usam
//! `assert!` puro, então o harness roda em qualquer runner de teste.

use std::future::Future;

use serde_json::{json, Value};

use crate::internal::session_summary::fold_session_summary;
use crate::types::{SessionKey, SessionListSubkeysKey, SessionStore};

/// Métodos opcionais de um [`SessionStore`] que o harness sabe pular.
const OPTIONAL_METHODS: [&str; 4] = [
    "list_sessions",
    "list_session_summaries",
    "delete",
    "list_subkeys",
];

/// Entrada de teste que satisfaz `SessionStoreEntry` (o `type` é obrigatório;
/// o valor dele é irrelevante para os contratos, que tratam a entrada como
/// blob opaco).
fn e(fields: Value) -> Value {
    let mut entry = serde_json::Map::new();
    entry.insert("type".to_string(), json!("x"));
    if let Value::Object(map) = fields {
        for (k, v) in map {
            entry.insert(k, v);
        }
    }
    Value::Object(entry)
}

fn key(project_key: &str, session_id: &str) -> SessionKey {
    SessionKey::new(project_key, session_id)
}

fn sub_key(project_key: &str, session_id: &str, subpath: &str) -> SessionKey {
    SessionKey {
        project_key: project_key.to_string(),
        session_id: session_id.to_string(),
        subpath: Some(subpath.to_string()),
    }
}

fn subkeys_key(project_key: &str, session_id: &str) -> SessionListSubkeysKey {
    SessionListSubkeysKey {
        project_key: project_key.to_string(),
        session_id: session_id.to_string(),
    }
}

/// Afirma os 14 contratos de comportamento de um [`SessionStore`], como o
/// `run_session_store_conformance` do SDK Python.
///
/// `make_store` é chamado uma vez por contrato, para isolar um do outro. Os
/// contratos dos métodos opcionais (`list_sessions`, `list_session_summaries`,
/// `delete`, `list_subkeys`) são pulados quando o nome está em
/// `skip_optional` ou quando o store não os implementa (`has_*` falso).
///
/// Um store com falha de backend faz o harness entrar em pânico com a
/// mensagem do erro: é teste, e a falha precisa aparecer.
pub async fn run_session_store_conformance<F, Fut, S>(make_store: F, skip_optional: &[&str])
where
    F: Fn() -> Fut,
    Fut: Future<Output = S>,
    S: SessionStore,
{
    let invalid: Vec<&&str> = skip_optional
        .iter()
        .filter(|m| !OPTIONAL_METHODS.contains(m))
        .collect();
    assert!(
        invalid.is_empty(),
        "unknown optional methods in skip_optional: {invalid:?}"
    );
    let skipped = |m: &str| skip_optional.contains(&m);

    let probe = make_store().await;
    let has_list_sessions = probe.has_list_sessions() && !skipped("list_sessions");
    let has_list_summaries =
        probe.has_list_session_summaries() && !skipped("list_session_summaries");
    let has_delete = probe.has_delete() && !skipped("delete");
    let has_list_subkeys = probe.has_list_subkeys() && !skipped("list_subkeys");
    drop(probe);

    let main = key("proj", "sess");

    // --- Obrigatórios: append + load ---------------------------------------

    // 1. append e load devolvem as mesmas entradas na mesma ordem. O contrato é
    // igualdade profunda, nunca byte a byte (JSONB reordena chaves).
    let store = make_store().await;
    store
        .append(
            &main,
            &[
                e(json!({"uuid": "b", "n": 1})),
                e(json!({"uuid": "a", "n": 2})),
            ],
        )
        .await
        .expect("append");
    assert_eq!(
        store.load(&main).await.expect("load"),
        Some(vec![
            e(json!({"uuid": "b", "n": 1})),
            e(json!({"uuid": "a", "n": 2}))
        ])
    );

    // 2. load de chave desconhecida devolve None.
    let store = make_store().await;
    assert_eq!(store.load(&key("proj", "nope")).await.expect("load"), None);
    store
        .append(&main, &[e(json!({"uuid": "x", "n": 1}))])
        .await
        .expect("append");
    assert_eq!(
        store
            .load(&sub_key("proj", "sess", "nope"))
            .await
            .expect("load"),
        None
    );

    // 3. várias chamadas de append preservam a ordem das chamadas.
    let store = make_store().await;
    store
        .append(&main, &[e(json!({"uuid": "z", "n": 1}))])
        .await
        .expect("append");
    store
        .append(
            &main,
            &[
                e(json!({"uuid": "a", "n": 2})),
                e(json!({"uuid": "m", "n": 3})),
            ],
        )
        .await
        .expect("append");
    store
        .append(&main, &[e(json!({"uuid": "b", "n": 4}))])
        .await
        .expect("append");
    assert_eq!(
        store.load(&main).await.expect("load"),
        Some(vec![
            e(json!({"uuid": "z", "n": 1})),
            e(json!({"uuid": "a", "n": 2})),
            e(json!({"uuid": "m", "n": 3})),
            e(json!({"uuid": "b", "n": 4})),
        ])
    );

    // 4. append([]) não faz nada.
    let store = make_store().await;
    store
        .append(&main, &[e(json!({"uuid": "a", "n": 1}))])
        .await
        .expect("append");
    store.append(&main, &[]).await.expect("append");
    assert_eq!(
        store.load(&main).await.expect("load"),
        Some(vec![e(json!({"uuid": "a", "n": 1}))])
    );

    // 5. subpath é guardado à parte do transcript principal.
    let store = make_store().await;
    let sub = sub_key("proj", "sess", "subagents/agent-1");
    store
        .append(&main, &[e(json!({"uuid": "m", "n": 1}))])
        .await
        .expect("append");
    store
        .append(&sub, &[e(json!({"uuid": "s", "n": 1}))])
        .await
        .expect("append");
    assert_eq!(
        store.load(&main).await.expect("load"),
        Some(vec![e(json!({"uuid": "m", "n": 1}))])
    );
    assert_eq!(
        store.load(&sub).await.expect("load"),
        Some(vec![e(json!({"uuid": "s", "n": 1}))])
    );

    // 6. isolamento por project_key.
    let store = make_store().await;
    store
        .append(&key("A", "s1"), &[e(json!({"from": "A"}))])
        .await
        .expect("append");
    store
        .append(&key("B", "s1"), &[e(json!({"from": "B"}))])
        .await
        .expect("append");
    assert_eq!(
        store.load(&key("A", "s1")).await.expect("load"),
        Some(vec![e(json!({"from": "A"}))])
    );
    assert_eq!(
        store.load(&key("B", "s1")).await.expect("load"),
        Some(vec![e(json!({"from": "B"}))])
    );
    if has_list_sessions {
        assert_eq!(store.list_sessions("A").await.expect("list").len(), 1);
        assert_eq!(store.list_sessions("B").await.expect("list").len(), 1);
    }

    // --- Opcional: list_sessions -------------------------------------------

    if has_list_sessions {
        // 7. list_sessions devolve os session_ids do projeto.
        let store = make_store().await;
        store
            .append(&key("proj", "a"), &[e(json!({"n": 1}))])
            .await
            .expect("append");
        store
            .append(&key("proj", "b"), &[e(json!({"n": 1}))])
            .await
            .expect("append");
        store
            .append(&key("other", "c"), &[e(json!({"n": 1}))])
            .await
            .expect("append");
        let sessions = store.list_sessions("proj").await.expect("list");
        let mut ids: Vec<String> = sessions.iter().map(|s| s.session_id.clone()).collect();
        ids.sort();
        assert_eq!(ids, vec!["a".to_string(), "b".to_string()]);
        // mtime em epoch-ms: > 1e12 descarta epoch em segundos.
        assert!(sessions.iter().all(|s| s.mtime > 1_000_000_000_000));
        assert!(store
            .list_sessions("never-appended-project")
            .await
            .expect("list")
            .is_empty());

        // 8. list_sessions não inclui os subpaths de subagente.
        let store = make_store().await;
        store
            .append(&key("proj", "main"), &[e(json!({"n": 1}))])
            .await
            .expect("append");
        store
            .append(
                &sub_key("proj", "main", "subagents/agent-1"),
                &[e(json!({"n": 1}))],
            )
            .await
            .expect("append");
        let ids: Vec<String> = store
            .list_sessions("proj")
            .await
            .expect("list")
            .into_iter()
            .map(|s| s.session_id)
            .collect();
        assert_eq!(ids, vec!["main".to_string()]);
    }

    // --- Opcional: list_session_summaries ----------------------------------

    if has_list_summaries {
        // 14. list_session_summaries devolve a dobra persistida, que volta pela
        // fold_session_summary. O store guarda `data` sem interpretar.
        let store = make_store().await;
        let summ_key = key("proj", "summ-sess");
        store
            .append(
                &summ_key,
                &[
                    e(json!({"timestamp": "2024-01-01T00:00:00.000Z", "customTitle": "first"})),
                    e(json!({"timestamp": "2024-01-01T00:00:01.000Z"})),
                ],
            )
            .await
            .expect("append");
        store
            .append(
                &summ_key,
                &[e(
                    json!({"timestamp": "2024-01-01T00:00:02.000Z", "customTitle": "second"}),
                )],
            )
            .await
            .expect("append");
        store
            .append(
                &key("other", "elsewhere"),
                &[e(json!({"timestamp": "2024-01-01T00:00:00.000Z"}))],
            )
            .await
            .expect("append");
        let summaries = store
            .list_session_summaries("proj")
            .await
            .expect("summaries");
        let ids: Vec<&str> = summaries.iter().map(|s| s.session_id.as_str()).collect();
        assert_eq!(ids, vec!["summ-sess"]);
        let summ = summaries[0].clone();
        assert!(summ.mtime > 1_000_000_000_000);
        if has_list_sessions {
            let listed = store.list_sessions("proj").await.expect("list");
            let ls_mtime = listed
                .iter()
                .find(|s| s.session_id == "summ-sess")
                .map(|s| s.mtime)
                .expect("summ-sess listed");
            assert!(summ.mtime >= ls_mtime);
        }
        assert!(summ.data.is_object());
        let refolded = fold_session_summary(
            Some(&summ),
            &summ_key,
            &[e(json!({"timestamp": "2024-01-01T00:00:03.000Z"}))],
        );
        assert_eq!(refolded.session_id, "summ-sess");
        assert_eq!(refolded.mtime, summ.mtime);
        store
            .append(
                &sub_key("proj", "summ-sess", "subagents/agent-1"),
                &[e(
                    json!({"timestamp": "2024-01-01T00:00:09.000Z", "customTitle": "subagent"}),
                )],
            )
            .await
            .expect("append");
        let after_sub = store
            .list_session_summaries("proj")
            .await
            .expect("summaries");
        let again = after_sub
            .iter()
            .find(|s| s.session_id == "summ-sess")
            .expect("summ-sess");
        assert_eq!(again.data, summ.data);
        assert!(store
            .list_session_summaries("never-appended-project")
            .await
            .expect("summaries")
            .is_empty());
        if has_delete {
            store.delete(&summ_key).await.expect("delete");
            assert!(store
                .list_session_summaries("proj")
                .await
                .expect("summaries")
                .is_empty());
        }
    }

    // --- Opcional: delete --------------------------------------------------

    if has_delete {
        // 9. apagar o principal faz o load devolver None.
        let store = make_store().await;
        store
            .delete(&key("proj", "never-written"))
            .await
            .expect("delete");
        store
            .append(&main, &[e(json!({"n": 1}))])
            .await
            .expect("append");
        store.delete(&main).await.expect("delete");
        assert_eq!(store.load(&main).await.expect("load"), None);

        // 10. apagar o principal apaga em cascata os subkeys.
        let store = make_store().await;
        let sub1 = sub_key("proj", "sess", "subagents/agent-1");
        let sub2 = sub_key("proj", "sess", "subagents/agent-2");
        let other = key("proj", "sess2");
        let other_proj = key("other-proj", "sess");
        for k in [&main, &sub1, &sub2, &other, &other_proj] {
            store
                .append(k, &[e(json!({"n": 1}))])
                .await
                .expect("append");
        }
        store.delete(&main).await.expect("delete");
        assert_eq!(store.load(&main).await.expect("load"), None);
        assert_eq!(store.load(&sub1).await.expect("load"), None);
        assert_eq!(store.load(&sub2).await.expect("load"), None);
        assert_eq!(
            store
                .load(&other)
                .await
                .expect("load")
                .map(|entries| entries.len()),
            Some(1)
        );
        assert_eq!(
            store
                .load(&other_proj)
                .await
                .expect("load")
                .map(|entries| entries.len()),
            Some(1)
        );
        if has_list_subkeys {
            assert!(store
                .list_subkeys(&subkeys_key("proj", "sess"))
                .await
                .expect("subkeys")
                .is_empty());
        }
        if has_list_sessions {
            let listed = store.list_sessions("proj").await.expect("list");
            assert!(!listed.iter().any(|s| s.session_id == "sess"));
        }

        // 11. apagar com subpath remove só aquele subkey.
        let store = make_store().await;
        for k in [&main, &sub1, &sub2] {
            store
                .append(k, &[e(json!({"n": 1}))])
                .await
                .expect("append");
        }
        store.delete(&sub1).await.expect("delete");
        assert_eq!(store.load(&sub1).await.expect("load"), None);
        assert_eq!(
            store
                .load(&sub2)
                .await
                .expect("load")
                .map(|entries| entries.len()),
            Some(1)
        );
        assert_eq!(
            store
                .load(&main)
                .await
                .expect("load")
                .map(|entries| entries.len()),
            Some(1)
        );
        if has_list_subkeys {
            assert_eq!(
                store
                    .list_subkeys(&subkeys_key("proj", "sess"))
                    .await
                    .expect("subkeys"),
                vec!["subagents/agent-2".to_string()]
            );
        }
    }

    // --- Opcional: list_subkeys --------------------------------------------

    if has_list_subkeys {
        // 12. list_subkeys devolve os subpaths.
        let store = make_store().await;
        store
            .append(&main, &[e(json!({"n": 1}))])
            .await
            .expect("append");
        store
            .append(
                &sub_key("proj", "sess", "subagents/agent-1"),
                &[e(json!({"n": 1}))],
            )
            .await
            .expect("append");
        store
            .append(
                &sub_key("proj", "sess", "subagents/agent-2"),
                &[e(json!({"n": 1}))],
            )
            .await
            .expect("append");
        store
            .append(
                &sub_key("proj", "other-sess", "subagents/agent-x"),
                &[e(json!({"n": 1}))],
            )
            .await
            .expect("append");
        let mut subkeys = store
            .list_subkeys(&subkeys_key("proj", "sess"))
            .await
            .expect("subkeys");
        subkeys.sort();
        assert_eq!(
            subkeys,
            vec![
                "subagents/agent-1".to_string(),
                "subagents/agent-2".to_string()
            ]
        );

        // 13. list_subkeys não inclui o transcript principal.
        let store = make_store().await;
        store
            .append(&main, &[e(json!({"n": 1}))])
            .await
            .expect("append");
        assert!(store
            .list_subkeys(&subkeys_key("proj", "sess"))
            .await
            .expect("subkeys")
            .is_empty());
        assert!(store
            .list_subkeys(&subkeys_key("proj", "never-appended"))
            .await
            .expect("subkeys")
            .is_empty());
    }
}

#[cfg(test)]
mod tests {
    use super::run_session_store_conformance;
    use crate::internal::session_store::InMemorySessionStore;

    #[tokio::test]
    async fn o_store_em_memoria_cumpre_os_contratos() {
        run_session_store_conformance(|| async { InMemorySessionStore::new() }, &[]).await;
    }
}
