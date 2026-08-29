//! Paridade do transporte nativo com o pipeline do CLI: modos de permissão,
//! hooks (PreToolUse/UserPromptSubmit/Stop), tools de tarefa, plan mode e
//! background. Nenhum teste toca rede externa nem gasta token — tudo roda
//! contra o MockApi local.

use std::collections::HashMap;
use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::Arc;

use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::Mutex;

use rust_agent_sdk::{
    ClaudeAgentOptions, ClaudeSDKClient, HookEvent, HookJSONOutput, HookMatcher,
    HookSpecificOutput, Message, NativeApiTransport, PermissionMode, PermissionResult,
    PermissionResultAllow, ToolsConfig,
};

// ---------------------------------------------------------------------------
// MockApi (mesmo padrão do test_native_transport)
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

fn sse_tool_call_id(id: &str, tool_name: &str, arguments: &Value) -> String {
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

fn sse_tool_call(tool_name: &str, arguments: &Value) -> String {
    sse_tool_call_id("toolu_1", tool_name, arguments)
}

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

struct Fixture {
    client: ClaudeSDKClient,
    _config_dir: tempfile::TempDir,
    _cwd: tempfile::TempDir,
}

#[derive(Default)]
struct Spec {
    tools: Option<Vec<String>>,
    permission_mode: Option<PermissionMode>,
    can_use_tool: Option<rust_agent_sdk::CanUseToolFn>,
    hooks: Option<HashMap<HookEvent, Vec<HookMatcher>>>,
    allowed_tools: Vec<String>,
    disallowed_tools: Vec<String>,
}

async fn fixture(spec: Spec, api: &MockApi) -> Fixture {
    let config_dir = tempfile::tempdir().expect("config dir");
    let cwd = tempfile::tempdir().expect("cwd");
    let env = HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.path().display().to_string(),
        ),
    ]);
    let transport_options = ClaudeAgentOptions {
        env: env.clone(),
        cwd: Some(cwd.path().to_path_buf()),
        max_turns: Some(10),
        tools: Some(ToolsConfig::List(spec.tools.clone().unwrap_or_default())),
        permission_mode: spec.permission_mode,
        allowed_tools: spec.allowed_tools.clone(),
        disallowed_tools: spec.disallowed_tools.clone(),
        strict_mcp_config: true,
        ..Default::default()
    };
    let client_options = ClaudeAgentOptions {
        env,
        cwd: Some(cwd.path().to_path_buf()),
        can_use_tool: spec.can_use_tool,
        hooks: spec.hooks,
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

fn allow_all() -> rust_agent_sdk::CanUseToolFn {
    Arc::new(|_name, _input, _ctx| {
        Box::pin(async { PermissionResult::Allow(PermissionResultAllow::default()) })
    })
}

fn result_of(messages: &[Message]) -> Option<rust_agent_sdk::ResultMessage> {
    messages.iter().find_map(|m| match m {
        Message::Result(r) => Some(r.clone()),
        _ => None,
    })
}

async fn run_one(fx: &mut Fixture, prompt: &str) -> Vec<Message> {
    fx.client.connect().await.expect("connect");
    fx.client.query(prompt).await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");
    messages
}

// ---------------------------------------------------------------------------
// Modos de permissão
// ---------------------------------------------------------------------------

#[tokio::test]
async fn bypass_permissions_runs_tools_without_can_use_tool() {
    let api = MockApi::start(vec![
        sse_tool_call("Bash", &json!({"command": "echo paridade-bypass"})),
        sse_text("feito"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            // SEM can_use_tool: em bypass a tool roda mesmo assim.
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "rode echo").await;
    let result = result_of(&messages).expect("result");
    assert_eq!(result.subtype, "success");
    let second = api.requests().await[1].to_string();
    assert!(
        second.contains("paridade-bypass"),
        "o output do Bash não voltou ao modelo: {second}"
    );
    assert!(result.permission_denials.unwrap_or_default().is_empty());
}

#[tokio::test]
async fn plan_mode_denies_mutating_tools_with_a_teaching_message() {
    let api = MockApi::start(vec![
        sse_tool_call("Write", &json!({"file_path": "/tmp/x", "content": "y"})),
        sse_text("entendi"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Write".to_string(), "Read".to_string()]),
            permission_mode: Some(PermissionMode::Plan),
            can_use_tool: Some(allow_all()),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "escreva um arquivo").await;
    let result = result_of(&messages).expect("result");
    // Contrato: em plan mode a mutação NÃO roda e a recusa ensina o caminho.
    let second = api.requests().await[1].to_string();
    assert!(
        second.contains("plan mode is active"),
        "a recusa de plan mode não chegou ao modelo: {second}"
    );
    let denials = result.permission_denials.unwrap_or_default();
    assert_eq!(denials.len(), 1);
    assert_eq!(denials[0]["tool_name"], "Write");
}

#[tokio::test]
async fn set_permission_mode_switches_to_bypass_at_runtime() {
    let api = MockApi::start(vec![
        sse_tool_call("Bash", &json!({"command": "echo modo-trocado"})),
        sse_text("ok"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string()]),
            // Default + sem can_use_tool: sem a troca, o Bash seria negado.
            ..Default::default()
        },
        &api,
    )
    .await;
    fx.client.connect().await.expect("connect");
    fx.client
        .set_permission_mode(PermissionMode::BypassPermissions)
        .await
        .expect("set_permission_mode");
    fx.client.query("rode echo").await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");
    let second = api.requests().await[1].to_string();
    assert!(
        second.contains("modo-trocado"),
        "set_permission_mode não teve efeito: {second}"
    );
    assert_eq!(result_of(&messages).expect("result").subtype, "success");
}

#[tokio::test]
async fn disallowed_tools_never_reach_the_request() {
    let api = MockApi::start(vec![sse_text("sem web")]).await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string(), "WebFetch".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            disallowed_tools: vec!["WebFetch".to_string()],
            ..Default::default()
        },
        &api,
    )
    .await;
    let _ = run_one(&mut fx, "oi").await;
    let first = api.requests().await[0].to_string();
    // Contrato: deny incondicional FILTRA a tool do pool antes do request.
    assert!(
        !first.contains("WebFetch"),
        "tool negada ainda ofertada ao modelo: {first}"
    );
    assert!(first.contains("Bash"));
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

fn sync_output(hso: Option<HookSpecificOutput>, decision: Option<&str>, reason: Option<&str>) -> HookJSONOutput {
    HookJSONOutput::Sync {
        continue_: None,
        suppress_output: None,
        stop_reason: None,
        decision: decision.map(str::to_string),
        system_message: None,
        reason: reason.map(str::to_string),
        hook_specific_output: hso,
    }
}

#[tokio::test]
async fn pre_tool_use_hook_deny_blocks_the_tool_and_steers_the_model() {
    let api = MockApi::start(vec![
        sse_tool_call("Bash", &json!({"command": "rm -rf /"})),
        sse_text("cancelado"),
    ])
    .await;
    let hook: rust_agent_sdk::HookCallbackFn = Arc::new(|_input, _id, _ctx| {
        Box::pin(async {
            sync_output(
                Some(HookSpecificOutput::PreToolUse {
                    permission_decision: Some("deny".to_string()),
                    permission_decision_reason: Some(
                        "política: rm recursivo proibido".to_string(),
                    ),
                    updated_input: None,
                    additional_context: None,
                }),
                None,
                None,
            )
        })
    });
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            hooks: Some(HashMap::from([(
                HookEvent::PreToolUse,
                vec![HookMatcher {
                    matcher: None,
                    hooks: vec![hook],
                    timeout: None,
                }],
            )])),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "apague tudo").await;
    // Contrato: o deny do PreToolUse vence até o bypassPermissions e a razão
    // chega ao modelo como tool_result.
    let second = api.requests().await[1].to_string();
    assert!(
        second.contains("rm recursivo proibido"),
        "a razão do hook não chegou ao modelo: {second}"
    );
    let denials = result_of(&messages)
        .expect("result")
        .permission_denials
        .unwrap_or_default();
    assert_eq!(denials.len(), 1);
}

#[tokio::test]
async fn user_prompt_submit_context_reaches_the_request() {
    let api = MockApi::start(vec![sse_text("com contexto")]).await;
    let hook: rust_agent_sdk::HookCallbackFn = Arc::new(|_input, _id, _ctx| {
        Box::pin(async {
            sync_output(
                Some(HookSpecificOutput::UserPromptSubmit {
                    additional_context: Some("[memória]: o deploy é sexta".to_string()),
                }),
                None,
                None,
            )
        })
    });
    let mut fx = fixture(
        Spec {
            hooks: Some(HashMap::from([(
                HookEvent::UserPromptSubmit,
                vec![HookMatcher {
                    matcher: None,
                    hooks: vec![hook],
                    timeout: None,
                }],
            )])),
            ..Default::default()
        },
        &api,
    )
    .await;
    let _ = run_one(&mut fx, "quando é o deploy?").await;
    let first = api.requests().await[0].to_string();
    // Contrato: o additionalContext do UserPromptSubmit entra no turno.
    assert!(
        first.contains("o deploy é sexta"),
        "o contexto do hook não entrou na request: {first}"
    );
}

#[tokio::test]
async fn stop_hook_block_reinjects_the_reason_and_loops() {
    let api = MockApi::start(vec![sse_text("tentativa um"), sse_text("tentativa dois")]).await;
    let fired = Arc::new(AtomicU32::new(0));
    let counter = Arc::clone(&fired);
    let hook: rust_agent_sdk::HookCallbackFn = Arc::new(move |_input, _id, _ctx| {
        let n = counter.fetch_add(1, Ordering::SeqCst);
        Box::pin(async move {
            if n == 0 {
                sync_output(None, Some("block"), Some("os testes ainda não passaram"))
            } else {
                sync_output(None, None, None)
            }
        })
    });
    let mut fx = fixture(
        Spec {
            hooks: Some(HashMap::from([(
                HookEvent::Stop,
                vec![HookMatcher {
                    matcher: None,
                    hooks: vec![hook],
                    timeout: None,
                }],
            )])),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "termine a task").await;
    // Contrato: o block do Stop hook reinjeta a razão e o loop roda de novo.
    assert_eq!(fired.load(Ordering::SeqCst), 2, "o Stop hook deveria rodar duas vezes");
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let second = requests[1].to_string();
    assert!(
        second.contains("os testes ainda não passaram"),
        "a razão do stop hook não voltou ao modelo: {second}"
    );
    assert_eq!(result_of(&messages).expect("result").subtype, "success");
}

// ---------------------------------------------------------------------------
// Tools de tarefa e background
// ---------------------------------------------------------------------------

#[tokio::test]
async fn task_create_and_list_share_the_session_store() {
    let api = MockApi::start(vec![
        sse_tool_call_id("toolu_a", "TaskCreate", &json!({"subject": "estudar paridade", "description": "ler o plano"})),
        sse_tool_call_id("toolu_b", "TaskList", &json!({})),
        sse_text("listado"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["TaskCreate".to_string(), "TaskList".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "crie e liste").await;
    assert_eq!(result_of(&messages).expect("result").subtype, "success");
    let third = api.requests().await[2].to_string();
    // Contrato: o TaskList vê a task criada pelo TaskCreate no mesmo store.
    assert!(
        third.contains("estudar paridade"),
        "TaskList não viu a task criada: {third}"
    );
}

#[tokio::test]
async fn bash_background_registers_a_task_and_task_output_reads_it() {
    let api = MockApi::start(vec![
        sse_tool_call_id("toolu_a", "Bash", &json!({"command": "echo saida-de-fundo", "run_in_background": true})),
        sse_tool_call_id("toolu_b", "TaskOutput", &json!({"task_id": "bash_1"})),
        sse_text("li o output"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string(), "TaskOutput".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "rode em background").await;
    assert_eq!(result_of(&messages).expect("result").subtype, "success");
    let requests = api.requests().await;
    let second = requests[1].to_string();
    // Contrato: o Bash devolve o id e o caminho do output imediatamente.
    assert!(
        second.contains("bash_1"),
        "o id da task de background não voltou: {second}"
    );
    let third = requests[2].to_string();
    assert!(
        third.contains("status:"),
        "TaskOutput não devolveu status: {third}"
    );
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

#[tokio::test]
async fn get_context_usage_returns_an_estimate_after_a_turn() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let mut fx = fixture(Spec::default(), &api).await;
    fx.client.connect().await.expect("connect");
    fx.client.query("oi").await.expect("query");
    let _ = fx.client.receive_response().await.expect("response");
    let usage = fx.client.get_context_usage().await.expect("context usage");
    fx.client.disconnect().await.expect("disconnect");
    assert!(usage.total_tokens > 0, "estimativa zerada: {usage:?}");
    assert!(usage.max_tokens >= 200_000);
    assert_eq!(usage.model, "mock-model");
}

#[tokio::test]
async fn system_prompt_preset_reaches_the_request_with_append() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let config_dir = tempfile::tempdir().expect("config");
    let cwd = tempfile::tempdir().expect("cwd");
    let env = HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.path().display().to_string(),
        ),
    ]);
    let transport_options = ClaudeAgentOptions {
        env: env.clone(),
        cwd: Some(cwd.path().to_path_buf()),
        tools: Some(ToolsConfig::List(Vec::new())),
        system_prompt: Some(rust_agent_sdk::SystemPromptConfig::Structured(
            rust_agent_sdk::SystemPrompt::Preset {
                preset: "claude_code".to_string(),
                append: Some("Fale sempre em pt-BR.".to_string()),
                exclude_dynamic_sections: None,
            },
        )),
        strict_mcp_config: true,
        ..Default::default()
    };
    let client_options = ClaudeAgentOptions {
        env,
        cwd: Some(cwd.path().to_path_buf()),
        ..Default::default()
    };
    let transport = NativeApiTransport::new(transport_options);
    let mut client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    client.connect().await.expect("connect");
    client.query("oi").await.expect("query");
    let _ = client.receive_response().await.expect("response");
    client.disconnect().await.expect("disconnect");
    let first = api.requests().await[0].to_string();
    // Contrato: o preset gera identidade + ambiente, e o append concatena.
    assert!(
        first.contains("You are Claude Code"),
        "preset ausente do system: {first}"
    );
    assert!(
        first.contains("Fale sempre em pt-BR"),
        "append ausente do system: {first}"
    );
}

// ---------------------------------------------------------------------------
// Server tools (web_search executada pelo SERVIDOR da API)
// ---------------------------------------------------------------------------

/// SSE em que o SERVIDOR já executou a busca: server_tool_use +
/// web_search_tool_result chegam prontos, e o texto vem depois.
fn sse_server_web_search(answer: &str) -> String {
    sse_events(&[
        json!({"type":"message_start","message":{"id":"msg_ws","model":"mock-model","role":"assistant","usage":{"input_tokens":30,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"server_tool_use","id":"srvtoolu_1","name":"web_search"}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"{\"query\":\"preço bitcoin\"}"}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"content_block_start","index":1,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_1","content":[{"type":"web_search_result","title":"Preço","url":"https://exemplo","encrypted_content":"AAAA"}]}}),
        json!({"type":"content_block_stop","index":1}),
        json!({"type":"content_block_start","index":2,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":2,"delta":{"type":"text_delta","text":answer}}),
        json!({"type":"content_block_stop","index":2}),
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":12}}),
        json!({"type":"message_stop"}),
    ])
}

#[tokio::test]
async fn web_search_is_declared_as_a_server_tool_and_never_executed_locally() {
    let api = MockApi::start(vec![sse_server_web_search("O bitcoin está caro.")]).await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["WebSearch".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "qual o preço do bitcoin?").await;

    // Contrato: a definição enviada é a da SERVER tool — tipo versionado, sem
    // input_schema — e não uma tool cliente qualquer.
    let first = &api.requests().await[0];
    let tools = first["tools"].as_array().expect("tools no request");
    let ws = tools
        .iter()
        .find(|t| t["name"] == "web_search")
        .expect("web_search declarada");
    assert_eq!(ws["type"], "web_search_20250305");
    assert!(ws.get("input_schema").is_none(), "server tool não leva input_schema: {ws}");
    assert!(ws.get("cache_control").is_none(), "server tool não aceita cache_control: {ws}");

    // Contrato: o resultado do servidor encerra o turno sem uma segunda
    // request — o SDK não executou nada localmente.
    assert_eq!(api.requests().await.len(), 1);
    let result = result_of(&messages).expect("result");
    assert_eq!(result.subtype, "success");
    assert!(!result.is_error);
    assert_eq!(result.result.as_deref(), Some("O bitcoin está caro."));
}

#[tokio::test]
async fn an_unknown_content_block_type_does_not_kill_the_session() {
    // Gateway fora de spec: um tipo de bloco que o SDK não conhece.
    let api = MockApi::start(vec![sse_events(&[
        json!({"type":"message_start","message":{"id":"msg_u","model":"mock-model","role":"assistant","usage":{"input_tokens":5,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"quantum_flux","payload":{"a":1}}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"content_block_start","index":1,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":1,"delta":{"type":"text_delta","text":"sobrevivi"}}),
        json!({"type":"content_block_stop","index":1}),
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":3}}),
        json!({"type":"message_stop"}),
    ])])
    .await;
    let mut fx = fixture(Spec::default(), &api).await;
    let messages = run_one(&mut fx, "oi").await;
    let result = result_of(&messages).expect("result");
    // Contrato: bloco desconhecido é descartado, o turno continua.
    assert_eq!(result.subtype, "success");
    assert_eq!(result.result.as_deref(), Some("sobrevivi"));
}

#[tokio::test]
async fn an_oversized_tool_result_is_persisted_and_the_next_request_carries_the_reference() {
    // A tool devolve um output gigante; o modelo pede de novo no turno 2.
    let api = MockApi::start(vec![
        sse_tool_call_id("toolu_big", "Bash", &json!({"command": "yes paridade | head -c 120000"})),
        sse_text("li o resumo"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "gere muito output").await;
    assert_eq!(result_of(&messages).expect("result").subtype, "success");

    let second = api.requests().await[1].to_string();
    // Contrato: o miolo não vai inteiro para a API — vira referência com
    // caminho, e o modelo relê com Read se precisar.
    assert!(
        second.contains("persisted-output"),
        "output grande não virou referência: {}",
        &second[..second.len().min(600)]
    );
    assert!(second.contains("Use the Read tool"));
    // Contrato: o arquivo com o conteúdo COMPLETO existe em disco.
    let path_start = second.find("saved to: ").expect("caminho no bloco") + "saved to: ".len();
    let rest = &second[path_start..];
    let path_end = rest.find("\\n").expect("fim do caminho");
    let path = &rest[..path_end];
    let full = std::fs::read_to_string(path).expect("arquivo persistido");
    assert!(full.len() > 100_000, "arquivo truncado: {}", full.len());
}

#[tokio::test]
async fn unsupported_options_are_announced_instead_of_silently_ignored() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let config_dir = tempfile::tempdir().expect("config");
    let cwd = tempfile::tempdir().expect("cwd");
    let env = HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.path().display().to_string(),
        ),
    ]);
    let transport_options = ClaudeAgentOptions {
        env: env.clone(),
        cwd: Some(cwd.path().to_path_buf()),
        tools: Some(ToolsConfig::List(Vec::new())),
        // Sem tradução nativa: precisa AVISAR, não engolir.
        effort: Some("high".to_string()),
        output_format: Some(json!({"type": "json_schema"})),
        strict_mcp_config: true,
        ..Default::default()
    };
    let client_options = ClaudeAgentOptions {
        env,
        cwd: Some(cwd.path().to_path_buf()),
        ..Default::default()
    };
    let transport = NativeApiTransport::new(transport_options);
    let mut client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    client.connect().await.expect("connect");
    client.query("oi").await.expect("query");
    let messages = client.receive_response().await.expect("response");
    client.disconnect().await.expect("disconnect");

    // Contrato: um system/unsupported_options nomeia CADA opção ignorada.
    let announced = messages.iter().any(|m| match m {
        Message::System(s) => {
            s.subtype == "unsupported_options"
                && s.data.to_string().contains("effort")
                && s.data.to_string().contains("output_format")
        }
        _ => false,
    });
    assert!(announced, "opções sem tradução foram engolidas: {messages:?}");
    assert_eq!(result_of(&messages).expect("result").subtype, "success");
}

#[tokio::test]
async fn adaptive_thinking_becomes_a_real_budget_in_the_request() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let config_dir = tempfile::tempdir().expect("config");
    let cwd = tempfile::tempdir().expect("cwd");
    let env = HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.path().display().to_string(),
        ),
    ]);
    let transport_options = ClaudeAgentOptions {
        env: env.clone(),
        cwd: Some(cwd.path().to_path_buf()),
        tools: Some(ToolsConfig::List(Vec::new())),
        thinking: Some(rust_agent_sdk::types::ThinkingConfig::Adaptive { display: None }),
        max_thinking_tokens: Some(4096),
        strict_mcp_config: true,
        ..Default::default()
    };
    let client_options = ClaudeAgentOptions {
        env,
        cwd: Some(cwd.path().to_path_buf()),
        ..Default::default()
    };
    let transport = NativeApiTransport::new(transport_options);
    let mut client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    client.connect().await.expect("connect");
    client.query("pense").await.expect("query");
    let _ = client.receive_response().await.expect("response");
    client.disconnect().await.expect("disconnect");

    // Contrato: adaptive vira thinking habilitado, com o teto de
    // max_thinking_tokens — o pedido não é ignorado.
    let first = &api.requests().await[0];
    assert_eq!(first["thinking"]["type"], "enabled");
    assert_eq!(first["thinking"]["budget_tokens"], 4096);
}
