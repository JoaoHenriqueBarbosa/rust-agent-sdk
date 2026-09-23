//! Fallback sem streaming do transporte nativo, na regra do `queryModel` do
//! CLI: quando o stream quebra depois que a resposta abriu (HTTP 200 com
//! `event: error` no SSE, stream que termina sem evento, watchdog de
//! inatividade), a MESMA chamada é repetida sem streaming, e é essa
//! resposta que conclui o turno. É o caminho que um model-router atrás de
//! `ANTHROPIC_BASE_URL` usa para mandar a chamada ao provider de fallback.
//! Tudo roda contra um MockApi local, sem rede externa.

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::Mutex;

use prana::{
    ClaudeAgentOptions, ClaudeSDKClient, Message, NativeApiTransport, ResultMessage, ToolsConfig,
};

// ---------------------------------------------------------------------------
// MockApi que separa a chamada streaming da não-streaming
// ---------------------------------------------------------------------------

/// O que o MockApi responde a uma chamada.
#[derive(Clone)]
enum Reply {
    /// HTTP 200 com este corpo SSE, e a conexão fecha.
    Sse(String),
    /// HTTP 200 com este corpo SSE, e a conexão fica aberta sem mandar mais
    /// nada (o provider que trava no meio do stream).
    SseThenStall(String),
    /// HTTP 200 com este JSON (a resposta da chamada sem streaming).
    Json(Value),
    /// Este status HTTP com este corpo de erro.
    Status(u16, Value),
}

/// Uma chamada recebida: headers (nomes em minúsculas) e corpo.
#[derive(Clone, Debug)]
struct Captured {
    headers: HashMap<String, String>,
    body: Value,
}

impl Captured {
    fn is_streaming(&self) -> bool {
        self.body["stream"].as_bool().unwrap_or(false)
    }
}

struct MockApi {
    addr: String,
    requests: Arc<Mutex<Vec<Captured>>>,
}

impl MockApi {
    /// `streaming` responde às chamadas com `"stream": true`, na ordem, e
    /// `non_streaming` às outras; a última resposta de cada roteiro se
    /// repete.
    async fn start(streaming: Vec<Reply>, non_streaming: Vec<Reply>) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").await.expect("bind");
        let addr = format!("http://{}", listener.local_addr().expect("addr"));
        let requests: Arc<Mutex<Vec<Captured>>> = Arc::new(Mutex::new(Vec::new()));
        let captured = Arc::clone(&requests);
        let counters = Arc::new(Mutex::new((0usize, 0usize)));
        let streaming = Arc::new(streaming);
        let non_streaming = Arc::new(non_streaming);
        tokio::spawn(async move {
            loop {
                let Ok((mut socket, _)) = listener.accept().await else {
                    return;
                };
                let captured = Arc::clone(&captured);
                let counters = Arc::clone(&counters);
                let streaming = Arc::clone(&streaming);
                let non_streaming = Arc::clone(&non_streaming);
                // Uma conexão por tarefa: um stream travado não segura a
                // chamada seguinte.
                tokio::spawn(async move {
                    let Some(request) = read_http_request(&mut socket).await else {
                        return;
                    };
                    let is_streaming = request.is_streaming();
                    captured.lock().await.push(request);
                    let reply = {
                        let mut counters = counters.lock().await;
                        let (script, served) = if is_streaming {
                            (&streaming, &mut counters.0)
                        } else {
                            (&non_streaming, &mut counters.1)
                        };
                        let index = (*served).min(script.len().saturating_sub(1));
                        *served += 1;
                        script[index].clone()
                    };
                    write_reply(&mut socket, reply).await;
                });
            }
        });
        Self { addr, requests }
    }

    async fn requests(&self) -> Vec<Captured> {
        self.requests.lock().await.clone()
    }
}

async fn write_reply(socket: &mut tokio::net::TcpStream, reply: Reply) {
    let (status, content_type, body, stall) = match reply {
        Reply::Sse(body) => (200, "text/event-stream", body, false),
        Reply::SseThenStall(body) => (200, "text/event-stream", body, true),
        Reply::Json(value) => (200, "application/json", value.to_string(), false),
        Reply::Status(status, value) => (status, "application/json", value.to_string(), false),
    };
    let reason = match status {
        200 => "OK",
        404 => "Not Found",
        529 => "Overloaded",
        _ => "Error",
    };
    let head = if stall {
        format!("HTTP/1.1 {status} {reason}\r\ncontent-type: {content_type}\r\n\r\n")
    } else {
        format!(
            "HTTP/1.1 {status} {reason}\r\ncontent-type: {content_type}\r\ncontent-length: {}\r\nconnection: close\r\n\r\n",
            body.len()
        )
    };
    let _ = socket.write_all(head.as_bytes()).await;
    let _ = socket.write_all(body.as_bytes()).await;
    let _ = socket.flush().await;
    if stall {
        tokio::time::sleep(Duration::from_secs(30)).await;
    }
    let _ = socket.shutdown().await;
}

