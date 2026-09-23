//! Paridade do transporte nativo com o que o CLI manda ao modelo e emite no
//! stream: memórias (`CLAUDE.md`) por `setting_sources`, o contexto de
//! usuário prependido a cada chamada, o `system` com cabeçalho de atribuição
//! e prefixo de identidade do SDK, o frame `system`/`init` e o silêncio das
//! opções que o nativo atende (`skills=[]`, `permission_prompt_tool_name`
//! `stdio`). Tudo contra um MockApi local, sem rede nem token.

use std::collections::HashMap;
use std::path::Path;
use std::sync::Arc;

use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::Mutex;

use prana::{
    ClaudeAgentOptions, ClaudeSDKClient, HookEvent, HookJSONOutput, HookMatcher,
    HookSpecificOutput, Message, NativeApiTransport, PermissionMode, PermissionResult,
    PermissionResultAllow, SettingSource, SystemPromptConfig, ToolsConfig,
};

// ---------------------------------------------------------------------------
// MockApi (mesmo padrão do test_native_parity)
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

fn sse_text(text: &str) -> String {
    [
        json!({"type":"message_start","message":{"id":"msg_text","model":"mock-model","role":"assistant","usage":{"input_tokens":10,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":text}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":5}}),
        json!({"type":"message_stop"}),
    ]
    .iter()
    .map(|e| format!("event: {}\ndata: {e}\n\n", e["type"].as_str().unwrap()))
    .collect()
}

fn sse_write_call(path: &Path) -> String {
    let partial = json!({"file_path": path.display().to_string(), "content": "oi\n"}).to_string();
    [
        json!({"type":"message_start","message":{"id":"msg_tool","model":"mock-model","role":"assistant","usage":{"input_tokens":20,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":"toolu_1","name":"Write"}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":partial}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"output_tokens":8}}),
        json!({"type":"message_stop"}),
    ]
    .iter()
    .map(|e| format!("event: {}\ndata: {e}\n\n", e["type"].as_str().unwrap()))
    .collect()
}

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const CONTEXT_HEAD: &str =
    "<system-reminder>\nAs you answer the user's questions, you can use the following context:\n";
const AGENT_SDK_PREFIX: &str = "You are a Claude agent, built on Anthropic's Claude Agent SDK.";

struct Fixture {
    config_dir: tempfile::TempDir,
    cwd: tempfile::TempDir,
    env: HashMap<String, String>,
}

fn fixture(api: &MockApi) -> Fixture {
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
        (
            "CLAUDE_CODE_OVERRIDE_DATE".to_string(),
            "2026-09-23".to_string(),
        ),
        // Como o serviço de chat: variáveis em branco no env.
        ("ANTHROPIC_AUTH_TOKEN".to_string(), String::new()),
    ]);
    Fixture {
        config_dir,
        cwd,
        env,
    }
}

impl Fixture {
    fn options(&self) -> ClaudeAgentOptions {
        ClaudeAgentOptions {
            env: self.env.clone(),
            cwd: Some(self.cwd.path().to_path_buf()),
            tools: Some(ToolsConfig::List(Vec::new())),
            strict_mcp_config: true,
            ..Default::default()
        }
    }

    fn client(&self, transport_options: ClaudeAgentOptions) -> ClaudeSDKClient {
        let client_options = ClaudeAgentOptions {
            env: self.env.clone(),
            cwd: Some(self.cwd.path().to_path_buf()),
            ..Default::default()
        };
        ClaudeSDKClient::new(client_options)
            .with_transport(Box::new(NativeApiTransport::new(transport_options)))
    }
}

async fn ask(client: &mut ClaudeSDKClient, prompt: &str) -> Vec<Message> {
    client.query(prompt).await.expect("query");
    client.receive_response().await.expect("response")
}

fn first_text(message: &Value) -> String {
    match &message["content"] {
        Value::String(s) => s.clone(),
        Value::Array(blocks) => blocks
            .iter()
            .find(|b| b["type"] == "text")
            .and_then(|b| b["text"].as_str())
            .unwrap_or("")
            .to_string(),
        _ => String::new(),
    }
}

fn system_texts(request: &Value) -> Vec<String> {
    request["system"]
        .as_array()
        .map(|blocks| {
            blocks
                .iter()
                .map(|b| b["text"].as_str().unwrap_or("").to_string())
                .collect()
        })
        .unwrap_or_default()
}

