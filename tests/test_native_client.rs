//! `ClaudeSDKClient::with_native_transport()`: o transporte nativo montado
//! dentro do `connect`, com a materialização do resume a partir do
//! `session_store` (o `materialize_resume_session` do SDK Python), e o
//! atendimento de `control_request` em paralelo com a leitura (o
//! `start_soon` do SDK Python). Contra um MockApi local.

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::Mutex;

use rust_agent_sdk::{
    project_key_for_directory, ClaudeAgentOptions, ClaudeSDKClient, InMemorySessionStore, Message,
    PermissionResult, PermissionResultAllow, SessionKey, SessionStore, ToolsConfig,
};

struct MockApi {
    addr: String,
    requests: Arc<Mutex<Vec<Value>>>,
}

impl MockApi {
    async fn start(script: Vec<String>) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").await.expect("bind");
        let addr = format!("http://{}", listener.local_addr().expect("addr"));
        let requests: Arc<Mutex<Vec<Value>>> = Arc::new(Mutex::new(Vec::new()));
        let captured = Arc::clone(&requests);
        tokio::spawn(async move {
            let mut served = 0usize;
            loop {
                let Ok((mut socket, _)) = listener.accept().await else {
                    return;
                };
                if let Some(body) = read_body(&mut socket).await {
                    captured.lock().await.push(body);
                }
                let sse = script[served.min(script.len() - 1)].clone();
                served += 1;
                let response = format!(
                    "HTTP/1.1 200 OK\r\ncontent-type: text/event-stream\r\nconnection: close\r\n\r\n{sse}"
                );
                let _ = socket.write_all(response.as_bytes()).await;
                let _ = socket.shutdown().await;
            }
        });
        Self { addr, requests }
    }
}

async fn read_body(socket: &mut tokio::net::TcpStream) -> Option<Value> {
    let mut buf = Vec::new();
    let mut chunk = [0u8; 4096];
    loop {
        let n = socket.read(&mut chunk).await.ok()?;
        if n == 0 {
            return None;
        }
        buf.extend_from_slice(&chunk[..n]);
        if let Some(end) = buf.windows(4).position(|w| w == b"\r\n\r\n") {
            let headers = String::from_utf8_lossy(&buf[..end]).to_lowercase();
            let length: usize = headers
                .lines()
                .find_map(|l| l.strip_prefix("content-length:"))
                .and_then(|v| v.trim().parse().ok())
                .unwrap_or(0);
            if buf.len() >= end + 4 + length {
                return serde_json::from_slice(&buf[end + 4..end + 4 + length]).ok();
            }
        }
    }
}

fn sse(events: &[Value]) -> String {
    events
        .iter()
        .map(|e| format!("event: {}\ndata: {e}\n\n", e["type"].as_str().unwrap()))
        .collect()
}

fn sse_text(text: &str) -> String {
    sse(&[
        json!({"type":"message_start","message":{"id":"msg_t","model":"mock-model","role":"assistant","usage":{"input_tokens":10,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":text}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":5}}),
        json!({"type":"message_stop"}),
    ])
}

fn sse_write_call(path: &std::path::Path) -> String {
    let input = json!({"file_path": path.display().to_string(), "content": "oi\n"}).to_string();
    sse(&[
        json!({"type":"message_start","message":{"id":"msg_w","model":"mock-model","role":"assistant","usage":{"input_tokens":20,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":"toolu_w","name":"Write"}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":input}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"output_tokens":8}}),
        json!({"type":"message_stop"}),
    ])
}

fn env(api: &MockApi, config_dir: &std::path::Path) -> HashMap<String, String> {
    HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.display().to_string(),
        ),
    ])
}