async fn read_http_request(socket: &mut tokio::net::TcpStream) -> Option<Captured> {
    let mut buf = Vec::new();
    let mut chunk = [0u8; 4096];
    loop {
        let n = socket.read(&mut chunk).await.ok()?;
        if n == 0 {
            return None;
        }
        buf.extend_from_slice(&chunk[..n]);
        if let Some(header_end) = buf.windows(4).position(|w| w == b"\r\n\r\n") {
            let head = String::from_utf8_lossy(&buf[..header_end]).to_string();
            let headers: HashMap<String, String> = head
                .lines()
                .skip(1)
                .filter_map(|line| {
                    let (name, value) = line.split_once(':')?;
                    Some((name.trim().to_lowercase(), value.trim().to_string()))
                })
                .collect();
            let content_length: usize = headers
                .get("content-length")
                .and_then(|v| v.parse().ok())
                .unwrap_or(0);
            let body_start = header_end + 4;
            if buf.len() >= body_start + content_length {
                let body =
                    serde_json::from_slice(&buf[body_start..body_start + content_length]).ok()?;
                return Some(Captured { headers, body });
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Roteiros de resposta
// ---------------------------------------------------------------------------

fn sse_events(events: &[Value]) -> String {
    events
        .iter()
        .map(|e| {
            let event_name = e["type"].as_str().expect("event type");
            format!("event: {event_name}\ndata: {e}\n\n")
        })
        .collect()
}

fn message_start() -> Value {
    json!({"type":"message_start","message":{"id":"msg_stream","type":"message","role":"assistant","model":"mock-model","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":0}}})
}

/// O `event: error` que a API (e o model-router) mandam dentro do SSE.
fn sse_error(kind: &str, message: &str) -> String {
    let data = json!({"type":"error","error":{"type":kind,"message":message}});
    format!("event: error\ndata: {data}\n\n")
}

fn text_block(text: &str) -> Vec<Value> {
    vec![
        json!({"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":text}}),
        json!({"type":"content_block_stop","index":0}),
    ]
}

fn fallback_message(text: &str) -> Value {
    json!({
        "id": "msg_fallback",
        "type": "message",
        "role": "assistant",
        "model": "mock-model",
        "content": [{"type": "text", "text": text}],
        "stop_reason": "end_turn",
        "stop_sequence": null,
        "usage": {"input_tokens": 12, "output_tokens": 6}
    })
}

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

struct Fixture {
    client: ClaudeSDKClient,
    _config_dir: tempfile::TempDir,
    _cwd: tempfile::TempDir,
}

async fn fixture(api: &MockApi, extra_env: &[(&str, &str)]) -> Fixture {
    let config_dir = tempfile::tempdir().expect("config dir");
    let cwd = tempfile::tempdir().expect("cwd");
    let mut env = HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.path().display().to_string(),
        ),
    ]);
    for (key, value) in extra_env {
        env.insert((*key).to_string(), (*value).to_string());
    }
    let transport_options = ClaudeAgentOptions {
        env: env.clone(),
        cwd: Some(cwd.path().to_path_buf()),
        max_turns: Some(5),
        tools: Some(ToolsConfig::List(vec!["Bash".to_string()])),
        strict_mcp_config: true,
        ..Default::default()
    };
    let client_options = ClaudeAgentOptions {
        env,
        cwd: Some(cwd.path().to_path_buf()),
        ..Default::default()
    };
    let transport = NativeApiTransport::new(transport_options);
    let client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    Fixture {
        client,
        _config_dir: config_dir,
        _cwd: cwd,
    }
}

async fn run_one(fx: &mut Fixture, prompt: &str) -> Vec<Message> {
    fx.client.connect().await.expect("connect");
    fx.client.query(prompt).await.expect("query");
    let messages = tokio::time::timeout(Duration::from_secs(60), fx.client.receive_response())
        .await
        .expect("o turno termina")
        .expect("response");
    fx.client.disconnect().await.expect("disconnect");
    messages
}

fn result_of(messages: &[Message]) -> ResultMessage {
    messages
        .iter()
        .find_map(|m| match m {
            Message::Result(r) => Some(r.clone()),
            _ => None,
        })
        .expect("um ResultMessage")
}