/// `computeFingerprint` do CLI, independente da implementação do SDK.
fn expected_header(first_user_text: &str, entrypoint: &str) -> String {
    let units: Vec<u16> = first_user_text.encode_utf16().collect();
    let chars: String = [4usize, 7, 20]
        .iter()
        .map(|&i| {
            units
                .get(i)
                .map(|u| char::from_u32(u32::from(*u)).unwrap_or(char::REPLACEMENT_CHARACTER))
                .unwrap_or('0')
        })
        .collect();
    let digest = Sha256::digest(format!("59cf53e54c78{chars}2.1.90").as_bytes());
    let hex: String = digest.iter().map(|b| format!("{b:02x}")).collect();
    format!(
        "x-anthropic-billing-header: cc_version=2.1.90.{}; cc_entrypoint={entrypoint};",
        &hex[..3]
    )
}

fn all_files_text(dir: &Path) -> String {
    let mut out = String::new();
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                out.push_str(&all_files_text(&path));
            } else if let Ok(text) = std::fs::read_to_string(&path) {
                out.push_str(&text);
            }
        }
    }
    out
}

// ---------------------------------------------------------------------------
// Memórias e contexto de usuário
// ---------------------------------------------------------------------------

#[tokio::test]
async fn project_source_prepends_the_session_claude_md_to_every_call_and_never_persists_it() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);
    std::fs::write(
        fx.cwd.path().join("CLAUDE.md"),
        "<!-- BEGIN:ctx -->\nO usuário se chama Ana.\n<!-- END:ctx -->\n",
    )
    .unwrap();
    std::fs::write(
        fx.config_dir.path().join("CLAUDE.md"),
        "instrução global que não pode entrar",
    )
    .unwrap();

    let mut options = fx.options();
    options.system_prompt = Some(SystemPromptConfig::String("Você é o assistente.".into()));
    options.setting_sources = Some(vec![SettingSource::Project]);
    options.skills = Some(json!([]));
    let mut client = fx.client(options);
    client.connect().await.expect("connect");
    let first_turn = ask(&mut client, "primeira").await;
    // O serviço reescreve o CLAUDE.md entre turnos: o CLI memoiza o contexto
    // pela sessão, então a segunda chamada ainda leva a versão lida antes.
    std::fs::write(fx.cwd.path().join("CLAUDE.md"), "O usuário se chama Bia.\n").unwrap();
    let _ = ask(&mut client, "segunda").await;
    client.disconnect().await.expect("disconnect");

    let requests = api.requests().await;
    assert_eq!(requests.len(), 2);
    let project_md = fx.cwd.path().join("CLAUDE.md");
    let expected_context = format!(
        "{CONTEXT_HEAD}# claudeMd\nCodebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written.\n\nContents of {} (project instructions, checked into the codebase):\n\nO usuário se chama Ana.\n# currentDate\nToday's date is 2026-09-23.\n\n      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.\n</system-reminder>\n",
        project_md.display()
    );
    for request in &requests {
        let first = &request["messages"][0];
        assert_eq!(first["role"], "user");
        // A mensagem meta se funde ao primeiro turno do usuário
        // (`normalizeMessagesForAPI`): primeiro bloco é o contexto.
        assert_eq!(first_text(first), expected_context);
        assert!(!request.to_string().contains("instrução global"));
    }
    let second_body = requests[1]["messages"].to_string();
    assert!(second_body.contains("primeira") && second_body.contains("segunda"));
    assert!(!second_body.contains("Bia"));

    // `skills=[]` e `setting_sources` não são avisados.
    assert!(
        !first_turn
            .iter()
            .any(|m| matches!(m, Message::System(s) if s.subtype == "unsupported_options")),
        "aviso indevido: {first_turn:?}"
    );

    // Nunca no transcript.
    let transcripts = all_files_text(&fx.config_dir.path().join("projects"));
    assert!(transcripts.contains("primeira"), "transcript não gravado");
    assert!(!transcripts.contains("As you answer the user's questions"));
}

#[tokio::test]
async fn empty_setting_sources_skip_project_and_user_memories_but_keep_the_date() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);
    std::fs::write(fx.cwd.path().join("CLAUDE.md"), "do projeto").unwrap();
    std::fs::write(fx.config_dir.path().join("CLAUDE.md"), "do usuário").unwrap();
    let mut options = fx.options();
    options.setting_sources = Some(Vec::new());
    let mut client = fx.client(options);
    client.connect().await.expect("connect");
    let _ = ask(&mut client, "oi").await;
    client.disconnect().await.expect("disconnect");

    let request = &api.requests().await[0];
    let context = first_text(&request["messages"][0]);
    assert_eq!(
        context,
        format!("{CONTEXT_HEAD}# currentDate\nToday's date is 2026-09-23.\n\n      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.\n</system-reminder>\n")
    );
}

