//! Transporte nativo da API Anthropic — o motor agêntico roda NO PROCESSO,
//! sem subprocess do CLI, mas fala com o `ClaudeSDKClient` pelo MESMO
//! protocolo de frames stream-json que o CLI fala. Isso é deliberado: todo o
//! comportamento que o cliente já tem (can_use_tool, hooks, sdk_mcp, session
//! mirror, multi-turno) funciona sem mudar uma linha do lado do cliente.
//!
//! O que o transporte honra das `ClaudeAgentOptions` que recebe:
//! - `model` / `env[ANTHROPIC_MODEL]`, `env[ANTHROPIC_API_KEY]`,
//!   `env[ANTHROPIC_BASE_URL]` (o env das opções SOBREPÕE o do processo —
//!   é o env selado de quem monta sessão hermética);
//! - `system_prompt`, `max_turns`, `thinking`, `fallback_model`, `cwd`;
//! - `tools` (nomes de builtins: Read, Write, Edit, Bash, Glob, Grep, ...);
//! - `sdk_mcp_servers` — cada tool vira `mcp__<servidor>__<tool>` executada
//!   pela ponte JSON-RPC in-process (sem round-trip pelo cliente);
//! - `resume` / `fork_session` — o histórico vem do JSONL em
//!   `~/.claude/projects/<key>/<sessão>.jsonl`, o mesmo arquivo que o CLI
//!   escreveria, e é onde este transporte também escreve;
//! - `session_store.is_some()` — liga a emissão de frames `transcript_mirror`
//!   (quem consome é o batcher do CLIENTE, como no subprocess).
//!
//! Permissão: toda tool passa pelo `can_use_tool` do cliente via
//! `control_request`, inclusive as de MCP — a recusa carrega a MENSAGEM, que
//! é o canal de steering (commit forçado etc.). `PostToolUse` idem, via
//! `hook_callback` com os ids registrados no `initialize`.
//!
//! Compactação SOBREVIVE entre turnos: o loop avisa cada reescrita de
//! histórico (micro/auto/reactive) via `on_history_rewrite`, e o engine aplica
//! o snapshot quando o evento de boundary chega — o próximo turno parte do
//! contexto compactado, não do bruto.

use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;

use serde_json::{json, Value};
use tokio::sync::{mpsc, oneshot, Mutex};
use tokio_util::sync::CancellationToken;

use crate::agentic::{AgenticEvent, AgenticLoop, AgenticLoopOptions};
use crate::api::client::AnthropicClient;
use crate::api::types::{ApiMessage, ContentBlock, Role, SystemBlock, ThinkingParam};
use crate::errors::{ClaudeSDKError, Result};
use crate::internal::transport::Transport;
use crate::session::SessionStorage;
use crate::tools::framework::{
    PermissionOutcome, PostToolUseEvent, Tool, ToolContext, ToolExecutor, ToolRegistry,
    ToolResult,
};
use crate::types::{ClaudeAgentOptions, SystemPrompt, SystemPromptConfig, ThinkingConfig, ToolsConfig};

/// Teto de espera por uma resposta do cliente a um `control_request` nosso
/// (can_use_tool / hook_callback). Estourar vira recusa/ausência — nunca
/// pendura a run.
const CONTROL_ROUNDTRIP_TIMEOUT: std::time::Duration = std::time::Duration::from_secs(600);

// ---------------------------------------------------------------------------
// Estado compartilhado entre write()/engine
// ---------------------------------------------------------------------------

struct Shared {
    /// Frames a caminho do cliente (o que `read_message` entrega).
    outbound: mpsc::UnboundedSender<Value>,
    /// Respostas pendentes aos `control_request` QUE NÓS emitimos.
    pending: Mutex<HashMap<String, oneshot::Sender<Value>>>,
    /// Ids de callback de hook por evento, capturados do `initialize`
    /// (ex.: "PostToolUse" -> ["hook_0"]).
    hooks: Mutex<HashMap<String, Vec<String>>>,
    /// Token de cancelamento do turno em curso (interrupt).
    abort: Mutex<CancellationToken>,
    /// Override de modelo vindo de `set_model`.
    model_override: Mutex<Option<String>>,
    /// Modo de permissão vigente — mutável por `set_permission_mode` e pelos
    /// plan-mode tools; o `ToolContext` lê daqui.
    permission_mode: Arc<std::sync::RwLock<crate::types::PermissionMode>>,
    /// Resposta pré-computada do `mcp_status` (servidores in-process).
    mcp_status: Mutex<Value>,
    /// Última estimativa de uso de contexto, servida por `get_context_usage`.
    context_usage: Mutex<Value>,
    /// Snapshot de histórico REESCRITO pelo loop (compaction) — aplicado pelo
    /// engine quando o evento de boundary correspondente chega.
    rewritten_history: Arc<std::sync::Mutex<Option<Vec<ApiMessage>>>>,
    /// Gerador de request_id para os nossos control_requests.
    counter: AtomicU64,
    /// `end_input` já foi chamado — user frames novos são erro.
    input_closed: AtomicBool,
}

impl Shared {
    fn next_request_id(&self) -> String {
        let n = self.counter.fetch_add(1, Ordering::Relaxed);
        format!("ntr_{n}")
    }

    /// Emite um control_request ao cliente e espera a resposta.
    async fn control_roundtrip(&self, body: Value) -> Option<Value> {
        let request_id = self.next_request_id();
        let (tx, rx) = oneshot::channel();
        self.pending.lock().await.insert(request_id.clone(), tx);
        let frame = json!({
            "type": "control_request",
            "request_id": request_id,
            "request": body,
        });
        if self.outbound.send(frame).is_err() {
            self.pending.lock().await.remove(&request_id);
            return None;
        }
        match tokio::time::timeout(CONTROL_ROUNDTRIP_TIMEOUT, rx).await {
            Ok(Ok(value)) => Some(value),
            _ => {
                self.pending.lock().await.remove(&request_id);
                None
            }
        }
    }

    /// Dispara todos os `hook_callback` registrados para um evento e devolve
    /// as respostas (uma por callback id). `extra` completa o input padrão
    /// (session_id/transcript_path/cwd ficam por conta do chamador).
    async fn run_hooks(&self, event: &str, base_input: Value) -> Vec<Value> {
        let ids = self
            .hooks
            .lock()
            .await
            .get(event)
            .cloned()
            .unwrap_or_default();
        let mut responses = Vec::new();
        for callback_id in ids {
            let mut input = base_input.clone();
            if let Some(obj) = input.as_object_mut() {
                obj.insert("hook_event_name".to_string(), json!(event));
            }
            let tool_use_id = base_input
                .get("tool_use_id")
                .cloned()
                .unwrap_or(Value::Null);
            let response = self
                .control_roundtrip(json!({
                    "subtype": "hook_callback",
                    "callback_id": callback_id,
                    "input": input,
                    "tool_use_id": tool_use_id,
                }))
                .await;
            if let Some(r) = response {
                responses.push(r);
            }
        }
        responses
    }
}

// ---------------------------------------------------------------------------
// O transporte
// ---------------------------------------------------------------------------

