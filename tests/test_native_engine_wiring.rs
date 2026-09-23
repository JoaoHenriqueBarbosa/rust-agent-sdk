//! O que o motor nativo entrega às tools e ao cliente, conferido no fio:
//! os campos do `can_use_tool` (`createCanUseTool` do CLI), o deny com
//! `interrupt`, as mensagens `isMeta` que o Read anexa (`newMessages`), o
//! conjunto de tools registrado, o `agent_id` do subagente e a chamada de
//! modelo das tools. Tudo roda contra um MockApi local, sem rede nem token.

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::Mutex;

use prana::{ClaudeAgentOptions, NativeApiTransport, PermissionMode, ToolsConfig, Transport};

// ---------------------------------------------------------------------------
// MockApi (o padrão de tests/test_native_parity.rs)
// ---------------------------------------------------------------------------

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
                let body = read_http_request(&mut socket).await;
                if let Some(body) = body {
                    captured.lock().await.push(body);
                }
                let index = served.min(script.len().saturating_sub(1));
                served += 1;
                let response = format!(
                    "HTTP/1.1 200 OK\r\ncontent-type: text/event-stream\r\nconnection: close\r\n\r\n{}",
                    script[index]
                );
                let _ = socket.write_all(response.as_bytes()).await;
                let _ = socket.shutdown().await;
            }
        });
        Self { addr, requests }
    }

    async fn requests(&self) -> Vec<Value> {
        self.requests.lock().await.clone()
    }
}

async fn read_http_request(socket: &mut tokio::net::TcpStream) -> Option<Value> {
    let mut buf = Vec::new();
    let mut chunk = [0u8; 4096];
    loop {
        let n = socket.read(&mut chunk).await.ok()?;
        if n == 0 {
            break;
        }
        buf.extend_from_slice(&chunk[..n]);
        if let Some(header_end) = buf.windows(4).position(|w| w == b"\r\n\r\n") {
            let headers = String::from_utf8_lossy(&buf[..header_end]).to_lowercase();
            let content_length: usize = headers
                .lines()
                .find(|l| l.starts_with("content-length:"))
                .and_then(|l| l.split(':').nth(1))
                .and_then(|v| v.trim().parse().ok())
                .unwrap_or(0);
            let body_start = header_end + 4;
            if buf.len() >= body_start + content_length {
                return serde_json::from_slice(&buf[body_start..body_start + content_length]).ok();
            }
        }
    }
    None
}

fn sse_events(events: &[Value]) -> String {
    events
        .iter()
        .map(|e| {
            let event_name = e["type"].as_str().expect("event type");
            format!("event: {event_name}\ndata: {e}\n\n")
        })
        .collect()
}

