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
//! - `mcp_servers`: servidores externos por `stdio`, `sse` e `http`
//!   (streamável), conectados uma vez por sessão pelo cliente MCP da crate
//!   (`crate::mcp`), com as mesmas tools `mcp__<servidor>__<tool>`; um
//!   servidor que não responde vira `failed` no `mcp_status`, e a sessão
//!   segue sem ele. `McpServersConfig::Path` lê o `mcpServers` do arquivo,
//!   como o `--mcp-config` do CLI;
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
use crate::api::types::{
    ApiMessage, ContentBlock, CreateMessageRequest, Role, SystemBlock, ThinkingParam,
};
use crate::errors::{ClaudeSDKError, Result};
use crate::internal::transport::Transport;
use crate::session::SessionStorage;
use crate::tools::framework::{
    PermissionOutcome, PostToolUseEvent, Tool, ToolContext, ToolExecutor, ToolRegistry, ToolResult,
};
use crate::types::{
    ClaudeAgentOptions, SystemPrompt, SystemPromptConfig, ThinkingConfig, ToolsConfig,
};

/// Teto default de um `hook_callback` (`TOOL_HOOK_EXECUTION_TIMEOUT_MS` do
/// CLI), quando o matcher não traz `timeout`. O `can_use_tool` não tem teto:
/// o usuário pode deixar um formulário aberto o tempo que quiser, e só o
/// interrupt do turno encerra a espera.
const TOOL_HOOK_EXECUTION_TIMEOUT: std::time::Duration = std::time::Duration::from_secs(600);

/// Por que uma espera por resposta do cliente terminou sem resposta.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum RoundtripFailure {
    /// O turno já estava interrompido antes do envio (`Request aborted`).
    AbortedBeforeSend,
    /// Interrupt do turno durante a espera (`AbortError`).
    Aborted,
    /// Estourou o teto pedido.
    TimedOut,
    /// O canal com o cliente caiu antes da resposta.
    Closed,
}