/// Transporte in-process: implementa [`Transport`] dirigindo a API Anthropic
/// diretamente, com o protocolo de frames do CLI na fronteira com o cliente.
pub struct NativeApiTransport {
    /// Consumidas no `connect` (as opções não são clonáveis — carregam
    /// callbacks e o session_store).
    options: Option<ClaudeAgentOptions>,
    shared: Option<Arc<Shared>>,
    outbound_rx: Option<mpsc::UnboundedReceiver<Value>>,
    user_tx: Option<mpsc::UnboundedSender<Value>>,
    engine: Option<tokio::task::JoinHandle<()>>,
    ready: bool,
}

impl NativeApiTransport {
    /// Cria o transporte a partir das opções (o mesmo par de opções que o
    /// `SubprocessCLITransport::new` recebe — o prompt one-shot não existe
    /// aqui porque o caminho suportado é o streaming do `ClaudeSDKClient`).
    pub fn new(options: ClaudeAgentOptions) -> Self {
        Self {
            options: Some(options),
            shared: None,
            outbound_rx: None,
            user_tx: None,
            engine: None,
            ready: false,
        }
    }
}

#[async_trait::async_trait]
impl Transport for NativeApiTransport {
    async fn connect(&mut self) -> Result<()> {
        if self.ready {
            return Ok(());
        }
        let (outbound_tx, outbound_rx) = mpsc::unbounded_channel();
        let (user_tx, user_rx) = mpsc::unbounded_channel();
        let options = self.options.take().ok_or_else(|| {
            ClaudeSDKError::cli_connection("native transport cannot reconnect after close")
        })?;
        let initial_mode = options
            .permission_mode
            .unwrap_or(crate::types::PermissionMode::Default);
        let shared = Arc::new(Shared {
            outbound: outbound_tx,
            pending: Mutex::new(HashMap::new()),
            hooks: Mutex::new(HashMap::new()),
            abort: Mutex::new(CancellationToken::new()),
            model_override: Mutex::new(None),
            permission_mode: Arc::new(std::sync::RwLock::new(initial_mode)),
            mcp_status: Mutex::new(json!({"mcp_servers": []})),
            context_usage: Mutex::new(Value::Null),
            rewritten_history: Arc::new(std::sync::Mutex::new(None)),
            counter: AtomicU64::new(1),
            input_closed: AtomicBool::new(false),
        });
        let engine = tokio::spawn(engine_main(options, Arc::clone(&shared), user_rx));
        self.shared = Some(shared);
        self.outbound_rx = Some(outbound_rx);
        self.user_tx = Some(user_tx);
        self.engine = Some(engine);
        self.ready = true;
        Ok(())
    }

    async fn close(&mut self) -> Result<()> {
        if let Some(shared) = &self.shared {
            shared.abort.lock().await.cancel();
        }
        self.user_tx = None;
        if let Some(engine) = self.engine.take() {
            engine.abort();
        }
        self.shared = None;
        self.outbound_rx = None;
        self.ready = false;
        Ok(())
    }

    async fn write(&mut self, data: &str) -> Result<()> {
        let shared = self
            .shared
            .as_ref()
            .ok_or_else(|| ClaudeSDKError::cli_connection("Transport is not ready for writing"))?;
        for line in data.lines() {
            let line = line.trim();
            if line.is_empty() {
                continue;
            }
            let frame: Value = serde_json::from_str(line)
                .map_err(|e| ClaudeSDKError::sdk(format!("invalid frame written to native transport: {e}")))?;
            match frame.get("type").and_then(Value::as_str) {
                Some("user") => {
                    if shared.input_closed.load(Ordering::Relaxed) {
                        return Err(ClaudeSDKError::cli_connection(
                            "Transport is not ready for writing",
                        ));
                    }
                    let tx = self.user_tx.as_ref().ok_or_else(|| {
                        ClaudeSDKError::cli_connection("Transport is not ready for writing")
                    })?;
                    tx.send(frame)
                        .map_err(|_| ClaudeSDKError::cli_connection("engine terminated"))?;
                }
                Some("control_request") => {
                    handle_client_control(shared, &frame).await;
                }
                Some("control_response") => {
                    let response = &frame["response"];
                    let request_id = response
                        .get("request_id")
                        .and_then(Value::as_str)
                        .unwrap_or_default()
                        .to_string();
                    if let Some(tx) = shared.pending.lock().await.remove(&request_id) {
                        // Erro do cliente vira payload de recusa implícita: o
                        // consumidor interpreta a ausência de "behavior"/output.
                        let payload = if response.get("subtype").and_then(Value::as_str)
                            == Some("success")
                        {
                            response.get("response").cloned().unwrap_or(json!({}))
                        } else {
                            json!({"error": response.get("error").cloned().unwrap_or(Value::Null)})
                        };
                        let _ = tx.send(payload);
                    }
                }
                _ => {
                    // Frame desconhecido na entrada: ignorado, como o CLI faz.
                }
            }
        }
        Ok(())
    }

    async fn end_input(&mut self) -> Result<()> {
        if let Some(shared) = &self.shared {
            shared.input_closed.store(true, Ordering::Relaxed);
        }
        // Derrubar o canal de user frames faz o engine drenar a fila e
        // encerrar o stream de saída (EOF para `read_message`).
        self.user_tx = None;
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.ready
    }

    async fn read_message(&mut self) -> Result<Option<Value>> {
        let rx = match self.outbound_rx.as_mut() {
            Some(rx) => rx,
            None => return Ok(None),
        };
        Ok(rx.recv().await)
    }
}

// ---------------------------------------------------------------------------
// Controle vindo do cliente
// ---------------------------------------------------------------------------

async fn handle_client_control(shared: &Arc<Shared>, frame: &Value) {
    let request_id = frame
        .get("request_id")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string();
    let request = &frame["request"];
    let subtype = request.get("subtype").and_then(Value::as_str).unwrap_or("");
    let respond = |payload: Value| {
        let _ = shared.outbound.send(json!({
            "type": "control_response",
            "response": {
                "subtype": "success",
                "request_id": request_id,
                "response": payload,
            }
        }));
    };
    match subtype {
        "initialize" => {
            // Captura os hookCallbackIds por evento — é com eles que o engine
            // devolve `hook_callback` na hora certa.
            let mut map = HashMap::new();
            if let Some(hooks) = request.get("hooks").and_then(Value::as_object) {
                for (event, matchers) in hooks {
                    let mut ids = Vec::new();
                    if let Some(list) = matchers.as_array() {
                        for matcher in list {
                            if let Some(cb_ids) =
                                matcher.get("hookCallbackIds").and_then(Value::as_array)
                            {
                                ids.extend(
                                    cb_ids
                                        .iter()
                                        .filter_map(Value::as_str)
                                        .map(str::to_string),
                                );
                            }
                        }
                    }
                    map.insert(event.clone(), ids);
                }
            }
            *shared.hooks.lock().await = map;
            respond(json!({}));
        }
        "interrupt" => {
            shared.abort.lock().await.cancel();
            respond(json!({}));
        }
        "set_model" => {
            let model = request
                .get("model")
                .and_then(Value::as_str)
                .map(str::to_string);
            *shared.model_override.lock().await = model;
            respond(json!({}));
        }
        "set_permission_mode" => {
            let parsed = request
                .get("mode")
                .and_then(Value::as_str)
                .and_then(|m| serde_json::from_value::<crate::types::PermissionMode>(json!(m)).ok());
            match parsed {
                Some(mode) => {
                    if let Ok(mut guard) = shared.permission_mode.write() {
                        *guard = mode;
                    }
                    respond(json!({}));
                }
                None => {
                    let _ = shared.outbound.send(json!({
                        "type": "control_response",
                        "response": {
                            "subtype": "error",
                            "request_id": request_id,
                            "error": "invalid permission mode",
                        }
                    }));
                }
            }
        }
        "mcp_status" => {
            let status = shared.mcp_status.lock().await.clone();
            respond(status);
        }
        "get_context_usage" => {
            let usage = shared.context_usage.lock().await.clone();
            respond(usage);
        }
        other => {
            let message = match other {
                "rewind_files" | "mcp_reconnect" | "mcp_toggle" | "stop_task" => format!(
                    "Control request '{other}' is not supported by the native transport \
                     (it requires the CLI subprocess transport)."
                ),
                _ => format!("Unsupported control request subtype: {other}"),
            };
            let _ = shared.outbound.send(json!({
                "type": "control_response",
                "response": {
                    "subtype": "error",
                    "request_id": request_id,
                    "error": message,
                }
            }));
        }
    }
}