#[tokio::test]
async fn without_setting_sources_every_source_loads_like_the_cli_without_the_flag() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);
    std::fs::write(fx.cwd.path().join("CLAUDE.md"), "do projeto").unwrap();
    std::fs::write(fx.cwd.path().join("CLAUDE.local.md"), "local").unwrap();
    std::fs::write(fx.config_dir.path().join("CLAUDE.md"), "do usuário").unwrap();
    let mut client = fx.client(fx.options());
    client.connect().await.expect("connect");
    let _ = ask(&mut client, "oi").await;
    client.disconnect().await.expect("disconnect");

    let context = first_text(&api.requests().await[0]["messages"][0]);
    let user = context.find("do usuário").expect("user");
    let project = context.find("do projeto").expect("project");
    let local = context.find("\n\nlocal\n").expect("local");
    assert!(user < project && project < local, "ordem errada: {context}");
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

#[tokio::test]
async fn custom_system_prompt_goes_after_the_attribution_header_and_the_sdk_prefix() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);
    let mut options = fx.options();
    options.system_prompt = Some(SystemPromptConfig::String("Você é o assistente.".into()));
    options.setting_sources = Some(vec![SettingSource::Project]);
    let mut client = fx.client(options);
    client.connect().await.expect("connect");
    let _ = ask(&mut client, "oi").await;
    client.disconnect().await.expect("disconnect");

    let request = &api.requests().await[0];
    let first_user = first_text(&request["messages"][0]);
    assert_eq!(
        system_texts(request),
        vec![
            expected_header(&first_user, "sdk-rs"),
            AGENT_SDK_PREFIX.to_string(),
            "Você é o assistente.".to_string(),
        ]
    );
}

#[tokio::test]
async fn no_system_prompt_is_the_empty_custom_prompt_and_the_env_steers_the_header() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);

    let mut options = fx.options();
    options
        .env
        .insert("CLAUDE_CODE_ENTRYPOINT".into(), "sdk-py".into());
    let mut client = fx.client(options);
    client.connect().await.expect("connect");
    let _ = ask(&mut client, "oi").await;
    client.disconnect().await.expect("disconnect");

    let mut options = fx.options();
    options
        .env
        .insert("CLAUDE_CODE_ATTRIBUTION_HEADER".into(), "false".into());
    let mut client = fx.client(options);
    client.connect().await.expect("connect");
    let _ = ask(&mut client, "oi").await;
    client.disconnect().await.expect("disconnect");

    let requests = api.requests().await;
    let first_user = first_text(&requests[0]["messages"][0]);
    assert_eq!(
        system_texts(&requests[0]),
        vec![
            expected_header(&first_user, "sdk-py"),
            AGENT_SDK_PREFIX.to_string()
        ]
    );
    assert_eq!(
        system_texts(&requests[1]),
        vec![AGENT_SDK_PREFIX.to_string()]
    );
}

// ---------------------------------------------------------------------------
// Frame system/init
// ---------------------------------------------------------------------------