fn sse_text(text: &str) -> String {
    sse_events(&[
        json!({"type":"message_start","message":{"id":"msg_text","model":"mock-model","role":"assistant","usage":{"input_tokens":10,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":text}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":5}}),
        json!({"type":"message_stop"}),
    ])
}

fn sse_tool_call(id: &str, tool_name: &str, arguments: &Value) -> String {
    let partial = serde_json::to_string(arguments).expect("args");
    sse_events(&[
        json!({"type":"message_start","message":{"id":"msg_tool","model":"mock-model","role":"assistant","usage":{"input_tokens":20,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":id,"name":tool_name}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":partial}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"output_tokens":8}}),
        json!({"type":"message_stop"}),
    ])
}

/// A resposta da chamada aninhada do WebSearch: a busca já feita pelo
/// servidor e o texto depois.
fn sse_server_web_search(answer: &str) -> String {
    sse_events(&[
        json!({"type":"message_start","message":{"id":"msg_ws","model":"mock-model","role":"assistant","usage":{"input_tokens":30,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"server_tool_use","id":"srvtoolu_1","name":"web_search"}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"{\"query\":\"cotação\"}"}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"content_block_start","index":1,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_1","content":[{"type":"web_search_result","title":"Cotação","url":"https://exemplo","encrypted_content":"AAAA"}]}}),
        json!({"type":"content_block_stop","index":1}),
        json!({"type":"content_block_start","index":2,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":2,"delta":{"type":"text_delta","text":answer}}),
        json!({"type":"content_block_stop","index":2}),
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":12}}),
        json!({"type":"message_stop"}),
    ])
}

// ---------------------------------------------------------------------------
// Sessão crua: o transporte sem o ClaudeSDKClient, para ver os frames e os
// control_request exatamente como saem.
// ---------------------------------------------------------------------------

struct Session {
    transport: NativeApiTransport,
    _config_dir: tempfile::TempDir,
    _cwd: tempfile::TempDir,
}

#[derive(Default)]
struct Spec {
    tools: Option<Vec<String>>,
    permission_mode: Option<PermissionMode>,
    extra_env: Vec<(&'static str, &'static str)>,
}

fn session(spec: Spec, api: &MockApi) -> Session {
    session_in(spec, api, tempfile::tempdir().expect("cwd"))
}

/// A sessão num cwd já preparado (quando o script da API precisa de um
/// caminho dentro dele).
fn session_in(spec: Spec, api: &MockApi, cwd: tempfile::TempDir) -> Session {
    let config_dir = tempfile::tempdir().expect("config dir");
    let mut env = HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.path().display().to_string(),
        ),
    ]);
    for (key, value) in spec.extra_env {
        env.insert(key.to_string(), value.to_string());
    }
    let options = ClaudeAgentOptions {
        env,
        cwd: Some(cwd.path().to_path_buf()),
        max_turns: Some(10),
        tools: spec.tools.map(ToolsConfig::List),
        permission_mode: spec.permission_mode,
        strict_mcp_config: true,
        ..Default::default()
    };
    Session {
        transport: NativeApiTransport::new(options),
        _config_dir: config_dir,
        _cwd: cwd,
    }
}

/// O que um turno produziu: os frames emitidos e os `can_use_tool` pedidos.
struct Turn {
    frames: Vec<Value>,
    permission_requests: Vec<Value>,
}

impl Turn {
    fn result(&self) -> &Value {
        self.frames
            .iter()
            .find(|f| f["type"] == "result")
            .expect("frame result")
    }

    fn user_frames(&self) -> Vec<&Value> {
        self.frames.iter().filter(|f| f["type"] == "user").collect()
    }
}

/// Manda o prompt e roda o turno até o `result`, respondendo cada
/// `can_use_tool` com `decide`.
async fn run_turn(s: &mut Session, prompt: &str, decide: impl Fn(&Value) -> Value) -> Turn {
    s.transport.connect().await.expect("connect");
    let user = json!({
        "type": "user",
        "session_id": "",
        "message": {"role": "user", "content": prompt},
        "parent_tool_use_id": null,
    });
    s.transport
        .write(&format!("{user}\n"))
        .await
        .expect("write prompt");
    let mut frames = Vec::new();
    let mut permission_requests = Vec::new();
    loop {
        let frame = tokio::time::timeout(Duration::from_secs(20), s.transport.read_message())
            .await
            .expect("o turno travou")
            .expect("read")
            .expect("o stream acabou antes do result");
        if frame["type"] == "control_request" && frame["request"]["subtype"] == "can_use_tool" {
            let request = frame["request"].clone();
            let response = json!({
                "type": "control_response",
                "response": {
                    "subtype": "success",
                    "request_id": frame["request_id"],
                    "response": decide(&request),
                }
            });
            permission_requests.push(request);
            s.transport
                .write(&format!("{response}\n"))
                .await
                .expect("write control_response");
            continue;
        }
        let done = frame["type"] == "result";
        frames.push(frame);
        if done {
            break;
        }
    }
    let _ = s.transport.close().await;
    Turn {
        frames,
        permission_requests,
    }
}

fn allow(request: &Value) -> Value {
    json!({"behavior": "allow", "updatedInput": request["input"]})
}

fn tool_names(request: &Value) -> Vec<String> {
    request["tools"]
        .as_array()
        .map(|tools| {
            tools
                .iter()
                .filter_map(|t| t["name"].as_str().map(str::to_string))
                .collect()
        })
        .unwrap_or_default()
}

// ---------------------------------------------------------------------------
// can_use_tool
// ---------------------------------------------------------------------------

/// O `can_use_tool` leva o que o `createCanUseTool` do CLI manda: as
/// sugestões de permissão, o motivo serializado e o `tool_use_id`. O que não
/// existe falta no JSON (o `JSON.stringify` descarta `undefined`): na thread
/// principal não há `agent_id`, e o Read fora do diretório não tem
/// `blocked_path`.
#[tokio::test]
async fn can_use_tool_carries_the_fields_the_cli_sends() {
    let outside = tempfile::tempdir().expect("fora");
    let file = outside.path().join("nota.txt");
    std::fs::write(&file, "conteúdo de fora\n").expect("write");
    let api = MockApi::start(vec![
        sse_tool_call(
            "toolu_read",
            "Read",
            &json!({"file_path": file.display().to_string()}),
        ),
        sse_text("lido"),
    ])
    .await;
    let mut s = session(
        Spec {
            tools: Some(vec!["Read".to_string()]),
            ..Default::default()
        },
        &api,
    );

    let turn = run_turn(&mut s, "leia a nota", allow).await;

    assert_eq!(turn.permission_requests.len(), 1);
    let request = &turn.permission_requests[0];
    assert_eq!(request["tool_name"], "Read");
    assert_eq!(request["tool_use_id"], "toolu_read");
    assert_eq!(
        request["decision_reason"],
        "Path is outside allowed working directories"
    );
    let suggestions = request["permission_suggestions"]
        .as_array()
        .expect("permission_suggestions");
    assert!(!suggestions.is_empty(), "sem sugestão: {request}");
    let object = request.as_object().expect("objeto");
    assert!(
        !object.contains_key("agent_id"),
        "agent_id na thread principal: {request}"
    );
    assert!(
        !object.contains_key("blocked_path"),
        "blocked_path inventado: {request}"
    );
    assert_eq!(turn.result()["subtype"], "success");
}

/// Deny com `interrupt: true`: a tool é recusada, o turno para ali (nenhum
/// pedido novo à API), sai a mensagem de interrupção do CLI
/// (`createUserInterruptionMessage({ toolUse: true })`, porque o `abort()`
/// desse caso não tem o motivo "interrupt") e o result é de erro.
#[tokio::test]
async fn deny_with_interrupt_ends_the_turn_like_the_cli() {
    let outside = tempfile::tempdir().expect("fora");
    let file = outside.path().join("segredo.txt");
    std::fs::write(&file, "x\n").expect("write");
    let api = MockApi::start(vec![
        sse_tool_call(
            "toolu_read",
            "Read",
            &json!({"file_path": file.display().to_string()}),
        ),
        sse_text("não devia chegar aqui"),
    ])
    .await;
    let mut s = session(
        Spec {
            tools: Some(vec!["Read".to_string()]),
            ..Default::default()
        },
        &api,
    );

    let turn = run_turn(
        &mut s,
        "leia o segredo",
        |_| json!({"behavior": "deny", "message": "Parado pelo usuário.", "interrupt": true}),
    )
    .await;

    assert_eq!(
        api.requests().await.len(),
        1,
        "o loop seguiu depois do interrupt"
    );
    let users = turn.user_frames();
    let tool_result = users
        .iter()
        .find(|f| f["message"]["content"][0]["type"] == "tool_result")
        .expect("tool_result da recusa");
    assert_eq!(tool_result["message"]["content"][0]["is_error"], true);
    assert!(tool_result.to_string().contains("Parado pelo usuário."));
    let last_user = users.last().expect("mensagem de interrupção");
    assert_eq!(
        last_user["message"]["content"][0]["text"],
        "[Request interrupted by user for tool use]"
    );
    let result = turn.result();
    assert_eq!(result["subtype"], "error_during_execution");
    assert_eq!(result["is_error"], true);
}

// ---------------------------------------------------------------------------
// newMessages
// ---------------------------------------------------------------------------

/// O Read de PDF devolve o texto curto no tool_result e anexa o documento
/// numa mensagem `isMeta` (`newMessages`). Ela sai ao cliente como o
/// `normalizeMessage` do CLI (`isSynthetic: true`) e vai à API depois do
/// tool_result, na mesma mensagem de usuário, que é como o modelo lê o PDF.
#[tokio::test]
async fn read_pdf_attaches_the_document_as_a_meta_message() {
    let cwd = tempfile::tempdir().expect("cwd");
    let pdf = cwd.path().join("relatorio.pdf");
    std::fs::write(&pdf, b"%PDF-1.4\n%mock\n").expect("pdf");
    let api = MockApi::start(vec![
        sse_tool_call(
            "toolu_pdf",
            "Read",
            &json!({"file_path": pdf.display().to_string()}),
        ),
        sse_text("li o pdf"),
    ])
    .await;
    let mut s = session_in(
        Spec {
            tools: Some(vec!["Read".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            ..Default::default()
        },
        &api,
        cwd,
    );

    let turn = run_turn(&mut s, "leia o pdf", allow).await;
    assert_eq!(turn.result()["subtype"], "success");

    // Ao cliente: o tool_result sem `isSynthetic`, depois o documento com.
    let users = turn.user_frames();
    assert_eq!(users.len(), 2, "frames de usuário: {users:?}");
    assert_eq!(users[0]["message"]["content"][0]["type"], "tool_result");
    assert!(users[0].get("isSynthetic").is_none());
    assert_eq!(users[1]["isSynthetic"], true);
    let document = &users[1]["message"]["content"][0];
    assert_eq!(document["type"], "document");
    assert_eq!(document["source"]["media_type"], "application/pdf");

    // À API: tool_result na frente, documento depois, na mesma mensagem.
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let last = requests[1]["messages"]
        .as_array()
        .and_then(|m| m.last())
        .expect("última mensagem")
        .clone();
    assert_eq!(last["role"], "user");
    let kinds: Vec<&str> = last["content"]
        .as_array()
        .expect("content")
        .iter()
        .filter_map(|b| b["type"].as_str())
        .collect();
    assert_eq!(kinds, vec!["tool_result", "document"]);
    assert!(last["content"][0].to_string().contains("PDF file read:"));

    // No transcript: a mensagem inteira, com `isMeta: true`.
    let entries = transcript_entries(s._config_dir.path());
    let meta = entries
        .iter()
        .find(|e| e["type"] == "user" && e["message"]["content"][0]["type"] == "document")
        .expect("entrada do documento no transcript");
    assert_eq!(meta["isMeta"], true, "{meta}");
}

/// As entradas de todos os JSONL de sessão sob o diretório de config.
fn transcript_entries(config_dir: &std::path::Path) -> Vec<Value> {
    fn walk(dir: &std::path::Path, out: &mut Vec<Value>) {
        let Ok(entries) = std::fs::read_dir(dir) else {
            return;
        };
        for entry in entries.filter_map(Result::ok) {
            let path = entry.path();
            if path.is_dir() {
                walk(&path, out);
            } else if path.extension().is_some_and(|e| e == "jsonl") {
                let text = std::fs::read_to_string(&path).unwrap_or_default();
                out.extend(text.lines().filter_map(|l| serde_json::from_str(l).ok()));
            }
        }
    }
    let mut out = Vec::new();
    walk(config_dir, &mut out);
    out
}

// ---------------------------------------------------------------------------
// Registro das tools
// ---------------------------------------------------------------------------

/// O conjunto default traz o subagente só como `Agent` (o `Task` é alias
/// antigo, não uma segunda tool) e o WebSearch pelo nome do CLI.
#[tokio::test]
async fn default_tools_register_agent_once_and_websearch_by_its_cli_name() {
    let api = MockApi::start(vec![sse_text("oi")]).await;
    let mut s = session(Spec::default(), &api);

    let turn = run_turn(&mut s, "oi", allow).await;
    assert_eq!(turn.result()["subtype"], "success");

    let names = tool_names(&api.requests().await[0]);
    assert_eq!(
        names.iter().filter(|n| *n == "Agent").count(),
        1,
        "{names:?}"
    );
    assert!(!names.contains(&"Task".to_string()), "{names:?}");
    assert!(names.contains(&"WebSearch".to_string()), "{names:?}");
    assert!(!names.contains(&"web_search".to_string()), "{names:?}");
    assert!(names.contains(&"Read".to_string()), "{names:?}");
}

/// Pedir `Task` na lista de tools é pedir o subagente pelo alias antigo: a
/// tool que vai ao request se chama `Agent`.
#[tokio::test]
async fn the_legacy_task_name_in_the_list_registers_agent() {
    let api = MockApi::start(vec![sse_text("oi")]).await;
    let mut s = session(
        Spec {
            tools: Some(vec!["Task".to_string(), "web_search".to_string()]),
            ..Default::default()
        },
        &api,
    );

    run_turn(&mut s, "oi", allow).await;

    assert_eq!(
        tool_names(&api.requests().await[0]),
        vec!["Agent".to_string()]
    );
}

// ---------------------------------------------------------------------------
// Subagente
// ---------------------------------------------------------------------------

/// A pergunta de permissão feita por uma tool do subagente leva o
/// `agent_id` dele (`createAgentId`: `a` e 16 dígitos hexadecimais).
#[tokio::test]
async fn subagent_permission_requests_carry_its_agent_id() {
    let outside = tempfile::tempdir().expect("fora");
    let file = outside.path().join("dados.txt");
    std::fs::write(&file, "dados\n").expect("write");
    let api = MockApi::start(vec![
        sse_tool_call(
            "toolu_agent",
            "Agent",
            &json!({"description": "ler dados", "prompt": "leia o arquivo"}),
        ),
        sse_tool_call(
            "toolu_sub_read",
            "Read",
            &json!({"file_path": file.display().to_string()}),
        ),
        sse_text("o subagente leu"),
        sse_text("pronto"),
    ])
    .await;
    let mut s = session(
        Spec {
            tools: Some(vec!["Agent".to_string(), "Read".to_string()]),
            ..Default::default()
        },
        &api,
    );

    let turn = run_turn(&mut s, "delegue a leitura", allow).await;
    assert_eq!(turn.result()["subtype"], "success");

    let from_subagent = turn
        .permission_requests
        .iter()
        .find(|r| r["tool_name"] == "Read")
        .expect("pedido do Read do subagente");
    let agent_id = from_subagent["agent_id"].as_str().expect("agent_id");
    assert_eq!(agent_id.len(), 17, "{agent_id}");
    assert!(agent_id.starts_with('a'));
    assert!(agent_id[1..].chars().all(|c| c.is_ascii_hexdigit()));
    // O Agent em si foi perguntado na thread principal, sem agent_id.
    let from_main = turn
        .permission_requests
        .iter()
        .find(|r| r["tool_name"] == "Agent");
    if let Some(request) = from_main {
        assert!(request.get("agent_id").is_none());
    }
}

/// Resposta com dois `tool_use` do Agent na mesma mensagem.
fn sse_two_agent_calls(first: &Value, second: &Value) -> String {
    let mut events = vec![
        json!({"type":"message_start","message":{"id":"msg_two","model":"mock-model","role":"assistant","usage":{"input_tokens":20,"output_tokens":0}}}),
    ];
    for (index, (id, input)) in [("toolu_agent_a", first), ("toolu_agent_b", second)]
        .into_iter()
        .enumerate()
    {
        events.push(json!({"type":"content_block_start","index":index,"content_block":{"type":"tool_use","id":id,"name":"Agent"}}));
        events.push(json!({"type":"content_block_delta","index":index,"delta":{"type":"input_json_delta","partial_json":input.to_string()}}));
        events.push(json!({"type":"content_block_stop","index":index}));
    }
    events.push(json!({"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"output_tokens":8}}));
    events.push(json!({"type":"message_stop"}));
    sse_events(&events)
}

/// MockApi que atende cada conexão numa tarefa própria e só responde a um
/// subagente quando os DOIS já fizeram o pedido: se os subagentes rodassem em
/// série, o primeiro esperaria em vão e responderia `sozinho`. A thread
/// principal é reconhecida pelo prompt do usuário.
async fn start_parallel_agents_api() -> MockApi {
    let listener = TcpListener::bind("127.0.0.1:0").await.expect("bind");
    let addr = format!("http://{}", listener.local_addr().expect("addr"));
    let requests: Arc<Mutex<Vec<Value>>> = Arc::new(Mutex::new(Vec::new()));
    let captured = Arc::clone(&requests);
    let (arrived_tx, arrived_rx) = tokio::sync::watch::channel(0usize);
    let arrived_tx = Arc::new(arrived_tx);
    tokio::spawn(async move {
        loop {
            let Ok((mut socket, _)) = listener.accept().await else {
                return;
            };
            let captured = Arc::clone(&captured);
            let arrived_tx = Arc::clone(&arrived_tx);
            let mut arrived_rx = arrived_rx.clone();
            tokio::spawn(async move {
                let body = read_http_request(&mut socket).await.unwrap_or(Value::Null);
                captured.lock().await.push(body.clone());
                let text = body.to_string();
                let sse = if text.contains("delegue as duas") {
                    if text.contains("tool_result") {
                        sse_text("pronto")
                    } else {
                        sse_two_agent_calls(
                            &json!({"description": "parte A", "prompt": "tarefa A", "bogus": 1}),
                            &json!({"description": "parte B", "prompt": "tarefa B"}),
                        )
                    }
                } else if let Some(label) = ["tarefa A", "tarefa B"]
                    .into_iter()
                    .find(|label| text.contains(label))
                {
                    arrived_tx.send_modify(|n| *n += 1);
                    let together = tokio::time::timeout(
                        Duration::from_secs(5),
                        arrived_rx.wait_for(|n| *n >= 2),
                    )
                    .await
                    .is_ok();
                    let suffix = &label[label.len() - 1..];
                    if together {
                        sse_text(&format!("feito {suffix}"))
                    } else {
                        sse_text(&format!("sozinho {suffix}"))
                    }
                } else {
                    sse_text("ok")
                };
                let response = format!(
                    "HTTP/1.1 200 OK\r\ncontent-type: text/event-stream\r\nconnection: close\r\n\r\n{sse}"
                );
                let _ = socket.write_all(response.as_bytes()).await;
                let _ = socket.shutdown().await;
            });
        }
    });
    MockApi { addr, requests }
}

/// O `isConcurrencySafe` do AgentTool é `true` no JS, e o
/// `runToolsConcurrently` (`services/tools/toolOrchestration.js`) roda os
/// subagentes do mesmo turno juntos. O mock só responde quando os dois já
/// pediram, então só passa com execução concorrente de verdade. De quebra, o
/// `z.object` do Agent descarta a chave desconhecida: o `can_use_tool` recebe
/// o input sem ela.
#[tokio::test]
async fn subagents_of_the_same_turn_run_concurrently() {
    let api = start_parallel_agents_api().await;
    let mut s = session(
        Spec {
            tools: Some(vec!["Agent".to_string()]),
            ..Default::default()
        },
        &api,
    );

    let turn = run_turn(&mut s, "delegue as duas partes", allow).await;
    assert_eq!(turn.result()["subtype"], "success", "{:?}", turn.frames);

    let results: Vec<(String, String)> = turn
        .user_frames()
        .iter()
        .flat_map(|frame| {
            frame["message"]["content"]
                .as_array()
                .cloned()
                .unwrap_or_default()
        })
        .filter(|block| block["type"] == "tool_result")
        .map(|block| {
            (
                block["tool_use_id"]
                    .as_str()
                    .unwrap_or_default()
                    .to_string(),
                block["content"].to_string(),
            )
        })
        .collect();
    assert_eq!(results.len(), 2, "{results:?}");
    assert_eq!(results[0].0, "toolu_agent_a");
    assert!(results[0].1.contains("feito A"), "{results:?}");
    assert_eq!(results[1].0, "toolu_agent_b");
    assert!(results[1].1.contains("feito B"), "{results:?}");

    let asked: Vec<&Value> = turn
        .permission_requests
        .iter()
        .filter(|r| r["tool_name"] == "Agent")
        .collect();
    assert_eq!(asked.len(), 2, "{:?}", turn.permission_requests);
    assert!(asked
        .iter()
        .all(|r| r["input"].get("bogus").is_none() && r["input"]["prompt"].is_string()));
}

// ---------------------------------------------------------------------------
// Chamada de modelo das tools
// ---------------------------------------------------------------------------

/// O WebSearch faz a busca numa chamada aninhada pelo cliente da sessão, com
/// streaming (`queryModelWithStreaming` do JS) e a server tool
/// `web_search_20250305`; a resposta volta ao modelo no tool_result. O
/// modelo da busca é o pequeno, e ele vem do env das options
/// (`ANTHROPIC_SMALL_FAST_MODEL`, precedência do `getSmallFastModel`).
#[tokio::test]
async fn web_search_runs_its_nested_call_through_the_session_client() {
    let api = MockApi::start(vec![
        sse_tool_call("toolu_ws", "WebSearch", &json!({"query": "cotação"})),
        sse_server_web_search("A cotação subiu."),
        sse_text("respondido"),
    ])
    .await;
    let mut s = session(
        Spec {
            tools: Some(vec!["WebSearch".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            extra_env: vec![("ANTHROPIC_SMALL_FAST_MODEL", "mock-haiku")],
        },
        &api,
    );

    let turn = run_turn(&mut s, "qual a cotação?", allow).await;
    assert_eq!(turn.result()["subtype"], "success");

    let requests = api.requests().await;
    assert_eq!(requests.len(), 3);
    let nested = &requests[1];
    assert_eq!(nested["stream"], true);
    assert!(nested["tools"]
        .as_array()
        .expect("tools")
        .iter()
        .any(|t| t["type"] == "web_search_20250305"));
    assert_eq!(nested["model"], "mock-haiku");
    assert!(
        requests[2].to_string().contains("A cotação subiu."),
        "a resposta da busca não voltou ao modelo"
    );
}