fn assert_success_with(result: &ResultMessage, text: &str) {
    assert!(
        !result.is_error,
        "o turno devia concluir com sucesso: {result:?}"
    );
    assert_eq!(result.subtype, "success");
    assert_eq!(result.result.as_deref(), Some(text));
}

// ---------------------------------------------------------------------------
// Gatilhos do fallback
// ---------------------------------------------------------------------------

/// O caso de produção: o router responde a streaming com 200 e um
/// `event: error` de sobrecarga, e a não-streaming vai para o provider de
/// fallback, que responde.
#[tokio::test]
async fn event_error_in_the_sse_is_retried_without_streaming() {
    let api = MockApi::start(
        vec![Reply::Sse(sse_error("overloaded_error", "Overloaded"))],
        vec![Reply::Json(fallback_message(
            "resposta do provider de fallback",
        ))],
    )
    .await;
    let mut fx = fixture(&api, &[]).await;

    let messages = run_one(&mut fx, "oi").await;

    assert_success_with(&result_of(&messages), "resposta do provider de fallback");
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2, "uma streaming e UMA não-streaming");
    assert!(requests[0].is_streaming());
    assert!(!requests[1].is_streaming());

    // A MESMA chamada: mesmo modelo, mensagens, system e tools, com o
    // `max_tokens` no teto da não-streaming e os mesmos headers.
    let (stream_body, fallback_body) = (&requests[0].body, &requests[1].body);
    for field in ["model", "messages", "system", "tools"] {
        assert_eq!(stream_body[field], fallback_body[field], "campo {field}");
    }
    let max_tokens = fallback_body["max_tokens"].as_u64().expect("max_tokens");
    assert!(max_tokens <= 64_000);
    assert_eq!(
        max_tokens,
        stream_body["max_tokens"]
            .as_u64()
            .expect("max_tokens")
            .min(64_000)
    );
    for header in ["x-api-key", "anthropic-version", "anthropic-beta"] {
        assert_eq!(
            requests[0].headers.get(header),
            requests[1].headers.get(header),
            "header {header}"
        );
    }

    // A resposta da não-streaming sai como mensagem de assistente.
    let assistant_texts: Vec<String> = messages
        .iter()
        .filter_map(|m| match m {
            Message::Assistant(a) => Some(format!("{:?}", a.content)),
            _ => None,
        })
        .collect();
    assert_eq!(assistant_texts.len(), 1, "{assistant_texts:?}");
    assert!(assistant_texts[0].contains("resposta do provider de fallback"));
}

/// Erro no meio do stream, depois de um `tool_use` completo: o que o stream
/// entregou fica órfão (o tombstone do CLI), e só a resposta da
/// não-streaming conta; o `tool_use` órfão não roda.
#[tokio::test]
async fn an_error_after_a_complete_block_discards_the_orphaned_tool_use() {
    let mut events = vec![message_start()];
    events.extend([
        json!({"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":"toolu_orphan","name":"Bash"}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"{\"command\":\"echo orfao\"}"}}),
        json!({"type":"content_block_stop","index":0}),
    ]);
    let sse = format!(
        "{}{}",
        sse_events(&events),
        sse_error("api_error", "Internal server error")
    );
    let api = MockApi::start(
        vec![Reply::Sse(sse)],
        vec![Reply::Json(fallback_message("sem ferramenta desta vez"))],
    )
    .await;
    let mut fx = fixture(&api, &[]).await;

    let messages = run_one(&mut fx, "oi").await;

    assert_success_with(&result_of(&messages), "sem ferramenta desta vez");
    let requests = api.requests().await;
    assert_eq!(
        requests.len(),
        2,
        "o tool_use órfão não pode gerar uma terceira chamada"
    );
    let has_tool_result = messages.iter().any(
        |m| matches!(m, Message::User(u) if format!("{:?}", u.content).contains("toolu_orphan")),
    );
    assert!(!has_tool_result, "o tool_use órfão não roda");
}

/// Stream que termina limpo com `message_start` e nada mais: o CLI trata
/// como "Stream ended without receiving any events" e cai na não-streaming.
#[tokio::test]
async fn a_stream_that_ends_after_message_start_falls_back() {
    let api = MockApi::start(
        vec![Reply::Sse(sse_events(&[message_start()]))],
        vec![Reply::Json(fallback_message("veio da não-streaming"))],
    )
    .await;
    let mut fx = fixture(&api, &[]).await;

    let messages = run_one(&mut fx, "oi").await;

    assert_success_with(&result_of(&messages), "veio da não-streaming");
    assert_eq!(api.requests().await.len(), 2);
}