// ---------------------------------------------------------------------------
// O engine
// ---------------------------------------------------------------------------

/// Configuração resolvida das opções + env selado.
struct EngineConfig {
    api_key: String,
    base_url: Option<String>,
    model: Option<String>,
    cwd: String,
    mirror: bool,
}

fn env_of(options: &ClaudeAgentOptions, key: &str) -> Option<String> {
    // O env das opções SOBREPÕE o do processo: valor vazio nas opções conta
    // como ausente de propósito (é a convenção do selamento hermético).
    match options.env.get(key) {
        Some(v) if !v.is_empty() => Some(v.clone()),
        Some(_) => None,
        None => std::env::var(key).ok().filter(|v| !v.is_empty()),
    }
}

fn resolve_config(options: &ClaudeAgentOptions) -> Result<EngineConfig> {
    let api_key = env_of(options, "ANTHROPIC_API_KEY")
        .ok_or_else(|| ClaudeSDKError::sdk("native transport requires ANTHROPIC_API_KEY (options.env or process env)"))?;
    let base_url = env_of(options, "ANTHROPIC_BASE_URL");
    let model = options
        .model
        .clone()
        .or_else(|| env_of(options, "ANTHROPIC_MODEL"));
    let cwd = options
        .cwd
        .as_ref()
        .map(|p| p.display().to_string())
        .or_else(|| {
            std::env::current_dir()
                .ok()
                .map(|p| p.display().to_string())
        })
        .unwrap_or_else(|| ".".to_string());
    Ok(EngineConfig {
        api_key,
        base_url,
        model,
        cwd,
        mirror: options.session_store.is_some(),
    })
}

/// Prompt base do preset `claude_code` — o CLI monta o seu por dentro; o
/// nativo oferece um preset coerente (identidade + ambiente) em vez de vazio.
fn preset_system_prompt(config: &EngineConfig, model: &str) -> String {
    let today = chrono_free_date();
    format!(
        "You are Claude Code, Anthropic's official CLI for Claude.\n\
         You are an interactive agent that helps users with software engineering tasks. \
         Use the tools available to you to assist the user.\n\n\
         Here is useful information about the environment you are running in:\n\
         <env>\n\
         Working directory: {}\n\
         Platform: {}\n\
         Today's date: {}\n\
         </env>\n\
         You are powered by the model named {model}.",
        config.cwd,
        std::env::consts::OS,
        today,
    )
}

/// Data de hoje (YYYY-MM-DD) sem dependência de chrono.
fn chrono_free_date() -> String {
    let secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    // Conversão civil (algoritmo de Howard Hinnant) — dias desde epoch.
    let days = (secs / 86_400) as i64;
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z.rem_euclid(146_097);
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if m <= 2 { y + 1 } else { y };
    format!("{y:04}-{m:02}-{d:02}")
}

fn system_prompt_blocks(
    options: &ClaudeAgentOptions,
    config: &EngineConfig,
    model: &str,
) -> Vec<SystemBlock> {
    match &options.system_prompt {
        Some(SystemPromptConfig::String(s)) if !s.is_empty() => vec![SystemBlock::text(s.clone())],
        // Preset `claude_code`: o nativo monta um prompt base coerente
        // (identidade + ambiente) e concatena o `append`.
        Some(SystemPromptConfig::Structured(SystemPrompt::Preset { append, .. })) => {
            let mut blocks = vec![SystemBlock::text(preset_system_prompt(config, model))];
            if let Some(extra) = append.as_ref().filter(|s| !s.is_empty()) {
                blocks.push(SystemBlock::text(extra.clone()));
            }
            blocks
        }
        Some(SystemPromptConfig::Structured(SystemPrompt::File { path })) => {
            std::fs::read_to_string(path)
                .ok()
                .filter(|s| !s.is_empty())
                .map(|s| vec![SystemBlock::text(s)])
                .unwrap_or_default()
        }
        _ => Vec::new(),
    }
}

/// Budget usado quando o chamador pede thinking `adaptive` sem número: a API
/// crua exige um teto, e o CLI resolve o "adaptativo" por dentro. Escolher um
/// default é mais honesto que ignorar o pedido de thinking.
const ADAPTIVE_THINKING_BUDGET: u32 = 8_192;

fn thinking_param(options: &ClaudeAgentOptions) -> Option<ThinkingParam> {
    // `max_thinking_tokens` das options vence o budget do ThinkingConfig —
    // é o teto explícito de quem monta a sessão.
    let explicit_max = options
        .max_thinking_tokens
        .and_then(|n| u32::try_from(n).ok())
        .filter(|n| *n > 0);
    match &options.thinking {
        Some(ThinkingConfig::Enabled { budget_tokens, .. }) => explicit_max
            .or_else(|| u32::try_from(*budget_tokens).ok())
            .map(ThinkingParam::enabled),
        Some(ThinkingConfig::Adaptive { .. }) => Some(ThinkingParam::enabled(
            explicit_max.unwrap_or(ADAPTIVE_THINKING_BUDGET),
        )),
        // Disabled = sem thinking, mesmo com max_thinking_tokens posto.
        Some(ThinkingConfig::Disabled) => None,
        None => explicit_max.map(ThinkingParam::enabled),
    }
}

/// Opções da superfície pública que o transporte nativo NÃO traduz. Em vez de
/// ignorá-las em silêncio, o engine avisa uma vez, no início da sessão — quem
/// depende delas precisa do transporte subprocess do CLI.
fn unsupported_options(options: &ClaudeAgentOptions) -> Vec<&'static str> {
    let mut unsupported = Vec::new();
    if options.output_format.is_some() {
        unsupported.push("output_format (structured output)");
    }
    if options.effort.is_some() {
        unsupported.push("effort");
    }
    if !options.plugins.is_empty() {
        unsupported.push("plugins");
    }
    if options.settings.is_some() {
        unsupported.push("settings");
    }
    if options.setting_sources.is_some() {
        unsupported.push("setting_sources");
    }
    if options.skills.is_some() {
        unsupported.push("skills");
    }
    if options.sandbox.is_some() {
        unsupported.push("sandbox");
    }
    if options.permission_prompt_tool_name.is_some() {
        unsupported.push("permission_prompt_tool_name");
    }
    if options.task_budget.is_some() {
        unsupported.push("task_budget");
    }
    if options.continue_conversation {
        unsupported.push("continue_conversation (use resume)");
    }
    let has_external_mcp = match &options.mcp_servers {
        crate::types::McpServersConfig::Dict(map) => !map.is_empty(),
        crate::types::McpServersConfig::Path(_) => true,
    };
    if has_external_mcp {
        unsupported.push("mcp_servers externos (use sdk_mcp_servers)");
    }
    unsupported
}