/// Com `resume` e `session_store`, a sessão sai do store (e não do disco
/// local, que não tem nada dela) e o histórico chega ao modelo.
#[tokio::test]
async fn resume_is_materialized_from_the_session_store() {
    let api = MockApi::start(vec![sse_text("de novo")]).await;
    let config_dir = tempfile::tempdir().unwrap();
    let cwd = tempfile::tempdir().unwrap();
    let cwd_str = cwd.path().display().to_string();
    let session_id = "5b2e1f3a-8c4d-4e6f-9a1b-2c3d4e5f6a7b";
    let store = InMemorySessionStore::new();
    let key = SessionKey::new(
        project_key_for_directory(Some(&cwd_str)).unwrap(),
        session_id,
    );
    let entries = vec![
        json!({"type":"user","uuid":"11111111-1111-4111-8111-111111111111","parentUuid":null,"sessionId":session_id,"cwd":cwd_str,"timestamp":"2026-09-23T10:00:00.000Z","isSidechain":false,"userType":"external","version":"2.1.90","message":{"role":"user","content":"lembra da palavra ornitorrinco"}}),
        json!({"type":"assistant","uuid":"22222222-2222-4222-8222-222222222222","parentUuid":"11111111-1111-4111-8111-111111111111","sessionId":session_id,"cwd":cwd_str,"timestamp":"2026-09-23T10:00:01.000Z","isSidechain":false,"userType":"external","version":"2.1.90","message":{"id":"msg_old","type":"message","role":"assistant","model":"mock-model","content":[{"type":"text","text":"Lembrarei."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":1,"output_tokens":1}}}),
    ];
    store.append(&key, &entries).await.unwrap();

    let options = ClaudeAgentOptions {
        env: env(&api, config_dir.path()),
        cwd: Some(cwd.path().to_path_buf()),
        tools: Some(ToolsConfig::List(Vec::new())),
        resume: Some(session_id.to_string()),
        session_store: Some(Box::new(store)),
        ..Default::default()
    };
    let mut client = ClaudeSDKClient::new(options).with_native_transport();
    client.connect().await.expect("connect");
    client.query("qual era a palavra?").await.unwrap();
    let messages = client.receive_response().await.unwrap();
    client.disconnect().await.unwrap();

    let result = messages
        .iter()
        .find_map(|m| match m {
            Message::Result(r) => Some(r.clone()),
            _ => None,
        })
        .expect("result");
    assert_eq!(result.session_id, session_id);
    let body = api.requests.lock().await.last().cloned().unwrap();
    let history = body["messages"].to_string();
    assert!(
        history.contains("ornitorrinco") && history.contains("Lembrarei."),
        "{history}"
    );
    // O config dir de verdade não ganhou a sessão: ela vive no diretório
    // temporário da materialização (apagado no disconnect) e no store.
    let local = config_dir.path().join("projects");
    let found = walk(&local)
        .iter()
        .any(|p| p.ends_with(format!("{session_id}.jsonl")));
    assert!(!found, "a retomada gravou no config dir local");
}

fn walk(dir: &std::path::Path) -> Vec<std::path::PathBuf> {
    let mut out = Vec::new();
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                out.extend(walk(&path));
            } else {
                out.push(path);
            }
        }
    }
    out
}

/// Enquanto um `can_use_tool` espera (o usuário pensando num formulário), a
/// leitura segue: um `set_model` pelo handle recebe a resposta na hora, em
/// vez de esperar o callback terminar.
#[tokio::test]
async fn control_requests_are_answered_while_a_permission_callback_waits() {
    let cwd = tempfile::tempdir().unwrap();
    let target = cwd.path().join("depois.txt");
    let api = MockApi::start(vec![sse_write_call(&target), sse_text("feito")]).await;
    let config_dir = tempfile::tempdir().unwrap();
    let asked = Arc::new(tokio::sync::Notify::new());
    let release = Arc::new(tokio::sync::Notify::new());
    let (asked_cb, release_cb) = (Arc::clone(&asked), Arc::clone(&release));
    let callback: rust_agent_sdk::CanUseToolFn = Arc::new(move |_name, _input, _ctx| {
        let (asked, release) = (Arc::clone(&asked_cb), Arc::clone(&release_cb));
        Box::pin(async move {
            asked.notify_one();
            release.notified().await;
            PermissionResult::Allow(PermissionResultAllow::default())
        })
    });
    let options = ClaudeAgentOptions {
        env: env(&api, config_dir.path()),
        cwd: Some(cwd.path().to_path_buf()),
        tools: Some(ToolsConfig::List(vec!["Write".into()])),
        can_use_tool: Some(callback),
        ..Default::default()
    };
    let mut client = ClaudeSDKClient::new(options).with_native_transport();
    client.connect().await.expect("connect");
    let handle = client.handle().expect("handle");
    let controller = tokio::spawn(async move {
        asked.notified().await;
        let answered =
            tokio::time::timeout(Duration::from_secs(5), handle.set_model(Some("outro"))).await;
        release.notify_one();
        answered
    });
    client.query("escreva").await.unwrap();
    let messages = tokio::time::timeout(Duration::from_secs(30), client.receive_response())
        .await
        .expect("turno terminou")
        .unwrap();
    let answered = controller.await.unwrap();
    client.disconnect().await.unwrap();
    assert!(
        matches!(answered, Ok(Ok(()))),
        "set_model esperou o callback: {answered:?}"
    );
    assert!(target.exists());
    assert!(messages
        .iter()
        .any(|m| matches!(m, Message::Result(r) if r.subtype == "success")));
}
