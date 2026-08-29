//! Conformidade do transporte nativo: o `ClaudeSDKClient` da main dirigindo o
//! `NativeApiTransport` contra um servidor HTTP local que fala o SSE da API
//! Anthropic. Nenhum teste daqui toca rede externa nem gasta token.
//!
//! O padrão exercitado é o do consumidor real (ahamkara): duas
//! `ClaudeAgentOptions` (transporte e cliente), servidor MCP in-process nas
//! duas, `can_use_tool` só no cliente, hooks `PostToolUse`, session store para
//! o mirror, resume por id de sessão.

use std::collections::HashMap;
use std::sync::Arc;

use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::Mutex;

use rust_agent_sdk::sdk_mcp::{PropertySchema, SdkMcpServer, ToolInputSchema, ToolOutput};
use rust_agent_sdk::{
    ClaudeAgentOptions, ClaudeSDKClient, ContentBlock, HookEvent, HookJSONOutput, HookMatcher,
    HookSpecificOutput, InMemorySessionStore, Message, NativeApiTransport, PermissionResult,
    PermissionResultAllow, PermissionResultDeny, SessionStore, ToolsConfig,
};

// ---------------------------------------------------------------------------
// Mock da API Anthropic: um script de respostas SSE, servidas em ordem, com
// captura de cada corpo de request para asserção.
// ---------------------------------------------------------------------------

struct MockApi {
    addr: String,
    requests: Arc<Mutex<Vec<Value>>>,
}