async fn engine_main(
    options: ClaudeAgentOptions,
    shared: Arc<Shared>,
    mut user_rx: mpsc::UnboundedReceiver<Value>,
) {
    let config = match resolve_config(&options) {
        Ok(c) => c,
        Err(e) => {
            let _ = shared.outbound.send(json!({
                "type": "error",
                "error": format!("{e}"),
            }));
            return;
        }
    };

    let storage = match SessionStorage::for_cwd_with_env(&config.cwd, Some(&options.env)).await {
        Ok(s) => s,
        Err(e) => {
            let _ = shared.outbound.send(json!({
                "type": "error",
                "error": format!("failed to open session storage: {e}"),
            }));
            return;
        }
    };

    // Identidade e histórico da sessão (resume/fork).
    let (session_id, mut history) = match (&options.resume, options.fork_session) {
        (Some(resume_id), fork) => {
            let loaded = storage.load(resume_id).await.unwrap_or_default();
            let sid = if fork {
                uuid::Uuid::new_v4().to_string()
            } else {
                resume_id.clone()
            };
            (sid, loaded)
        }
        (None, _) => (uuid::Uuid::new_v4().to_string(), Vec::new()),
    };

    let mut client = AnthropicClient::new(config.api_key.clone());
    if let Some(base_url) = &config.base_url {
        client = client.with_base_url(base_url.clone());
    }
    if let Some(model) = &config.model {
        client = client.with_model(model.clone());
    }
    // Betas das options viram header (o único permitido pelo SDK é o 1M).
    let mut context_window_tokens = 200_000usize;
    for beta in &options.betas {
        match beta {
            crate::types::SdkBeta::Context1M => {
                client = client.with_beta("context-1m-2025-08-07");
                context_window_tokens = 1_000_000;
            }
        }
    }

    let transcript_path = storage.session_path(&session_id).display().to_string();
    let mut last_uuid: Option<String> = None;

    // mcp_status pré-computado: os servidores in-process com as suas tools.
    {
        let mut servers = Vec::new();
        for server_name in options.sdk_mcp_servers.names() {
            if let Some(server) = options.sdk_mcp_servers.get(&server_name) {
                let listed = server
                    .handle_message(&json!({"jsonrpc": "2.0", "id": 1, "method": "tools/list"}))
                    .await;
                let tools = listed
                    .as_ref()
                    .and_then(|v| v.pointer("/result/tools"))
                    .cloned()
                    .unwrap_or_else(|| json!([]));
                servers.push(json!({
                    "name": server_name,
                    "status": "connected",
                    "scope": "sdk",
                    "tools": tools,
                }));
            }
        }
        *shared.mcp_status.lock().await = json!({"mcp_servers": servers});
    }

    // SessionStart: dispara os hooks registrados (o resultado não bloqueia).
    let hook_base = |extra: Value| {        let mut base = json!({
            "session_id": session_id,
            "transcript_path": transcript_path,
            "cwd": config.cwd,
        });
        if let (Some(obj), Some(extra_obj)) = (base.as_object_mut(), extra.as_object()) {
            for (k, v) in extra_obj {
                obj.insert(k.clone(), v.clone());
            }
        }
        base
    };
    // Opções sem tradução nativa: avisadas UMA vez, nunca ignoradas em
    // silêncio — quem depende delas precisa do transporte subprocess.
    {
        let unsupported = unsupported_options(&options);
        if !unsupported.is_empty() {
            let _ = shared.outbound.send(json!({
                "type": "system",
                "subtype": "unsupported_options",
                "options": unsupported,
                "message": format!(
                    "These options have no native translation and were ignored: {}. \
                     Use the CLI subprocess transport if you need them.",
                    unsupported.join(", ")
                ),
                "session_id": session_id,
                "uuid": uuid::Uuid::new_v4().to_string(),
            }));
        }
    }

    shared
        .run_hooks("SessionStart", hook_base(json!({"source": "startup"})))
        .await;

    // Custo acumulado da sessão — o teto vem de options.max_budget_usd.
    let mut session_cost_usd: f64 = 0.0;

    // Stores por sessão: TodoV2/background e a lista TodoWrite v1.
    let task_store = Arc::new(crate::tools::task_store::TaskStore::new());
    let todo_store = Arc::new(std::sync::Mutex::new(serde_json::json!([])));

    while let Some(frame) = user_rx.recv().await {
        if let Some(budget) = options.max_budget_usd {
            if session_cost_usd >= budget {
                let _ = shared.outbound.send(json!({
                    "type": "result",
                    "subtype": "error_max_budget_usd",
                    "is_error": true,
                    "duration_ms": 0,
                    "duration_api_ms": 0,
                    "num_turns": 0,
                    "total_cost_usd": session_cost_usd,
                    "usage": {},
                    "stop_reason": null,
                    "session_id": session_id,
                    "uuid": uuid::Uuid::new_v4().to_string(),
                    "errors": [format!("Maximum budget of ${budget} exceeded (spent ${session_cost_usd:.4})")],
                }));
                continue;
            }
        }
        let mut content = user_content_of(&frame);
        if content.is_empty() {
            continue;
        }

        // UserPromptSubmit: pode BLOQUEAR o prompt ou anexar contexto.
        {
            let prompt_text = content
                .iter()
                .filter_map(|b| match b {
                    ContentBlock::Text { text, .. } => Some(text.as_str()),
                    _ => None,
                })
                .collect::<Vec<_>>()
                .join("\n");
            let responses = shared
                .run_hooks("UserPromptSubmit", hook_base(json!({"prompt": prompt_text})))
                .await;
            let mut blocked_reason: Option<String> = None;
            for r in &responses {
                let decision_block = r.get("decision").and_then(Value::as_str) == Some("block")
                    || r.pointer("/hookSpecificOutput/permissionDecision")
                        .and_then(Value::as_str)
                        == Some("deny");
                if decision_block {
                    blocked_reason = Some(
                        r.get("reason")
                            .and_then(Value::as_str)
                            .unwrap_or("Prompt blocked by UserPromptSubmit hook")
                            .to_string(),
                    );
                    break;
                }
                if let Some(ctx) = r
                    .pointer("/hookSpecificOutput/additionalContext")
                    .and_then(Value::as_str)
                {
                    content.push(ContentBlock::text(ctx.to_string()));
                }
            }
            if let Some(reason) = blocked_reason {
                let _ = shared.outbound.send(json!({
                    "type": "system",
                    "subtype": "user_prompt_submit_blocked",
                    "reason": reason,
                    "session_id": session_id,
                    "uuid": uuid::Uuid::new_v4().to_string(),
                }));
                continue;
            }
        }

        // Persiste o turno do usuário no JSONL (e espelha).
        match storage
            .append_user(&session_id, &content, last_uuid.as_deref(), &config.cwd)
            .await
        {
            Ok((uuid, entry)) => {
                last_uuid = Some(uuid);
                if config.mirror {
                    emit_mirror(&shared, &transcript_path, entry);
                }
            }
            Err(e) => {
                let _ = shared.outbound.send(json!({
                    "type": "error",
                    "error": format!("failed to persist user turn: {e}"),
                }));
            }
        }
        history.push(ApiMessage::user(content));

        // Token de cancelamento novo por corrida (interrupt cancela SÓ o turno).
        let abort = CancellationToken::new();
        *shared.abort.lock().await = abort.clone();

        let model = {
            let override_ = shared.model_override.lock().await.clone();
            override_
                .or_else(|| config.model.clone())
                .unwrap_or_else(|| crate::api::client::DEFAULT_MODEL.to_string())
        };

        let tool_results_dir = storage
            .session_path(&session_id)
            .with_extension("tool-results");
        let executor = build_executor(
            &options,
            &shared,
            &config,
            ExecutorSetup {
                session_id: session_id.clone(),
                transcript_path: transcript_path.clone(),
                tool_results_dir,
                task_store: Arc::clone(&task_store),
                todo_store: Arc::clone(&todo_store),
                client: client.clone(),
                model: model.clone(),
            },
        )
        .await;

        // Stop hook: roundtrip pelos callback ids registrados. `decision:
        // "block"` reinjeta a razão como user message (re-loop); `continue:
        // false` encerra com stop_hook_prevented.
        let stop_shared = Arc::clone(&shared);
        let stop_session = session_id.clone();
        let stop_transcript = transcript_path.clone();
        let stop_cwd = config.cwd.clone();
        let stop_hook: crate::agentic::StopHookCallback = Arc::new(move |_ctx| {
            let shared = Arc::clone(&stop_shared);
            let session_id = stop_session.clone();
            let transcript_path = stop_transcript.clone();
            let cwd = stop_cwd.clone();
            Box::pin(async move {
                let responses = shared
                    .run_hooks(
                        "Stop",
                        json!({
                            "session_id": session_id,
                            "transcript_path": transcript_path,
                            "cwd": cwd,
                            "stop_hook_active": true,
                        }),
                    )
                    .await;
                let mut result = crate::agentic::StopHookResult::default();
                for r in &responses {
                    if r.get("continue").and_then(Value::as_bool) == Some(false) {
                        result.prevent_continuation = true;
                    }
                    if r.get("decision").and_then(Value::as_str) == Some("block") {
                        let reason = r
                            .get("reason")
                            .and_then(Value::as_str)
                            .unwrap_or("Stop hook blocked stopping")
                            .to_string();
                        result
                            .blocking_messages
                            .push(ApiMessage::user(vec![ContentBlock::text(reason)]));
                    }
                }
                result
            })
        });

        // PreCompact: aviso antes da compactação cara (resposta ignorada).
        let pre_compact_shared = Arc::clone(&shared);
        let pre_compact_session = session_id.clone();
        let pre_compact_transcript = transcript_path.clone();
        let pre_compact_cwd = config.cwd.clone();
        let pre_compact: crate::agentic::PreCompactHook = Arc::new(move |trigger: String| {
            let shared = Arc::clone(&pre_compact_shared);
            let session_id = pre_compact_session.clone();
            let transcript_path = pre_compact_transcript.clone();
            let cwd = pre_compact_cwd.clone();
            Box::pin(async move {
                shared
                    .run_hooks(
                        "PreCompact",
                        json!({
                            "session_id": session_id,
                            "transcript_path": transcript_path,
                            "cwd": cwd,
                            "trigger": trigger,
                        }),
                    )
                    .await;
            })
        });

        // Rewrite de histórico: o loop grava o snapshot; o engine aplica
        // quando o evento de boundary correspondente chega.
        let rewrite_slot = Arc::clone(&shared.rewritten_history);
        let on_history_rewrite: crate::agentic::HistoryRewriteFn =
            Arc::new(move |messages: Vec<ApiMessage>| {
                if let Ok(mut slot) = rewrite_slot.lock() {
                    *slot = Some(messages);
                }
            });

        let has_stop_hooks = !shared
            .hooks
            .lock()
            .await
            .get("Stop")
            .cloned()
            .unwrap_or_default()
            .is_empty();

        let loop_options = AgenticLoopOptions {
            model: model.clone(),
            system_prompt: system_prompt_blocks(&options, &config, &model),
            max_turns: options
                .max_turns
                .and_then(|n| u32::try_from(n).ok()),
            initial_messages: history.clone(),
            thinking: thinking_param(&options),
            include_stream_events: options.include_partial_messages,
            abort: Some(abort),
            fallback_model: options.fallback_model.clone(),
            session_id: Some(session_id.clone()),
            stop_hook: if has_stop_hooks { Some(stop_hook) } else { None },
            pre_compact_hook: Some(pre_compact),
            on_history_rewrite: Some(on_history_rewrite),
            context_window_tokens,
            ..AgenticLoopOptions::default()
        };

        let agentic = AgenticLoop::new(client.clone(), executor, loop_options);
        let mut stream = agentic.stream();
        use futures::StreamExt as _;
        while let Some(event) = stream.next().await {
            match event {
                Ok(ev) => {
                    // Compaction reescreveu o histórico dentro do loop: o
                    // snapshot chega ANTES do evento de boundary — aplicar
                    // aqui é o que faz a compactação sobreviver entre turnos.
                    if let AgenticEvent::System { subtype, .. } = &ev {
                        if subtype == "microcompact" || subtype == "compact_boundary" {
                            if let Ok(mut slot) = shared.rewritten_history.lock() {
                                if let Some(snapshot) = slot.take() {
                                    history = snapshot;
                                }
                            }
                        }
                    }
                    if let AgenticEvent::Result { total_cost_usd: cost, .. } = &ev {
                        session_cost_usd += *cost;
                    }
                    track_history(&mut history, &ev);
                    persist_event(&storage, &shared, &config, &session_id, &transcript_path, &mut last_uuid, &ev)
                        .await;
                    match serde_json::to_value(&ev) {
                        Ok(frame) => {
                            if shared.outbound.send(frame).is_err() {
                                return;
                            }
                        }
                        Err(e) => {
                            let _ = shared.outbound.send(json!({
                                "type": "error",
                                "error": format!("failed to serialize event: {e}"),
                            }));
                        }
                    }
                }
                Err(e) => {
                    let _ = shared.outbound.send(json!({
                        "type": "error",
                        "error": format!("{e}"),
                    }));
                }
            }
        }

        // Estimativa de contexto atualizada para o get_context_usage.
        {
            use crate::compact::token_estimation::estimate_message_tokens_with_margin;
            let system_blocks = system_prompt_blocks(&options, &config, &model);
            let system_tokens: usize = system_blocks
                .iter()
                .map(|b| b.text.len() / 4)
                .sum();
            let total = estimate_message_tokens_with_margin(&history) + system_tokens;
            let max_tokens = context_window_tokens;
            *shared.context_usage.lock().await = json!({
                "categories": [
                    {"name": "System prompt", "tokens": system_tokens, "color": "blue"},
                    {"name": "Messages", "tokens": total.saturating_sub(system_tokens), "color": "green"},
                ],
                "totalTokens": total,
                "maxTokens": max_tokens,
                "rawMaxTokens": max_tokens,
                "percentage": (total as f64 / max_tokens as f64) * 100.0,
                "model": model,
                "isAutoCompactEnabled": true,
                "memoryFiles": [],
                "mcpTools": [],
                "agents": [],
                "gridRows": [],
            });
        }
    }
    // SessionEnd antes do EOF: o cliente ainda está lendo o stream.
    shared
        .run_hooks(
            "SessionEnd",
            json!({
                "session_id": session_id,
                "transcript_path": transcript_path,
                "cwd": config.cwd,
                "reason": "other",
            }),
        )
        .await;
    // user_tx caiu (end_input/close) e a fila drenou: EOF.
}

