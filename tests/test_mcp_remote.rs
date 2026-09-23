//! O cliente MCP remoto contra servidores de verdade, em processo: HTTP
//! streamável (resposta em JSON e em stream, sessão, versão, cabeçalhos,
//! sessão expirada), SSE legado (endpoint anunciado, origem conferida), e a
//! ligação no transporte nativo, com o modelo de mentira chamando a tool.
//! Nenhum teste daqui toca rede externa nem gasta token.

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use futures::StreamExt;
use prana::mcp::{
    connect_mcp_servers, McpClient, McpServerConfig, McpTimeouts, LATEST_PROTOCOL_VERSION,
};
use prana::tools::framework::{ToolContext, ToolResultContent};
use prana::{
    ClaudeAgentOptions, ClaudeSDKClient, ContentBlock, McpServersConfig, Message,
    NativeApiTransport, PermissionMode, ToolsConfig,
};
use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::mpsc;

const SESSION_HEADER: &str = "mcp-session-id";
const VERSION_HEADER: &str = "mcp-protocol-version";

// ---------------------------------------------------------------------------
// O servidor MCP de bancada: registra o que viu em cada request
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
struct Request {
    method: String,
    session: Option<String>,
    version: Option<String>,
    authorization: Option<String>,
    accept: Option<String>,
}

#[derive(Default)]
struct Seen {
    requests: Mutex<Vec<Request>>,
    initializations: Mutex<u32>,
    outbox: Mutex<Option<mpsc::UnboundedSender<String>>>,
    /// A primeira `tools/call` responde 404 com `-32001`, uma vez.
    expire_once: Mutex<bool>,
    /// A versão que o `initialize` devolve.
    version: Mutex<String>,
}

impl Seen {
    fn with_version(version: &str) -> Arc<Self> {
        let seen = Self::default();
        *seen.version.lock().unwrap() = version.to_string();
        Arc::new(seen)
    }

    fn requests(&self) -> Vec<Request> {
        self.requests.lock().unwrap().clone()
    }
}

fn header(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::to_string)
}

fn noted(seen: &Seen, headers: &HeaderMap, method: &str) {
    seen.requests.lock().unwrap().push(Request {
        method: method.to_string(),
        session: header(headers, SESSION_HEADER),
        version: header(headers, VERSION_HEADER),
        authorization: header(headers, "authorization"),
        accept: header(headers, "accept"),
    });
}

fn method_of(request: &Value) -> String {
    request
        .get("method")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string()
}

/// A resposta JSON-RPC da bancada, ou `None` para notificações.
fn reply(seen: &Seen, request: &Value) -> Option<Value> {
    let id = request.get("id")?.clone();
    let result = match method_of(request).as_str() {
        "initialize" => {
            *seen.initializations.lock().unwrap() += 1;
            json!({
                "protocolVersion": seen.version.lock().unwrap().clone(),
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "bancada", "version": "0"},
            })
        }
        "tools/list" => json!({"tools": [
            {
                "name": "echo",
                "description": "Repete o texto",
                "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]},
            },
            {
                "name": "peek",
                "description": "Só olha",
                "inputSchema": {"type": "object", "properties": {}},
                "annotations": {"readOnlyHint": true},
            },
        ]}),
        "tools/call" => {
            let text = request
                .pointer("/params/arguments/text")
                .and_then(Value::as_str)
                .unwrap_or_default();
            json!({"content": [{"type": "text", "text": format!("eco: {text}")}]})
        }
        other => {
            return Some(json!({
                "jsonrpc": "2.0", "id": id,
                "error": {"code": -32601, "message": format!("method not found: {other}")},
            }))
        }
    };
    Some(json!({"jsonrpc": "2.0", "id": id, "result": result}))
}

fn session_of(seen: &Seen) -> String {
    format!("sessao-{}", *seen.initializations.lock().unwrap())
}

/// Streamable HTTP respondendo em JSON, com sessão por `initialize`.
async fn streamable(
    State(seen): State<Arc<Seen>>,
    headers: HeaderMap,
    Json(request): Json<Value>,
) -> Response {
    let method = method_of(&request);
    noted(&seen, &headers, &method);
    if method == "tools/call" {
        let mut expire = seen.expire_once.lock().unwrap();
        if *expire {
            *expire = false;
            return (
                StatusCode::NOT_FOUND,
                r#"{"jsonrpc":"2.0","id":9,"error":{"code":-32001,"message":"Session not found"}}"#,
            )
                .into_response();
        }
    }
    match reply(&seen, &request) {
        None => StatusCode::ACCEPTED.into_response(),
        Some(payload) => ([(SESSION_HEADER, session_of(&seen))], Json(payload)).into_response(),
    }
}