/// Stream com corpo vazio (sem nenhum evento): também cai na não-streaming,
/// o erro "antes do primeiro evento" não é exceção.
#[tokio::test]
async fn an_empty_stream_falls_back() {
    let api = MockApi::start(
        vec![Reply::Sse(String::new())],
        vec![Reply::Json(fallback_message("corpo vazio contornado"))],
    )
    .await;
    let mut fx = fixture(&api, &[]).await;

    let messages = run_one(&mut fx, "oi").await;

    assert_success_with(&result_of(&messages), "corpo vazio contornado");
    assert_eq!(api.requests().await.len(), 2);
}

/// Blocos completos e `stop_reason` sem `message_stop`: o CLI segue com o
/// que chegou, sem fallback.
#[tokio::test]
async fn a_stream_without_message_stop_but_with_blocks_does_not_fall_back() {
    let mut events = vec![message_start()];
    events.extend(text_block("chegou sem message_stop"));
    events.push(
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":4}}),
    );
    let api = MockApi::start(
        vec![Reply::Sse(sse_events(&events))],
        vec![Reply::Json(fallback_message("não devia ser chamada"))],
    )
    .await;
    let mut fx = fixture(&api, &[]).await;

    let messages = run_one(&mut fx, "oi").await;

    assert_success_with(&result_of(&messages), "chegou sem message_stop");
    let requests = api.requests().await;
    assert_eq!(requests.len(), 1);
    assert!(requests[0].is_streaming());
}

/// 404 na abertura do stream: o CLI repete sem streaming.
#[tokio::test]
async fn a_404_on_the_streaming_endpoint_falls_back() {
    let api = MockApi::start(
        vec![Reply::Status(
            404,
            json!({"type":"error","error":{"type":"not_found_error","message":"Not found"}}),
        )],
        vec![Reply::Json(fallback_message("sem endpoint de stream"))],
    )
    .await;
    let mut fx = fixture(&api, &[]).await;

    let messages = run_one(&mut fx, "oi").await;

    assert_success_with(&result_of(&messages), "sem endpoint de stream");
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    assert!(requests[0].is_streaming());
    assert!(!requests[1].is_streaming());
}

/// Watchdog ligado: o stream que para de mandar evento é abandonado e a
/// chamada vai sem streaming.
#[tokio::test]
async fn the_idle_watchdog_abandons_a_stalled_stream() {
    let api = MockApi::start(
        vec![Reply::SseThenStall(sse_events(&[message_start()]))],
        vec![Reply::Json(fallback_message("o watchdog destravou"))],
    )
    .await;
    let mut fx = fixture(
        &api,
        &[
            ("CLAUDE_ENABLE_STREAM_WATCHDOG", "1"),
            ("CLAUDE_STREAM_IDLE_TIMEOUT_MS", "300"),
        ],
    )
    .await;

    let messages = run_one(&mut fx, "oi").await;

    assert_success_with(&result_of(&messages), "o watchdog destravou");
    assert_eq!(api.requests().await.len(), 2);
}

/// `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK`: o erro do stream encerra o
/// turno, sem a chamada sem streaming.
#[tokio::test]
async fn the_fallback_can_be_disabled_by_env() {
    let api = MockApi::start(
        vec![Reply::Sse(sse_error("overloaded_error", "Overloaded"))],
        vec![Reply::Json(fallback_message("não devia ser chamada"))],
    )
    .await;
    let mut fx = fixture(&api, &[("CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK", "1")]).await;

    let messages = run_one(&mut fx, "oi").await;

    let result = result_of(&messages);
    assert!(result.is_error, "{result:?}");
    let requests = api.requests().await;
    assert_eq!(requests.len(), 1);
    assert!(requests[0].is_streaming());
}

/// Um `event: error` de sobrecarga já conta como o primeiro 529 da
/// não-streaming (`initialConsecutive529Errors: 1`): com o limite de 3,
/// bastam mais DOIS 529 para desistir, e o terceiro sucesso nunca é pedido.
#[tokio::test]
async fn an_overloaded_stream_error_counts_as_the_first_529() {
    let overloaded =
        json!({"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}});
    let api = MockApi::start(
        vec![Reply::Sse(sse_error("overloaded_error", "Overloaded"))],
        vec![
            Reply::Status(529, overloaded.clone()),
            Reply::Status(529, overloaded),
            Reply::Json(fallback_message("não devia chegar aqui")),
        ],
    )
    .await;
    let mut fx = fixture(&api, &[]).await;

    let messages = run_one(&mut fx, "oi").await;

    let result = result_of(&messages);
    assert!(result.is_error, "{result:?}");
    let non_streaming = api
        .requests()
        .await
        .iter()
        .filter(|r| !r.is_streaming())
        .count();
    assert_eq!(non_streaming, 2);
}