/// Extrai o conteúdo do frame `{"type":"user","message":{"content":...}}`.
fn user_content_of(frame: &Value) -> Vec<ContentBlock> {
    let content = &frame["message"]["content"];
    if let Some(text) = content.as_str() {
        if text.is_empty() {
            return Vec::new();
        }
        return vec![ContentBlock::text(text.to_string())];
    }
    serde_json::from_value(content.clone()).unwrap_or_default()
}

fn emit_mirror(shared: &Arc<Shared>, transcript_path: &str, entry: Value) {
    let _ = shared.outbound.send(json!({
        "type": "transcript_mirror",
        "filePath": transcript_path,
        "entries": [entry],
    }));
}

/// Mantém o histórico entre turnos do usuário a partir dos eventos do loop.
fn track_history(history: &mut Vec<ApiMessage>, event: &AgenticEvent) {
    match event {
        AgenticEvent::Assistant { message, .. } => {
            if let Some(content) = message.get("content") {
                if let Ok(blocks) = serde_json::from_value::<Vec<ContentBlock>>(content.clone()) {
                    history.push(ApiMessage {
                        role: Role::Assistant,
                        content: blocks,
                    });
                }
            }
        }
        AgenticEvent::User { message, .. } => {
            history.push(message.clone());
        }
        _ => {}
    }
}

