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

use prana::{
    ClaudeAgentOptions, ClaudeSDKClient, HookEvent, HookJSONOutput, HookMatcher,
    HookSpecificOutput, Message, NativeApiTransport, PermissionMode, PermissionResult, ToolsConfig,
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

/// Ajuste livre das opções do transporte.
type Configure = Box<dyn FnOnce(&mut ClaudeAgentOptions) + Send>;

/// `(tool, chaves do input na ordem, input)` de cada `can_use_tool`.
type SeenInputs = Arc<Mutex<Vec<(String, Vec<String>, Value)>>>;

#[derive(Default)]
struct Spec {
    tools: Option<Vec<String>>,
    permission_mode: Option<PermissionMode>,
    can_use_tool: Option<prana::CanUseToolFn>,
    hooks: Option<HashMap<HookEvent, Vec<HookMatcher>>>,
    allowed_tools: Vec<String>,
    disallowed_tools: Vec<String>,
    system_prompt: Option<String>,
    model: Option<String>,
    setting_sources: Option<Vec<prana::SettingSource>>,
    /// Ajuste livre das opções do transporte (servidores MCP, por exemplo).
    configure: Option<Configure>,
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
    let mut transport_options = ClaudeAgentOptions {
        env: env.clone(),
        cwd: Some(cwd.path().to_path_buf()),
        max_turns: Some(10),
        tools: Some(ToolsConfig::List(spec.tools.clone().unwrap_or_default())),
        permission_mode: spec.permission_mode,
        allowed_tools: spec.allowed_tools.clone(),
        disallowed_tools: spec.disallowed_tools.clone(),
        system_prompt: spec
            .system_prompt
            .clone()
            .map(prana::SystemPromptConfig::String),
        model: spec.model.clone(),
        setting_sources: spec.setting_sources.clone(),
        strict_mcp_config: true,
        ..Default::default()
    };
    if let Some(configure) = spec.configure {
        configure(&mut transport_options);
    }
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

fn result_of(messages: &[Message]) -> Option<prana::ResultMessage> {
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

/// Em plan mode o CLI não recusa a mutação por conta própria: o Write passa
/// pelo `checkWritePermissionForTool`, que responde `ask` (plan não é
/// acceptEdits), e a pergunta chega ao `can_use_tool`. Quem recusa é o
/// cliente, e a mensagem dele é o que o modelo lê.
#[tokio::test]
async fn plan_mode_sends_mutating_tools_to_can_use_tool() {
    let api = MockApi::start(vec![
        // Caminho que não existe: arquivo existente sem leitura prévia seria
        // recusado pelo `validateInput` do Write antes da permissão.
        sse_tool_call(
            "Write",
            &json!({
                "file_path": std::env::temp_dir()
                    .join(format!("plano-{}", uuid::Uuid::new_v4()))
                    .join("x.txt"),
                "content": "y"
            }),
        ),
        sse_text("entendi"),
    ])
    .await;
    let asked: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
    let asked_cb = Arc::clone(&asked);
    let deny_in_plan: prana::CanUseToolFn = Arc::new(move |name, _input, _ctx| {
        let asked = Arc::clone(&asked_cb);
        Box::pin(async move {
            asked.lock().await.push(name);
            PermissionResult::Deny(prana::PermissionResultDeny {
                behavior: "deny".to_string(),
                message: "Apresente o plano com ExitPlanMode antes de escrever.".to_string(),
                interrupt: false,
            })
        })
    });
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Write".to_string(), "Read".to_string()]),
            permission_mode: Some(PermissionMode::Plan),
            can_use_tool: Some(deny_in_plan),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "escreva um arquivo").await;
    let result = result_of(&messages).expect("result");
    // Contrato: a pergunta chegou ao cliente e a recusa dele chegou ao modelo.
    assert_eq!(asked.lock().await.as_slice(), ["Write".to_string()]);
    let second = api.requests().await[1].to_string();
    assert!(
        second.contains("Apresente o plano com ExitPlanMode"),
        "a recusa do cliente não chegou ao modelo: {second}"
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

fn sync_output(
    hso: Option<HookSpecificOutput>,
    decision: Option<&str>,
    reason: Option<&str>,
) -> HookJSONOutput {
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
    let hook: prana::HookCallbackFn = Arc::new(|_input, _id, _ctx| {
        Box::pin(async {
            sync_output(
                Some(HookSpecificOutput::PreToolUse {
                    permission_decision: Some("deny".to_string()),
                    permission_decision_reason: Some("política: rm recursivo proibido".to_string()),
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
    let hook: prana::HookCallbackFn = Arc::new(|_input, _id, _ctx| {
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
    let hook: prana::HookCallbackFn = Arc::new(move |_input, _id, _ctx| {
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
    assert_eq!(
        fired.load(Ordering::SeqCst),
        2,
        "o Stop hook deveria rodar duas vezes"
    );
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
        sse_tool_call_id(
            "toolu_a",
            "TaskCreate",
            &json!({"subject": "estudar paridade", "description": "ler o plano"}),
        ),
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
        sse_tool_call_id(
            "toolu_a",
            "Bash",
            &json!({"command": "echo saida-de-fundo", "run_in_background": true}),
        ),
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
        // O TaskOutput do CLI devolve o estado em tags (`<status>...</status>`).
        third.contains("<status>"),
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
        system_prompt: Some(prana::SystemPromptConfig::Structured(
            prana::SystemPrompt::Preset {
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

/// No CLI 2.1.90 o WebSearch é uma tool CLIENTE: o request principal a
/// declara com `input_schema`, e a busca de verdade sai numa chamada
/// aninhada com a server tool `web_search_20250305`
/// (`tools/WebSearchTool/WebSearchTool.js`). A chamada aninhada em si é
/// coberta em `tests/test_native_tools_web.rs`.
#[tokio::test]
async fn web_search_is_declared_as_a_client_tool() {
    let api = MockApi::start(vec![
        sse_tool_call_id("toolu_ws", "WebSearch", &json!({"query": "preço bitcoin"})),
        sse_server_web_search("O bitcoin está caro."),
        sse_text("respondido"),
    ])
    .await;
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
    assert_eq!(result_of(&messages).expect("result").subtype, "success");

    let first = &api.requests().await[0];
    let tools = first["tools"].as_array().expect("tools no request");
    let ws = tools
        .iter()
        .find(|t| t["name"] == "WebSearch")
        .expect("WebSearch declarada");
    assert!(ws.get("type").is_none(), "tool cliente não leva type: {ws}");
    assert_eq!(ws["input_schema"]["required"], json!(["query"]));
    assert!(
        !tools.iter().any(|t| t["type"] == "web_search_20250305"),
        "a server tool não vai no request principal"
    );
}

// ---------------------------------------------------------------------------
// Breakpoints de prompt cache (a regra do cache_opt do jai)
// ---------------------------------------------------------------------------

fn cache_ttl(block: &Value) -> Option<&str> {
    block["cache_control"]["ttl"].as_str()
}

fn count_breakpoints(value: &Value) -> usize {
    match value {
        Value::Object(map) => {
            usize::from(map.contains_key("cache_control"))
                + map.values().map(count_breakpoints).sum::<usize>()
        }
        Value::Array(items) => items.iter().map(count_breakpoints).sum(),
        _ => 0,
    }
}

#[tokio::test]
async fn cache_breakpoints_follow_the_anchor_and_tail_layout_on_the_wire() {
    let api = MockApi::start(vec![
        sse_tool_call("Bash", &json!({"command": "echo cache"})),
        sse_text("feito"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string(), "WebSearch".to_string()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            system_prompt: Some("Você é um agente de teste.".to_string()),
            ..Default::default()
        },
        &api,
    )
    .await;
    let _ = run_one(&mut fx, "rode echo").await;
    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);

    for request in &requests {
        // Âncora 1h na última tool CLIENTE; server tool nunca leva breakpoint.
        let tools = request["tools"].as_array().expect("tools");
        let marked: Vec<&Value> = tools
            .iter()
            .filter(|t| t.get("cache_control").is_some())
            .collect();
        assert_eq!(marked.len(), 1, "uma âncora de tools: {tools:?}");
        let last_client = tools
            .iter()
            .rev()
            .find(|t| t.get("type").is_none())
            .expect("tool cliente");
        assert_eq!(cache_ttl(last_client), Some("1h"));

        // Âncora 1h no último bloco de system, e só nele.
        let system = request["system"].as_array().expect("system");
        assert_eq!(cache_ttl(system.last().expect("system")), Some("1h"));
        assert!(system[..system.len() - 1]
            .iter()
            .all(|b| b.get("cache_control").is_none()));
    }

    // Primeiro request: uma mensagem só, então a cauda é um breakpoint.
    let first = &requests[0];
    assert_eq!(count_breakpoints(first), 3, "{first}");
    let first_tail = first["messages"][0]["content"]
        .as_array()
        .and_then(|c| c.last())
        .expect("bloco");
    assert_eq!(cache_ttl(first_tail), Some("5m"));

    // Segundo request: cauda 5m no último bloco de messages[-2] (o tool_use)
    // e de messages[-1] (o tool_result), e o teto de 4 no total.
    let second = &requests[1];
    let messages = second["messages"].as_array().expect("messages");
    let n = messages.len();
    let tail_of = |i: usize| messages[i]["content"].as_array().and_then(|c| c.last());
    let penultimate = tail_of(n - 2).expect("messages[-2]");
    assert_eq!(penultimate["type"], "tool_use");
    assert_eq!(cache_ttl(penultimate), Some("5m"));
    let last = tail_of(n - 1).expect("messages[-1]");
    assert_eq!(last["type"], "tool_result");
    assert_eq!(cache_ttl(last), Some("5m"));
    assert_eq!(count_breakpoints(second), 4, "{second}");
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
        sse_tool_call_id(
            "toolu_big",
            "Bash",
            &json!({"command": "yes paridade | head -c 120000"}),
        ),
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
    // O texto é o `buildLargeToolResultMessage` do CLI.
    assert!(second.contains("Preview (first 2KB):"));
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
    assert!(
        announced,
        "opções sem tradução foram engolidas: {messages:?}"
    );
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
        thinking: Some(prana::types::ThinkingConfig::Adaptive { display: None }),
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

// ---------------------------------------------------------------------------
// Lacunas de paridade: regras no contexto, concorrência por input, modelo do
// Bash, normalização do tool_use, cwd compartilhado, ordem das chaves do
// can_use_tool e o init.
// ---------------------------------------------------------------------------

/// O `tool_result` de um `tool_use` no corpo de um request, como texto.
fn tool_result_text(request: &Value, tool_use_id: &str) -> String {
    let Some(messages) = request["messages"].as_array() else {
        return String::new();
    };
    for message in messages {
        for block in message["content"].as_array().into_iter().flatten() {
            if block["type"] == "tool_result" && block["tool_use_id"] == tool_use_id {
                return match &block["content"] {
                    Value::String(s) => s.clone(),
                    other => other.to_string(),
                };
            }
        }
    }
    String::new()
}

/// O input de um `tool_use` do histórico de um request, serializado (a ordem
/// das chaves conta).
fn history_tool_input(request: &Value, tool_use_id: &str) -> Option<String> {
    request["messages"]
        .as_array()?
        .iter()
        .flat_map(|m| m["content"].as_array().cloned().unwrap_or_default())
        .find(|b| b["type"] == "tool_use" && b["id"] == tool_use_id)
        .map(|b| b["input"].to_string())
}

/// Um callback que registra `(tool, chaves do input na ordem)` e responde
/// com a decisão dada.
fn recording_callback(seen: SeenInputs, allow: bool) -> prana::CanUseToolFn {
    Arc::new(move |name, input, _ctx| {
        let seen = Arc::clone(&seen);
        Box::pin(async move {
            let keys: Vec<String> = input.keys().cloned().collect();
            seen.lock()
                .await
                .push((name, keys, Value::Object(input.clone())));
            if allow {
                PermissionResult::Allow(prana::PermissionResultAllow {
                    updated_input: Some(input),
                    ..Default::default()
                })
            } else {
                PermissionResult::Deny(prana::PermissionResultDeny {
                    behavior: "deny".to_string(),
                    message: "negado no teste".to_string(),
                    interrupt: false,
                })
            }
        })
    })
}

/// Lacuna 1: com as regras no `ToolContext`, o `validateInput` do Edit, do
/// Write e do Read recusa o caminho coberto por regra deny com a mensagem do
/// CLI (antes da permissão, mesmo em bypass), e o Glob e o Grep escondem da
/// listagem o que as regras deny de `Read(...)` cobrem
/// (`getFileReadIgnorePatterns`).
#[tokio::test]
async fn deny_rules_reach_validate_input_and_hide_files_from_glob_and_grep() {
    let cwd_marker = uuid::Uuid::new_v4().to_string();
    let api_script = |cwd: &std::path::Path| {
        vec![
            sse_tool_call_id(
                "t_write",
                "Write",
                &json!({"file_path": cwd.join("secret/a.txt"), "content": "x"}),
            ),
            sse_tool_call_id(
                "t_edit",
                "Edit",
                &json!({"file_path": cwd.join("secret/b.txt"), "old_string": "a", "new_string": "b"}),
            ),
            sse_tool_call_id(
                "t_read",
                "Read",
                &json!({"file_path": cwd.join("hidden/segredo.txt")}),
            ),
            sse_tool_call_id("t_glob", "Glob", &json!({"pattern": "**/*.txt"})),
            sse_tool_call_id(
                "t_grep",
                "Grep",
                &json!({"pattern": cwd_marker, "output_mode": "files_with_matches"}),
            ),
            sse_text("pronto"),
        ]
    };
    // O cwd só existe depois do fixture: o roteiro é montado com um
    // diretório provisório e trocado pelo real antes do primeiro request.
    let cwd = tempfile::tempdir().expect("cwd");
    std::fs::create_dir_all(cwd.path().join("hidden")).unwrap();
    std::fs::create_dir_all(cwd.path().join("visible")).unwrap();
    std::fs::write(cwd.path().join("hidden/segredo.txt"), &cwd_marker).unwrap();
    std::fs::write(cwd.path().join("visible/aberto.txt"), &cwd_marker).unwrap();
    let api = MockApi::start(api_script(cwd.path())).await;
    let cwd_path = cwd.path().to_path_buf();
    let mut fx = fixture(
        Spec {
            tools: Some(
                ["Write", "Edit", "Read", "Glob", "Grep"]
                    .iter()
                    .map(|s| s.to_string())
                    .collect(),
            ),
            permission_mode: Some(PermissionMode::BypassPermissions),
            disallowed_tools: vec![
                "Edit(/secret/**)".to_string(),
                "Read(/hidden/**)".to_string(),
            ],
            configure: Some(Box::new(move |options: &mut ClaudeAgentOptions| {
                options.cwd = Some(cwd_path);
            })),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "mexa nos arquivos").await;
    assert_eq!(result_of(&messages).expect("result").subtype, "success");
    let requests = api.requests().await;
    let denied = "<tool_use_error>File is in a directory that is denied by your permission settings.</tool_use_error>";
    assert_eq!(tool_result_text(&requests[1], "t_write"), denied);
    assert_eq!(tool_result_text(&requests[2], "t_edit"), denied);
    assert_eq!(tool_result_text(&requests[3], "t_read"), denied);
    assert!(!cwd.path().join("secret/a.txt").exists());

    let glob = tool_result_text(&requests[4], "t_glob");
    assert!(glob.contains("visible/aberto.txt"), "{glob}");
    assert!(
        !glob.contains("segredo"),
        "o Glob mostrou o que Read(...) nega: {glob}"
    );
    let grep = tool_result_text(&requests[5], "t_grep");
    assert!(grep.contains("visible/aberto.txt"), "{grep}");
    assert!(
        !grep.contains("segredo"),
        "o Grep mostrou o que Read(...) nega: {grep}"
    );
}

/// Uma tool que dorme e conta quantas execuções simultâneas houve; é segura
/// para concorrência só quando o input pede (`{"safe": true}`).
struct Sleeper {
    active: Arc<std::sync::atomic::AtomicUsize>,
    peak: Arc<std::sync::atomic::AtomicUsize>,
}

#[async_trait::async_trait]
impl prana::tools::framework::Tool for Sleeper {
    fn name(&self) -> &str {
        "Sleeper"
    }
    fn description(&self) -> &str {
        "dorme"
    }
    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {"safe": {"type": "boolean"}, "n": {"type": "integer"}},
            "required": ["safe"]
        })
    }
    fn is_concurrency_safe(&self, input: &Value) -> bool {
        input["safe"] == true
    }
    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &prana::tools::framework::ToolContext,
        _rules: &prana::tools::permission::PermissionRules,
    ) -> prana::tools::permission::PermissionResult {
        prana::tools::permission::PermissionResult::allow()
    }
    async fn execute(
        &self,
        _input: Value,
        _context: &prana::tools::framework::ToolContext,
    ) -> prana::tools::framework::ToolResult {
        let now = self.active.fetch_add(1, Ordering::SeqCst) + 1;
        self.peak.fetch_max(now, Ordering::SeqCst);
        tokio::time::sleep(std::time::Duration::from_millis(150)).await;
        self.active.fetch_sub(1, Ordering::SeqCst);
        prana::tools::framework::ToolResult::text("ok")
    }
}

async fn peak_concurrency(inputs: &[Value]) -> usize {
    use prana::tools::framework::{ToolContext, ToolExecutor, ToolRegistry};
    let active = Arc::new(std::sync::atomic::AtomicUsize::new(0));
    let peak = Arc::new(std::sync::atomic::AtomicUsize::new(0));
    let mut registry = ToolRegistry::new();
    registry.register(Box::new(Sleeper {
        active: Arc::clone(&active),
        peak: Arc::clone(&peak),
    }));
    let executor = ToolExecutor::new(registry, ToolContext::default());
    let uses = inputs
        .iter()
        .enumerate()
        .map(|(i, input)| prana::api::streaming::ToolUseBlock {
            id: format!("t{i}"),
            name: "Sleeper".to_string(),
            input: input.clone(),
        })
        .collect();
    let results = executor.execute_all(uses).await;
    assert_eq!(results.len(), inputs.len());
    peak.load(Ordering::SeqCst)
}

/// Lacuna 2: o `isConcurrencySafe(input)` do `partitionToolCalls` decide por
/// chamada: duas seguras rodam juntas e uma insegura roda sozinha. O Bash de
/// leitura é seguro, o que
/// escreve (ou junta `cd` com `git`) não.
#[tokio::test]
async fn concurrency_safety_is_decided_per_input() {
    assert_eq!(
        peak_concurrency(&[json!({"safe": true}), json!({"safe": true})]).await,
        2
    );
    assert_eq!(
        peak_concurrency(&[json!({"safe": true}), json!({"safe": false})]).await,
        1
    );
    // Input que não passa no schema não é seguro (o `parsedInput.success`
    // do `partitionToolCalls`), mesmo que a tool diga que sim: ele corta o
    // lote, e as duas válidas em volta rodam cada uma sozinha.
    assert_eq!(
        peak_concurrency(&[
            json!({"safe": true}),
            json!({"safe": true, "n": "não é número"}),
            json!({"safe": true}),
        ])
        .await,
        1
    );
    use prana::tools::framework::Tool as _;
    let bash = prana::tools::bash::BashTool::default();
    for read_only in ["ls -la", "git status", "cat a.txt | grep x", "cd sub && ls"] {
        assert!(
            bash.is_concurrency_safe(&json!({"command": read_only})),
            "{read_only} deveria ser de leitura"
        );
    }
    for mutating in [
        "rm -f a.txt",
        "ls > out.txt",
        "cd sub && git status",
        "echo $(whoami)",
        "npm install",
    ] {
        assert!(
            !bash.is_concurrency_safe(&json!({"command": mutating})),
            "{mutating} não é de leitura"
        );
    }
}

/// Lacuna 3: o Bash do transporte nativo é registrado com o modelo da
/// sessão, e a linha de atribuição do prompt sai com ele.
#[tokio::test]
async fn bash_attribution_follows_the_session_model() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string()]),
            model: Some("claude-sonnet-4-5-20250929".to_string()),
            ..Default::default()
        },
        &api,
    )
    .await;
    run_one(&mut fx, "oi").await;
    let first = &api.requests().await[0];
    let bash = first["tools"]
        .as_array()
        .expect("tools")
        .iter()
        .find(|t| t["name"] == "Bash")
        .expect("Bash no request");
    let description = bash["description"].as_str().expect("description");
    assert!(
        description.contains("Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"),
        "{description}"
    );
}

/// Lacuna 4: o `tool_use` sai normalizado como o `normalizeToolInput` do CLI
/// (medido no 2.1.90): o Bash perde o `cd <cwd> && ` e fica com `command`
/// antes de `description`; o Write perde o espaço de fim de linha e fica
/// `{file_path, content}`. É essa forma que o cliente vê, que o
/// `can_use_tool` recebe, que é gravada e que volta à API.
#[tokio::test]
async fn tool_use_input_is_normalized_like_the_cli() {
    let cwd = tempfile::tempdir().expect("cwd");
    let cwd_text = cwd.path().display().to_string();
    let target = cwd.path().join("w.txt");
    let api = MockApi::start(vec![
        sse_tool_call_id(
            "t_bash",
            "Bash",
            &json!({"description": "lista", "command": format!("cd {cwd_text} && ls")}),
        ),
        sse_tool_call_id(
            "t_write",
            "Write",
            &json!({"content": "a  \nb\t\n", "file_path": target}),
        ),
        sse_text("feito"),
    ])
    .await;
    let seen = Arc::new(Mutex::new(Vec::new()));
    let cwd_path = cwd.path().to_path_buf();
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Bash".to_string(), "Write".to_string()]),
            can_use_tool: Some(recording_callback(Arc::clone(&seen), true)),
            configure: Some(Box::new(move |options: &mut ClaudeAgentOptions| {
                options.cwd = Some(cwd_path);
            })),
            ..Default::default()
        },
        &api,
    )
    .await;
    let messages = run_one(&mut fx, "grave").await;
    assert_eq!(result_of(&messages).expect("result").subtype, "success");

    let bash_expected = json!({"command": "ls", "description": "lista"}).to_string();
    let write_expected =
        json!({"file_path": target.display().to_string(), "content": "a\nb\n"}).to_string();

    // O cliente recebe o bloco normalizado.
    let client_inputs: Vec<String> = messages
        .iter()
        .filter_map(|m| match m {
            Message::Assistant(a) => Some(a.content.clone()),
            _ => None,
        })
        .flatten()
        .filter_map(|b| match b {
            prana::ContentBlock::ToolUse(t) => Some(t.input.to_string()),
            _ => None,
        })
        .collect();
    assert_eq!(
        client_inputs,
        vec![bash_expected.clone(), write_expected.clone()]
    );

    // O histórico que volta à API também.
    let requests = api.requests().await;
    assert_eq!(
        history_tool_input(&requests[2], "t_bash").as_deref(),
        Some(bash_expected.as_str())
    );
    assert_eq!(
        history_tool_input(&requests[2], "t_write").as_deref(),
        Some(write_expected.as_str())
    );

    // O `can_use_tool` do Write e a execução usam a forma normalizada.
    let seen = seen.lock().await;
    assert_eq!(seen.len(), 1, "só o Write pergunta: {seen:?}");
    assert_eq!(seen[0].2.to_string(), write_expected);
    assert_eq!(std::fs::read_to_string(&target).unwrap(), "a\nb\n");
}

/// Lacuna 5: o `cd` do Bash muda o cwd de todas as tools do turno (o
/// `getCwd()` global do CLI): o Read de caminho relativo e o Glob sem `path`
/// passam a partir do diretório novo.
#[tokio::test]
async fn bash_cd_moves_the_cwd_of_every_tool() {
    let cwd = tempfile::tempdir().expect("cwd");
    std::fs::create_dir_all(cwd.path().join("sub")).unwrap();
    std::fs::write(cwd.path().join("f.txt"), "NA_RAIZ\n").unwrap();
    std::fs::write(cwd.path().join("so_na_raiz.txt"), "x\n").unwrap();
    std::fs::write(cwd.path().join("sub/f.txt"), "NO_SUB\n").unwrap();
    let api = MockApi::start(vec![
        sse_tool_call_id("t_cd", "Bash", &json!({"command": "cd sub"})),
        sse_tool_call_id("t_read", "Read", &json!({"file_path": "f.txt"})),
        sse_tool_call_id("t_glob", "Glob", &json!({"pattern": "*.txt"})),
        sse_tool_call_id("t_pwd", "Bash", &json!({"command": "pwd"})),
        sse_text("fim"),
    ])
    .await;
    let cwd_path = cwd.path().to_path_buf();
    let mut fx = fixture(
        Spec {
            tools: Some(
                ["Bash", "Read", "Glob"]
                    .iter()
                    .map(|s| s.to_string())
                    .collect(),
            ),
            permission_mode: Some(PermissionMode::BypassPermissions),
            configure: Some(Box::new(move |options: &mut ClaudeAgentOptions| {
                options.cwd = Some(cwd_path);
            })),
            ..Default::default()
        },
        &api,
    )
    .await;
    run_one(&mut fx, "navegue").await;
    let requests = api.requests().await;
    let read = tool_result_text(&requests[2], "t_read");
    assert!(read.contains("NO_SUB"), "o Read não seguiu o cd: {read}");
    let glob = tool_result_text(&requests[3], "t_glob");
    assert_eq!(glob, "f.txt", "o Glob não seguiu o cd: {glob}");
    let pwd = tool_result_text(&requests[4], "t_pwd");
    let sub = std::fs::canonicalize(cwd.path().join("sub")).unwrap();
    assert_eq!(pwd.trim(), sub.display().to_string());
}

/// Lacuna 8: o input chega ao `can_use_tool` do cliente num `Map` ordenado.
/// Numa builtin, as chaves de primeiro nível saem na ordem do schema, como
/// o `parse` do zod (medido no CLI 2.1.90: WebFetch pedido com
/// `{prompt, url}` chega como `{url, prompt}`); numa tool MCP (passthrough),
/// na ordem que o modelo mandou.
#[tokio::test]
async fn can_use_tool_input_keeps_a_deterministic_key_order() {
    let server = prana::sdk_mcp::SdkMcpServer::builder("ordem")
        .tool(
            "par",
            "Recebe dois campos.",
            prana::sdk_mcp::ToolInputSchema::object()
                .required("alfa", prana::sdk_mcp::PropertySchema::string())
                .required("beta", prana::sdk_mcp::PropertySchema::string()),
            |_input: Value| async move { Ok(prana::sdk_mcp::ToolOutput::text("ok")) },
        )
        .build_shared();
    let api = MockApi::start(vec![
        sse_tool_call_id(
            "t_fetch",
            "WebFetch",
            &json!({"prompt": "resuma", "url": "https://example.com/x"}),
        ),
        sse_tool_call_id(
            "t_mcp",
            "mcp__ordem__par",
            &json!({"zeta": "3", "beta": "2", "alfa": "1"}),
        ),
        sse_text("fim"),
    ])
    .await;
    let seen = Arc::new(Mutex::new(Vec::new()));
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["WebFetch".to_string()]),
            can_use_tool: Some(recording_callback(Arc::clone(&seen), false)),
            configure: Some(Box::new(move |options: &mut ClaudeAgentOptions| {
                options.add_sdk_mcp_server(server);
            })),
            ..Default::default()
        },
        &api,
    )
    .await;
    run_one(&mut fx, "busque").await;
    let seen = seen.lock().await;
    let orders: Vec<(String, Vec<String>)> = seen
        .iter()
        .map(|(name, keys, _)| (name.clone(), keys.clone()))
        .collect();
    assert_eq!(
        orders,
        vec![
            (
                "WebFetch".to_string(),
                vec!["url".to_string(), "prompt".to_string()]
            ),
            (
                "mcp__ordem__par".to_string(),
                vec!["zeta".to_string(), "beta".to_string(), "alfa".to_string()]
            ),
        ]
    );
}

/// Lacuna 9: o `init` anuncia em `skills` e `slash_commands` só o que o
/// transporte nativo executa: os skills do disco que o usuário pode invocar
/// (`userInvocable !== false`, `utils/messages/systemInit.js`). O CLI 2.1.90
/// real anuncia também os skills e comandos que traz embutidos, mas o nativo
/// não tem o conteúdo deles (a tool Skill responderia `Unknown skill`) nem
/// processa comando de barra; a divergência é deliberada. A
/// `claude_code_version` confere com o CLI.
#[tokio::test]
async fn init_lists_only_the_skills_the_native_transport_runs() {
    let init_of = |messages: &[Message]| {
        messages
            .iter()
            .find_map(|m| match m {
                Message::System(s) if s.subtype == "init" => Some(s.data.clone()),
                _ => None,
            })
            .expect("init")
    };
    let strings = |v: &Value| -> Vec<String> {
        v.as_array()
            .expect("lista")
            .iter()
            .map(|s| s.as_str().expect("texto").to_string())
            .collect()
    };

    // Sem skills no disco: nada anunciado (nenhum embutido do CLI).
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let mut fx = fixture(
        Spec {
            setting_sources: Some(vec![prana::SettingSource::Project]),
            ..Default::default()
        },
        &api,
    )
    .await;
    let init = init_of(&run_one(&mut fx, "oi").await);
    assert!(strings(&init["skills"]).is_empty());
    assert!(strings(&init["slash_commands"]).is_empty());
    assert_eq!(init["claude_code_version"], "2.1.90");

    // Com skills de projeto: entra o invocável; o `user-invocable: false`
    // fica de fora, como no filtro do `buildSystemInitMessage`.
    let cwd = tempfile::tempdir().expect("cwd");
    for (name, frontmatter) in [
        ("demo-skill", "description: demo"),
        ("hidden-skill", "description: oculto\nuser-invocable: false"),
    ] {
        let skill_dir = cwd.path().join(".claude/skills").join(name);
        std::fs::create_dir_all(&skill_dir).unwrap();
        std::fs::write(
            skill_dir.join("SKILL.md"),
            format!("---\n{frontmatter}\n---\nFaça a demonstração.\n"),
        )
        .unwrap();
    }
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let cwd_path = cwd.path().to_path_buf();
    let mut fx = fixture(
        Spec {
            setting_sources: Some(vec![prana::SettingSource::Project]),
            configure: Some(Box::new(move |options: &mut ClaudeAgentOptions| {
                options.cwd = Some(cwd_path);
            })),
            ..Default::default()
        },
        &api,
    )
    .await;
    let init = init_of(&run_one(&mut fx, "oi").await);
    assert_eq!(strings(&init["skills"]), vec!["demo-skill".to_string()]);
    assert_eq!(
        strings(&init["slash_commands"]),
        vec!["demo-skill".to_string()]
    );
}

/// Por que o `init` não anuncia os skills embutidos do CLI: a tool Skill do
/// nativo não os tem, e invocar um deles falha com `Unknown skill`.
#[tokio::test]
async fn bundled_cli_skills_are_not_runnable_natively() {
    let api = MockApi::start(vec![
        sse_tool_call_id("toolu_s1", "Skill", &json!({"skill": "simplify"})),
        sse_text("ok"),
    ])
    .await;
    let mut fx = fixture(
        Spec {
            tools: Some(vec!["Skill".into()]),
            permission_mode: Some(PermissionMode::BypassPermissions),
            setting_sources: Some(vec![prana::SettingSource::Project]),
            ..Default::default()
        },
        &api,
    )
    .await;
    run_one(&mut fx, "rode /simplify").await;
    let requests = api.requests().await;
    let result = tool_result_text(&requests[1], "toolu_s1");
    assert!(result.contains("Unknown skill: simplify"), "{result}");
}