/// O GET que um servidor sem stream de servidor responde: 405.
async fn no_server_stream() -> StatusCode {
    StatusCode::METHOD_NOT_ALLOWED
}

/// Streamable HTTP que responde `tools/call` num stream de eventos, com uma
/// notificação alheia antes e um `id:` em cada evento.
async fn streamable_over_sse(
    State(seen): State<Arc<Seen>>,
    headers: HeaderMap,
    Json(request): Json<Value>,
) -> Response {
    let method = method_of(&request);
    noted(&seen, &headers, &method);
    let Some(payload) = reply(&seen, &request) else {
        return StatusCode::ACCEPTED.into_response();
    };
    if method != "tools/call" {
        return Json(payload).into_response();
    }
    let body = format!(
        "id: 1\r\nevent: message\r\ndata: {{\"jsonrpc\":\"2.0\",\"method\":\"notifications/message\",\"params\":{{}}}}\r\n\r\nid: 2\r\nevent: message\r\ndata: {payload}\r\n\r\n"
    );
    ([("content-type", "text/event-stream")], body).into_response()
}

/// O stream do transporte SSE legado: `endpoint` primeiro, respostas depois.
async fn legacy_stream(State(seen): State<Arc<Seen>>, headers: HeaderMap) -> Response {
    noted(&seen, &headers, "GET /sse");
    let (tx, rx) = mpsc::unbounded_channel::<String>();
    *seen.outbox.lock().unwrap() = Some(tx);
    let frames = futures::stream::once(async {
        Ok::<_, std::convert::Infallible>(
            "event: endpoint\ndata: /messages?session=1\n\n".to_string(),
        )
    })
    .chain(futures::stream::unfold(rx, |mut rx| async move {
        rx.recv()
            .await
            .map(|frame| (Ok::<_, std::convert::Infallible>(frame), rx))
    }));
    (
        [("content-type", "text/event-stream")],
        Body::from_stream(frames),
    )
        .into_response()
}

/// Um stream legado que manda o cliente postar em OUTRA origem.
async fn foreign_endpoint_stream() -> Response {
    (
        [("content-type", "text/event-stream")],
        "event: endpoint\ndata: https://outro.exemplo/messages\n\n".to_string(),
    )
        .into_response()
}

async fn legacy_post(
    State(seen): State<Arc<Seen>>,
    headers: HeaderMap,
    Json(request): Json<Value>,
) -> StatusCode {
    noted(&seen, &headers, &method_of(&request));
    if let Some(payload) = reply(&seen, &request) {
        if let Some(tx) = seen.outbox.lock().unwrap().clone() {
            let _ = tx.send(format!("event: message\ndata: {payload}\n\n"));
        }
    }
    StatusCode::ACCEPTED
}

async fn served(router: Router<Arc<Seen>>, seen: Arc<Seen>) -> String {
    let listener = TcpListener::bind("127.0.0.1:0").await.expect("bind");
    let base = format!("http://{}", listener.local_addr().expect("addr"));
    let app = router.with_state(seen);
    tokio::spawn(async move {
        let _ = axum::serve(listener, app).await;
    });
    base
}

fn bearer() -> HashMap<String, String> {
    HashMap::from([("Authorization".to_string(), "Bearer segredo".to_string())])
}

fn http(url: String) -> McpServerConfig {
    McpServerConfig::Http {
        url,
        headers: Some(bearer()),
    }
}

fn sse(url: String) -> McpServerConfig {
    McpServerConfig::Sse {
        url,
        headers: Some(bearer()),
    }
}

fn quick() -> McpTimeouts {
    McpTimeouts {
        connect: std::time::Duration::from_secs(10),
        tool: std::time::Duration::from_secs(10),
        request: std::time::Duration::from_secs(5),
    }
}

fn text_of(content: &[ToolResultContent]) -> String {
    content
        .iter()
        .filter_map(|part| match part {
            ToolResultContent::Text(text) => Some(text.clone()),
            ToolResultContent::Image { .. } => None,
        })
        .collect()
}