/// Persiste o evento no JSONL do CLI e espelha quando o mirror está ligado.
async fn persist_event(
    storage: &SessionStorage,
    shared: &Arc<Shared>,
    config: &EngineConfig,
    session_id: &str,
    transcript_path: &str,
    last_uuid: &mut Option<String>,
    event: &AgenticEvent,
) {
    let appended = match event {
        AgenticEvent::Assistant { message, .. } => {
            let blocks: Vec<ContentBlock> = message
                .get("content")
                .cloned()
                .and_then(|c| serde_json::from_value(c).ok())
                .unwrap_or_default();
            let model = message
                .get("model")
                .and_then(Value::as_str)
                .unwrap_or_default()
                .to_string();
            let stop_reason = message
                .get("stop_reason")
                .and_then(Value::as_str)
                .map(str::to_string);
            storage
                .append_assistant(
                    session_id,
                    &blocks,
                    &model,
                    stop_reason.as_deref(),
                    last_uuid.as_deref(),
                    &config.cwd,
                )
                .await
                .ok()
        }
        AgenticEvent::User { message, .. } => storage
            .append_user(session_id, &message.content, last_uuid.as_deref(), &config.cwd)
            .await
            .ok(),
        _ => None,
    };
    if let Some((uuid, entry)) = appended {
        *last_uuid = Some(uuid);
        if config.mirror {
            emit_mirror(shared, transcript_path, entry);
        }
    }
}

// ---------------------------------------------------------------------------
// Tools: builtins nomeadas + ponte MCP + permissão/hooks via control_request
// ---------------------------------------------------------------------------

fn register_named_builtins(registry: &mut ToolRegistry, names: &[String]) {
    use crate::tools::*;
    for name in names {
        match name.as_str() {
            "Bash" => registry.register(Box::new(bash::BashTool::default())),
            "Read" => registry.register(Box::new(file_read::FileReadTool)),
            "Write" => registry.register(Box::new(file_write::FileWriteTool)),
            "Edit" => registry.register(Box::new(file_edit::FileEditTool)),
            "Glob" => registry.register(Box::new(glob_tool::GlobTool)),
            "Grep" => registry.register(Box::new(grep::GrepTool)),
            "NotebookEdit" => registry.register(Box::new(notebook::NotebookEditTool)),
            "TodoWrite" => registry.register(Box::new(todo::TodoWriteTool)),
            "WebFetch" => registry.register(Box::new(web_fetch::WebFetchTool)),
            "WebSearch" | "web_search" => {
                registry.register(Box::new(web_search::WebSearchTool::default()))
            }
            "AskUserQuestion" => registry.register(Box::new(ask_user::AskUserQuestionTool)),
            "TaskCreate" => registry.register(Box::new(tasks::TaskCreateTool)),
            "TaskGet" => registry.register(Box::new(tasks::TaskGetTool)),
            "TaskList" => registry.register(Box::new(tasks::TaskListTool)),
            "TaskUpdate" => registry.register(Box::new(tasks::TaskUpdateTool)),
            "TaskStop" => registry.register(Box::new(tasks::TaskStopTool)),
            "TaskOutput" => registry.register(Box::new(tasks::TaskOutputTool)),
            "EnterPlanMode" => registry.register(Box::new(plan_mode::EnterPlanModeTool)),
            "ExitPlanMode" => registry.register(Box::new(plan_mode::ExitPlanModeTool)),
            // Nome desconhecido: silencioso de propósito — a lista vem do
            // chamador e um nome CLI sem builtin nativo não pode derrubar a
            // sessão inteira.
            _ => {}
        }
    }
}

/// O que o executor precisa da sessão viva, além das opções e do estado
/// compartilhado: a identidade da conversa, onde ela é espelhada, e os
/// depósitos que as builtins de estado usam. Vieram parar numa struct porque
/// dez parâmetros posicionais do mesmo tipo `String`/`Arc` são trocáveis em
/// silêncio — o compilador não distingue `session_id` de `transcript_path`.
struct ExecutorSetup {
    session_id: String,
    transcript_path: String,
    tool_results_dir: std::path::PathBuf,
    task_store: Arc<crate::tools::task_store::TaskStore>,
    todo_store: Arc<std::sync::Mutex<serde_json::Value>>,
    client: AnthropicClient,
    model: String,
}