impl RoundtripFailure {
    /// O texto que o `${error}` do CLI produziria para este motivo.
    fn js_error(self) -> &'static str {
        match self {
            RoundtripFailure::AbortedBeforeSend => "Error: Request aborted",
            RoundtripFailure::Aborted | RoundtripFailure::TimedOut => "AbortError",
            RoundtripFailure::Closed => {
                "Error: Tool permission stream closed before response received"
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Estado compartilhado entre write()/engine
// ---------------------------------------------------------------------------

/// Os `hook_callback` por evento: id do callback e `timeout` (segundos) do
/// matcher que o registrou.
type HookCallbacks = HashMap<String, Vec<(String, Option<f64>)>>;

struct Shared {
    /// Frames a caminho do cliente (o que `read_message` entrega).
    outbound: mpsc::UnboundedSender<Value>,
    /// Respostas pendentes aos `control_request` QUE NÓS emitimos.
    pending: Mutex<HashMap<String, oneshot::Sender<Value>>>,
    /// Ids de callback de hook por evento, capturados do `initialize`
    /// (ex.: "PostToolUse" -> [("hook_0", None)]), cada um com o `timeout`
    /// (segundos) do seu matcher, quando veio.
    hooks: Mutex<HookCallbacks>,
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
    /// O que a geração de título precisa para trabalhar. Só fica pronto depois
    /// que o engine resolveu config, sessão e storage, e antes disso um
    /// `generate_session_title` responde título nulo em vez de esperar.
    titling: Mutex<Option<Titling>>,
}

/// Recursos da geração de título de sessão (`generate_session_title`).
///
/// O cliente daqui é SEPARADO do cliente do turno: leva o modelo pequeno e
/// nenhum beta, porque um pedido de sete palavras não tem uso para janela de
/// 1M e nem todo proxy aceita o par beta/modelo.
#[derive(Clone)]
struct Titling {
    client: AnthropicClient,
    model: String,
    session_id: String,
    storage: SessionStorage,
    transcript_path: String,
    mirror: bool,
}

impl Shared {
    fn next_request_id(&self) -> String {
        let n = self.counter.fetch_add(1, Ordering::Relaxed);
        format!("ntr_{n}")
    }

    /// Emite um control_request ao cliente e espera a resposta, como o
    /// `StructuredIO.sendRequest` do CLI: sem teto próprio (`timeout = None`
    /// espera o quanto o cliente levar), cancelada pelo interrupt do turno
    /// em curso. Cancelar ou estourar o `timeout` avisa o cliente com um
    /// `control_cancel_request`.
    async fn control_roundtrip(
        &self,
        body: Value,
        timeout: Option<std::time::Duration>,
    ) -> std::result::Result<Value, RoundtripFailure> {
        let cancel = self.abort.lock().await.clone();
        if cancel.is_cancelled() {
            return Err(RoundtripFailure::AbortedBeforeSend);
        }
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
            return Err(RoundtripFailure::Closed);
        }
        let deadline = async {
            match timeout {
                Some(limit) => tokio::time::sleep(limit).await,
                None => std::future::pending::<()>().await,
            }
        };
        let failure = tokio::select! {
            answer = rx => {
                return answer.map_err(|_| RoundtripFailure::Closed);
            }
            _ = cancel.cancelled() => RoundtripFailure::Aborted,
            _ = deadline => RoundtripFailure::TimedOut,
        };
        self.pending.lock().await.remove(&request_id);
        let _ = self.outbound.send(json!({
            "type": "control_cancel_request",
            "request_id": request_id,
        }));
        Err(failure)
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
        for (callback_id, timeout_secs) in ids {
            let mut input = base_input.clone();
            if let Some(obj) = input.as_object_mut() {
                obj.insert("hook_event_name".to_string(), json!(event));
            }
            let tool_use_id = base_input
                .get("tool_use_id")
                .cloned()
                .unwrap_or(Value::Null);
            // `createHookCallback`: o `timeout` do matcher (segundos) ou o
            // `TOOL_HOOK_EXECUTION_TIMEOUT_MS`, somado ao abort do turno.
            // Estourar ou ser cancelado vale como hook que não fez nada (`{}`).
            let limit = timeout_secs
                .filter(|s| *s > 0.0)
                .map(std::time::Duration::from_secs_f64)
                .unwrap_or(TOOL_HOOK_EXECUTION_TIMEOUT);
            let response = self
                .control_roundtrip(
                    json!({
                        "subtype": "hook_callback",
                        "callback_id": callback_id,
                        "input": input,
                        "tool_use_id": tool_use_id,
                    }),
                    Some(limit),
                )
                .await;
            match response {
                Ok(r) => responses.push(r),
                Err(_) => responses.push(json!({})),
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
    /// Canal dos frames de usuário para o engine. Fica num slot compartilhado
    /// com o [`NativeWriter`]: fechar a entrada é esvaziar o slot, e isso vale
    /// para os dois lados ao mesmo tempo.
    user_tx: UserSlot,
    engine: Option<tokio::task::JoinHandle<()>>,
    ready: bool,
}

/// Slot do canal de frames de usuário, compartilhado entre o transporte e o
/// escritor concorrente.
type UserSlot = Arc<std::sync::Mutex<Option<mpsc::UnboundedSender<Value>>>>;

/// Escritor concorrente do transporte nativo: o mesmo tratamento de frames
/// do `write`, sem precisar do transporte emprestado (a leitura segue livre
/// numa outra tarefa).
struct NativeWriter {
    shared: Arc<Shared>,
    user_tx: UserSlot,
}

#[async_trait::async_trait]
impl crate::internal::transport::TransportWriter for NativeWriter {
    async fn write(&self, data: &str) -> Result<()> {
        write_frames(&self.shared, &self.user_tx, data).await
    }

    async fn end_input(&self) -> Result<()> {
        close_input(&self.shared, &self.user_tx);
        Ok(())
    }
}

/// Marca a entrada como fechada e derruba o canal: o engine drena a fila e
/// encerra o stream de saída (EOF para `read_message`).
fn close_input(shared: &Shared, user_tx: &UserSlot) {
    shared.input_closed.store(true, Ordering::Relaxed);
    if let Ok(mut slot) = user_tx.lock() {
        *slot = None;
    }
}

/// Trata as linhas escritas pelo cliente: frames de usuário vão para o
/// engine, `control_request` é atendido na hora e `control_response` destrava
/// quem esperava por ela.
async fn write_frames(shared: &Arc<Shared>, user_tx: &UserSlot, data: &str) -> Result<()> {
    for line in data.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let frame: Value = serde_json::from_str(line).map_err(|e| {
            ClaudeSDKError::sdk(format!("invalid frame written to native transport: {e}"))
        })?;
        match frame.get("type").and_then(Value::as_str) {
            Some("user") => {
                if shared.input_closed.load(Ordering::Relaxed) {
                    return Err(ClaudeSDKError::cli_connection(
                        "Transport is not ready for writing",
                    ));
                }
                let tx = user_tx
                    .lock()
                    .ok()
                    .and_then(|slot| slot.clone())
                    .ok_or_else(|| {
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
                    let payload =
                        if response.get("subtype").and_then(Value::as_str) == Some("success") {
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

impl NativeApiTransport {
    /// Cria o transporte a partir das opções (o mesmo par de opções que o
    /// `SubprocessCLITransport::new` recebe — o prompt one-shot não existe
    /// aqui porque o caminho suportado é o streaming do `ClaudeSDKClient`).
    pub fn new(options: ClaudeAgentOptions) -> Self {
        Self {
            options: Some(options),
            shared: None,
            outbound_rx: None,
            user_tx: Arc::new(std::sync::Mutex::new(None)),
            engine: None,
            ready: false,
        }
    }
}

/// Dropar o transporte sem `close()` (o cliente foi abortado no meio de um
/// turno, por exemplo) NÃO pode deixar o engine vivo: ele continuaria
/// chamando a API e executando tools sem ninguém para ler o resultado. O
/// `abort` do JoinHandle é síncrono, então cabe no Drop.
impl Drop for NativeApiTransport {
    fn drop(&mut self) {
        if let Some(engine) = self.engine.take() {
            engine.abort();
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
            mcp_status: Mutex::new(json!({"mcpServers": pending_mcp_status(&options)})),
            context_usage: Mutex::new(Value::Null),
            rewritten_history: Arc::new(std::sync::Mutex::new(None)),
            counter: AtomicU64::new(1),
            input_closed: AtomicBool::new(false),
            titling: Mutex::new(None),
        });
        let engine = tokio::spawn(engine_main(options, Arc::clone(&shared), user_rx));
        self.shared = Some(shared);
        self.outbound_rx = Some(outbound_rx);
        if let Ok(mut slot) = self.user_tx.lock() {
            *slot = Some(user_tx);
        }
        self.engine = Some(engine);
        self.ready = true;
        Ok(())
    }

    async fn close(&mut self) -> Result<()> {
        if let Some(shared) = &self.shared {
            shared.abort.lock().await.cancel();
        }
        if let Ok(mut slot) = self.user_tx.lock() {
            *slot = None;
        }
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
        write_frames(shared, &self.user_tx, data).await
    }

    async fn end_input(&mut self) -> Result<()> {
        match &self.shared {
            Some(shared) => close_input(shared, &self.user_tx),
            None => {
                if let Ok(mut slot) = self.user_tx.lock() {
                    *slot = None;
                }
            }
        }
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.ready
    }

    fn concurrent_writer(&self) -> Option<Arc<dyn crate::internal::transport::TransportWriter>> {
        let shared = Arc::clone(self.shared.as_ref()?);
        Some(Arc::new(NativeWriter {
            shared,
            user_tx: Arc::clone(&self.user_tx),
        }))
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
                            let timeout = matcher.get("timeout").and_then(Value::as_f64);
                            if let Some(cb_ids) =
                                matcher.get("hookCallbackIds").and_then(Value::as_array)
                            {
                                ids.extend(
                                    cb_ids
                                        .iter()
                                        .filter_map(Value::as_str)
                                        .map(|id| (id.to_string(), timeout)),
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
            let parsed = request.get("mode").and_then(Value::as_str).and_then(|m| {
                serde_json::from_value::<crate::types::PermissionMode>(json!(m)).ok()
            });
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
        "generate_session_title" => {
            let description = request
                .get("description")
                .and_then(Value::as_str)
                .unwrap_or_default()
                .to_string();
            let persist = request
                .get("persist")
                .and_then(Value::as_bool)
                .unwrap_or(false);
            // A geração fala com a API, então sai da linha de leitura do
            // transporte: esperar aqui atrasaria todo frame seguinte do
            // cliente, inclusive um interrupt.
            let shared = Arc::clone(shared);
            let request_id = request_id.clone();
            tokio::spawn(async move {
                let titling = shared.titling.lock().await.clone();
                let title = match titling {
                    Some(titling) => session_title(&shared, &titling, &description, persist).await,
                    None => None,
                };
                let _ = shared.outbound.send(json!({
                    "type": "control_response",
                    "response": {
                        "subtype": "success",
                        "request_id": request_id,
                        "response": { "title": title },
                    }
                }));
            });
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
// Título da sessão
// ---------------------------------------------------------------------------

/// Modelo default do título: pequeno de propósito, porque a tarefa é curta.
const DEFAULT_TITLE_MODEL: &str = "claude-haiku-4-5-20251001";

/// Teto de texto mandado ao modelo, contado do FIM: o assunto da sessão mora
/// no que aconteceu por último, não na primeira mensagem.
const MAX_CONVERSATION_TEXT: usize = 1000;

/// Título tem sete palavras no máximo, e a resposta é um JSON de uma chave.
const TITLE_MAX_TOKENS: u32 = 64;

/// O prompt é o do CLI, palavra por palavra, com UM acréscimo deliberado: a
/// frase que manda escrever o título no idioma da conversa. Sem ela, o modelo
/// segue o idioma deste prompt, que é inglês, e uma conversa inteira em
/// português ganha um título em inglês. Medido.
const SESSION_TITLE_PROMPT: &str = r#"Generate a concise, sentence-case title (3-7 words) that captures the main topic or goal of this coding session. The title should be clear enough that the user recognizes the session in a list. Use sentence case: capitalize only the first word and proper nouns. Write the title in the same language the conversation is in.

Return JSON with a single "title" field.

Good examples:
{"title": "Fix login button on mobile"}
{"title": "Add OAuth authentication"}
{"title": "Debug failing CI tests"}
{"title": "Refactor API client error handling"}

Bad (too vague): {"title": "Code changes"}
Bad (too long): {"title": "Investigate and fix the issue where the login button does not respond on mobile devices"}
Bad (wrong case): {"title": "Fix Login Button On Mobile"}"#;

/// Gera o título e, quando `persist`, grava a entrada `ai-title` no transcript.
///
/// Nada aqui derruba a sessão: modelo fora da allowlist do proxy, rede caída
/// ou resposta ilegível viram título nulo e um aviso, como no CLI.
async fn session_title(
    shared: &Arc<Shared>,
    titling: &Titling,
    description: &str,
    persist: bool,
) -> Option<String> {
    let title = ask_for_title(titling, description).await?;
    if persist {
        match titling
            .storage
            .append_ai_title(&titling.session_id, &title)
            .await
        {
            Ok(entry) => {
                if titling.mirror {
                    emit_mirror(shared, &titling.transcript_path, entry);
                }
            }
            Err(e) => eprintln!("Warning: failed to persist session title: {e}"),
        }
    }
    Some(title)
}

async fn ask_for_title(titling: &Titling, description: &str) -> Option<String> {
    let trimmed = description.trim();
    if trimmed.is_empty() {
        return None;
    }
    let request = CreateMessageRequest {
        model: titling.model.clone(),
        max_tokens: TITLE_MAX_TOKENS,
        messages: vec![ApiMessage::user(vec![ContentBlock::text(last_chars(
            trimmed,
            MAX_CONVERSATION_TEXT,
        ))])],
        system: Some(vec![SystemBlock::text(SESSION_TITLE_PROMPT)]),
        tools: None,
        tool_choice: None,
        stream: false,
        metadata: None,
        stop_sequences: None,
        temperature: Some(0.0),
        top_p: None,
        top_k: None,
        thinking: None,
    };
    match titling.client.create_message(request).await {
        Ok(response) => title_of_blocks(&response.content),
        Err(e) => {
            eprintln!("Warning: session title generation failed: {e}");
            None
        }
    }
}

/// Últimos `max` CARACTERES (não bytes: cortar no meio de um caractere faria
/// o texto virar erro de serialização em vez de prompt).
fn last_chars(text: &str, max: usize) -> String {
    let total = text.chars().count();
    if total <= max {
        return text.to_string();
    }
    text.chars().skip(total - max).collect()
}

fn title_of_blocks(content: &[ContentBlock]) -> Option<String> {
    let text = content
        .iter()
        .filter_map(|block| match block {
            ContentBlock::Text { text, .. } => Some(text.as_str()),
            _ => None,
        })
        .collect::<Vec<_>>()
        .join("");
    title_of_model_text(&text)
}

/// O modelo responde um JSON `{"title": ...}`. Sem campo, com título vazio ou
/// com resposta que nem JSON é, o resultado é `None`, nunca título em branco.
fn title_of_model_text(text: &str) -> Option<String> {
    let trimmed = text.trim();
    if let Some(title) = title_of_json(trimmed) {
        return Some(title);
    }
    // O pedido não carrega schema de saída, então de vez em quando o objeto
    // vem embrulhado em cerca de markdown ou em uma frase de cortesia. O JSON
    // continua lá dentro, entre a primeira chave e a última.
    let start = trimmed.find('{')?;
    let end = trimmed.rfind('}')?;
    title_of_json(trimmed.get(start..=end)?)
}

fn title_of_json(text: &str) -> Option<String> {
    let value: Value = serde_json::from_str(text).ok()?;
    crate::types::session_title_of(&value)
}

// ---------------------------------------------------------------------------
// O engine
// ---------------------------------------------------------------------------

/// Configuração resolvida das opções + env selado.
#[derive(Clone)]
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
    let api_key = env_of(options, "ANTHROPIC_API_KEY").ok_or_else(|| {
        ClaudeSDKError::sdk(
            "native transport requires ANTHROPIC_API_KEY (options.env or process env)",
        )
    })?;
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

/// Prompt base do preset `claude_code`: o CLI monta o seu por dentro; o
/// nativo oferece um preset coerente (tarefa + ambiente) em vez de vazio. A
/// identidade não mora aqui: é o bloco de prefixo que a camada de API põe
/// antes (ver [`system_prefix`]).
fn preset_system_prompt(config: &EngineConfig, model: &str) -> String {
    let today = chrono_free_date();
    format!(
        "You are an interactive agent that helps users with software engineering tasks. \
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
    // O `systemPrompt` do `QueryEngine` (`[custom] ou default, + append`) que
    // o `splitSysPromptPrefix` junta com "\n\n" num bloco só, depois do
    // cabeçalho e do prefixo. Sem `system_prompt` o SDK Python passa
    // `--system-prompt ""`: prompt vazio, que o `filter(Boolean)` descarta, e
    // o `system` fica só com cabeçalho e prefixo.
    let parts: Vec<String> = match &options.system_prompt {
        Some(SystemPromptConfig::String(s)) => vec![s.clone()],
        // Preset `claude_code`: o nativo monta um prompt base coerente
        // (tarefa + ambiente) e concatena o `append`.
        Some(SystemPromptConfig::Structured(SystemPrompt::Preset { append, .. })) => {
            let mut parts = vec![preset_system_prompt(config, model)];
            parts.extend(append.clone().filter(|s| !s.is_empty()));
            parts
        }
        Some(SystemPromptConfig::Structured(SystemPrompt::File { path })) => {
            std::fs::read_to_string(path).ok().into_iter().collect()
        }
        None => Vec::new(),
    };
    let joined = parts
        .into_iter()
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("\n\n");
    if joined.is_empty() {
        Vec::new()
    } else {
        vec![SystemBlock::text(joined)]
    }
}

/// `getAttributionHeader` + `getCLISyspromptPrefix` numa sessão SDK
/// (`isNonInteractive`): o prefixo de identidade depende só de haver
/// `append` (o do preset), e o cabeçalho leva o `CLAUDE_CODE_ENTRYPOINT` que
/// o transporte subprocess daria ao CLI (`sdk-rs`, ou o do `env` das
/// opções), a menos que `CLAUDE_CODE_ATTRIBUTION_HEADER` esteja definido e
/// falso.
fn system_prefix(options: &ClaudeAgentOptions) -> crate::agentic::SystemPrefix {
    let has_append = matches!(
        &options.system_prompt,
        Some(SystemPromptConfig::Structured(SystemPrompt::Preset { append: Some(a), .. })) if !a.is_empty()
    );
    let identity = if has_append {
        crate::agentic::AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX
    } else {
        crate::agentic::AGENT_SDK_PREFIX
    };
    let header_flag = options
        .env
        .get("CLAUDE_CODE_ATTRIBUTION_HEADER")
        .cloned()
        .or_else(|| std::env::var("CLAUDE_CODE_ATTRIBUTION_HEADER").ok());
    let header_off = matches!(
        header_flag
            .map(|v| v.trim().to_ascii_lowercase())
            .as_deref(),
        Some("0" | "false" | "no" | "off")
    );
    crate::agentic::SystemPrefix {
        identity: identity.to_string(),
        attribution_entrypoint: (!header_off).then(|| {
            options
                .env
                .get("CLAUDE_CODE_ENTRYPOINT")
                .cloned()
                .unwrap_or_else(|| "sdk-rs".to_string())
        }),
    }
}

/// O contexto de usuário da sessão: as memórias das fontes pedidas (todas,
/// sem `setting_sources`, que é o CLI sem `--setting-sources`), a partir do
/// cwd da sessão, memoizado como o `getUserContext` do CLI.
fn user_context_cache(
    options: &ClaudeAgentOptions,
    config: &EngineConfig,
) -> Arc<crate::memory::UserContextCache> {
    let memory_config = crate::memory::MemoryConfig::from_env(
        std::path::Path::new(&config.cwd),
        options.setting_sources.as_deref(),
        &options.env,
    );
    Arc::new(crate::memory::UserContextCache::new(
        memory_config,
        options.env.clone(),
    ))
}

/// Os campos do `init` que dependem da sessão e não do loop.
/// `skills` e `slash_commands` do `init`, como o `buildSystemInitMessage`
/// monta (`utils/messages/systemInit.js`): os skills lidos das fontes
/// habilitadas que o usuário pode invocar (`userInvocable !== false`), menos
/// os condicionais, que só entram quando um arquivo casa.
///
/// Divergência deliberada do CLI 2.1.90: o CLI real anuncia também os skills
/// que traz embutidos (`update-config`, `debug`, `simplify`, `batch`, `loop`,
/// `schedule`, `claude-api`) e, em `slash_commands`, os comandos embutidos
/// (`compact`, `context`, `cost`, `heapdump`, `init`, `pr-comments`,
/// `release-notes`, `review`, `security-review`, `insights`). O transporte
/// nativo não tem o conteúdo desses skills (a tool Skill só lê `SKILL.md`
/// do disco e responderia `Unknown skill`) nem processa comando de barra no
/// prompt (um `/compact` iria ao modelo como texto). Anunciar o que não
/// executa faria o consumidor oferecer ao usuário, e o modelo tentar, algo
/// que falha; por isso só entra o que existe de fato.
fn init_skills_and_commands(options: &ClaudeAgentOptions, cwd: &str) -> (Vec<String>, Vec<String>) {
    let mut skills: Vec<String> = Vec::new();
    for skill in crate::tools::skill::load_skills(&skill_directories(options, cwd)) {
        if !skill.conditional && skill.user_invocable && !skills.contains(&skill.name) {
            skills.push(skill.name);
        }
    }
    let commands = skills.clone();
    (skills, commands)
}

fn init_info(
    options: &ClaudeAgentOptions,
    mcp_status: &Value,
    cwd: &str,
) -> crate::agentic::InitInfo {
    let (skills, slash_commands) = init_skills_and_commands(options, cwd);
    let mcp_servers = mcp_status
        .get("mcpServers")
        .and_then(Value::as_array)
        .map(|servers| {
            servers
                .iter()
                .map(|s| json!({"name": s.get("name"), "status": s.get("status")}))
                .collect()
        })
        .unwrap_or_default();
    // Os tipos que a tool de agente do nativo aceita: o general-purpose e os
    // das opções (builtins primeiro, como o `getAgentDefinitions`).
    let wants_agent = match &options.tools {
        Some(ToolsConfig::List(names)) => names.iter().any(|n| n == "Task" || n == "Agent"),
        _ => true,
    };
    let agents = if wants_agent {
        let mut custom: Vec<String> = options
            .agents
            .as_ref()
            .map(|a| {
                a.keys()
                    .filter(|k| *k != "general-purpose")
                    .cloned()
                    .collect()
            })
            .unwrap_or_default();
        custom.sort();
        std::iter::once("general-purpose".to_string())
            .chain(custom)
            .collect()
    } else {
        Vec::new()
    };
    let betas: Vec<String> = options
        .betas
        .iter()
        .filter_map(|b| serde_json::to_value(b).ok())
        .filter_map(|v| v.as_str().map(str::to_string))
        .collect();
    crate::agentic::InitInfo {
        mcp_servers,
        // O nativo exige a chave no ambiente: é o `ANTHROPIC_API_KEY` que o
        // CLI não interativo reporta.
        api_key_source: "ANTHROPIC_API_KEY".to_string(),
        betas: (!betas.is_empty()).then_some(betas),
        agents,
        skills,
        slash_commands,
        ..crate::agentic::InitInfo::default()
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
    // `setting_sources` tem tradução: decide quais memórias (`CLAUDE.md`)
    // entram no contexto de usuário (ver `crate::memory`).
    //
    // `skills`: o nativo não tem skills. `[]` é o "nenhuma skill" do SDK
    // Python (vai no `initialize` e o CLI esvazia a lista), que é exatamente
    // o que o nativo já faz; só `"all"` ou uma lista com nomes pede algo que
    // não existe aqui.
    let wants_skills = match &options.skills {
        None => false,
        Some(Value::Array(names)) => !names.is_empty(),
        Some(_) => true,
    };
    if wants_skills {
        unsupported.push("skills");
    }
    if options.sandbox.is_some() {
        unsupported.push("sandbox");
    }
    // `stdio` é o marcador que o cliente põe quando há `can_use_tool` (o
    // pedido de permissão vai pelo protocolo de controle), e esse caminho o
    // nativo atende; outro nome seria uma tool MCP de permissão.
    if options
        .permission_prompt_tool_name
        .as_deref()
        .is_some_and(|name| name != "stdio")
    {
        unsupported.push("permission_prompt_tool_name");
    }
    if options.task_budget.is_some() {
        unsupported.push("task_budget");
    }
    if options.continue_conversation {
        unsupported.push("continue_conversation (use resume)");
    }
    unsupported
}

/// Os servidores MCP externos que as opções declaram, no formato que o
/// cliente entende. `Path` é o `--mcp-config` do CLI: um JSON com a chave
/// `mcpServers`. Arquivo ilegível vira um status `failed` com o motivo, e não
/// uma sessão que morre por causa de um servidor.
fn declared_mcp_servers(
    options: &ClaudeAgentOptions,
) -> (HashMap<String, crate::types::McpServerConfig>, Vec<Value>) {
    match &options.mcp_servers {
        crate::types::McpServersConfig::Dict(map) => (map.clone(), Vec::new()),
        crate::types::McpServersConfig::Path(path) => {
            let read = std::fs::read_to_string(path)
                .map_err(|e| e.to_string())
                .and_then(|text| serde_json::from_str::<Value>(&text).map_err(|e| e.to_string()))
                .and_then(|json| {
                    let servers = json.get("mcpServers").cloned().unwrap_or(json);
                    serde_json::from_value::<HashMap<String, crate::types::McpServerConfig>>(
                        servers,
                    )
                    .map_err(|e| e.to_string())
                });
            match read {
                Ok(map) => (map, Vec::new()),
                Err(error) => (
                    HashMap::new(),
                    vec![json!({
                        "name": path.display().to_string(),
                        "status": "failed",
                        "scope": "user",
                        "error": format!("mcp config file: {error}"),
                    })],
                ),
            }
        }
    }
}

/// O `mcp_status` ANTES de o engine conectar: cada servidor externo declarado
/// aparece como `pending`, como no CLI, para quem pergunta logo depois do
/// `connect` ver que há servidores a caminho e não uma lista vazia. O engine
/// substitui a lista inteira quando as conexões se resolvem.
fn pending_mcp_status(options: &ClaudeAgentOptions) -> Vec<Value> {
    let (declared, mut status) = declared_mcp_servers(options);
    let mut names: Vec<&String> = declared
        .iter()
        .filter(|(_, config)| !matches!(config, crate::types::McpServerConfig::Sdk { .. }))
        .map(|(name, _)| name)
        .collect();
    names.sort();
    status.extend(
        names
            .into_iter()
            .map(|name| json!({"name": name, "status": "pending", "scope": "user"})),
    );
    status
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

    // Identidade e histórico da sessão (resume/fork), como o
    // `loadInitialMessages` do modo print: a conversa é a cadeia do
    // transcript desserializada (`loadConversationForResume`), e o request
    // a vê pelo `normalizeMessagesForAPI`.
    let mut transcript = TranscriptState::default();
    let (session_id, mut history) = match (&options.resume, options.fork_session) {
        (Some(resume_id), fork) => {
            let loaded = match storage.load_conversation(resume_id).await {
                Ok(Some(conversation)) => conversation,
                Ok(None) => {
                    let _ = shared.outbound.send(json!({
                        "type": "error",
                        "error": format!("No conversation found with session ID: {resume_id}"),
                    }));
                    return;
                }
                Err(e) => {
                    let _ = shared.outbound.send(json!({
                        "type": "error",
                        "error": format!("Failed to resume session: {e}"),
                    }));
                    return;
                }
            };
            // `--fork-session` com `--session-id` usa o id pedido para a
            // sessão nova, como o CLI; sem ele, um uuid novo.
            let sid = if fork {
                options
                    .session_id
                    .clone()
                    .unwrap_or_else(|| uuid::Uuid::new_v4().to_string())
            } else {
                resume_id.clone()
            };
            let history = crate::internal::transcript_load::messages_for_api(&loaded.messages);
            transcript.resume_from(loaded, fork);
            (sid, history)
        }
        // `--session-id`: a sessão nova nasce com o id que o chamador escolheu
        // (quem monta o diretório de trabalho antes da primeira mensagem
        // precisa do id antes do CLI existir).
        (None, _) => (
            options
                .session_id
                .clone()
                .unwrap_or_else(|| uuid::Uuid::new_v4().to_string()),
            Vec::new(),
        ),
    };

    let mut client = AnthropicClient::new(config.api_key.clone());
    if let Some(base_url) = &config.base_url {
        client = client.with_base_url(base_url.clone());
    }
    if let Some(model) = &config.model {
        client = client.with_model(model.clone());
    }
    // O fallback sem streaming lê o env das opções sobreposto ao do processo.
    client =
        client.with_stream_fallback(crate::api::client::StreamFallbackConfig::from_env(|key| {
            env_of(&options, key)
        }));
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

    // A geração de título fica armada aqui, com tudo que ela precisa: a partir
    // deste ponto um `generate_session_title` tem sessão, transcript e cliente.
    {
        let mut title_client = AnthropicClient::new(config.api_key.clone());
        if let Some(base_url) = &config.base_url {
            title_client = title_client.with_base_url(base_url.clone());
        }
        *shared.titling.lock().await = Some(Titling {
            client: title_client,
            model: options
                .title_model
                .clone()
                .unwrap_or_else(|| DEFAULT_TITLE_MODEL.to_string()),
            session_id: session_id.clone(),
            storage: storage.clone(),
            transcript_path: transcript_path.clone(),
            mirror: config.mirror,
        });
    }

    // mcp_status pré-computado: os servidores in-process com as suas tools,
    // mais os externos, conectados UMA vez por sessão (como o CLI memoiza
    // `connectToServer`) e mantidos vivos até a sessão acabar.
    let (declared, mut mcp_report) = declared_mcp_servers(&options);
    let remote = crate::mcp::connect_mcp_servers(&declared).await;
    let remote_tools: Vec<Arc<dyn Tool>> = remote.tools.clone();
    let remote_clients = remote.clients;
    mcp_report.extend(remote.status);
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
        servers.extend(mcp_report);
        // A chave é a do CLI (`mcpServers`): é o que `McpStatusResponse` lê,
        // e com a chave antiga o `get_mcp_status` do cliente não parseava a
        // resposta deste transporte.
        *shared.mcp_status.lock().await = json!({"mcpServers": servers});
    }

    // SessionStart: dispara os hooks registrados (o resultado não bloqueia).
    let hook_base = |extra: Value| {
        let mut base = json!({
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

    // `getUserContext` memoizado pela sessão inteira (o "processo" do CLI):
    // as memórias são lidas na primeira consulta e relidas só depois de uma
    // compactação da conversa principal.
    let user_context = user_context_cache(&options, &config);

    while let Some(frame) = user_rx.recv().await {
        // Token de cancelamento novo por corrida (interrupt cancela SÓ o
        // turno), criado já na chegada do prompt: as esperas pelo cliente
        // (hooks do UserPromptSubmit inclusive) são canceladas por ele, e o
        // interrupt de um turno anterior não pode cancelar as deste.
        *shared.abort.lock().await = CancellationToken::new();
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
        let mut prompt_attachments: Vec<Value> = Vec::new();

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
                .run_hooks(
                    "UserPromptSubmit",
                    hook_base(json!({"prompt": prompt_text})),
                )
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
                // O `processUserInput` do CLI: o contexto vira um anexo
                // `hook_additional_context` (gravado depois do prompt), que
                // chega ao modelo como `<system-reminder>` fundido ao prompt.
                if let Some(ctx) = r
                    .pointer("/hookSpecificOutput/additionalContext")
                    .and_then(Value::as_str)
                {
                    prompt_attachments.push(user_prompt_context_attachment(ctx));
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

        // Persiste o turno do usuário no JSONL (e espelha), como o
        // `recordTranscript` do `submitMessage`: o que o resume trouxe e o
        // arquivo ainda não tem, o prompt (com o conteúdo do jeito que veio
        // e o `uuid` do frame, quando veio) e os anexos dos hooks.
        {
            transcript.prompt_id = Some(uuid::Uuid::new_v4().to_string());
            let raw_content = frame
                .pointer("/message/content")
                .cloned()
                .unwrap_or(Value::Null);
            let prompt = crate::internal::transcript_load::user_message_value(
                raw_content,
                crate::internal::transcript_load::UserMessageFlags {
                    uuid: frame
                        .get("uuid")
                        .and_then(Value::as_str)
                        .map(str::to_string),
                    ..Default::default()
                },
            );
            let mut messages = std::mem::take(&mut transcript.pending_resumed);
            messages.push(prompt);
            messages.extend(prompt_attachments.iter().cloned());
            if let Err(e) = transcript
                .record(
                    &storage,
                    &shared,
                    &config,
                    &session_id,
                    &transcript_path,
                    messages,
                )
                .await
            {
                let _ = shared.outbound.send(json!({
                    "type": "error",
                    "error": format!("failed to persist user turn: {e}"),
                }));
            }
        }
        // Os anexos sobem para antes do prompt (`reorderAttachmentsForAPI`) e
        // o prompt se funde a eles (`mergeUserMessages`), como no request do
        // CLI.
        if !prompt_attachments.is_empty() {
            let mut sequence = prompt_attachments;
            sequence.push(crate::internal::transcript_load::user_message_value(
                serde_json::to_value(&content).unwrap_or_default(),
                Default::default(),
            ));
            content = crate::internal::transcript_load::messages_for_api(&sequence)
                .into_iter()
                .flat_map(|m| m.content)
                .collect();
        }
        history.push(ApiMessage::user(content));

        // O token da corrida, criado na chegada do prompt.
        let abort = shared.abort.lock().await.clone();

        let model = {
            let override_ = shared.model_override.lock().await.clone();
            override_
                .or_else(|| config.model.clone())
                .unwrap_or_else(|| crate::api::client::DEFAULT_MODEL.to_string())
        };

        let tool_results_dir = tool_results_dir_for(&options, &storage.session_path(&session_id));
        // O `submitMessage` do CLI volta o cwd ao original a cada prompt
        // (`setCwd(cwd)`); dentro do turno, o `cd` do Bash vale para todas as
        // tools, para os subagentes e para o `cwd` do transcript.
        let cwd_state: crate::tools::framework::SharedCwd = Arc::new(std::sync::RwLock::new(None));
        transcript.cwd_state = Some(Arc::clone(&cwd_state));
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
                mcp_tools: remote_tools.clone(),
                user_context: Arc::clone(&user_context),
                abort: abort.clone(),
                storage: storage.clone(),
                prompt_id: transcript.prompt_id.clone(),
                cwd_state,
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
            max_turns: options.max_turns.and_then(|n| u32::try_from(n).ok()),
            initial_messages: history.clone(),
            thinking: thinking_param(&options),
            include_stream_events: options.include_partial_messages,
            abort: Some(abort),
            fallback_model: options.fallback_model.clone(),
            session_id: Some(session_id.clone()),
            stop_hook: if has_stop_hooks {
                Some(stop_hook)
            } else {
                None
            },
            pre_compact_hook: Some(pre_compact),
            on_history_rewrite: Some(on_history_rewrite),
            context_window_tokens,
            user_context: Some(Arc::clone(&user_context)),
            clear_user_context_on_compact: true,
            system_prefix: Some(system_prefix(&options)),
            init_info: init_info(&options, &*shared.mcp_status.lock().await, &config.cwd),
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
                    let mut compacted: Option<Vec<ApiMessage>> = None;
                    if let AgenticEvent::System { subtype, .. } = &ev {
                        if subtype == "microcompact" || subtype == "compact_boundary" {
                            if let Ok(mut slot) = shared.rewritten_history.lock() {
                                if let Some(snapshot) = slot.take() {
                                    history = snapshot;
                                    if subtype == "compact_boundary" {
                                        compacted = Some(history.clone());
                                    }
                                }
                            }
                        }
                    }
                    if let AgenticEvent::Result {
                        total_cost_usd: cost,
                        ..
                    } = &ev
                    {
                        session_cost_usd += *cost;
                    }
                    track_history(&mut history, &mut transcript.history_assistant_id, &ev);
                    if let Err(e) = transcript
                        .persist_event(
                            &storage,
                            &shared,
                            &config,
                            &session_id,
                            &transcript_path,
                            &ev,
                            compacted.as_deref(),
                        )
                        .await
                    {
                        let _ = shared.outbound.send(json!({
                            "type": "error",
                            "error": format!("failed to persist transcript: {e}"),
                        }));
                    }
                    match sdk_frames(&ev) {
                        Ok(frames) => {
                            for frame in frames {
                                if shared.outbound.send(frame).is_err() {
                                    return;
                                }
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
        // Blocos de uma resposta cortada no meio (interrupt, erro) vão para o
        // transcript do jeito que saíram, como o CLI os grava.
        if let Err(e) = transcript
            .flush_assistant(&storage, &shared, &config, &session_id, &transcript_path)
            .await
        {
            let _ = shared.outbound.send(json!({
                "type": "error",
                "error": format!("failed to persist transcript: {e}"),
            }));
        }

        // Estimativa de contexto atualizada para o get_context_usage.
        {
            use crate::compact::token_estimation::estimate_message_tokens_with_margin;
            let system_blocks = system_prompt_blocks(&options, &config, &model);
            let system_tokens: usize = system_blocks.iter().map(|b| b.text.len() / 4).sum();
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
    // SessionEnd antes do EOF: o cliente ainda está lendo o stream. Um token
    // novo, para o interrupt do último turno não cancelar a espera do hook.
    *shared.abort.lock().await = CancellationToken::new();
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
    // Os servidores MCP externos morrem com a sessão: DELETE da sessão HTTP,
    // stream SSE fechado, processo stdio encerrado.
    for client in &remote_clients {
        client.close().await;
    }
    // user_tx caiu (end_input/close) e a fila drenou: EOF.
}

/// Os frames stream-json de um evento do loop, como o `normalizeMessage` do
/// `QueryEngine` do CLI os emite.
///
/// Para mensagem de usuário, duas coisas do JS: a mensagem `isMeta` sai com
/// `isSynthetic: true` (o documento que o Read anexa, por exemplo), e a
/// mensagem com mais de um bloco sai partida em um frame por bloco
/// (`normalizeMessages`), com o uuid derivado pelo `deriveUUID`. O histórico e
/// o transcript continuam com a mensagem inteira, como no JS.
///
/// Para mensagem de assistente: o `message` ganha `context_management: null`
/// quando não tem, e uma mensagem com vários blocos (a do fallback não
/// streamado) também sai partida. O fechamento interno da resposta
/// (`AssistantFinal`) não vira frame. A de usuário leva ainda `timestamp` e
/// `tool_use_result`.
fn sdk_frames(event: &AgenticEvent) -> serde_json::Result<Vec<Value>> {
    if let AgenticEvent::AssistantFinal { .. } = event {
        return Ok(Vec::new());
    }
    let frame = serde_json::to_value(event)?;
    if let AgenticEvent::Assistant { message, uuid, .. } = event {
        let mut frame = frame;
        if let Some(inner) = frame.get_mut("message").and_then(Value::as_object_mut) {
            if !inner.contains_key("context_management") {
                inner.insert("context_management".into(), Value::Null);
            }
        }
        let blocks = message
            .get("content")
            .and_then(Value::as_array)
            .cloned()
            .unwrap_or_default();
        if blocks.len() <= 1 {
            return Ok(vec![frame]);
        }
        return Ok(blocks
            .into_iter()
            .enumerate()
            .map(|(index, block)| {
                let mut part = frame.clone();
                part["message"]["content"] = Value::Array(vec![block]);
                part["uuid"] = Value::String(derive_js_uuid(uuid, index));
                part
            })
            .collect());
    }
    let AgenticEvent::User {
        message,
        uuid,
        is_meta,
        timestamp,
        tool_use_result,
        ..
    } = event
    else {
        return Ok(vec![frame]);
    };
    let mut frame = frame;
    if let Some(object) = frame.as_object_mut() {
        object.insert("timestamp".into(), Value::String(timestamp.clone()));
        if *is_meta {
            object.insert("isSynthetic".into(), Value::Bool(true));
        }
        if let Some(result) = tool_use_result {
            object.insert("tool_use_result".into(), result.clone());
        }
    }
    if message.content.len() <= 1 {
        return Ok(vec![frame]);
    }
    let mut frames = Vec::with_capacity(message.content.len());
    for (index, block) in message.content.iter().enumerate() {
        let mut part = frame.clone();
        part["message"]["content"] = serde_json::to_value(vec![block])?;
        part["uuid"] = Value::String(derive_js_uuid(uuid, index));
        frames.push(part);
    }
    Ok(frames)
}

/// O `deriveUUID` do JS: os 24 primeiros caracteres do uuid pai e o índice
/// em 12 dígitos hexadecimais.
fn derive_js_uuid(parent: &str, index: usize) -> String {
    let prefix: String = parent.chars().take(24).collect();
    format!("{prefix}{index:012x}")
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

/// Espelha entradas gravadas num frame `transcript_mirror`.
fn emit_mirror_entries(shared: &Arc<Shared>, transcript_path: &str, entries: Vec<Value>) {
    if entries.is_empty() {
        return;
    }
    let _ = shared.outbound.send(json!({
        "type": "transcript_mirror",
        "filePath": transcript_path,
        "entries": entries,
    }));
}

/// Mantém o histórico entre turnos do usuário a partir dos eventos do loop.
/// Os blocos de uma resposta chegam um a um com o mesmo `message.id` e se
/// juntam numa mensagem só (o `normalizeMessagesForAPI` do CLI faz isso a
/// cada request); o erro de API sintetizado não vai ao modelo.
fn track_history(
    history: &mut Vec<ApiMessage>,
    last_assistant_id: &mut Option<String>,
    event: &AgenticEvent,
) {
    match event {
        AgenticEvent::Assistant {
            message,
            is_api_error,
            ..
        } => {
            let model = message.get("model").and_then(Value::as_str);
            if *is_api_error && model == Some(crate::internal::transcript_load::SYNTHETIC_MODEL) {
                return;
            }
            let blocks: Vec<ContentBlock> = message
                .get("content")
                .and_then(Value::as_array)
                .map(|blocks| {
                    blocks
                        .iter()
                        .filter_map(|b| serde_json::from_value(b.clone()).ok())
                        .collect()
                })
                .unwrap_or_default();
            let id = message
                .get("id")
                .and_then(Value::as_str)
                .map(str::to_string);
            if let Some(last) = history.last_mut() {
                if last.role == Role::Assistant && id.is_some() && *last_assistant_id == id {
                    last.content.extend(blocks);
                    return;
                }
            }
            history.push(ApiMessage {
                role: Role::Assistant,
                content: blocks,
            });
            *last_assistant_id = id;
        }
        AgenticEvent::User { message, .. } => {
            history.push(message.clone());
            *last_assistant_id = None;
        }
        _ => {}
    }
}

/// O anexo `hook_additional_context` que o `processUserInput` do CLI cria
/// para o `additionalContext` de um hook UserPromptSubmit.
fn user_prompt_context_attachment(context: &str) -> Value {
    // `applyTruncation`: acima de 10 mil caracteres o contexto é cortado.
    const MAX_HOOK_OUTPUT_LENGTH: usize = 10_000;
    let content = if context.encode_utf16().count() > MAX_HOOK_OUTPUT_LENGTH {
        let cut: Vec<u16> = context
            .encode_utf16()
            .take(MAX_HOOK_OUTPUT_LENGTH)
            .collect();
        format!(
            "{}\u{2026} [output truncated - exceeded {MAX_HOOK_OUTPUT_LENGTH} characters]",
            String::from_utf16_lossy(&cut)
        )
    } else {
        context.to_string()
    };
    json!({
        "attachment": {
            "type": "hook_additional_context",
            "content": [content],
            "hookName": "UserPromptSubmit",
            "toolUseID": format!("hook-{}", uuid::Uuid::new_v4()),
            "hookEvent": "UserPromptSubmit",
        },
        "type": "attachment",
        "uuid": uuid::Uuid::new_v4().to_string(),
        "timestamp": chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
    })
}

/// O que o `recordTranscript` do CLI acompanha entre gravações.
#[derive(Default)]
struct TranscriptState {
    /// O uuid da última mensagem gravada que participa da cadeia.
    last_uuid: Option<String>,
    /// O `promptId` do prompt em curso (o `getPromptId` do CLI).
    prompt_id: Option<String>,
    /// Mensagens do resume que o arquivo desta sessão ainda não tem (as
    /// sintéticas do resume; no fork, a conversa inteira), gravadas junto
    /// com o primeiro prompt.
    pending_resumed: Vec<Value>,
    /// Blocos de assistente já entregues ao cliente esperando o fechamento
    /// da resposta para irem ao transcript.
    pending_assistant: Vec<Value>,
    /// O `message.id` da última mensagem de assistente do histórico.
    history_assistant_id: Option<String>,
    /// O subagente dono deste transcript: `Some` grava o sidechain dele
    /// (`recordSidechainTranscript`), `None` o transcript da sessão.
    agent_id: Option<String>,
    /// O cwd corrente do turno, gravado em `cwd` como o `getCwd()` que o
    /// `insertMessageChain` lê na hora da escrita.
    cwd_state: Option<crate::tools::framework::SharedCwd>,
}

impl TranscriptState {
    /// O estado depois do `loadConversationForResume`: no resume, as
    /// mensagens que o arquivo já tem ficam, e a cadeia continua da última
    /// delas antes da primeira que falta (o `startingParentUuid` do
    /// `recordTranscript`); no fork o arquivo novo recebe a conversa toda.
    fn resume_from(
        &mut self,
        loaded: crate::internal::transcript_load::LoadedConversation,
        fork: bool,
    ) {
        if fork {
            self.pending_resumed = loaded.messages;
            self.last_uuid = None;
            return;
        }
        let mut seen_new = false;
        for message in loaded.messages {
            let uuid = message.get("uuid").and_then(Value::as_str).unwrap_or("");
            if loaded.recorded.contains(uuid) {
                if !seen_new && message.get("type").and_then(Value::as_str) != Some("progress") {
                    self.last_uuid = Some(uuid.to_string());
                }
            } else {
                seen_new = true;
                self.pending_resumed.push(message);
            }
        }
    }

    /// Grava mensagens internas em cadeia e espelha as entradas.
    async fn record(
        &mut self,
        storage: &SessionStorage,
        shared: &Arc<Shared>,
        config: &EngineConfig,
        session_id: &str,
        transcript_path: &str,
        messages: Vec<Value>,
    ) -> crate::errors::Result<()> {
        if messages.is_empty() {
            return Ok(());
        }
        let cwd = self
            .cwd_state
            .as_ref()
            .and_then(|state| state.read().ok().and_then(|guard| guard.clone()))
            .map(|path| path.to_string_lossy().to_string());
        let (target, mirror_path) = match &self.agent_id {
            None => (
                crate::session::ChainTarget::Main,
                transcript_path.to_string(),
            ),
            Some(agent_id) => (
                crate::session::ChainTarget::Sidechain { agent_id },
                storage
                    .agent_transcript_path(session_id, agent_id)
                    .to_string_lossy()
                    .to_string(),
            ),
        };
        let write = storage
            .append_chain_to(
                target,
                session_id,
                &messages,
                self.last_uuid.as_deref(),
                self.prompt_id.as_deref(),
                cwd.as_deref(),
            )
            .await?;
        self.last_uuid = write.last_uuid;
        // O sidechain vai ao `SessionStore` pelo caminho dele, que o
        // `file_path_to_session_key` traduz no `subpath`
        // `subagents/agent-<id>`.
        if config.mirror {
            emit_mirror_entries(shared, &mirror_path, write.entries);
        }
        Ok(())
    }

    /// Grava os blocos de assistente pendentes.
    async fn flush_assistant(
        &mut self,
        storage: &SessionStorage,
        shared: &Arc<Shared>,
        config: &EngineConfig,
        session_id: &str,
        transcript_path: &str,
    ) -> crate::errors::Result<()> {
        let pending = std::mem::take(&mut self.pending_assistant);
        self.record(
            storage,
            shared,
            config,
            session_id,
            transcript_path,
            pending,
        )
        .await
    }

    /// Persiste o evento do loop como o `QueryEngine` do CLI: os blocos de
    /// assistente esperam o `message_delta` (o `stop_reason` e o `usage`
    /// finais entram no último bloco, que o CLI ainda não tinha gravado),
    /// resultados de tool e mensagens meta vão na hora, e o compact boundary
    /// grava a marca e o histórico compactado.
    #[allow(clippy::too_many_arguments)]
    async fn persist_event(
        &mut self,
        storage: &SessionStorage,
        shared: &Arc<Shared>,
        config: &EngineConfig,
        session_id: &str,
        transcript_path: &str,
        event: &AgenticEvent,
        compacted: Option<&[ApiMessage]>,
    ) -> crate::errors::Result<()> {
        match event {
            AgenticEvent::Assistant { .. } => {
                self.pending_assistant
                    .push(assistant_transcript_message(event));
                Ok(())
            }
            AgenticEvent::AssistantFinal {
                message_id,
                stop_reason,
                usage,
            } => {
                let last = self.pending_assistant.iter_mut().rev().find(|m| {
                    m.pointer("/message/id").and_then(Value::as_str) == Some(message_id.as_str())
                });
                if let Some(inner) = last
                    .and_then(|m| m.get_mut("message"))
                    .and_then(Value::as_object_mut)
                {
                    inner.insert("usage".into(), usage.clone());
                    inner.insert(
                        "stop_reason".into(),
                        stop_reason.clone().map_or(Value::Null, Value::String),
                    );
                }
                self.flush_assistant(storage, shared, config, session_id, transcript_path)
                    .await
            }
            AgenticEvent::User {
                message,
                uuid,
                timestamp,
                tool_use_result,
                source_tool_assistant_uuid,
                is_meta,
                ..
            } => {
                self.flush_assistant(storage, shared, config, session_id, transcript_path)
                    .await?;
                let internal = crate::internal::transcript_load::user_message_value(
                    serde_json::to_value(&message.content).unwrap_or_default(),
                    crate::internal::transcript_load::UserMessageFlags {
                        is_meta: *is_meta,
                        uuid: Some(uuid.clone()),
                        timestamp: Some(timestamp.clone()),
                        tool_use_result: tool_use_result.clone(),
                        source_tool_assistant_uuid: source_tool_assistant_uuid.clone(),
                        ..Default::default()
                    },
                );
                self.record(
                    storage,
                    shared,
                    config,
                    session_id,
                    transcript_path,
                    vec![internal],
                )
                .await
            }
            AgenticEvent::System {
                subtype,
                data,
                uuid,
                ..
            } if subtype == "compact_boundary" => {
                self.flush_assistant(storage, shared, config, session_id, transcript_path)
                    .await?;
                let mut messages = vec![compact_boundary_message(uuid, data)];
                messages.extend(compacted_transcript_messages(compacted.unwrap_or_default()));
                self.record(
                    storage,
                    shared,
                    config,
                    session_id,
                    transcript_path,
                    messages,
                )
                .await
            }
            AgenticEvent::Result { .. } | AgenticEvent::System { .. } => {
                self.flush_assistant(storage, shared, config, session_id, transcript_path)
                    .await
            }
            AgenticEvent::StreamEvent { .. } => Ok(()),
        }
    }
}

/// A mensagem interna de assistente do CLI para um evento do loop: a do
/// `queryModel` (`{message, requestId, type, uuid, timestamp}`), ou a do
/// `createAssistantAPIErrorMessage` para um erro de API sintetizado.
fn assistant_transcript_message(event: &AgenticEvent) -> Value {
    let AgenticEvent::Assistant {
        message,
        uuid,
        timestamp,
        request_id,
        error,
        is_api_error,
        api_error,
        ..
    } = event
    else {
        return Value::Null;
    };
    let mut m = serde_json::Map::new();
    let synthetic = message.get("model").and_then(Value::as_str)
        == Some(crate::internal::transcript_load::SYNTHETIC_MODEL);
    if synthetic {
        m.insert("type".into(), json!("assistant"));
        m.insert("uuid".into(), json!(uuid));
        m.insert("timestamp".into(), json!(timestamp));
        m.insert("message".into(), message.clone());
        if let Some(api_error) = api_error {
            m.insert("apiError".into(), json!(api_error));
        }
        if let Some(error) = error {
            m.insert("error".into(), json!(error));
        }
        m.insert("isApiErrorMessage".into(), json!(is_api_error));
    } else {
        m.insert("message".into(), message.clone());
        if let Some(request_id) = request_id {
            m.insert("requestId".into(), json!(request_id));
        }
        m.insert("type".into(), json!("assistant"));
        m.insert("uuid".into(), json!(uuid));
        m.insert("timestamp".into(), json!(timestamp));
        if *is_api_error {
            if let Some(api_error) = api_error {
                m.insert("apiError".into(), json!(api_error));
            }
            m.insert("isApiErrorMessage".into(), json!(true));
        }
    }
    Value::Object(m)
}

/// O `createCompactBoundaryMessage` do CLI para o evento de boundary.
fn compact_boundary_message(uuid: &str, data: &Value) -> Value {
    let trigger = data
        .pointer("/compact_metadata/trigger")
        .cloned()
        .unwrap_or(Value::Null);
    let mut metadata = serde_json::Map::new();
    metadata.insert("trigger".into(), trigger);
    if let Some(pre_tokens) = data.pointer("/compact_metadata/pre_tokens") {
        metadata.insert("preTokens".into(), pre_tokens.clone());
    }
    json!({
        "type": "system",
        "subtype": "compact_boundary",
        "content": "Conversation compacted",
        "isMeta": false,
        "timestamp": chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
        "uuid": uuid,
        "level": "info",
        "compactMetadata": Value::Object(metadata),
    })
}

/// O histórico que a compactação deixou, como as mensagens que o CLI grava
/// depois do boundary: o resumo (`isCompactSummary`,
/// `isVisibleInTranscriptOnly`) e o que foi reanexado (meta).
fn compacted_transcript_messages(compacted: &[ApiMessage]) -> Vec<Value> {
    use crate::internal::transcript_load::{user_message_value, UserMessageFlags};
    let after_marker = compacted
        .iter()
        .position(|m| {
            m.role == Role::User
                && m.content.len() == 1
                && matches!(&m.content[0], ContentBlock::Text { text, .. } if text == crate::agentic::COMPACT_BOUNDARY_MARKER)
        })
        .map_or(0, |i| i + 1);
    let mut summary_written = false;
    compacted[after_marker..]
        .iter()
        .map(|m| {
            let content = serde_json::to_value(&m.content).unwrap_or_default();
            if m.role == Role::Assistant {
                return json!({
                    "message": {
                        "id": uuid::Uuid::new_v4().to_string(),
                        "type": "message",
                        "role": "assistant",
                        "model": crate::internal::transcript_load::SYNTHETIC_MODEL,
                        "content": content,
                        "stop_reason": null,
                        "stop_sequence": null,
                    },
                    "type": "assistant",
                    "uuid": uuid::Uuid::new_v4().to_string(),
                    "timestamp": chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
                });
            }
            let flags = if summary_written {
                UserMessageFlags {
                    is_meta: true,
                    ..Default::default()
                }
            } else {
                summary_written = true;
                UserMessageFlags {
                    is_compact_summary: true,
                    is_visible_in_transcript_only: true,
                    ..Default::default()
                }
            };
            user_message_value(content, flags)
        })
        .collect()
}

// ---------------------------------------------------------------------------
// Tools: builtins nomeadas + ponte MCP + permissão/hooks via control_request
// ---------------------------------------------------------------------------

/// Registra a builtin de nome `name` (nome do CLI ou alias antigo, como
/// `KillShell`), com as que dependem do modelo da sessão já ajustadas a ele:
/// o Read tira a linha de PDF do prompt para os modelos que não leem PDF
/// (`isPDFSupported` do JS) e o Bash põe o modelo na linha de atribuição.
///
/// Nome repetido (`TaskStop` e `KillShell` na mesma lista) registra uma vez
/// só, porque duas tools homônimas no request são rejeitadas pela API.
/// Nome desconhecido é ignorado de propósito: a lista vem do chamador, e um
/// nome do CLI sem builtin nativa não pode derrubar a sessão inteira.
fn register_builtin(registry: &mut ToolRegistry, name: &str, model: &str) {
    use crate::tools::*;
    let tool: Box<dyn Tool> = match name {
        "Read" => Box::new(file_read::FileReadTool::for_model(Some(model))),
        "Bash" => Box::new(bash::BashTool::with_main_model(model)),
        other => match ToolRegistry::builtin(other) {
            Some(tool) => tool,
            None => return,
        },
    };
    if registry.get(tool.name()).is_none() {
        registry.register(tool);
    }
}

/// As builtins pedidas pelo nome, na ordem da lista.
fn register_named_builtins(registry: &mut ToolRegistry, names: &[String], model: &str) {
    for name in names {
        register_builtin(registry, name, model);
    }
}

/// O conjunto default do CLI (`DEFAULT_TOOL_NAMES`), com as builtins que
/// dependem do modelo ajustadas a ele. O `Agent` fica de fora aqui: quem o
/// registra é o engine, com o cliente da API.
fn register_default_builtins(registry: &mut ToolRegistry, model: &str) {
    for name in crate::tools::framework::DEFAULT_TOOL_NAMES {
        register_builtin(registry, name, model);
    }
}

/// Põe as tools nativas do chamador no registry, SUBSTITUINDO a builtin de
/// mesmo nome em vez de concorrer com ela.
///
/// A substituição é o ponto. Sem ela, duas tools homônimas iriam no mesmo
/// request e qual das duas o modelo chamaria dependeria da ordem de registro,
/// que é um detalhe invisível de quem configura a sessão. Para quem troca a
/// builtin por uma versão confinada, "às vezes vale a antiga" não é uma
/// fronteira.
fn register_native_tools(registry: &mut ToolRegistry, tools: &[Arc<dyn Tool>]) {
    if tools.is_empty() {
        return;
    }
    let replaced: Vec<&str> = tools.iter().map(|tool| tool.name()).collect();
    registry.retain(|name| !replaced.contains(&name));
    for tool in tools {
        registry.register_shared(Arc::clone(tool));
    }
}

/// Onde gravar o resultado grande de uma tool: o que as options pedirem, ou o
/// lugar histórico, ao lado do arquivo de sessão.
///
/// Fica numa função própria porque a regra tem uma consequência que merece
/// teste direto: o default é derivado do transcript, e quem confina o `Read` do
/// modelo precisa poder mover o destino sem mover o transcript junto.
fn tool_results_dir_for(
    options: &ClaudeAgentOptions,
    session_path: &std::path::Path,
) -> std::path::PathBuf {
    options
        .tool_results_dir
        .clone()
        .unwrap_or_else(|| session_path.with_extension("tool-results"))
}

/// Monta o registry de um subagente: as tools do agent def, ou as defaults,
/// com as tools nativas do chamador substituindo as homônimas, e as regras de
/// negação aplicadas por último.
///
/// A negação precisa valer AQUI, e não só no nível de cima. Isto foi medido, e
/// não deduzido: numa sessão que registrava `Task` com `Bash` em
/// `disallowed_tools`, o subagente recebia o conjunto default (que traz `Bash`),
/// o executor dele nascia sem regra nenhuma, e o comando rodou de verdade,
/// escrevendo um arquivo no disco fora de qualquer raiz confinada. **Negação
/// que vale só no primeiro nível não é negação**: basta um `Task` para o modelo
/// recuperar tudo o que a configuração tirou dele.
///
/// Registre também o que a medição disse sobre evidência: naquele mesmo turno o
/// modelo afirmou duas vezes, com segurança, que a ferramenta de shell não
/// existia no ambiente, enquanto ela existia e já tinha rodado. **Testemunho do
/// modelo sobre as próprias ferramentas não é evidência**, e a conferência que
/// fecha este buraco é o registry, não a resposta dele.
fn subagent_registry(
    tools: Option<&Vec<String>>,
    native_tools: &[Arc<dyn Tool>],
    permission_rules: &crate::tools::permission::PermissionRules,
    model: &str,
) -> ToolRegistry {
    let mut registry = ToolRegistry::new();
    match tools {
        Some(names) => register_named_builtins(&mut registry, names, model),
        None => register_default_builtins(&mut registry, model),
    }
    // O subagente roda no MESMO processo, então a fronteira do pai vale aqui
    // também: sem isto, delegar uma tarefa devolveria as builtins sem
    // confinamento que o pai tinha justamente trocado.
    register_native_tools(&mut registry, native_tools);
    registry.retain(|name| !permission_rules.is_tool_fully_denied(name));
    registry
}

/// Monta o executor do subagente: o registry já filtrado, o contexto herdado do
/// pai e as MESMAS regras de permissão.
///
/// Está fora do `execute` para poder ser conferido por teste sem um turno de
/// verdade, e isso não é arrumação: a herança das regras tem DOIS efeitos, e só
/// um deles aparece no registry. Negar `Bash` inteiro tira a ferramenta da
/// lista, e ali a conferência é visível; negar `Read(/etc/*)` não tira nada da
/// lista, porque a ferramenta segue legítima no resto da árvore, e quem aplica
/// a regra é a checagem POR CHAMADA, que mora aqui. Sem estas regras, o
/// executor do subagente nasceria com `PermissionRules::default()`, que não
/// nega nada, e a metade fina da fronteira sumiria um nível abaixo sem quebrar
/// teste nenhum.
///
/// O resto do contexto segue o `runAgent` do JS para um subagente síncrono:
/// `mainLoopModel` é o modelo resolvido do subagente, o `agentId` é novo, o
/// `abortController` é o MESMO do pai (interromper o turno interrompe o
/// subagente, e um deny com `interrupt` dentro dele interrompe o pai), o
/// `readFileState` nasce vazio, e a chamada de modelo, o modelo pequeno e as
/// skills são os da sessão.
#[allow(clippy::too_many_arguments)]
fn subagent_executor(
    registry: ToolRegistry,
    parent: &ToolContext,
    cwd: &str,
    tool_results_dir: &std::path::Path,
    task_store: &Arc<crate::tools::task_store::TaskStore>,
    permission_rules: &crate::tools::permission::PermissionRules,
    model: &str,
    agent_id: String,
) -> ToolExecutor {
    let context = ToolContext {
        working_directory: std::path::PathBuf::from(cwd),
        permission_mode: parent.mode(),
        permission_mode_shared: parent.permission_mode_shared.clone(),
        permission_callback: parent.permission_callback.clone(),
        pre_tool_use: parent.pre_tool_use.clone(),
        post_tool_use: None,
        tool_results_dir: Some(tool_results_dir.to_path_buf()),
        additional_directories: parent.additional_directories.clone(),
        extra_env: parent.extra_env.clone(),
        // O subagente herda o MESMO corte do pai: ele roda as mesmas tools, no
        // mesmo processo, e um corte que valesse só no nível de cima deixaria a
        // credencial ao alcance de quem delegasse a tarefa.
        denied_env_prefixes: parent.denied_env_prefixes.clone(),
        task_store: Some(Arc::clone(task_store)),
        todo_store: None,
        model_call: parent.model_call.clone(),
        main_model: Some(model.to_string()),
        small_fast_model: parent.small_fast_model.clone(),
        agent_id: Some(agent_id),
        skill_directories: parent.skill_directories.clone(),
        abort: parent.abort.clone(),
        non_interactive: parent.non_interactive,
        // O cwd é o MESMO da thread principal (o `getCwd()` do JS é global):
        // o subagente resolve caminhos relativos pelo `cd` que o pai fez, e o
        // Bash dele não muda o cwd (`preventCwdChanges`).
        cwd_state: Arc::clone(&parent.cwd_state),
        ..ToolContext::default()
    };
    ToolExecutor::new(registry, context).with_permission_rules(permission_rules.clone())
}

/// O `createAgentId` do JS: `a` seguido de 16 dígitos hexadecimais.
fn create_agent_id() -> String {
    let bytes: [u8; 8] = rand::random();
    let hex: String = bytes.iter().map(|b| format!("{b:02x}")).collect();
    format!("a{hex}")
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
    /// As tools dos servidores MCP externos, já conectados na abertura da
    /// sessão. Entram pelo mesmo caminho das nativas, inclusive nos
    /// subagentes: no CLI o pool de tools é um só.
    mcp_tools: Vec<Arc<dyn Tool>>,
    /// O contexto de usuário da sessão, que o subagente também recebe (o
    /// `runAgent` do CLI chama o mesmo `getUserContext` memoizado).
    user_context: Arc<crate::memory::UserContextCache>,
    /// O cancelamento do turno (o `abortController` do JS): o mesmo token do
    /// loop, para que as tools abortem no interrupt e para que um deny com
    /// `interrupt: true` encerre o turno.
    abort: CancellationToken,
    /// O armazenamento da sessão, onde o subagente grava o sidechain.
    storage: crate::session::SessionStorage,
    /// O `promptId` do prompt em curso, que as entradas de usuário do
    /// sidechain também levam (o `getPromptId` do CLI é global).
    prompt_id: Option<String>,
    /// O cwd corrente do turno, compartilhado por todas as tools e pelo
    /// transcript (o `setCwd` do `submitMessage` o zera a cada prompt).
    cwd_state: crate::tools::framework::SharedCwd,
}

/// O que o subagente precisa para gravar o próprio transcript (o sidechain)
/// e espelhá-lo no `SessionStore`, como o `runAgent` do CLI.
#[derive(Clone)]
struct SidechainRecording {
    storage: crate::session::SessionStorage,
    shared: Arc<Shared>,
    config: EngineConfig,
    session_id: String,
    transcript_path: String,
    prompt_id: Option<String>,
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
        mcp_tools,
        user_context,
        abort,
        storage,
        prompt_id,
        cwd_state,
    } = setup;
    let sidechain = SidechainRecording {
        storage,
        shared: Arc::clone(shared),
        config: config.clone(),
        session_id: session_id.clone(),
        transcript_path: transcript_path.clone(),
        prompt_id,
    };
    let session_id = session_id.as_str();
    let transcript_path = transcript_path.as_str();
    let permission_rules = crate::tools::permission::PermissionRules::from_lists(
        &options.allowed_tools,
        &options.disallowed_tools,
    );
    // O pool que os subagentes herdam: as nativas do chamador e as dos
    // servidores MCP externos, porque uma fronteira que valesse só no nível
    // de cima cairia com um `Task`, e uma tool que só o pai enxerga não é o
    // que o CLI faz.
    let inherited: Vec<Arc<dyn Tool>> = options
        .native_tools
        .iter()
        .cloned()
        .chain(mcp_tools.iter().cloned())
        .collect();

    let mut registry = ToolRegistry::new();
    match &options.tools {
        Some(ToolsConfig::List(names)) => register_named_builtins(&mut registry, names, &model),
        // Preset/ausente: o conjunto default de builtins.
        Some(ToolsConfig::Preset(_)) | None => register_default_builtins(&mut registry, &model),
    }
    // Subagente in-process: registrado só como `Agent`, o nome do CLI.
    // `Task` é alias antigo (`LEGACY_AGENT_TOOL_NAME`): vale na lista de
    // tools pedidas, mas não vira uma segunda tool no request. Só quando as
    // tools não vieram por lista explícita sem ele.
    let wants_agent = match &options.tools {
        Some(ToolsConfig::List(names)) => names.iter().any(|n| n == "Task" || n == "Agent"),
        _ => true,
    };
    if wants_agent {
        registry.register(Box::new(NativeAgentTool {
            client: client.clone(),
            model: model.clone(),
            agents: options.agents.clone().unwrap_or_default(),
            cwd: config.cwd.clone(),
            tool_results_dir: tool_results_dir.clone(),
            task_store: Arc::clone(&task_store),
            native_tools: inherited.clone(),
            permission_rules: permission_rules.clone(),
            tool_name: "Agent",
            user_context: Arc::clone(&user_context),
            system_prefix: system_prefix(options),
            sidechain: Some(sidechain),
        }));
    }

    // As tools do chamador entram ANTES das deny rules, e não depois: uma
    // regra de negação vale para o nome, e trocar quem atende o nome não pode
    // tirar o nome do alcance da regra.
    register_native_tools(&mut registry, &inherited);

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
                    read_only: tool
                        .pointer("/annotations/readOnlyHint")
                        .and_then(Value::as_bool)
                        .unwrap_or(false),
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
    let permission_abort = abort.clone();
    let permission_callback: crate::tools::framework::PermissionCallbackFn =
        Arc::new(move |request| {
            let shared = Arc::clone(&permission_shared);
            let abort = permission_abort.clone();
            Box::pin(async move {
                // Sem teto, como o `createCanUseTool` do CLI: só o interrupt
                // do turno (ou o cliente sumindo) encerra a espera, e isso
                // vira recusa com o texto do CLI.
                let response = shared
                    .control_roundtrip(can_use_tool_request(&request), None)
                    .await;
                match response {
                    Ok(payload) => {
                        let outcome = permission_outcome(&payload);
                        // O deny com `interrupt` aborta o turno NA HORA, como o
                        // `abortController.abort()` do JS: as tools que rodam
                        // em paralelo param e as que não começaram nem começam.
                        if matches!(outcome, PermissionOutcome::DenyAndInterrupt { .. }) {
                            abort.cancel();
                        }
                        outcome
                    }
                    Err(failure) => PermissionOutcome::Deny {
                        message: format!("Tool permission request failed: {}", failure.js_error()),
                    },
                }
            })
        });

    // O que as tools recebem do motor, como o `toolUseContext` do JS: a
    // chamada de modelo da sessão (o resumo do WebFetch e a busca do
    // WebSearch saem pelo mesmo cliente, mesma chave e mesma base URL), o
    // `mainLoopModel`, o modelo pequeno, as skills das fontes habilitadas e o
    // cancelamento do turno.
    let model_call = session_model_call(client.clone());

    // PostToolUse: dispara cada callback id registrado no initialize e junta
    // os additionalContext — o texto volta dentro do tool_result.
    let hook_shared = Arc::clone(shared);
    let hook_session = session_id.to_string();
    let hook_transcript = transcript_path.to_string();
    let hook_cwd = config.cwd.clone();
    let post_tool_use: crate::tools::framework::PostToolUseFn =
        Arc::new(move |event: PostToolUseEvent| {
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
        extra_env: tool_env(&options.env, &options.tool_env_denylist),
        denied_env_prefixes: options.tool_env_denylist.clone(),
        task_store: Some(task_store),
        todo_store: Some(todo_store),
        model_call: Some(model_call),
        main_model: Some(model),
        small_fast_model: small_fast_model(&options.env),
        agent_id: None,
        skill_directories: skill_directories(options, &config.cwd),
        abort: Some(abort),
        cwd_state,
        ..ToolContext::default()
    };
    ToolExecutor::new(registry, context).with_permission_rules(permission_rules)
}

/// A chamada de modelo que as tools fazem pelo cliente da sessão, no modo que
/// o pedido escolhe: `stream: true` é o `queryModelWithStreaming` do JS (a
/// busca do WebSearch), e a resposta sai montada do `message_stop`;
/// `stream: false` é o `queryModelWithoutStreaming` (o resumo do WebFetch no
/// `queryHaiku`).
fn session_model_call(client: AnthropicClient) -> crate::tools::framework::ModelCallFn {
    Arc::new(move |request| {
        let client = client.clone();
        Box::pin(async move {
            if !request.stream {
                return client
                    .create_message(request)
                    .await
                    .map_err(|e| e.to_string());
            }
            use futures::StreamExt as _;
            let mut stream = client
                .create_message_stream(request)
                .await
                .map_err(|e| e.to_string())?;
            let mut complete = None;
            while let Some(update) = stream.next().await {
                // Depois de um `NonStreamingFallback` vem o `MessageComplete`
                // da chamada repetida; vale o último.
                if let crate::api::streaming::StreamUpdate::MessageComplete { message } =
                    update.map_err(|e| e.to_string())?
                {
                    complete = Some(message);
                }
            }
            let message = complete.ok_or_else(|| "Stream ended without a message".to_string())?;
            let stop_reason = serde_json::to_value(&message.stop_reason)
                .ok()
                .and_then(|v| v.as_str().map(str::to_string));
            Ok(crate::api::types::ApiResponse {
                id: message.id,
                r#type: "message".to_string(),
                role: Role::Assistant,
                content: message.content,
                model: message.model,
                stop_reason,
                stop_sequence: None,
                usage: message.usage,
            })
        })
    })
}

/// O corpo do `can_use_tool` com os campos que o `createCanUseTool` do CLI
/// manda. Os opcionais só entram quando existem: o JS serializa com
/// `JSON.stringify`, que descarta `undefined`, e o `agent_id` falta na thread
/// principal.
fn can_use_tool_request(request: &crate::tools::framework::ToolPermissionRequest) -> Value {
    let mut body = serde_json::Map::new();
    body.insert("subtype".into(), json!("can_use_tool"));
    body.insert("tool_name".into(), json!(request.tool_name));
    body.insert("input".into(), request.input.clone());
    if let Some(suggestions) = &request.permission_suggestions {
        body.insert("permission_suggestions".into(), suggestions.clone());
    }
    if let Some(path) = &request.blocked_path {
        body.insert("blocked_path".into(), json!(path));
    }
    if let Some(reason) = &request.decision_reason {
        body.insert("decision_reason".into(), json!(reason));
    }
    if let Some(id) = &request.tool_use_id {
        body.insert("tool_use_id".into(), json!(id));
    }
    if let Some(agent) = &request.agent_id {
        body.insert("agent_id".into(), json!(agent));
    }
    Value::Object(body)
}

/// A resposta do cliente ao `can_use_tool` como decisão
/// (`permissionPromptToolResultToPermissionDecision`). Um deny com
/// `interrupt: true` também aborta o turno no JS
/// (`toolUseContext.abortController.abort()`), o que aqui é o
/// `DenyAndInterrupt`: o executor marca a execução e o loop encerra o turno.
fn permission_outcome(payload: &Value) -> PermissionOutcome {
    match payload.get("behavior").and_then(Value::as_str) {
        Some("allow") => PermissionOutcome::Allow {
            updated_input: payload.get("updatedInput").cloned(),
        },
        Some("deny") => {
            let message = payload
                .get("message")
                .and_then(Value::as_str)
                .unwrap_or("Permission denied")
                .to_string();
            if payload.get("interrupt").and_then(Value::as_bool) == Some(true) {
                PermissionOutcome::DenyAndInterrupt { message }
            } else {
                PermissionOutcome::Deny { message }
            }
        }
        _ => PermissionOutcome::Deny {
            message: payload
                .get("error")
                .and_then(Value::as_str)
                .unwrap_or("permission decision unavailable")
                .to_string(),
        },
    }
}

/// O modelo pequeno configurado no env da sessão (`ANTHROPIC_SMALL_FAST_MODEL`,
/// depois `ANTHROPIC_DEFAULT_HAIKU_MODEL`, a precedência do
/// `getSmallFastModel`). Lido do `options.env` inteiro, e não do env das
/// tools: o corte do `tool_env_denylist` protege os processos que as tools
/// spawnam, não a configuração do motor. Sem nada no env das options, o
/// `ToolContext` cai no env do processo e no haiku default.
fn small_fast_model(env: &HashMap<String, String>) -> Option<String> {
    [
        "ANTHROPIC_SMALL_FAST_MODEL",
        "ANTHROPIC_DEFAULT_HAIKU_MODEL",
    ]
    .iter()
    .find_map(|key| env.get(*key).filter(|v| !v.is_empty()).cloned())
}

/// Os diretórios de skills das fontes de settings habilitadas: sem
/// `setting_sources`, todas (o CLI sem `--setting-sources`, a mesma regra das
/// memórias); com a lista, só as pedidas (`isSettingSourceEnabled`).
fn skill_directories(options: &ClaudeAgentOptions, cwd: &str) -> Vec<std::path::PathBuf> {
    use crate::types::SettingSource;
    let sources: Vec<String> = match &options.setting_sources {
        None => vec!["user".to_string(), "project".to_string()],
        Some(list) => list
            .iter()
            .map(|source| {
                match source {
                    SettingSource::User => "user",
                    SettingSource::Project => "project",
                    SettingSource::Local => "local",
                }
                .to_string()
            })
            .collect(),
    };
    crate::tools::skill::skill_directories_for_sources(std::path::Path::new(cwd), &sources)
}

/// O env que as tools que rodam processo enxergam.
///
/// O `options.env` carrega duas coisas: o que configura o MOTOR (a chave e a
/// base URL da API) e o que prepara o ambiente dos processos que as tools
/// spawnam. Elas coincidem no uso simples, e divergem quando o motor roda num
/// sandbox multi-inquilino: ali a credencial da sessão não pode aparecer num
/// `env` digitado pelo modelo no shell. `tool_env_denylist` é o corte, e vazio
/// (o default) preserva o comportamento histórico de repassar tudo.
fn tool_env(env: &HashMap<String, String>, denylist: &[String]) -> HashMap<String, String> {
    if denylist.is_empty() {
        return env.clone();
    }
    env.iter()
        .filter(|(key, _)| {
            !denylist
                .iter()
                .any(|prefix| key.starts_with(prefix.as_str()))
        })
        .map(|(key, value)| (key.clone(), value.clone()))
        .collect()
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
    /// As tools nativas da sessão, herdadas para que delegar uma tarefa não
    /// devolva ao subagente as builtins que o pai tinha substituído.
    native_tools: Vec<Arc<dyn Tool>>,
    /// As regras de permissão do pai, herdadas pelo mesmo motivo: uma negação
    /// que parasse no primeiro nível seria contornável com um `Task`.
    permission_rules: crate::tools::permission::PermissionRules,
    tool_name: &'static str,
    /// O contexto de usuário da sessão: o subagente o recebe na frente das
    /// mensagens, mas a compactação dele não limpa o cache (no CLI, só a
    /// conversa principal faz `runPostCompactCleanup`).
    user_context: Arc<crate::memory::UserContextCache>,
    /// Cabeçalho e prefixo do `system`, que a camada de API do CLI põe em
    /// toda chamada, inclusive nas do subagente.
    system_prefix: crate::agentic::SystemPrefix,
    /// Onde gravar o sidechain de cada subagente; `None` não grava.
    sidechain: Option<SidechainRecording>,
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
        let model = input
            .get("model")
            .and_then(Value::as_str)
            .map(str::to_string)
            .or_else(|| definition.and_then(|d| d.model.clone()))
            .unwrap_or_else(|| self.model.clone());

        let registry = subagent_registry(
            definition.and_then(|d| d.tools.as_ref()),
            &self.native_tools,
            &self.permission_rules,
            &model,
        );

        let agent_id = create_agent_id();
        let executor = subagent_executor(
            registry,
            context,
            &self.cwd,
            &self.tool_results_dir,
            &self.task_store,
            &self.permission_rules,
            &model,
            agent_id.clone(),
        );

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
            user_context: Some(Arc::clone(&self.user_context)),
            system_prefix: Some(self.system_prefix.clone()),
            // O subagente síncrono usa o `abortController` do pai (`runAgent`).
            abort: context.abort.clone(),
            ..crate::agentic::AgenticLoopOptions::default()
        };

        // O sidechain do subagente, como o `runAgent` do CLI: a mensagem
        // inicial (o prompt) e o `agent-<id>.meta.json` antes do loop, e cada
        // mensagem do loop à medida que sai, no
        // `<sessão>/subagents/agent-<id>.jsonl`, espelhado no `SessionStore`.
        let mut recorder = self.sidechain.as_ref().map(|sink| {
            (
                sink,
                TranscriptState {
                    prompt_id: sink.prompt_id.clone(),
                    agent_id: Some(agent_id.clone()),
                    cwd_state: Some(Arc::clone(&context.cwd_state)),
                    ..TranscriptState::default()
                },
            )
        });
        if let Some((sink, state)) = recorder.as_mut() {
            let initial = crate::internal::transcript_load::user_message_value(
                Value::String(prompt.clone()),
                crate::internal::transcript_load::UserMessageFlags::default(),
            );
            let mut metadata = serde_json::Map::new();
            metadata.insert("agentType".into(), json!(subagent_type));
            if let Some(description) = input
                .get("description")
                .and_then(Value::as_str)
                .filter(|d| !d.is_empty())
            {
                metadata.insert("description".into(), json!(description));
            }
            let _ = state
                .record(
                    &sink.storage,
                    &sink.shared,
                    &sink.config,
                    &sink.session_id,
                    &sink.transcript_path,
                    vec![initial],
                )
                .await;
            let _ = sink
                .storage
                .write_agent_metadata(&sink.session_id, &agent_id, &Value::Object(metadata))
                .await;
        }

        let events: crate::errors::Result<Vec<AgenticEvent>> = async {
            use futures::StreamExt as _;
            let stream =
                crate::agentic::agentic_query(self.client.clone(), &prompt, executor, loop_options);
            tokio::pin!(stream);
            let mut events = Vec::new();
            while let Some(result) = stream.next().await {
                let event = result?;
                if let Some((sink, state)) = recorder.as_mut() {
                    let _ = state
                        .persist_event(
                            &sink.storage,
                            &sink.shared,
                            &sink.config,
                            &sink.session_id,
                            &sink.transcript_path,
                            &event,
                            None,
                        )
                        .await;
                }
                events.push(event);
            }
            Ok(events)
        }
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
    /// O `readOnlyHint` das anotações da tool.
    read_only: bool,
}

#[async_trait::async_trait]
impl Tool for McpBridgeTool {
    fn name(&self) -> &str {
        &self.full_name
    }

    /// `isConcurrencySafe` do MCPTool: o `readOnlyHint` da anotação.
    fn is_concurrency_safe(&self, _input: &Value) -> bool {
        self.read_only
    }

    fn is_read_only(&self) -> bool {
        self.read_only
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

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use std::sync::Arc;

    use super::{register_named_builtins, register_native_tools, tool_env, tool_results_dir_for};
    use crate::tools::framework::{Tool, ToolContext, ToolRegistry, ToolResult};
    use crate::tools::permission::{PermissionDecision, PermissionRules};
    use crate::types::ClaudeAgentOptions;
    use serde_json::json;

    fn env() -> HashMap<String, String> {
        [
            ("ANTHROPIC_API_KEY", "segredo"),
            ("ANTHROPIC_BASE_URL", "https://exemplo"),
            ("PATH", "/usr/bin"),
            ("HOME", "/home/agent"),
        ]
        .into_iter()
        .map(|(k, v)| (k.to_string(), v.to_string()))
        .collect()
    }

    /// O default não pode mudar o que já está em produção.
    #[test]
    fn denylist_vazia_repassa_o_env_inteiro() {
        let out = tool_env(&env(), &[]);
        assert_eq!(out.len(), 4);
        assert_eq!(
            out.get("ANTHROPIC_API_KEY").map(String::as_str),
            Some("segredo")
        );
    }

    #[test]
    fn prefixo_corta_a_familia_inteira() {
        let deny = vec!["ANTHROPIC_".to_string()];
        let out = tool_env(&env(), &deny);
        assert_eq!(out.len(), 2);
        assert!(!out.contains_key("ANTHROPIC_API_KEY"));
        assert!(!out.contains_key("ANTHROPIC_BASE_URL"));
        assert_eq!(out.get("PATH").map(String::as_str), Some("/usr/bin"));
        assert_eq!(out.get("HOME").map(String::as_str), Some("/home/agent"));
    }

    /// Sensível a maiúsculas: nome de variável de ambiente é, e um casamento
    /// frouxo aqui cortaria em silêncio o que o chamador não pediu.
    #[test]
    fn comparacao_e_sensivel_a_maiusculas() {
        let out = tool_env(&env(), &["anthropic_".to_string()]);
        assert_eq!(out.len(), 4);
    }

    #[test]
    fn varios_prefixos_somam() {
        let deny = vec!["ANTHROPIC_".to_string(), "HOME".to_string()];
        let out = tool_env(&env(), &deny);
        assert_eq!(out.len(), 1);
        assert!(out.contains_key("PATH"));
    }

    /// Uma tool nativa com o nome de uma builtin SUBSTITUI a builtin, em vez
    /// de concorrer com ela.
    ///
    /// Este teste existe por causa de quem embute o motor num processo
    /// multi-inquilino e troca `Read` por uma versão confinada ao diretório da
    /// sessão. Se as duas ficassem registradas, qual delas atenderia dependeria
    /// da ordem de registro, e a builtin sem fronteira poderia ganhar: seria um
    /// confinamento que às vezes vale, ou seja, nenhum.
    #[test]
    fn tool_nativa_substitui_a_builtin_homonima() {
        struct Confinada;

        #[async_trait::async_trait]
        impl Tool for Confinada {
            fn name(&self) -> &str {
                "Read"
            }
            fn description(&self) -> &str {
                "Read confinado ao workspace da sessao"
            }
            fn input_schema(&self) -> serde_json::Value {
                serde_json::json!({"type": "object"})
            }
            async fn execute(&self, _input: serde_json::Value, _ctx: &ToolContext) -> ToolResult {
                ToolResult::text("confinado")
            }
        }

        let mut registry = ToolRegistry::new();
        registry.register_defaults();
        let antes = registry.len();
        assert!(registry.names().contains(&"Read"));

        let nativas: Vec<Arc<dyn Tool>> = vec![Arc::new(Confinada)];
        register_native_tools(&mut registry, &nativas);

        // Uma entrou, uma saiu: o total não muda, e sobra um "Read" só.
        assert_eq!(registry.len(), antes);
        let leitores = registry.names().iter().filter(|n| **n == "Read").count();
        assert_eq!(leitores, 1, "ficaram duas tools chamadas Read");

        // E quem atende pelo nome é a do chamador.
        let escolhida = registry.get("Read");
        assert!(escolhida.is_some());
        assert_eq!(
            escolhida.map(Tool::description),
            Some("Read confinado ao workspace da sessao")
        );

        // As outras builtins seguem onde estavam.
        assert!(registry.names().contains(&"Bash"));
        assert!(registry.names().contains(&"Glob"));
    }

    /// Lista vazia de tools nativas não mexe em nada: é o comportamento de
    /// quem não usa a novidade, e ele não pode mudar.
    #[test]
    fn sem_tool_nativa_o_registry_fica_intacto() {
        let mut registry = ToolRegistry::new();
        registry.register_defaults();
        let antes = registry.names().join(",");

        register_native_tools(&mut registry, &[]);

        assert_eq!(registry.names().join(","), antes);
    }

    /// Com as builtins DESLIGADAS por lista vazia, o conjunto da sessão é
    /// exatamente o que o chamador registrou.
    #[test]
    fn builtins_desligadas_deixam_so_as_do_chamador() {
        struct Propria;

        #[async_trait::async_trait]
        impl Tool for Propria {
            fn name(&self) -> &str {
                "Glob"
            }
            fn description(&self) -> &str {
                "Glob confinado"
            }
            fn input_schema(&self) -> serde_json::Value {
                serde_json::json!({"type": "object"})
            }
            async fn execute(&self, _input: serde_json::Value, _ctx: &ToolContext) -> ToolResult {
                ToolResult::text("confinado")
            }
        }

        let mut registry = ToolRegistry::new();
        // O caminho que `build_executor` toma com `ToolsConfig::List(vec![])`.
        register_named_builtins(&mut registry, &[], "claude-sonnet-4-6");
        assert_eq!(registry.len(), 0, "a lista vazia trouxe builtin");

        let nativas: Vec<Arc<dyn Tool>> = vec![Arc::new(Propria)];
        register_native_tools(&mut registry, &nativas);

        assert_eq!(registry.names(), vec!["Glob"]);
    }

    /// Sem o campo, o destino do resultado grande continua sendo derivado do
    /// arquivo de sessão. É o comportamento de quem não usa a novidade, e ele
    /// não pode mudar.
    #[test]
    fn sem_tool_results_dir_o_destino_sai_do_arquivo_de_sessao() {
        let options = ClaudeAgentOptions::default();
        let sessao = std::path::Path::new("/home/agent/.claude/projects/x/abc-123.jsonl");

        assert_eq!(
            tool_results_dir_for(&options, sessao),
            std::path::PathBuf::from("/home/agent/.claude/projects/x/abc-123.tool-results"),
        );
    }

    /// Com o campo, o destino é o do chamador, e o arquivo de sessão deixa de
    /// decidir.
    ///
    /// É esta separação que quem confina o `Read` do modelo precisa: o
    /// transcript fica de propósito FORA da raiz confinada, e o ponteiro que o
    /// resultado grande deixa no lugar do texto só resolve se apontar para
    /// DENTRO dela.
    #[test]
    fn tool_results_dir_das_options_manda_no_destino() {
        let escolhido = std::path::PathBuf::from("/var/lib/claudia/sessions/abc/work/.claudia/out");
        let options = ClaudeAgentOptions::default().with_tool_results_dir(escolhido.clone());
        let sessao = std::path::Path::new("/var/lib/claudia/sessions/abc/engine/abc-123.jsonl");

        assert_eq!(tool_results_dir_for(&options, sessao), escolhido);
    }

    /// A cópia sem callbacks leva o destino junto: quem monta transporte
    /// próprio constrói as options uma vez só, e perder o campo na cópia
    /// devolveria o ponteiro para fora da raiz sem ninguém notar.
    #[test]
    fn a_copia_sem_callbacks_preserva_o_tool_results_dir() {
        let escolhido = std::path::PathBuf::from("/var/lib/claudia/sessions/abc/work/.claudia/out");
        let options = ClaudeAgentOptions::default().with_tool_results_dir(escolhido.clone());

        assert_eq!(
            options.clone_without_callbacks().tool_results_dir,
            Some(escolhido)
        );
    }

    /// Uma tool negada NÃO volta pela porta do subagente.
    ///
    /// Este teste existe por causa de uma medição, e não de uma leitura: numa
    /// sessão que registrava `Task` com `Bash` em `disallowed_tools`, o
    /// subagente recebia o conjunto default, o `Bash` dele rodava de verdade e
    /// escrevia um arquivo no disco fora de qualquer raiz confinada. Negação
    /// que vale só no primeiro nível não é negação.
    #[test]
    fn uma_tool_negada_nao_volta_pelo_subagente() {
        let rules = crate::tools::permission::PermissionRules::from_lists(
            &[],
            &["Bash".to_string(), "WebFetch".to_string()],
        );

        // `None` é o caminho do subagente sem agent definition, que é o default
        // e o que traz o conjunto inteiro de builtins.
        let registry = super::subagent_registry(None, &[], &rules, "claude-sonnet-4-6");

        assert!(
            !registry.names().contains(&"Bash"),
            "o Bash do subagente sobreviveu à negação"
        );
        assert!(!registry.names().contains(&"WebFetch"));
        // E o que não foi negado continua lá: a negação é cirúrgica, não é um
        // desligamento geral.
        assert!(registry.names().contains(&"Read"));
        assert!(registry.names().contains(&"Glob"));
    }

    /// A negação alcança também o subagente que veio com lista própria de
    /// tools no agent definition.
    #[test]
    fn a_negacao_alcanca_o_subagente_com_lista_propria() {
        let rules =
            crate::tools::permission::PermissionRules::from_lists(&[], &["Bash".to_string()]);
        let pedidas = vec!["Bash".to_string(), "Read".to_string()];

        let registry = super::subagent_registry(Some(&pedidas), &[], &rules, "claude-sonnet-4-6");

        assert_eq!(registry.names(), vec!["Read"]);
    }

    /// Sem negação nenhuma, o subagente continua com o conjunto de sempre: o
    /// conserto não pode tirar ferramenta de quem não pediu para tirar.
    #[test]
    fn sem_negacao_o_subagente_mantem_o_conjunto_default() {
        let rules = crate::tools::permission::PermissionRules::default();

        let registry = super::subagent_registry(None, &[], &rules, "claude-sonnet-4-6");

        assert!(registry.names().contains(&"Bash"));
        assert!(registry.names().contains(&"WebFetch"));
    }

    /// A tool nativa do chamador substitui a homônima também no subagente, e a
    /// negação roda DEPOIS dessa substituição.
    #[test]
    fn a_tool_nativa_chega_ao_subagente_e_a_negacao_vem_depois() {
        struct Confinada;

        #[async_trait::async_trait]
        impl Tool for Confinada {
            fn name(&self) -> &str {
                "Read"
            }
            fn description(&self) -> &str {
                "Read confinado ao workspace da sessao"
            }
            fn input_schema(&self) -> serde_json::Value {
                serde_json::json!({"type": "object"})
            }
            async fn execute(&self, _input: serde_json::Value, _ctx: &ToolContext) -> ToolResult {
                ToolResult::text("confinado")
            }
        }

        let rules =
            crate::tools::permission::PermissionRules::from_lists(&[], &["Bash".to_string()]);
        let nativas: Vec<Arc<dyn Tool>> = vec![Arc::new(Confinada)];

        let registry = super::subagent_registry(None, &nativas, &rules, "claude-sonnet-4-6");

        assert!(!registry.names().contains(&"Bash"));
        assert_eq!(
            registry.get("Read").map(Tool::description),
            Some("Read confinado ao workspace da sessao")
        );
    }

    /// A outra metade da fronteira: o EXECUTOR do subagente nasce com as
    /// regras do pai, e não com as regras vazias do default.
    ///
    /// O registry sozinho não cobre isto, e a diferença é o que a medição
    /// custou a ensinar. Uma negação SEM padrão (`Bash`) tira a ferramenta da
    /// lista, e os testes de registry acima já a pegam. Uma negação COM padrão
    /// (`Read(/etc/*)`) não tira nada da lista, porque `Read` continua legítimo
    /// no resto da árvore: quem a aplica é a checagem por chamada, e ela só
    /// existe no subagente se o executor dele carregar as regras. Apagar essa
    /// herança não quebrava teste nenhum antes desta conferência.
    ///
    /// E a lição sobre o que conta como evidência, porque ela é o motivo de o
    /// conserto ter demorado: no turno em que o furo apareceu, o modelo
    /// afirmou DUAS vezes, com toda a segurança, que não havia shell nenhum no
    /// ambiente, enquanto o shell existia e já tinha escrito um arquivo no
    /// disco fora da raiz confinada. Testemunho de modelo sobre as próprias
    /// ferramentas não é evidência. O disco é, e o registry é: quem confere
    /// esta fronteira são asserções como estas, nunca a resposta dele.
    #[test]
    fn o_executor_do_subagente_herda_a_checagem_por_chamada() {
        // `Bash` sai da lista; `Read` fica, e só a regra por argumento o
        // alcança.
        let rules =
            PermissionRules::from_lists(&[], &["Bash".to_string(), "Read(/etc/*)".to_string()]);
        let registry = super::subagent_registry(None, &[], &rules, "claude-sonnet-4-6");
        let store = Arc::new(crate::tools::task_store::TaskStore::new());

        let executor = super::subagent_executor(
            registry,
            &ToolContext::default(),
            "/workspace",
            std::path::Path::new("/workspace/.out"),
            &store,
            &rules,
            "claude-sonnet-4-6",
            super::create_agent_id(),
        );

        assert!(executor.permission_rules.is_tool_fully_denied("Bash"));
        assert!(!executor.registry.names().contains(&"Bash"));
        // A regra fina desce junto: o `Read` do subagente recusa `/etc`, que é
        // exatamente o que o registry NÃO teria como impedir.
        assert_eq!(
            executor
                .permission_rules
                .check("Read", &json!({"file_path": "/etc/passwd"})),
            PermissionDecision::Deny("Tool 'Read' is denied by rule".to_string())
        );
        // E o que a regra não alcança segue decidido pelo fluxo normal, em vez
        // de virar recusa geral: a negação é cirúrgica nos dois níveis.
        assert_eq!(
            executor
                .permission_rules
                .check("Read", &json!({"file_path": "/workspace/pedido.txt"})),
            PermissionDecision::Ask
        );
    }

    // -----------------------------------------------------------------------
    // Título da sessão: a parte pura, sem rede
    // -----------------------------------------------------------------------

    use super::{last_chars, title_of_blocks, title_of_model_text};
    use crate::api::types::ContentBlock;

    #[test]
    fn titulo_sai_do_json_do_modelo() {
        assert_eq!(
            title_of_model_text(r#"{"title": "Fix login button on mobile"}"#),
            Some("Fix login button on mobile".to_string())
        );
    }

    /// O modelo às vezes devolve o título com espaço em volta, e espaço no
    /// começo de um nome de sessão é sujeira visível na lista.
    #[test]
    fn espaco_em_volta_do_titulo_e_aparado() {
        assert_eq!(
            title_of_model_text("{\"title\": \"  Add OAuth authentication \\n\"}"),
            Some("Add OAuth authentication".to_string())
        );
    }

    /// Título só de espaço equivale a título nenhum: melhor `None` do que uma
    /// linha em branco onde deveria estar o assunto da sessão.
    #[test]
    fn titulo_so_de_espaco_vira_nulo() {
        assert_eq!(title_of_model_text(r#"{"title": "   "}"#), None);
        assert_eq!(title_of_model_text(r#"{"title": ""}"#), None);
    }

    #[test]
    fn resposta_vazia_vira_nulo() {
        assert_eq!(title_of_model_text(""), None);
        assert_eq!(title_of_model_text("   \n  "), None);
    }

    #[test]
    fn resposta_sem_o_campo_vira_nulo() {
        assert_eq!(title_of_model_text(r#"{"summary": "Fix login"}"#), None);
        assert_eq!(title_of_model_text(r#"{"title": null}"#), None);
        assert_eq!(title_of_model_text(r#"{"title": 42}"#), None);
    }

    /// Sem schema de saída no pedido, o objeto chega embrulhado de vez em
    /// quando. Desistir aí seria perder um título que está ali, legível.
    #[test]
    fn json_embrulhado_ainda_rende_titulo() {
        assert_eq!(
            title_of_model_text("```json\n{\"title\": \"Debug failing CI tests\"}\n```"),
            Some("Debug failing CI tests".to_string())
        );
        assert_eq!(
            title_of_model_text("Sure! {\"title\": \"Refactor API client\"} hope it helps"),
            Some("Refactor API client".to_string())
        );
    }

    #[test]
    fn resposta_que_nem_json_e_vira_nulo() {
        assert_eq!(title_of_model_text("Fix login button on mobile"), None);
    }

    /// A resposta chega em blocos, e só os de texto interessam.
    #[test]
    fn titulo_sai_dos_blocos_de_texto() {
        let content = vec![
            ContentBlock::Thinking {
                thinking: "pensando".to_string(),
                signature: None,
            },
            ContentBlock::text(r#"{"title": "#),
            ContentBlock::text(r#""Add OAuth authentication"}"#),
        ];
        assert_eq!(
            title_of_blocks(&content),
            Some("Add OAuth authentication".to_string())
        );
        assert_eq!(title_of_blocks(&[]), None);
    }

    /// O corte é pelo FIM, e conta caractere: cortar por byte partiria um
    /// acentuado no meio.
    #[test]
    fn o_corte_do_texto_pega_o_final_e_conta_caractere() {
        assert_eq!(last_chars("conversa curta", 100), "conversa curta");
        assert_eq!(last_chars("abcdef", 3), "def");
        assert_eq!(last_chars("ação", 3), "ção");
        assert_eq!(last_chars("ação", 0), "");
    }
}

/// O que o motor entrega às tools e ao cliente: registro das builtins pelo
/// modelo, o corpo do `can_use_tool`, a decisão do cliente e os frames das
/// mensagens de usuário.
#[cfg(test)]
mod engine_wiring_tests {
    use std::collections::HashMap;

    use serde_json::json;

    use super::{
        can_use_tool_request, derive_js_uuid, permission_outcome, register_default_builtins,
        register_named_builtins, sdk_frames, skill_directories, small_fast_model,
    };
    use crate::agentic::AgenticEvent;
    use crate::api::types::{ApiMessage, ContentBlock};
    use crate::tools::framework::{PermissionOutcome, ToolPermissionRequest, ToolRegistry};
    use crate::types::{ClaudeAgentOptions, SettingSource};

    fn names(list: &[&str], model: &str) -> Vec<String> {
        let mut registry = ToolRegistry::new();
        let list: Vec<String> = list.iter().map(|s| s.to_string()).collect();
        register_named_builtins(&mut registry, &list, model);
        registry.names().into_iter().map(str::to_string).collect()
    }

    /// `web_search` e `Task` não são nomes de builtin do CLI (o `Task` é
    /// alias do `Agent`, que o engine registra à parte), e alias repetido
    /// registra uma vez só.
    #[test]
    fn named_builtins_follow_the_cli_names() {
        assert_eq!(
            names(&["web_search", "Task"], "claude-sonnet-4-6"),
            Vec::<String>::new()
        );
        assert_eq!(
            names(&["WebSearch"], "claude-sonnet-4-6"),
            vec!["WebSearch"]
        );
        assert_eq!(
            names(&["TaskStop", "KillShell"], "claude-sonnet-4-6"),
            vec!["TaskStop"]
        );
    }

    /// O Read é o do modelo da sessão: sem a linha de PDF para o haiku 3
    /// (`isPDFSupported`), com ela para os demais, nos dois caminhos de
    /// registro.
    #[test]
    fn read_is_registered_for_the_session_model() {
        let description = |model: &str| {
            let mut registry = ToolRegistry::new();
            register_default_builtins(&mut registry, model);
            registry
                .get("Read")
                .map(|t| t.description().to_string())
                .expect("Read no default")
        };
        let modern = description("claude-sonnet-4-6");
        let old = description("claude-3-haiku-20240307");
        assert!(modern.contains("PDF"), "{modern}");
        assert!(!old.contains("PDF files"), "{old}");
        assert_ne!(modern, old);

        let mut registry = ToolRegistry::new();
        register_named_builtins(
            &mut registry,
            &["Read".to_string()],
            "claude-3-haiku-20240307",
        );
        assert_eq!(
            registry.get("Read").map(|t| t.description().to_string()),
            Some(old)
        );
    }

    /// Os opcionais do `can_use_tool` só entram quando existem, como o
    /// `JSON.stringify` do JS.
    #[test]
    fn can_use_tool_body_omits_what_does_not_exist() {
        let bare = can_use_tool_request(&ToolPermissionRequest {
            tool_name: "Bash".into(),
            input: json!({"command": "ls"}),
            tool_use_id: Some("toolu_1".into()),
            ..Default::default()
        });
        assert_eq!(
            bare,
            json!({
                "subtype": "can_use_tool",
                "tool_name": "Bash",
                "input": {"command": "ls"},
                "tool_use_id": "toolu_1",
            })
        );

        let full = can_use_tool_request(&ToolPermissionRequest {
            tool_name: "Edit".into(),
            input: json!({}),
            tool_use_id: Some("toolu_2".into()),
            permission_suggestions: Some(json!([{"type": "setMode", "mode": "acceptEdits"}])),
            blocked_path: Some("/etc/hosts".into()),
            decision_reason: Some("Path is outside allowed working directories".into()),
            agent_id: Some("a0123456789abcdef".into()),
            ..Default::default()
        });
        assert_eq!(full["blocked_path"], "/etc/hosts");
        assert_eq!(
            full["decision_reason"],
            "Path is outside allowed working directories"
        );
        assert_eq!(full["agent_id"], "a0123456789abcdef");
        assert_eq!(full["permission_suggestions"][0]["mode"], "acceptEdits");
    }

    /// Deny com `interrupt: true` vira `DenyAndInterrupt`; sem ele, deny
    /// simples.
    #[test]
    fn deny_with_interrupt_maps_to_deny_and_interrupt() {
        assert!(matches!(
            permission_outcome(&json!({"behavior": "deny", "message": "não", "interrupt": true})),
            PermissionOutcome::DenyAndInterrupt { message } if message == "não"
        ));
        assert!(matches!(
            permission_outcome(&json!({"behavior": "deny", "message": "não"})),
            PermissionOutcome::Deny { message } if message == "não"
        ));
        assert!(matches!(
            permission_outcome(&json!({"behavior": "deny", "message": "não", "interrupt": false})),
            PermissionOutcome::Deny { .. }
        ));
        assert!(matches!(
            permission_outcome(&json!({"behavior": "allow", "updatedInput": {"a": 1}})),
            PermissionOutcome::Allow {
                updated_input: Some(_)
            }
        ));
    }

    fn user_event(content: Vec<ContentBlock>, is_meta: bool) -> AgenticEvent {
        AgenticEvent::User {
            message: ApiMessage::user(content),
            parent_tool_use_id: None,
            uuid: "12345678-1234-4234-8234-123456789abc".into(),
            session_id: "s".into(),
            timestamp: String::new(),
            tool_use_result: None,
            source_tool_assistant_uuid: None,
            is_meta,
        }
    }

    /// Mensagem meta sai com `isSynthetic`; mensagem de vários blocos sai
    /// partida em um frame por bloco, com o uuid do `deriveUUID`.
    #[test]
    fn user_frames_follow_normalize_message() {
        let single = sdk_frames(&user_event(vec![ContentBlock::text("a")], false)).expect("frames");
        assert_eq!(single.len(), 1);
        assert!(single[0].get("isSynthetic").is_none());
        assert_eq!(single[0]["uuid"], "12345678-1234-4234-8234-123456789abc");

        let meta = sdk_frames(&user_event(
            vec![ContentBlock::text("p1"), ContentBlock::text("p2")],
            true,
        ))
        .expect("frames");
        assert_eq!(meta.len(), 2);
        for (index, frame) in meta.iter().enumerate() {
            assert_eq!(frame["isSynthetic"], true);
            assert_eq!(
                frame["message"]["content"].as_array().map(Vec::len),
                Some(1)
            );
            assert_eq!(
                frame["uuid"],
                format!("12345678-1234-4234-8234-{index:012x}")
            );
        }
        assert_eq!(meta[1]["message"]["content"][0]["text"], "p2");
    }

    #[test]
    fn derive_uuid_matches_the_js_formula() {
        assert_eq!(
            derive_js_uuid("aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee", 10),
            "aaaaaaaa-bbbb-4ccc-8ddd-00000000000a"
        );
    }

    /// O modelo pequeno vem do env das options, na precedência do
    /// `getSmallFastModel`; sem nada ali, fica para o fallback do contexto.
    #[test]
    fn small_fast_model_reads_the_options_env() {
        let env = |pairs: &[(&str, &str)]| -> HashMap<String, String> {
            pairs
                .iter()
                .map(|(k, v)| (k.to_string(), v.to_string()))
                .collect()
        };
        assert_eq!(small_fast_model(&env(&[])), None);
        assert_eq!(
            small_fast_model(&env(&[("ANTHROPIC_DEFAULT_HAIKU_MODEL", "haiku-x")])),
            Some("haiku-x".to_string())
        );
        assert_eq!(
            small_fast_model(&env(&[
                ("ANTHROPIC_DEFAULT_HAIKU_MODEL", "haiku-x"),
                ("ANTHROPIC_SMALL_FAST_MODEL", "rapido"),
            ])),
            Some("rapido".to_string())
        );
    }

    /// As skills seguem as fontes de settings: sem lista, projeto e usuário;
    /// com lista, só as pedidas (`local` não tem diretório de skills).
    #[test]
    fn skill_directories_follow_setting_sources() {
        let cwd = tempfile::tempdir().expect("cwd");
        let project_dir = cwd.path().join(".claude").join("skills");
        let cwd_str = cwd.path().to_str().expect("utf8");

        let all = skill_directories(&ClaudeAgentOptions::default(), cwd_str);
        assert!(all.contains(&project_dir), "{all:?}");

        let only_user = skill_directories(
            &ClaudeAgentOptions {
                setting_sources: Some(vec![SettingSource::User]),
                ..Default::default()
            },
            cwd_str,
        );
        assert!(!only_user.contains(&project_dir));
        assert_eq!(only_user.len(), 1);

        let none = skill_directories(
            &ClaudeAgentOptions {
                setting_sources: Some(vec![SettingSource::Local]),
                ..Default::default()
            },
            cwd_str,
        );
        assert!(none.is_empty(), "{none:?}");
    }
}