impl MockApi {
    /// Sobe o mock com um roteiro de respostas: a N-ésima request recebe a
    /// N-ésima resposta (a última repete para requests excedentes).
    async fn start(script: Vec<String>) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0")
            .await
            .expect("bind mock api");
        let addr = format!("http://{}", listener.local_addr().expect("local addr"));
        let requests: Arc<Mutex<Vec<Value>>> = Arc::new(Mutex::new(Vec::new()));
        let captured = Arc::clone(&requests);
        tokio::spawn(async move {
            let script = Arc::new(script);
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
        if let Some(header_end) = find_header_end(&buf) {
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

fn find_header_end(buf: &[u8]) -> Option<usize> {
    buf.windows(4).position(|w| w == b"\r\n\r\n")
}

/// Uma resposta SSE de texto puro que encerra o turno.
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

/// Uma resposta SSE que chama uma tool.
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

fn sse_events(events: &[Value]) -> String {
    events
        .iter()
        .map(|e| {
            let event_name = e["type"].as_str().expect("event type");
            format!("event: {event_name}\ndata: {e}\n\n")
        })
        .collect()
}

// ---------------------------------------------------------------------------
// Montagem no padrão do consumidor real: duas options, MCP nas duas.
// ---------------------------------------------------------------------------

struct Fixture {
    client: ClaudeSDKClient,
    _config_dir: tempfile::TempDir,
    config_dir_path: String,
    cwd: tempfile::TempDir,
}

struct FixtureSpec {
    mcp_server: Option<Arc<SdkMcpServer>>,
    can_use_tool: Option<rust_agent_sdk::CanUseToolFn>,
    post_tool_use: Option<rust_agent_sdk::HookCallbackFn>,
    session_store: bool,
    resume: Option<String>,
    max_turns: Option<i64>,
    store: Option<Arc<InMemorySessionStore>>,
    config_dir: Option<tempfile::TempDir>,
}

impl Default for FixtureSpec {
    fn default() -> Self {
        Self {
            mcp_server: None,
            can_use_tool: None,
            post_tool_use: None,
            session_store: false,
            resume: None,
            max_turns: Some(10),
            store: None,
            config_dir: None,
        }
    }
}

fn base_options(spec: &FixtureSpec, api_addr: &str, config_dir: &str, cwd: &str) -> ClaudeAgentOptions {
    let mut env = HashMap::new();
    env.insert("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string());
    env.insert("ANTHROPIC_BASE_URL".to_string(), api_addr.to_string());
    env.insert("ANTHROPIC_MODEL".to_string(), "mock-model".to_string());
    env.insert("CLAUDE_CONFIG_DIR".to_string(), config_dir.to_string());
    let mut options = ClaudeAgentOptions {
        env,
        cwd: Some(std::path::PathBuf::from(cwd)),
        max_turns: spec.max_turns,
        resume: spec.resume.clone(),
        tools: Some(ToolsConfig::List(Vec::new())),
        allowed_tools: Vec::new(),
        strict_mcp_config: true,
        ..Default::default()
    };
    if let Some(server) = &spec.mcp_server {
        options.add_sdk_mcp_server(Arc::clone(server));
    }
    options
}

async fn fixture(mut spec: FixtureSpec, api: &MockApi) -> Fixture {
    let config_dir = match spec.config_dir.take() {
        Some(dir) => dir,
        None => tempfile::tempdir().expect("config dir"),
    };
    let config_dir_path = config_dir.path().display().to_string();
    let cwd = tempfile::tempdir().expect("cwd");
    let cwd_path = cwd.path().display().to_string();

    let transport_options = base_options(&spec, &api.addr, &config_dir_path, &cwd_path);
    let mut client_options = base_options(&spec, &api.addr, &config_dir_path, &cwd_path);

    // O session_store nas DUAS options, como o consumidor real faz: no
    // transporte ele liga o mirror; no cliente é de onde o batcher nasce.
    let mut transport_options = transport_options;
    if spec.session_store {
        let store = spec.store.clone().expect("session_store exige o store");
        transport_options.session_store = Some(Box::new(Arc::clone(&store)));
        client_options.session_store = Some(Box::new(store));
    }
    client_options.can_use_tool = spec.can_use_tool.take();
    if let Some(hook) = spec.post_tool_use.take() {
        client_options.hooks = Some(HashMap::from([(
            HookEvent::PostToolUse,
            vec![HookMatcher {
                matcher: None,
                hooks: vec![hook],
                timeout: None,
            }],
        )]));
    }

    let transport = NativeApiTransport::new(transport_options);
    let client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    Fixture {
        client,
        _config_dir: config_dir,
        config_dir_path,
        cwd,
    }
}

/// Servidor MCP com uma tool `remember` que registra as chamadas recebidas.
fn mcp_server_with_log() -> (Arc<SdkMcpServer>, Arc<Mutex<Vec<Value>>>) {
    let calls: Arc<Mutex<Vec<Value>>> = Arc::new(Mutex::new(Vec::new()));
    let log = Arc::clone(&calls);
    let server = SdkMcpServer::builder("bench")
        .tool(
            "remember",
            "Grava um fato.",
            ToolInputSchema::object().required("fact", PropertySchema::string().description("O fato a gravar.")),
            move |input: Value| {
                let log = Arc::clone(&log);
                async move {
                    log.lock().await.push(input);
                    Ok(ToolOutput::text("gravado"))
                }
            },
        )
        .build_shared();
    (server, calls)
}

fn drive(messages: &[Message]) -> (Vec<String>, Option<rust_agent_sdk::ResultMessage>) {
    let mut texts = Vec::new();
    let mut result = None;
    for message in messages {
        match message {
            Message::Assistant(assistant) => {
                for block in &assistant.content {
                    if let ContentBlock::Text(text) = block {
                        texts.push(text.text.clone());
                    }
                }
            }
            Message::Result(r) => result = Some(r.clone()),
            _ => {}
        }
    }
    (texts, result)
}

// ---------------------------------------------------------------------------
// Os contratos
// ---------------------------------------------------------------------------

#[tokio::test]
async fn a_text_only_session_yields_assistant_and_result() {
    let api = MockApi::start(vec![sse_text("olá do mock")]).await;
    let mut fx = fixture(FixtureSpec::default(), &api).await;

    fx.client.connect().await.expect("connect");
    fx.client.query("diga olá").await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");

    let (texts, result) = drive(&messages);
    // Contrato: o texto do assistant atravessa transporte e parser intactos.
    assert_eq!(texts, vec!["olá do mock".to_string()]);
    let result = result.expect("um result encerra o turno");
    // Contrato: o turno sem erro fecha com subtype success e session_id posto.
    assert_eq!(result.subtype, "success");
    assert!(!result.session_id.is_empty());
    assert!(!result.is_error);

    // Contrato: a request enviada à API carrega o prompt do usuário.
    let requests = api.requests().await;
    assert_eq!(requests.len(), 1);
    let body = requests[0].to_string();
    assert!(body.contains("diga olá"), "request sem o prompt: {body}");
}

#[tokio::test]
async fn a_tool_cycle_runs_the_mcp_tool_and_the_second_request_carries_the_result() {
    let (server, calls) = mcp_server_with_log();
    let api = MockApi::start(vec![
        sse_tool_call("mcp__bench__remember", &json!({"fact": "o mock funciona"})),
        sse_text("gravado com sucesso"),
    ])
    .await;
    let allow: rust_agent_sdk::CanUseToolFn = Arc::new(|_name, _input, _ctx| {
        Box::pin(async { PermissionResult::Allow(PermissionResultAllow::default()) })
    });
    let mut fx = fixture(
        FixtureSpec {
            mcp_server: Some(server),
            can_use_tool: Some(allow),
            ..Default::default()
        },
        &api,
    )
    .await;

    fx.client.connect().await.expect("connect");
    fx.client.query("grave um fato").await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");

    // Contrato: a tool do servidor MCP in-process foi executada com o input do modelo.
    let calls = calls.lock().await;
    assert_eq!(calls.len(), 1);
    assert_eq!(calls[0]["fact"], "o mock funciona");

    // Contrato: a segunda request à API contém o tool_result do ciclo.
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let second = requests[1].to_string();
    assert!(second.contains("tool_result"), "segunda request sem tool_result: {second}");
    assert!(second.contains("gravado"), "tool_result sem o output da tool: {second}");

    let (_, result) = drive(&messages);
    assert_eq!(result.expect("result").subtype, "success");
}

#[tokio::test]
async fn can_use_tool_deny_reaches_the_model_and_the_result_counts_the_denial() {
    let (server, calls) = mcp_server_with_log();
    let api = MockApi::start(vec![
        sse_tool_call("mcp__bench__remember", &json!({"fact": "não deveria gravar"})),
        sse_text("entendi, vou commitar"),
    ])
    .await;
    let deny: rust_agent_sdk::CanUseToolFn = Arc::new(|_name, _input, _ctx| {
        Box::pin(async {
            PermissionResult::Deny(PermissionResultDeny {
                behavior: "deny".to_string(),
                message: "orçamento em CommitOnly: chame commit_ingest".to_string(),
                interrupt: false,
            })
        })
    });
    let mut fx = fixture(
        FixtureSpec {
            mcp_server: Some(server),
            can_use_tool: Some(deny),
            ..Default::default()
        },
        &api,
    )
    .await;

    fx.client.connect().await.expect("connect");
    fx.client.query("grave um fato").await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");

    // Contrato: a tool NUNCA executa quando o can_use_tool nega.
    assert!(calls.lock().await.is_empty());

    // Contrato: a MENSAGEM da recusa chega ao modelo como tool_result — é o
    // canal de steering do commit forçado.
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let second = requests[1].to_string();
    assert!(
        second.contains("orçamento em CommitOnly"),
        "a recusa não chegou ao modelo: {second}"
    );

    // Contrato: o result contabiliza a negação com o nome da tool.
    let (_, result) = drive(&messages);
    let result = result.expect("result");
    let denials = result.permission_denials.expect("permission_denials");
    assert_eq!(denials.len(), 1);
    assert_eq!(denials[0]["tool_name"], "mcp__bench__remember");
}

#[tokio::test]
async fn post_tool_use_hook_context_reaches_the_model() {
    let (server, _calls) = mcp_server_with_log();
    let api = MockApi::start(vec![
        sse_tool_call("mcp__bench__remember", &json!({"fact": "com aviso"})),
        sse_text("ok"),
    ])
    .await;
    let allow: rust_agent_sdk::CanUseToolFn = Arc::new(|_name, _input, _ctx| {
        Box::pin(async { PermissionResult::Allow(PermissionResultAllow::default()) })
    });
    let hook: rust_agent_sdk::HookCallbackFn = Arc::new(|_input, _tool_use_id, _ctx| {
        Box::pin(async {
            HookJSONOutput::Sync {
                continue_: None,
                suppress_output: None,
                stop_reason: None,
                decision: None,
                system_message: None,
                reason: None,
                hook_specific_output: Some(HookSpecificOutput::PostToolUse {
                    additional_context: Some("AVISO: 50% do orçamento consumido".to_string()),
                    updated_mcp_tool_output: None,
                }),
            }
        })
    });
    let mut fx = fixture(
        FixtureSpec {
            mcp_server: Some(server),
            can_use_tool: Some(allow),
            post_tool_use: Some(hook),
            ..Default::default()
        },
        &api,
    )
    .await;

    fx.client.connect().await.expect("connect");
    fx.client.query("grave").await.expect("query");
    let _ = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");

    // Contrato: o additionalContext do hook PostToolUse é anexado ao
    // tool_result e portanto chega ao modelo na request seguinte.
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let second = requests[1].to_string();
    assert!(
        second.contains("50% do orçamento"),
        "o aviso do hook não chegou ao modelo: {second}"
    );
}

#[tokio::test]
async fn the_session_store_mirrors_the_transcript() {
    let api = MockApi::start(vec![sse_text("espelhado")]).await;
    let store = Arc::new(InMemorySessionStore::new());
    let mut fx = fixture(
        FixtureSpec {
            session_store: true,
            store: Some(Arc::clone(&store)),
            ..Default::default()
        },
        &api,
    )
    .await;

    fx.client.connect().await.expect("connect");
    fx.client.query("espelhe isto").await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");

    // Contrato: o mirror leva prompt E resposta ao session store do cliente,
    // sob a MESMA chave (project_key, session_id) que o subprocess usaria.
    let (_, result) = drive(&messages);
    let session_id = result.expect("result").session_id;
    let project_key = rust_agent_sdk::project_key_for_directory(Some(
        &fx.cwd.path().display().to_string(),
    ))
    .expect("project key");
    let key = rust_agent_sdk::SessionKey::new(project_key, session_id);
    let entries = store
        .load(&key)
        .await
        .expect("load")
        .expect("entries da sessão");
    let all = serde_json::to_string(&entries).expect("serialize");
    assert!(all.contains("espelhe isto"), "prompt fora do mirror: {all}");
    assert!(all.contains("espelhado"), "resposta fora do mirror: {all}");
}

#[tokio::test]
async fn resume_reloads_the_disk_history_and_keeps_the_session_id() {
    // Primeira sessão: grava o transcript em disco.
    let api = MockApi::start(vec![sse_text("primeira resposta"), sse_text("segunda resposta")]).await;
    let mut fx = fixture(FixtureSpec::default(), &api).await;
    fx.client.connect().await.expect("connect");
    fx.client.query("primeiro turno").await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");
    let (_, result) = drive(&messages);
    let session_id = result.expect("result").session_id;

    // Segunda sessão: resume pelo MESMO config_dir e cwd.
    let config_dir_path = fx.config_dir_path.clone();
    let cwd_path = fx.cwd.path().display().to_string();
    let mut transport_options = ClaudeAgentOptions {
        env: HashMap::from([
            ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
            ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
            ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
            ("CLAUDE_CONFIG_DIR".to_string(), config_dir_path.clone()),
        ]),
        cwd: Some(std::path::PathBuf::from(&cwd_path)),
        resume: Some(session_id.clone()),
        max_turns: Some(10),
        tools: Some(ToolsConfig::List(Vec::new())),
        ..Default::default()
    };
    transport_options.strict_mcp_config = true;
    let client_options = ClaudeAgentOptions {
        env: transport_options.env.clone(),
        cwd: transport_options.cwd.clone(),
        resume: Some(session_id.clone()),
        ..Default::default()
    };
    let transport = NativeApiTransport::new(transport_options);
    let mut client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    client.connect().await.expect("connect resumed");
    client.query("segundo turno").await.expect("query");
    let messages = client.receive_response().await.expect("response");
    client.disconnect().await.expect("disconnect");

    // Contrato: a sessão retomada mantém o id.
    let (_, result) = drive(&messages);
    assert_eq!(result.expect("result").session_id, session_id);

    // Contrato: a request da retomada carrega o histórico da primeira sessão.
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let resumed = requests[1].to_string();
    assert!(
        resumed.contains("primeiro turno") && resumed.contains("primeira resposta"),
        "resume sem o histórico do disco: {resumed}"
    );
}

#[tokio::test]
async fn two_turns_share_one_session_and_the_second_request_sees_the_first() {
    let api = MockApi::start(vec![sse_text("resposta um"), sse_text("resposta dois")]).await;
    let mut fx = fixture(FixtureSpec::default(), &api).await;

    fx.client.connect().await.expect("connect");
    fx.client.query("turno um").await.expect("query 1");
    let first = fx.client.receive_response().await.expect("response 1");
    fx.client.query("turno dois").await.expect("query 2");
    let second = fx.client.receive_response().await.expect("response 2");
    fx.client.disconnect().await.expect("disconnect");

    // Contrato: multi-turno na MESMA sessão — mesmo session_id nos dois results.
    let (_, r1) = drive(&first);
    let (_, r2) = drive(&second);
    assert_eq!(
        r1.expect("result 1").session_id,
        r2.expect("result 2").session_id
    );

    // Contrato: a request do turno dois vê o turno um inteiro.
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let body = requests[1].to_string();
    assert!(
        body.contains("turno um") && body.contains("resposta um") && body.contains("turno dois"),
        "o turno dois não viu o histórico: {body}"
    );
}