async fn echoed(config: &McpServerConfig) -> (Arc<McpClient>, String) {
    let client = Arc::new(
        McpClient::connect_with("bancada", config, quick())
            .await
            .expect("connect"),
    );
    let tools = Arc::clone(&client).into_sdk_tools();
    let echo = tools
        .iter()
        .find(|tool| tool.name() == "mcp__bancada__echo")
        .expect("a tool echo");
    assert_eq!(echo.description(), "Repete o texto");
    let result = echo
        .execute(json!({"text": "oi"}), &ToolContext::default())
        .await;
    assert!(!result.is_error, "{result:?}");
    (client, text_of(&result.content))
}

// ---------------------------------------------------------------------------
// Os contratos do cliente
// ---------------------------------------------------------------------------

#[tokio::test]
async fn streamable_http_negotiates_a_session_and_a_version_and_calls_a_tool() {
    let seen = Seen::with_version(LATEST_PROTOCOL_VERSION);
    let base = served(
        Router::new().route("/mcp", post(streamable).get(no_server_stream)),
        Arc::clone(&seen),
    )
    .await;

    let (client, text) = echoed(&http(format!("{base}/mcp"))).await;
    assert_eq!(text, "eco: oi");
    assert_eq!(client.protocol_version(), LATEST_PROTOCOL_VERSION);
    assert_eq!(client.tools.len(), 2);

    let requests = seen.requests();
    let posted: Vec<&Request> = requests.iter().filter(|r| r.method != "GET /sse").collect();
    assert_eq!(posted[0].method, "initialize");
    assert_eq!(
        posted[0].session, None,
        "o initialize abre a sessão, não a apresenta"
    );
    assert_eq!(
        posted[0].version, None,
        "a versão só existe depois de negociada"
    );
    assert!(
        posted[0]
            .accept
            .as_deref()
            .unwrap_or_default()
            .contains("text/event-stream")
            && posted[0]
                .accept
                .as_deref()
                .unwrap_or_default()
                .contains("application/json"),
        "{:?}",
        posted[0].accept
    );
    for later in &posted[1..] {
        assert_eq!(later.session.as_deref(), Some("sessao-1"), "{later:?}");
        assert_eq!(
            later.version.as_deref(),
            Some(LATEST_PROTOCOL_VERSION),
            "{later:?}"
        );
    }
    assert!(posted
        .iter()
        .all(|r| r.authorization.as_deref() == Some("Bearer segredo")));
    assert_eq!(posted.last().map(|r| r.method.as_str()), Some("tools/call"));
}

#[tokio::test]
async fn a_response_streamed_as_events_is_read_past_the_noise() {
    let seen = Seen::with_version("2025-06-18");
    let base = served(Router::new().route("/mcp", post(streamable_over_sse)), seen).await;
    let (client, text) = echoed(&http(format!("{base}/mcp"))).await;
    assert_eq!(text, "eco: oi");
    assert_eq!(client.protocol_version(), "2025-06-18");
}

#[tokio::test]
async fn an_expired_session_is_renewed_and_the_call_repeated_once() {
    let seen = Seen::with_version(LATEST_PROTOCOL_VERSION);
    *seen.expire_once.lock().unwrap() = true;
    let base = served(
        Router::new().route("/mcp", post(streamable).get(no_server_stream)),
        Arc::clone(&seen),
    )
    .await;

    let (_, text) = echoed(&http(format!("{base}/mcp"))).await;
    assert_eq!(text, "eco: oi");
    assert_eq!(
        *seen.initializations.lock().unwrap(),
        2,
        "a sessão foi refeita uma vez"
    );
    let requests = seen.requests();
    let last = requests.last().expect("a última request");
    assert_eq!(last.method, "tools/call");
    assert_eq!(
        last.session.as_deref(),
        Some("sessao-2"),
        "a repetição usa a sessão nova"
    );
}

#[tokio::test]
async fn the_legacy_sse_transport_posts_to_the_announced_endpoint() {
    let seen = Seen::with_version("2024-11-05");
    let base = served(
        Router::new()
            .route("/sse", get(legacy_stream))
            .route("/messages", post(legacy_post)),
        Arc::clone(&seen),
    )
    .await;

    let (client, text) = echoed(&sse(format!("{base}/sse"))).await;
    assert_eq!(text, "eco: oi");
    assert_eq!(client.protocol_version(), "2024-11-05");
    let requests = seen.requests();
    assert!(
        requests
            .iter()
            .all(|r| r.authorization.as_deref() == Some("Bearer segredo")),
        "{requests:?}"
    );
    let posted: Vec<&str> = requests.iter().map(|r| r.method.as_str()).collect();
    assert_eq!(
        posted,
        vec![
            "GET /sse",
            "initialize",
            "notifications/initialized",
            "tools/list",
            "tools/call"
        ]
    );
    assert_eq!(requests[3].version.as_deref(), Some("2024-11-05"));
}