#[tokio::test]
async fn init_frame_carries_the_cli_fields_once_per_query() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);
    let mut options = fx.options();
    options.tools = Some(ToolsConfig::List(vec!["Read".into(), "Agent".into()]));
    let mut client = fx.client(options);
    client.connect().await.expect("connect");
    let first = ask(&mut client, "um").await;
    let second = ask(&mut client, "dois").await;
    client.disconnect().await.expect("disconnect");

    let init_of = |messages: &[Message]| -> Vec<Value> {
        messages
            .iter()
            .filter_map(|m| match m {
                Message::System(s) if s.subtype == "init" => Some(s.data.clone()),
                _ => None,
            })
            .collect()
    };
    let inits = init_of(&first);
    assert_eq!(inits.len(), 1, "um init por consulta: {first:?}");
    assert_eq!(init_of(&second).len(), 1);
    let init = &inits[0];
    let keys: Vec<&str> = init
        .as_object()
        .unwrap()
        .keys()
        .map(String::as_str)
        .collect();
    assert_eq!(
        keys,
        vec![
            "type",
            "subtype",
            "cwd",
            "tools",
            "mcp_servers",
            "model",
            "permissionMode",
            "slash_commands",
            "apiKeySource",
            "claude_code_version",
            "output_style",
            "agents",
            "skills",
            "plugins",
            "fast_mode_state",
            "uuid",
            "session_id",
        ]
    );
    assert_eq!(init["permissionMode"], "default");
    assert_eq!(init["apiKeySource"], "ANTHROPIC_API_KEY");
    assert_eq!(init["claude_code_version"], "2.1.90");
    assert_eq!(init["output_style"], "default");
    assert_eq!(init["fast_mode_state"], "off");
    assert_eq!(init["model"], "mock-model");
    assert_eq!(init["agents"], json!(["general-purpose"]));
    let tools = init["tools"].as_array().unwrap();
    assert!(tools.contains(&json!("Read")) && tools.contains(&json!("Task")));
    assert!(
        !tools.contains(&json!("Agent")),
        "Agent sai como Task: {tools:?}"
    );
    assert_eq!(init["cwd"], json!(fx.cwd.path().display().to_string()),);
}

// ---------------------------------------------------------------------------
// Opções que o nativo atende sem aviso
// ---------------------------------------------------------------------------

#[tokio::test]
async fn can_use_tool_through_with_native_transport_is_not_an_unsupported_option() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);
    let allow: prana::CanUseToolFn = Arc::new(|_name, _input, _ctx| {
        Box::pin(async { PermissionResult::Allow(PermissionResultAllow::default()) })
    });
    let mut options = fx.options();
    options.can_use_tool = Some(allow);
    options.skills = Some(json!([]));
    options.setting_sources = Some(vec![SettingSource::Project]);
    let mut client = ClaudeSDKClient::new(options).with_native_transport();
    client.connect().await.expect("connect");
    let messages = ask(&mut client, "oi").await;
    client.disconnect().await.expect("disconnect");
    assert!(
        !messages
            .iter()
            .any(|m| matches!(m, Message::System(s) if s.subtype == "unsupported_options")),
        "aviso indevido: {messages:?}"
    );
    assert!(messages.iter().any(|m| matches!(m, Message::Result(_))));
}

#[tokio::test]
async fn skills_with_names_are_still_announced() {
    let api = MockApi::start(vec![sse_text("ok")]).await;
    let fx = fixture(&api);
    let mut options = fx.options();
    options.skills = Some(json!(["pdf"]));
    let mut client = fx.client(options);
    client.connect().await.expect("connect");
    let messages = ask(&mut client, "oi").await;
    client.disconnect().await.expect("disconnect");
    let announced = messages.iter().any(|m| match m {
        Message::System(s) => {
            s.subtype == "unsupported_options" && s.data["options"] == json!(["skills"])
        }
        _ => false,
    });
    assert!(announced, "skills com nomes precisa avisar: {messages:?}");
}

// ---------------------------------------------------------------------------
// Espera pelo cliente (can_use_tool e hook_callback)
// ---------------------------------------------------------------------------

/// Com o relógio pausado, a espera de 11 minutos passa num instante: o
/// `can_use_tool` não tem teto (o usuário pode deixar o formulário aberto),
/// e a decisão tardia ainda vale.
#[tokio::test(start_paused = true)]
async fn can_use_tool_waits_past_ten_minutes_without_a_ceiling() {
    let api = MockApi::start(vec![String::new()]).await;
    let fx = fixture(&api);
    let target = fx.cwd.path().join("tarde.txt");
    let api = MockApi::start(vec![sse_write_call(&target), sse_text("feito")]).await;
    let slow: prana::CanUseToolFn = Arc::new(|_name, _input, _ctx| {
        Box::pin(async {
            tokio::time::sleep(std::time::Duration::from_secs(11 * 60)).await;
            PermissionResult::Allow(PermissionResultAllow::default())
        })
    });
    let mut options = fx.options();
    options
        .env
        .insert("ANTHROPIC_BASE_URL".into(), api.addr.clone());
    options.tools = Some(ToolsConfig::List(vec!["Write".into()]));
    options.can_use_tool = Some(slow);
    let mut client = ClaudeSDKClient::new(options).with_native_transport();
    client.connect().await.expect("connect");
    let messages = ask(&mut client, "escreva").await;
    client.disconnect().await.expect("disconnect");
    assert!(
        target.exists(),
        "a permissão tardia foi descartada: {messages:?}"
    );
    let result = messages
        .iter()
        .find_map(|m| match m {
            Message::Result(r) => Some(r.clone()),
            _ => None,
        })
        .expect("result");
    assert_eq!(result.subtype, "success");
}