async fn build_executor(
    options: &ClaudeAgentOptions,
    shared: &Arc<Shared>,
    config: &EngineConfig,
    setup: ExecutorSetup,
) -> ToolExecutor {
    let ExecutorSetup {
        session_id,
        transcript_path,
        tool_results_dir,
        task_store,
        todo_store,
        client,
        model,
    } = setup;
    let session_id = session_id.as_str();
    let transcript_path = transcript_path.as_str();
    let permission_rules = crate::tools::permission::PermissionRules::from_lists(
        &options.allowed_tools,
        &options.disallowed_tools,
    );

    let mut registry = ToolRegistry::new();
    match &options.tools {
        Some(ToolsConfig::List(names)) => register_named_builtins(&mut registry, names),
        // Preset/ausente: o conjunto default de builtins.
        Some(ToolsConfig::Preset(_)) | None => registry.register_defaults(),
    }
    // Subagente in-process: registrado como `Task` (nome que os modelos
    // conhecem) e `Agent` (nome atual do CLI). Só quando as tools não vieram
    // por lista explícita sem ele.
    let wants_agent = match &options.tools {
        Some(ToolsConfig::List(names)) => names
            .iter()
            .any(|n| n == "Task" || n == "Agent"),
        _ => true,
    };
    if wants_agent {
        for tool_name in ["Task", "Agent"] {
            registry.register(Box::new(NativeAgentTool {
                client: client.clone(),
                model: model.clone(),
                agents: options.agents.clone().unwrap_or_default(),
                cwd: config.cwd.clone(),
                tool_results_dir: tool_results_dir.clone(),
                task_store: Arc::clone(&task_store),
                tool_name,
            }));
        }
    }

    // Deny incondicional tira a tool do request inteiro (filterToolsByDenyRules).
    registry.retain(|name| !permission_rules.is_tool_fully_denied(name));

    // Ponte MCP in-process: cada tool dos servidores declarados nas opções
    // vira uma tool `mcp__<servidor>__<tool>` executada via JSON-RPC direto.
    for server_name in options.sdk_mcp_servers.names() {
        if let Some(server) = options.sdk_mcp_servers.get(&server_name) {
            let listed = server
                .handle_message(&json!({
                    "jsonrpc": "2.0", "id": 1, "method": "tools/list"
                }))
                .await;
            let tools = listed
                .as_ref()
                .and_then(|v| v.pointer("/result/tools"))
                .and_then(Value::as_array)
                .cloned()
                .unwrap_or_default();
            for tool in tools {
                let tool_name = tool
                    .get("name")
                    .and_then(Value::as_str)
                    .unwrap_or_default()
                    .to_string();
                if tool_name.is_empty() {
                    continue;
                }
                registry.register(Box::new(McpBridgeTool {
                    server: Arc::clone(&server),
                    full_name: format!("mcp__{server_name}__{tool_name}"),
                    tool_name,
                    description: tool
                        .get("description")
                        .and_then(Value::as_str)
                        .unwrap_or_default()
                        .to_string(),
                    schema: tool
                        .get("inputSchema")
                        .cloned()
                        .unwrap_or_else(|| json!({"type": "object"})),
                }));
            }
        }
    }

    // PreToolUse: roda antes da permissão e pode decidi-la
    // (hookSpecificOutput.permissionDecision) ou reescrever o input.
    let pre_shared = Arc::clone(shared);
    let pre_session = session_id.to_string();
    let pre_transcript = transcript_path.to_string();
    let pre_cwd = config.cwd.clone();
    let pre_tool_use: crate::tools::framework::PreToolUseFn = Arc::new(move |request| {
        let shared = Arc::clone(&pre_shared);
        let session_id = pre_session.clone();
        let transcript_path = pre_transcript.clone();
        let cwd = pre_cwd.clone();
        Box::pin(async move {
            let responses = shared
                .run_hooks(
                    "PreToolUse",
                    json!({
                        "session_id": session_id,
                        "transcript_path": transcript_path,
                        "cwd": cwd,
                        "tool_name": request.tool_name,
                        "tool_input": request.input,
                        "tool_use_id": request.tool_use_id,
                    }),
                )
                .await;
            let mut decision = crate::tools::framework::PreToolUseDecision::default();
            for r in &responses {
                if let Some(updated) = r.pointer("/hookSpecificOutput/updatedInput") {
                    if !updated.is_null() {
                        decision.updated_input = Some(updated.clone());
                    }
                }
                let perm = r
                    .pointer("/hookSpecificOutput/permissionDecision")
                    .and_then(Value::as_str)
                    .or_else(|| r.get("decision").and_then(Value::as_str));
                match perm {
                    Some("deny") | Some("block") => {
                        let message = r
                            .pointer("/hookSpecificOutput/permissionDecisionReason")
                            .and_then(Value::as_str)
                            .or_else(|| r.get("reason").and_then(Value::as_str))
                            .unwrap_or("Denied by PreToolUse hook")
                            .to_string();
                        decision.permission =
                            Some(crate::tools::framework::PermissionOutcome::Deny { message });
                        // Um deny vence qualquer allow de outro hook.
                        return decision;
                    }
                    Some("allow") | Some("approve") => {
                        decision.permission =
                            Some(crate::tools::framework::PermissionOutcome::Allow {
                                updated_input: None,
                            });
                    }
                    _ => {}
                }
            }
            decision
        })
    });

    // can_use_tool: round-trip pelo cliente. Sem resposta = recusa dita.
    let permission_shared = Arc::clone(shared);
    let permission_callback: crate::tools::framework::PermissionCallbackFn =
        Arc::new(move |request| {
            let shared = Arc::clone(&permission_shared);
            Box::pin(async move {
                let response = shared
                    .control_roundtrip(json!({
                        "subtype": "can_use_tool",
                        "tool_name": request.tool_name,
                        "input": request.input,
                        "tool_use_id": request.tool_use_id,
                    }))
                    .await;
                match response {
                    Some(payload) => match payload.get("behavior").and_then(Value::as_str) {
                        Some("allow") => PermissionOutcome::Allow {
                            updated_input: payload.get("updatedInput").cloned(),
                        },
                        Some("deny") => PermissionOutcome::Deny {
                            message: payload
                                .get("message")
                                .and_then(Value::as_str)
                                .unwrap_or("Permission denied")
                                .to_string(),
                        },
                        _ => PermissionOutcome::Deny {
                            message: payload
                                .get("error")
                                .and_then(Value::as_str)
                                .unwrap_or("permission decision unavailable")
                                .to_string(),
                        },
                    },
                    None => PermissionOutcome::Deny {
                        message: "permission decision unavailable (client gone or timed out)"
                            .to_string(),
                    },
                }
            })
        });

    // PostToolUse: dispara cada callback id registrado no initialize e junta
    // os additionalContext — o texto volta dentro do tool_result.
    let hook_shared = Arc::clone(shared);
    let hook_session = session_id.to_string();
    let hook_transcript = transcript_path.to_string();
    let hook_cwd = config.cwd.clone();
    let post_tool_use: crate::tools::framework::PostToolUseFn = Arc::new(move |event: PostToolUseEvent| {
        let shared = Arc::clone(&hook_shared);
        let session_id = hook_session.clone();
        let transcript_path = hook_transcript.clone();
        let cwd = hook_cwd.clone();
        Box::pin(async move {
            // PostToolUse sempre; PostToolUseFailure adicionalmente quando o
            // resultado é erro.
            let mut events_to_run = vec!["PostToolUse"];
            if event.is_error {
                events_to_run.push("PostToolUseFailure");
            }
            let mut contexts: Vec<String> = Vec::new();
            for hook_event in events_to_run {
                let responses = shared
                    .run_hooks(
                        hook_event,
                        json!({
                            "session_id": session_id,
                            "transcript_path": transcript_path,
                            "cwd": cwd,
                            "tool_name": event.tool_name,
                            "tool_input": event.tool_input,
                            "tool_response": event.tool_response,
                            "tool_use_id": event.tool_use_id,
                        }),
                    )
                    .await;
                for response in responses {
                    if let Some(text) = response
                        .pointer("/hookSpecificOutput/additionalContext")
                        .and_then(Value::as_str)
                    {
                        contexts.push(text.to_string());
                    }
                }
            }
            if contexts.is_empty() {
                None
            } else {
                Some(contexts.join("\n"))
            }
        })
    });

    let context = ToolContext {
        working_directory: std::path::PathBuf::from(&config.cwd),
        permission_mode: *shared
            .permission_mode
            .read()
            .unwrap_or_else(|e| e.into_inner()),
        permission_mode_shared: Some(Arc::clone(&shared.permission_mode)),
        permission_callback: Some(permission_callback),
        pre_tool_use: Some(pre_tool_use),
        post_tool_use: Some(post_tool_use),
        tool_results_dir: Some(tool_results_dir),
        additional_directories: options.add_dirs.clone(),
        extra_env: options.env.clone(),
        task_store: Some(task_store),
        todo_store: Some(todo_store),
    };
    ToolExecutor::new(registry, context).with_permission_rules(permission_rules)
}