#[tokio::test]
async fn an_endpoint_on_another_origin_is_refused_at_connect() {
    let seen = Seen::with_version("2024-11-05");
    let base = served(
        Router::new().route("/sse", get(foreign_endpoint_stream)),
        seen,
    )
    .await;
    let refused = McpClient::connect_with("bancada", &sse(format!("{base}/sse")), quick()).await;
    let message = refused.err().map(|e| e.to_string()).unwrap_or_default();
    assert!(message.contains("origin"), "{message}");
}

#[tokio::test]
async fn an_unsupported_protocol_version_is_refused_and_not_downgraded() {
    let seen = Seen::with_version("1999-01-01");
    let base = served(Router::new().route("/mcp", post(streamable)), seen).await;
    let refused = McpClient::connect_with("bancada", &http(format!("{base}/mcp")), quick()).await;
    let message = refused.err().map(|e| e.to_string()).unwrap_or_default();
    assert!(message.contains("not supported"), "{message}");
}

#[tokio::test]
async fn a_server_that_is_not_there_is_a_failed_status_and_not_a_crash() {
    let configs = HashMap::from([
        (
            "morto".to_string(),
            http("http://127.0.0.1:9/mcp".to_string()),
        ),
        (
            "interno".to_string(),
            McpServerConfig::Sdk {
                name: "interno".to_string(),
            },
        ),
    ]);
    let connected = connect_mcp_servers(&configs).await;
    assert!(connected.tools.is_empty());
    assert_eq!(
        connected.status.len(),
        1,
        "o sdk é servido in-process e não entra"
    );
    assert_eq!(connected.status[0]["name"], "morto");
    assert_eq!(connected.status[0]["status"], "failed");
    assert!(
        connected.status[0]["error"]
            .as_str()
            .unwrap_or_default()
            .len()
            > 5
    );
}

#[tokio::test]
async fn the_read_only_hint_decides_concurrency_and_plan_mode() {
    let seen = Seen::with_version(LATEST_PROTOCOL_VERSION);
    let base = served(Router::new().route("/mcp", post(streamable)), seen).await;
    let client = Arc::new(
        McpClient::connect_with("bancada", &http(format!("{base}/mcp")), quick())
            .await
            .expect("connect"),
    );
    let tools = client.into_sdk_tools();
    let peek = tools
        .iter()
        .find(|t| t.name() == "mcp__bancada__peek")
        .expect("peek");
    let echo = tools
        .iter()
        .find(|t| t.name() == "mcp__bancada__echo")
        .expect("echo");
    let input = serde_json::json!({});
    assert!(peek.is_read_only() && peek.is_concurrency_safe(&input));
    assert!(!echo.is_read_only() && !echo.is_concurrency_safe(&input));
}

// ---------------------------------------------------------------------------
// O transporte nativo: o modelo de mentira chama a tool remota
// ---------------------------------------------------------------------------

struct MockApi {
    addr: String,
    requests: Arc<tokio::sync::Mutex<Vec<Value>>>,
}

