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
//! Limitação declarada: a compactação automática acontece DENTRO de uma
//! corrida do loop; o histórico que o transporte mantém entre turnos do
//! usuário é o não-compactado (reconstruído dos eventos).

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
        let shared = Arc::new(Shared {
            outbound: outbound_tx,
            pending: Mutex::new(HashMap::new()),
            hooks: Mutex::new(HashMap::new()),
            abort: Mutex::new(CancellationToken::new()),
            model_override: Mutex::new(None),
            counter: AtomicU64::new(1),
            input_closed: AtomicBool::new(false),
        });
        let options = self.options.take().ok_or_else(|| {
            ClaudeSDKError::cli_connection("native transport cannot reconnect after close")
        })?;
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
        "set_permission_mode" | "mcp_status" | "get_context_usage" => {
            respond(json!({}));
        }
        other => {
            let _ = shared.outbound.send(json!({
                "type": "control_response",
                "response": {
                    "subtype": "error",
                    "request_id": request_id,
                    "error": format!("Unsupported control request subtype: {other}"),
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

fn system_prompt_blocks(options: &ClaudeAgentOptions) -> Vec<SystemBlock> {
    match &options.system_prompt {
        Some(SystemPromptConfig::String(s)) if !s.is_empty() => vec![SystemBlock::text(s.clone())],
        // O preset do CLI não existe nativamente; o que dá para honrar do
        // structured é o `append`. Arquivo é lido no connect? Não: síncrono
        // aqui, então File é lido de forma best-effort.
        Some(SystemPromptConfig::Structured(SystemPrompt::Preset { append, .. })) => append
            .as_ref()
            .filter(|s| !s.is_empty())
            .map(|s| vec![SystemBlock::text(s.clone())])
            .unwrap_or_default(),
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

fn thinking_param(options: &ClaudeAgentOptions) -> Option<ThinkingParam> {
    match &options.thinking {
        Some(ThinkingConfig::Enabled { budget_tokens, .. }) => {
            u32::try_from(*budget_tokens).ok().map(ThinkingParam::enabled)
        }
        // Adaptive não tem tradução direta na API crua; Disabled/ausente = sem thinking.
        _ => None,
    }
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

    let transcript_path = storage.session_path(&session_id).display().to_string();
    let mut last_uuid: Option<String> = None;

    while let Some(frame) = user_rx.recv().await {
        let content = user_content_of(&frame);
        if content.is_empty() {
            continue;
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
            &session_id,
            &transcript_path,
            tool_results_dir,
        )
        .await;
        let loop_options = AgenticLoopOptions {
            model,
            system_prompt: system_prompt_blocks(&options),
            max_turns: options
                .max_turns
                .and_then(|n| u32::try_from(n).ok()),
            initial_messages: history.clone(),
            thinking: thinking_param(&options),
            include_stream_events: false,
            abort: Some(abort),
            fallback_model: options.fallback_model.clone(),
            session_id: Some(session_id.clone()),
            ..AgenticLoopOptions::default()
        };

        let agentic = AgenticLoop::new(client.clone(), executor, loop_options);
        let mut stream = agentic.stream();
        use futures::StreamExt as _;
        while let Some(event) = stream.next().await {
            match event {
                Ok(ev) => {
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
    }
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
            "WebSearch" => registry.register(Box::new(web_search::WebSearchTool)),
            // Nome desconhecido: silencioso de propósito — a lista vem do
            // chamador e um nome CLI sem builtin nativo não pode derrubar a
            // sessão inteira.
            _ => {}
        }
    }
}

async fn build_executor(
    options: &ClaudeAgentOptions,
    shared: &Arc<Shared>,
    config: &EngineConfig,
    session_id: &str,
    transcript_path: &str,
    tool_results_dir: std::path::PathBuf,
) -> ToolExecutor {
    let mut registry = ToolRegistry::new();
    match &options.tools {
        Some(ToolsConfig::List(names)) => register_named_builtins(&mut registry, names),
        // Preset/ausente: o conjunto default de builtins.
        Some(ToolsConfig::Preset(_)) | None => registry.register_defaults(),
    }

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
            let ids = shared
                .hooks
                .lock()
                .await
                .get("PostToolUse")
                .cloned()
                .unwrap_or_default();
            if ids.is_empty() {
                return None;
            }
            let mut contexts: Vec<String> = Vec::new();
            for callback_id in ids {
                let response = shared
                    .control_roundtrip(json!({
                        "subtype": "hook_callback",
                        "callback_id": callback_id,
                        "input": {
                            "hook_event_name": "PostToolUse",
                            "session_id": session_id,
                            "transcript_path": transcript_path,
                            "cwd": cwd,
                            "tool_name": event.tool_name,
                            "tool_input": event.tool_input,
                            "tool_response": event.tool_response,
                            "tool_use_id": event.tool_use_id,
                        },
                        "tool_use_id": event.tool_use_id,
                    }))
                    .await;
                if let Some(text) = response
                    .as_ref()
                    .and_then(|v| v.pointer("/hookSpecificOutput/additionalContext"))
                    .and_then(Value::as_str)
                {
                    contexts.push(text.to_string());
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
        permission_mode: crate::types::PermissionMode::Default,
        permission_callback: Some(permission_callback),
        post_tool_use: Some(post_tool_use),
        tool_results_dir: Some(tool_results_dir),
    };
    ToolExecutor::new(registry, context)
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