/// Subagente in-process: um `AgenticLoop` aninhado com registry próprio. O
/// `subagent_type` resolve em `options.agents`; sem tipo (ou `general-purpose`)
/// roda com as builtins default. As tools do subagente passam pelo MESMO
/// fluxo de permissão do pai (can_use_tool via cliente e modo compartilhado).
struct NativeAgentTool {
    client: AnthropicClient,
    model: String,
    agents: HashMap<String, crate::types::AgentDefinition>,
    cwd: String,
    tool_results_dir: std::path::PathBuf,
    task_store: Arc<crate::tools::task_store::TaskStore>,
    tool_name: &'static str,
}

#[async_trait::async_trait]
impl Tool for NativeAgentTool {
    fn name(&self) -> &str {
        self.tool_name
    }

    fn description(&self) -> &str {
        "Launch a subagent to handle a multi-step task. Provide a short \
         description, the full prompt, and optionally a subagent_type from the \
         configured agents."
    }

    fn input_schema(&self) -> Value {
        let types: Vec<String> = {
            let mut t: Vec<String> = self.agents.keys().cloned().collect();
            t.push("general-purpose".to_string());
            t.sort();
            t.dedup();
            t
        };
        json!({
            "type": "object",
            "properties": {
                "description": { "type": "string", "description": "A short (3-5 word) description of the task" },
                "prompt": { "type": "string", "description": "The task for the agent to perform" },
                "subagent_type": { "type": "string", "description": format!("One of: {}", types.join(", ")) },
                "model": { "type": "string", "description": "Optional model override" },
                "run_in_background": { "type": "boolean", "description": "Not supported natively; the agent runs in the foreground" }
            },
            "required": ["description", "prompt"]
        })
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let prompt = input
            .get("prompt")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .to_string();
        if prompt.is_empty() {
            return ToolResult::error("prompt is required");
        }
        let subagent_type = input
            .get("subagent_type")
            .and_then(Value::as_str)
            .unwrap_or("general-purpose");
        let definition = self.agents.get(subagent_type);
        if definition.is_none() && subagent_type != "general-purpose" {
            let mut known: Vec<&str> = self.agents.keys().map(String::as_str).collect();
            known.push("general-purpose");
            return ToolResult::error(format!(
                "Unknown subagent_type '{subagent_type}'. Available: {}",
                known.join(", ")
            ));
        }

        // Registry do subagente: as tools do agent def, ou as defaults —
        // nunca o próprio Agent/Task (sem recursão de subagentes na v1).
        let mut registry = ToolRegistry::new();
        match definition.and_then(|d| d.tools.as_ref()) {
            Some(names) => register_named_builtins(&mut registry, names),
            None => registry.register_defaults(),
        }

        let model = input
            .get("model")
            .and_then(Value::as_str)
            .map(str::to_string)
            .or_else(|| definition.and_then(|d| d.model.clone()))
            .unwrap_or_else(|| self.model.clone());

        let sub_context = ToolContext {
            working_directory: std::path::PathBuf::from(&self.cwd),
            permission_mode: context.mode(),
            permission_mode_shared: context.permission_mode_shared.clone(),
            permission_callback: context.permission_callback.clone(),
            pre_tool_use: context.pre_tool_use.clone(),
            post_tool_use: None,
            tool_results_dir: Some(self.tool_results_dir.clone()),
            additional_directories: context.additional_directories.clone(),
            extra_env: context.extra_env.clone(),
            task_store: Some(Arc::clone(&self.task_store)),
            todo_store: None,
        };
        let executor = ToolExecutor::new(registry, sub_context);

        let system_prompt = definition
            .map(|d| d.prompt.clone())
            .filter(|p| !p.is_empty())
            .map(|p| vec![SystemBlock::text(p)])
            .unwrap_or_default();
        let max_turns = definition
            .and_then(|d| d.max_turns)
            .and_then(|n| u32::try_from(n).ok());

        let loop_options = crate::agentic::AgenticLoopOptions {
            model,
            system_prompt,
            max_turns,
            include_stream_events: false,
            ..crate::agentic::AgenticLoopOptions::default()
        };

        let events = crate::agentic::agentic_query_collect(
            self.client.clone(),
            &prompt,
            executor,
            loop_options,
        )
        .await;

        match events {
            Ok(events) => {
                let mut final_text = String::new();
                let mut is_error = false;
                let mut errors: Vec<String> = Vec::new();
                for ev in &events {
                    if let AgenticEvent::Result {
                        result,
                        is_error: err,
                        errors: evs,
                        ..
                    } = ev
                    {
                        if let Some(text) = result {
                            final_text = text.clone();
                        }
                        is_error = *err;
                        errors = evs.clone();
                    }
                }
                if is_error {
                    ToolResult::error(format!(
                        "Subagent failed: {}",
                        if errors.is_empty() {
                            final_text
                        } else {
                            errors.join("; ")
                        }
                    ))
                } else if final_text.is_empty() {
                    ToolResult::error("Subagent produced no result")
                } else {
                    ToolResult::text(final_text)
                }
            }
            Err(e) => ToolResult::error(format!("Subagent error: {e}")),
        }
    }
}

/// Tool que encaminha para um `SdkMcpServer` in-process via JSON-RPC.
struct McpBridgeTool {
    server: Arc<crate::sdk_mcp::SdkMcpServer>,
    full_name: String,
    tool_name: String,
    description: String,
    schema: Value,
}

#[async_trait::async_trait]
impl Tool for McpBridgeTool {
    fn name(&self) -> &str {
        &self.full_name
    }

    fn description(&self) -> &str {
        &self.description
    }

    fn input_schema(&self) -> Value {
        self.schema.clone()
    }

    async fn execute(&self, input: Value, _context: &ToolContext) -> ToolResult {
        let response = self
            .server
            .handle_message(&json!({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "tools/call",
                "params": {"name": self.tool_name, "arguments": input},
            }))
            .await;
        let Some(response) = response else {
            return ToolResult::error("MCP server returned no response");
        };
        if let Some(err) = response.get("error") {
            let message = err
                .get("message")
                .and_then(Value::as_str)
                .unwrap_or("MCP error");
            return ToolResult::error(message.to_string());
        }
        let result = &response["result"];
        let is_error = result
            .get("isError")
            .and_then(Value::as_bool)
            .unwrap_or(false);
        let mut texts: Vec<String> = Vec::new();
        if let Some(content) = result.get("content").and_then(Value::as_array) {
            for block in content {
                if let Some(text) = block.get("text").and_then(Value::as_str) {
                    texts.push(text.to_string());
                }
            }
        }
        let text = texts.join("\n");
        if is_error {
            ToolResult::error(text)
        } else {
            ToolResult::text(text)
        }
    }
}