impl MockApi {
    async fn start(script: Vec<String>) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0")
            .await
            .expect("bind mock api");
        let addr = format!("http://{}", listener.local_addr().expect("local addr"));
        let requests: Arc<tokio::sync::Mutex<Vec<Value>>> = Arc::default();
        let captured = Arc::clone(&requests);
        tokio::spawn(async move {
            let script = Arc::new(script);
            let mut served = 0usize;
            loop {
                let Ok((mut socket, _)) = listener.accept().await else {
                    return;
                };
                if let Some(body) = read_http_request(&mut socket).await {
                    captured.lock().await.push(body);
                }
                let index = served.min(script.len().saturating_sub(1));
                served += 1;
                let sse = script[index].clone();
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
            format!(
                "event: {}\ndata: {e}\n\n",
                e["type"].as_str().expect("type")
            )
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

fn sse_tool_call(tool_name: &str, arguments: &Value) -> String {
    let partial = serde_json::to_string(arguments).expect("serialize arguments");
    sse_events(&[
        json!({"type":"message_start","message":{"id":"msg_tool","model":"mock-model","role":"assistant","usage":{"input_tokens":20,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":"toolu_1","name":tool_name}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":partial}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"output_tokens":8}}),
        json!({"type":"message_stop"}),
    ])
}

fn native_options(
    api_addr: &str,
    config_dir: &str,
    cwd: &str,
    mcp_url: &str,
) -> ClaudeAgentOptions {
    let mut env = HashMap::new();
    env.insert("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string());
    env.insert("ANTHROPIC_BASE_URL".to_string(), api_addr.to_string());
    env.insert("ANTHROPIC_MODEL".to_string(), "mock-model".to_string());
    env.insert("CLAUDE_CONFIG_DIR".to_string(), config_dir.to_string());
    ClaudeAgentOptions {
        env,
        cwd: Some(std::path::PathBuf::from(cwd)),
        max_turns: Some(10),
        tools: Some(ToolsConfig::List(Vec::new())),
        permission_mode: Some(PermissionMode::BypassPermissions),
        mcp_servers: McpServersConfig::Dict(HashMap::from([(
            "bancada".to_string(),
            http(mcp_url.to_string()),
        )])),
        ..Default::default()
    }
}

#[tokio::test]
async fn the_native_transport_hands_the_remote_tools_to_the_model_and_runs_them() {
    let seen = Seen::with_version(LATEST_PROTOCOL_VERSION);
    let mcp = served(
        Router::new().route("/mcp", post(streamable).get(no_server_stream)),
        Arc::clone(&seen),
    )
    .await;
    let api = MockApi::start(vec![
        sse_tool_call("mcp__bancada__echo", &json!({"text": "pelo modelo"})),
        sse_text("feito"),
    ])
    .await;
    let config_dir = tempfile::tempdir().expect("config dir");
    let cwd = tempfile::tempdir().expect("cwd");
    let options = |_: ()| {
        native_options(
            &api.addr,
            &config_dir.path().display().to_string(),
            &cwd.path().display().to_string(),
            &format!("{mcp}/mcp"),
        )
    };
    let transport = NativeApiTransport::new(options(()));
    let mut client = ClaudeSDKClient::new(options(())).with_transport(Box::new(transport));

    client.connect().await.expect("connect");
    // Contrato: logo depois do connect o servidor já consta, a caminho ou
    // conectado; nunca uma lista vazia que sugira que nada foi declarado.
    let early = client.get_mcp_status().await.expect("mcp_status");
    assert_eq!(early.mcp_servers.len(), 1, "{early:?}");
    assert_eq!(early.mcp_servers[0].name, "bancada");
    client.query("ecoa").await.expect("query");
    let messages = client.receive_response().await.expect("response");
    // Contrato: com o turno andado, o status é o final, com as tools.
    let settled = client.get_mcp_status().await.expect("mcp_status");
    assert_eq!(
        settled.mcp_servers[0].status,
        prana::McpServerConnectionStatus::Connected,
        "{settled:?}"
    );
    let listed = settled.mcp_servers[0].tools.clone().unwrap_or_default();
    assert!(listed.iter().any(|tool| tool.name == "echo"), "{listed:?}");
    client.disconnect().await.expect("disconnect");

    // Contrato: a tool remota foi chamada com o input do modelo.
    let calls: Vec<Request> = seen
        .requests()
        .into_iter()
        .filter(|r| r.method == "tools/call")
        .collect();
    assert_eq!(calls.len(), 1, "{:?}", seen.requests());

    // Contrato: a segunda request à API carrega o tool_result com o eco.
    let requests = api.requests.lock().await.clone();
    assert_eq!(requests.len(), 2);
    let first = requests[0].to_string();
    assert!(
        first.contains("mcp__bancada__echo"),
        "a tool não foi oferecida ao modelo: {first}"
    );
    let second = requests[1].to_string();
    assert!(second.contains("tool_result"), "{second}");
    assert!(second.contains("eco: pelo modelo"), "{second}");

    let result = messages.iter().find_map(|m| match m {
        Message::Result(r) => Some(r.clone()),
        _ => None,
    });
    assert_eq!(result.expect("result").subtype, "success");
    let _ = ContentBlock::Text;
}