/// O interrupt do turno encerra a espera do `can_use_tool` com a recusa que
/// o CLI produz (`Tool permission request failed: AbortError`).
#[tokio::test]
async fn interrupt_cancels_a_pending_can_use_tool_with_the_cli_denial() {
    let api = MockApi::start(vec![String::new()]).await;
    let fx = fixture(&api);
    let target = fx.cwd.path().join("nunca.txt");
    let api = MockApi::start(vec![sse_write_call(&target), sse_text("parei")]).await;
    let asked = Arc::new(tokio::sync::Notify::new());
    let asked_in_callback = Arc::clone(&asked);
    let never: prana::CanUseToolFn = Arc::new(move |_name, _input, _ctx| {
        let asked = Arc::clone(&asked_in_callback);
        Box::pin(async move {
            asked.notify_one();
            std::future::pending::<()>().await;
            PermissionResult::Allow(PermissionResultAllow::default())
        })
    });
    let mut options = fx.options();
    options
        .env
        .insert("ANTHROPIC_BASE_URL".into(), api.addr.clone());
    options.tools = Some(ToolsConfig::List(vec!["Write".into()]));
    options.can_use_tool = Some(never);
    let mut client = ClaudeSDKClient::new(options).with_native_transport();
    client.connect().await.expect("connect");
    let handle = client.handle().expect("handle");
    let interrupter = tokio::spawn(async move {
        asked.notified().await;
        handle.interrupt().await.expect("interrupt");
    });
    client.query("escreva").await.expect("query");
    let messages = tokio::time::timeout(
        std::time::Duration::from_secs(20),
        client.receive_response(),
    )
    .await
    .expect("a espera não foi cancelada pelo interrupt")
    .expect("response");
    interrupter.await.unwrap();
    client.disconnect().await.expect("disconnect");
    assert!(!target.exists());
    let denial = messages.iter().any(|m| match m {
        Message::User(u) => {
            format!("{:?}", u.content).contains("Tool permission request failed: AbortError")
        }
        _ => false,
    });
    assert!(denial, "recusa do CLI ausente: {messages:?}");
}

/// Um hook que passa do `timeout` do seu matcher vale como hook que não fez
/// nada (`{}`): o deny que ele daria tarde demais não bloqueia a tool.
#[tokio::test]
async fn hook_callback_past_its_matcher_timeout_is_a_no_op() {
    let api = MockApi::start(vec![String::new()]).await;
    let fx = fixture(&api);
    let target = fx.cwd.path().join("liberado.txt");
    let api = MockApi::start(vec![sse_write_call(&target), sse_text("feito")]).await;
    let late_deny: prana::HookCallbackFn = Arc::new(|_input, _id, _ctx| {
        Box::pin(async {
            tokio::time::sleep(std::time::Duration::from_secs(30)).await;
            HookJSONOutput::Sync {
                continue_: None,
                suppress_output: None,
                stop_reason: None,
                decision: None,
                system_message: None,
                reason: None,
                hook_specific_output: Some(HookSpecificOutput::PreToolUse {
                    permission_decision: Some("deny".to_string()),
                    permission_decision_reason: Some("tarde demais".to_string()),
                    updated_input: None,
                    additional_context: None,
                }),
            }
        })
    });
    let mut options = fx.options();
    options
        .env
        .insert("ANTHROPIC_BASE_URL".into(), api.addr.clone());
    options.tools = Some(ToolsConfig::List(vec!["Write".into()]));
    options.permission_mode = Some(PermissionMode::BypassPermissions);
    options.hooks = Some(HashMap::from([(
        HookEvent::PreToolUse,
        vec![HookMatcher {
            matcher: None,
            hooks: vec![late_deny],
            timeout: Some(1.0),
        }],
    )]));
    let mut client = ClaudeSDKClient::new(options).with_native_transport();
    client.connect().await.expect("connect");
    let started = std::time::Instant::now();
    let messages = ask(&mut client, "escreva").await;
    client.disconnect().await.expect("disconnect");
    assert!(started.elapsed() < std::time::Duration::from_secs(20));
    assert!(
        target.exists(),
        "o hook atrasado bloqueou a tool: {messages:?}"
    );
}
