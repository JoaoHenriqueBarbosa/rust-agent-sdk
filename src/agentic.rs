// Faithful port of ~/claude-code/src/query.ts queryLoop()
// Gated features (reactiveCompact, contextCollapse, skillPrefetch, snipModule,
// taskSummaryModule, jobClassifier) are all `= false` in the external build
// and are omitted entirely.

use std::collections::HashMap;
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;
use std::time::Instant;

use futures::stream::{Stream, StreamExt};
use serde::Serialize;
use tokio_util::sync::CancellationToken;

use crate::api::client::AnthropicClient;
use crate::api::cost::calculate_cost;
use crate::api::streaming::{AssistantMessage, StreamUpdate, ToolUseBlock};
use crate::api::types::*;
use crate::compact::auto_compact::AutoCompactConfig;
use crate::compact::compact::CompactionEngine;
use crate::compact::file_tracker::{ReadFileTracker, POST_COMPACT_MAX_LINES_PER_FILE};
use crate::errors::Result;
use crate::messages::normalize::{
    apply_tool_result_budget_default_persisting, ensure_tool_result_pairing,
    normalize_messages_for_api,
};
use crate::tools::framework::ToolExecutor;

// ---------------------------------------------------------------------------
// Stop hook types
// ---------------------------------------------------------------------------

/// Context passed to a stop hook callback.
#[derive(Debug, Clone)]
pub struct StopHookContext {
    /// Full conversation messages at the point the hook fires.
    pub messages: Vec<ApiMessage>,
    /// The system prompt blocks in use.
    pub system_prompt: Vec<SystemBlock>,
    /// How many turns have elapsed so far.
    pub turn_count: u32,
}

/// Result returned by a stop hook callback.
#[derive(Debug, Clone, Default)]
pub struct StopHookResult {
    /// If true, the loop yields a result with reason "stop_hook_prevented" and breaks.
    pub prevent_continuation: bool,
    /// Blocking error messages to inject into the conversation, causing a retry (StopHookBlocking).
    pub blocking_messages: Vec<ApiMessage>,
}

/// Async callback invoked after the assistant finishes a turn with no tool use.
pub type StopHookCallback = Arc<
    dyn Fn(StopHookContext) -> Pin<Box<dyn Future<Output = StopHookResult> + Send>> + Send + Sync,
>;

/// Async callback fired right BEFORE an expensive compaction runs. The
/// argument is the trigger ("auto" | "reactive" | "reactive_413") — the same
/// channel the CLI uses for the PreCompact hook.
pub type PreCompactHook =
    Arc<dyn Fn(String) -> Pin<Box<dyn Future<Output = ()> + Send>> + Send + Sync>;

/// Callback fired whenever the loop REWRITES the message history in place
/// (microcompact clearing tool_results, compaction replacing everything).
/// The transport uses it to keep its cross-turn history in sync — without it,
/// the compacted context would silently grow back on the next user turn.
pub type HistoryRewriteFn = Arc<dyn Fn(Vec<ApiMessage>) + Send + Sync>;

// ---------------------------------------------------------------------------
// SDK message types — mirrors TS SDKMessage union
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Default, Serialize)]
pub struct QueryUsage {
    pub input_tokens: u64,
    pub output_tokens: u64,
    pub cache_read_input_tokens: u64,
    pub cache_creation_input_tokens: u64,
}

impl QueryUsage {
    fn accumulate(&mut self, usage: &Usage) {
        self.input_tokens += usage.input_tokens as u64;
        self.output_tokens += usage.output_tokens as u64;
        self.cache_read_input_tokens += usage.cache_read_input_tokens.unwrap_or(0) as u64;
        self.cache_creation_input_tokens += usage.cache_creation_input_tokens.unwrap_or(0) as u64;
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum AgenticEvent {
    /// Uma mensagem de assistente do CLI: UM bloco de conteúdo por mensagem,
    /// entregue no `content_block_stop` (o `queryModel` do CLI faz assim). O
    /// `message` é o objeto do `message_start` cru da API com o `content`
    /// trocado pelo bloco, então `stop_reason` vem nulo e o `usage` é o do
    /// início (o `message_delta` ainda não chegou).
    #[serde(rename = "assistant")]
    Assistant {
        message: serde_json::Value,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
        /// Momento em que a mensagem nasceu (ISO 8601, como o CLI grava).
        #[serde(skip)]
        timestamp: String,
        /// O `request-id` da resposta HTTP, quando a API mandou.
        #[serde(skip)]
        request_id: Option<String>,
        /// Categoria do erro de API (`authentication_failed`,
        /// `rate_limit`, `invalid_request`, `unknown`, ...), só nas
        /// mensagens sintetizadas a partir de um erro.
        #[serde(skip_serializing_if = "Option::is_none")]
        error: Option<String>,
        /// Mensagem sintetizada pela camada de API (`isApiErrorMessage`).
        #[serde(skip)]
        is_api_error: bool,
        /// O `apiError` interno (`max_output_tokens`, `prompt_too_long`).
        #[serde(skip)]
        api_error: Option<String>,
        /// Mensagem retida pelo loop (o `withheld` do CLI): não vira frame
        /// nem entrada de transcript por enquanto.
        #[serde(skip)]
        withheld: bool,
    },

    #[serde(rename = "user")]
    User {
        message: ApiMessage,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
        #[serde(skip)]
        timestamp: String,
        /// O `data` estruturado da tool que produziu este resultado (o
        /// `toolUseResult` do CLI).
        #[serde(skip)]
        tool_use_result: Option<serde_json::Value>,
        /// O uuid da mensagem de assistente que pediu a tool (o
        /// `sourceToolAssistantUUID` do CLI), que encadeia o transcript.
        #[serde(skip)]
        source_tool_assistant_uuid: Option<String>,
        /// Mensagem meta (`isMeta`): conteúdo para o modelo que o usuário
        /// não escreveu (documento de um Read, aviso de interrupção...).
        #[serde(skip)]
        is_meta: bool,
    },

    /// Evento INTERNO (o transporte não o repassa ao cliente): o
    /// `message_delta` chegou para a resposta `message_id`, cujos blocos já
    /// saíram um a um. No CLI o `message_delta` muda o `stop_reason` e o
    /// `usage` (já passado pelo `updateUsage`) do ÚLTIMO bloco entregue, e é
    /// com esses valores que ele chega ao transcript, gravado depois.
    #[serde(rename = "assistant_final")]
    AssistantFinal {
        message_id: String,
        stop_reason: Option<String>,
        usage: serde_json::Value,
    },

    /// O evento SSE cru da API (`message_start`, `content_block_delta`, ...).
    #[serde(rename = "stream_event")]
    StreamEvent {
        event: serde_json::Value,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
    },

    #[serde(rename = "system")]
    System {
        subtype: String,
        #[serde(flatten)]
        data: serde_json::Value,
        uuid: String,
        session_id: String,
    },

    #[serde(rename = "result")]
    Result {
        subtype: String,
        duration_ms: u64,
        duration_api_ms: u64,
        is_error: bool,
        num_turns: u32,
        #[serde(skip_serializing_if = "Option::is_none")]
        result: Option<String>,
        stop_reason: Option<String>,
        total_cost_usd: f64,
        usage: QueryUsage,
        #[serde(rename = "modelUsage", skip_serializing_if = "Option::is_none")]
        model_usage: Option<serde_json::Value>,
        #[serde(skip_serializing_if = "Vec::is_empty")]
        permission_denials: Vec<serde_json::Value>,
        #[serde(skip_serializing_if = "Vec::is_empty")]
        errors: Vec<String>,
        session_id: String,
        uuid: String,
    },
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

#[derive(Clone)]
pub struct AgenticLoopOptions {
    pub model: String,
    pub max_tokens: u32,
    pub system_prompt: Vec<SystemBlock>,
    pub max_turns: Option<u32>,
    pub initial_messages: Vec<ApiMessage>,
    pub temperature: Option<f64>,
    pub tool_choice: Option<ToolChoice>,
    pub thinking: Option<ThinkingParam>,
    pub stop_sequences: Option<Vec<String>>,
    pub cache_last_n_messages: usize,
    pub context_window_tokens: usize,
    pub include_stream_events: bool,
    pub abort: Option<CancellationToken>,
    /// Optional fallback model — switched to on API overload.
    pub fallback_model: Option<String>,
    /// Optional stop hook — called when the assistant ends a turn with no tool use.
    pub stop_hook: Option<StopHookCallback>,
    /// Optional session ID — when set, reuses the given ID instead of
    /// generating a new one (e.g. for session resume).
    pub session_id: Option<String>,
    /// Fired before each expensive compaction (PreCompact hook channel).
    pub pre_compact_hook: Option<PreCompactHook>,
    /// Fired when the loop rewrites history in place (micro/auto/reactive
    /// compaction) so the caller can keep its own copy in sync.
    pub on_history_rewrite: Option<HistoryRewriteFn>,
    /// O contexto de usuário (`getUserContext`): a mensagem meta com o
    /// `<system-reminder>` que `prependUserContext` põe na frente das
    /// mensagens de CADA chamada ao modelo, sem nunca entrar no histórico.
    /// O valor é lido uma vez no início da consulta, como o parâmetro
    /// `userContext` do `query()` do CLI.
    pub user_context: Option<Arc<crate::memory::UserContextCache>>,
    /// Limpa o cache do contexto de usuário depois de uma compactação
    /// completa (`runPostCompactCleanup`, só na conversa principal: um
    /// subagente compactando não mexe no cache da sessão).
    pub clear_user_context_on_compact: bool,
    /// O começo do `system` que a camada de API do CLI acrescenta
    /// (`getAttributionHeader` + `getCLISyspromptPrefix`). `None` manda só
    /// o `system_prompt`.
    pub system_prefix: Option<SystemPrefix>,
    /// Os campos do frame `system`/`init` que o loop não conhece por conta
    /// própria (servidores MCP, agentes, fonte da chave...).
    pub init_info: InitInfo,
}

/// Versão do CLI de referência que o transporte nativo espelha: vai no
/// `claude_code_version` do frame `init` e no `cc_version` do cabeçalho de
/// atribuição, como o CLI 2.1.90 faria.
pub const CLAUDE_CODE_REFERENCE_VERSION: &str = "2.1.90";

/// `FINGERPRINT_SALT` de `utils/fingerprint.js`.
const FINGERPRINT_SALT: &str = "59cf53e54c78";

/// Prefixo de identidade do SDK sem `append` (`AGENT_SDK_PREFIX`).
pub const AGENT_SDK_PREFIX: &str = "You are a Claude agent, built on Anthropic's Claude Agent SDK.";

/// Prefixo de identidade do SDK com `append` (`AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX`).
pub const AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX: &str =
    "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.";

/// Os dois primeiros blocos do `system` que `services/api/claude` monta.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SystemPrefix {
    /// `getCLISyspromptPrefix`: [`AGENT_SDK_PREFIX`] ou
    /// [`AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX`].
    pub identity: String,
    /// O `cc_entrypoint` do cabeçalho de atribuição; `None` desliga o
    /// cabeçalho (`CLAUDE_CODE_ATTRIBUTION_HEADER` falso).
    pub attribution_entrypoint: Option<String>,
}

impl SystemPrefix {
    /// `getAttributionHeader(computeFingerprintFromMessages(messages))`.
    pub fn attribution_header(&self, messages: &[ApiMessage]) -> Option<String> {
        let entrypoint = self.attribution_entrypoint.as_ref()?;
        let fingerprint = compute_fingerprint(&first_user_text(messages));
        Some(format!(
            "x-anthropic-billing-header: cc_version={CLAUDE_CODE_REFERENCE_VERSION}.{fingerprint}; cc_entrypoint={entrypoint};"
        ))
    }
}

/// `extractFirstMessageText`: o texto da primeira mensagem de usuário (string
/// ou primeiro bloco de texto).
fn first_user_text(messages: &[ApiMessage]) -> String {
    let Some(first) = messages.iter().find(|m| m.role == Role::User) else {
        return String::new();
    };
    first
        .content
        .iter()
        .find_map(|block| match block {
            ContentBlock::Text { text, .. } => Some(text.clone()),
            _ => None,
        })
        .unwrap_or_default()
}

/// `computeFingerprint`: as unidades UTF-16 nas posições 4, 7 e 20 (ou `0`)
/// com sal e versão, sha256, 3 primeiros hex. Unidade de surrogate solta vira
/// U+FFFD, que é o que o `update` do Node grava para ela em UTF-8.
fn compute_fingerprint(text: &str) -> String {
    use sha2::{Digest, Sha256};
    let units: Vec<u16> = text.encode_utf16().collect();
    let chars: String = [4usize, 7, 20]
        .iter()
        .map(|&i| match units.get(i) {
            None => '0',
            Some(&unit) => char::from_u32(u32::from(unit)).unwrap_or('\u{FFFD}'),
        })
        .collect();
    let digest = Sha256::digest(
        format!("{FINGERPRINT_SALT}{chars}{CLAUDE_CODE_REFERENCE_VERSION}").as_bytes(),
    );
    digest
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect::<String>()
        .chars()
        .take(3)
        .collect()
}

/// O que o frame `system`/`init` (`buildSystemInitMessage`) leva além do que
/// o loop já sabe (cwd, tools, modelo, modo de permissão).
#[derive(Debug, Clone, PartialEq)]
pub struct InitInfo {
    /// `[{name, status}]` dos servidores MCP.
    pub mcp_servers: Vec<serde_json::Value>,
    pub slash_commands: Vec<String>,
    /// `getAnthropicApiKeyWithSource().source`.
    pub api_key_source: String,
    /// `getSdkBetas()`: ausente do frame quando `None`.
    pub betas: Option<Vec<String>>,
    pub output_style: String,
    /// Os `agentType` disponíveis para a tool de agente.
    pub agents: Vec<String>,
    pub skills: Vec<String>,
    /// `[{name, path, source}]`.
    pub plugins: Vec<serde_json::Value>,
    /// `getFastModeState`: `on`, `off` ou `cooldown`.
    pub fast_mode_state: String,
}

impl Default for InitInfo {
    fn default() -> Self {
        Self {
            mcp_servers: Vec::new(),
            slash_commands: Vec::new(),
            api_key_source: "none".to_string(),
            betas: None,
            output_style: "default".to_string(),
            agents: Vec::new(),
            skills: Vec::new(),
            plugins: Vec::new(),
            fast_mode_state: "off".to_string(),
        }
    }
}

/// `sdkCompatToolName`: a tool de agente aparece no `init` com o nome antigo
/// (`Task`), sem repetir quando as duas grafias estão registradas.
fn init_tool_names(names: &[&str]) -> Vec<String> {
    let mut out: Vec<String> = Vec::new();
    for name in names {
        let compat = if *name == crate::tools::agent::AGENT_TOOL_NAME {
            "Task"
        } else {
            name
        };
        if !out.iter().any(|n| n == compat) {
            out.push(compat.to_string());
        }
    }
    out
}

impl std::fmt::Debug for AgenticLoopOptions {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("AgenticLoopOptions")
            .field("model", &self.model)
            .field("max_tokens", &self.max_tokens)
            .field("max_turns", &self.max_turns)
            .field("stop_hook", &self.stop_hook.as_ref().map(|_| "..."))
            .finish_non_exhaustive()
    }
}

impl Default for AgenticLoopOptions {
    fn default() -> Self {
        Self {
            model: "claude-sonnet-4-20250514".to_string(),
            max_tokens: 16384,
            system_prompt: Vec::new(),
            max_turns: None,
            initial_messages: Vec::new(),
            temperature: None,
            tool_choice: None,
            thinking: None,
            stop_sequences: None,
            cache_last_n_messages: 2,
            context_window_tokens: 200_000,
            include_stream_events: true,
            abort: None,
            fallback_model: None,
            stop_hook: None,
            session_id: None,
            pre_compact_hook: None,
            on_history_rewrite: None,
            user_context: None,
            clear_user_context_on_compact: false,
            system_prefix: None,
            init_info: InitInfo::default(),
        }
    }
}

// ---------------------------------------------------------------------------
// Loop state — mirrors TS State type in query.ts
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
#[allow(dead_code)]
enum Transition {
    NextTurn,
    ReactiveCompactRetry,
    MaxOutputTokensRecovery { attempt: u32 },
    StopHookBlocking,
}

struct LoopState {
    messages: Vec<ApiMessage>,
    max_output_tokens_override: Option<u32>,
    max_output_tokens_recovery_count: u32,
    has_attempted_reactive_compact: bool,
    #[allow(dead_code)]
    stop_hook_active: Option<bool>,
    turn_count: u32,
    #[allow(dead_code)]
    transition: Option<Transition>,
    last_stop_reason: Option<String>,
    total_usage: QueryUsage,
    total_cost_usd: f64,
    api_duration_ms: u64,
    auto_compact_tracking: AutoCompactTracking,
    model_usage: HashMap<String, QueryUsage>,
    permission_denials: Vec<serde_json::Value>,
    /// Âncora de contagem: (nº de mensagens já COBERTAS pelo usage real da
    /// última resposta, tokens de contexto daquela resposta). O que veio
    /// depois é estimado com margem — é o tokenCountWithEstimation do CLI:
    /// usage exato para o grosso, heurística só para o delta.
    usage_anchor: Option<(usize, u64)>,
}

#[derive(Debug, Clone, Default)]
struct AutoCompactTracking {
    #[allow(dead_code)]
    compacted: bool,
    #[allow(dead_code)]
    turn_counter: u32,
    consecutive_failures: u32,
}

// Port: MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3 from query.ts
const MAX_OUTPUT_TOKENS_RECOVERY_LIMIT: u32 = 3;

// Port: MANUAL_COMPACT_BUFFER_TOKENS = 3000 from autoCompact.ts
const MANUAL_COMPACT_BUFFER_TOKENS: usize = 3_000;

// Port: compact boundary marker — inserted as a user message after compaction
// so that getMessagesAfterCompactBoundary can slice pre-compaction messages.
pub(crate) const COMPACT_BOUNDARY_MARKER: &str = "[COMPACT_BOUNDARY]";

/// Port of isPromptTooLongMessage from query.ts
/// Checks if the assistant response text indicates a prompt-too-long error
/// (API returned 413 as an assistant message rather than as an HTTP error).
fn is_prompt_too_long_message(msg: &AssistantMessage) -> bool {
    // Flag ESTRUTURAL posta pela camada de API, nunca inferida do texto: o
    // modelo escrevendo "prompt is too long" num rationale não pode disparar
    // compactação.
    msg.api_error.as_deref() == Some("prompt_too_long")
}

/// Port of getMessagesAfterCompactBoundary from utils/messages/
/// Finds the last compact boundary marker in the message list and returns
/// only messages from that point forward. If no boundary exists, returns all.
fn get_messages_after_compact_boundary(messages: &[ApiMessage]) -> Vec<ApiMessage> {
    let boundary_index = find_last_compact_boundary_index(messages);
    if boundary_index == -1 {
        messages.to_vec()
    } else {
        messages[boundary_index as usize..].to_vec()
    }
}

/// Port of findLastCompactBoundaryIndex from utils/messages/
fn find_last_compact_boundary_index(messages: &[ApiMessage]) -> isize {
    for i in (0..messages.len()).rev() {
        if is_compact_boundary_message(&messages[i]) {
            return i as isize;
        }
    }
    -1
}

/// Port of isCompactBoundaryMessage from utils/messages/
/// A compact boundary is a user message whose sole text content is COMPACT_BOUNDARY_MARKER.
fn is_compact_boundary_message(msg: &ApiMessage) -> bool {
    if msg.role != Role::User {
        return false;
    }
    msg.content.len() == 1
        && matches!(&msg.content[0], ContentBlock::Text { text, .. } if text == COMPACT_BOUNDARY_MARKER)
}

/// Insert a compact boundary marker as the first message in the compacted list.
fn insert_compact_boundary(messages: &mut Vec<ApiMessage>) {
    messages.insert(
        0,
        ApiMessage::user(vec![ContentBlock::text(COMPACT_BOUNDARY_MARKER)]),
    );
}

fn stop_reason_str(reason: &StopReason) -> Option<String> {
    match reason {
        StopReason::EndTurn => Some("end_turn".to_string()),
        StopReason::ToolUse => Some("tool_use".to_string()),
        StopReason::MaxTokens => Some("max_tokens".to_string()),
        StopReason::StopSequence => Some("stop_sequence".to_string()),
        StopReason::Unknown(s) => Some(s.clone()),
    }
}

fn new_uuid() -> String {
    uuid::Uuid::new_v4().to_string()
}

/// O `timestamp` das mensagens, no formato que o CLI grava
/// (`new Date().toISOString()`: UTC com milissegundos e `Z`).
fn now_timestamp() -> String {
    chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true)
}

/// Mensagem de usuário sintetizada pelo loop (sem tool que a produziu).
fn user_event(message: ApiMessage, session_id: &str) -> AgenticEvent {
    AgenticEvent::User {
        message,
        parent_tool_use_id: None,
        uuid: new_uuid(),
        session_id: session_id.to_string(),
        timestamp: now_timestamp(),
        tool_use_result: None,
        source_tool_assistant_uuid: None,
        is_meta: false,
    }
}

/// Serialize per-model usage map to a JSON Value, or None if empty.
fn serialize_model_usage(model_usage: &HashMap<String, QueryUsage>) -> Option<serde_json::Value> {
    if model_usage.is_empty() {
        return None;
    }
    serde_json::to_value(model_usage).ok()
}

/// Build an AgenticEvent::Assistant from an AssistantMessage with a nested
/// `message` field matching the TS SDK output format:
/// { id, role: "assistant", model, content, stop_reason, usage, type: "message" }
fn assistant_event(msg: &AssistantMessage, session_id: &str) -> AgenticEvent {
    let message = serde_json::json!({
        "id": msg.id,
        "role": "assistant",
        "model": msg.model,
        "content": serde_json::to_value(&msg.content).unwrap_or_default(),
        "stop_reason": stop_reason_str(&msg.stop_reason),
        "usage": serde_json::to_value(&msg.usage).unwrap_or_default(),
        "type": "message",
    });
    AgenticEvent::Assistant {
        message,
        parent_tool_use_id: None,
        uuid: new_uuid(),
        session_id: session_id.to_string(),
        timestamp: now_timestamp(),
        request_id: None,
        error: None,
        is_api_error: msg.api_error.is_some(),
        api_error: msg.api_error.clone(),
        withheld: false,
    }
}

/// Port of isWithheldMaxOutputTokens from query.ts
fn is_withheld_max_output_tokens(msg: &AssistantMessage) -> bool {
    msg.stop_reason == StopReason::MaxTokens
}

/// Contagem híbrida de contexto: o usage REAL da última resposta cobre o
/// prefixo; só o que entrou depois (tool results, mensagens novas) é estimado,
/// com margem. É o tokenCountWithEstimation do CLI — a heurística de 4
/// chars/token subestima JSON em ~30%, e subestimar contexto é estourar a
/// janela antes de o autocompact disparar.
fn hybrid_token_count(
    messages: &[ApiMessage],
    system: &[SystemBlock],
    tools: &[ToolDefinition],
    anchor: Option<(usize, u64)>,
) -> usize {
    use crate::compact::token_estimation::{
        estimate_message_tokens_with_margin, estimate_system_tokens,
        estimate_tool_definition_tokens,
    };
    match anchor {
        // O usage real já inclui system e tools do request anterior.
        Some((covered, context_tokens)) if covered <= messages.len() => {
            let delta = estimate_message_tokens_with_margin(&messages[covered..]);
            usize::try_from(context_tokens)
                .unwrap_or(usize::MAX)
                .saturating_add(delta)
        }
        _ => {
            estimate_system_tokens(system)
                + estimate_message_tokens_with_margin(messages)
                + estimate_tool_definition_tokens(tools)
        }
    }
}

/// Port of calculateTokenWarningState().isAtBlockingLimit from autoCompact.ts
/// The blocking limit is context_window - MANUAL_COMPACT_BUFFER_TOKENS (3000)
fn is_at_blocking_limit(token_count: usize, context_window: usize) -> bool {
    let blocking_limit = context_window.saturating_sub(MANUAL_COMPACT_BUFFER_TOKENS);
    token_count >= blocking_limit
}

/// Port of yieldMissingToolResultBlocks from query.ts: um `tool_result` de
/// erro para cada `tool_use` já entregue nesta iteração, com o
/// `toolUseResult` (a mensagem de erro) e o `sourceToolAssistantUUID` do
/// bloco que pediu a tool, como o `createUserMessage` do JS.
fn yield_missing_tool_result_blocks(
    tool_sources: &[(String, String)],
    error_message: &str,
    session_id: &str,
) -> Vec<AgenticEvent> {
    tool_sources
        .iter()
        .map(|(tool_use_id, source_uuid)| AgenticEvent::User {
            message: ApiMessage::user(vec![ContentBlock::ToolResult {
                tool_use_id: tool_use_id.clone(),
                // O JS devolve estes erros com o `content` em string.
                content: Some(crate::api::types::ToolResultBlockContent::Text(
                    error_message.to_string(),
                )),
                is_error: Some(true),
                cache_control: None,
            }]),
            parent_tool_use_id: None,
            uuid: new_uuid(),
            session_id: session_id.to_string(),
            timestamp: now_timestamp(),
            tool_use_result: Some(serde_json::Value::String(error_message.to_string())),
            source_tool_assistant_uuid: Some(source_uuid.clone()),
            is_meta: false,
        })
        .collect()
}

/// O `EMPTY_USAGE` do CLI (`services/api/emptyUsage.js`).
fn empty_usage() -> serde_json::Value {
    serde_json::json!({
        "input_tokens": 0,
        "cache_creation_input_tokens": 0,
        "cache_read_input_tokens": 0,
        "output_tokens": 0,
        "server_tool_use": {"web_search_requests": 0, "web_fetch_requests": 0},
        "service_tier": "standard",
        "cache_creation": {"ephemeral_1h_input_tokens": 0, "ephemeral_5m_input_tokens": 0},
        "inference_geo": "",
        "iterations": [],
        "speed": "standard",
    })
}

/// Port de `updateUsage` (`services/api/claude/updateUsage.js`): os tokens
/// de entrada só trocam quando a parte traz um valor positivo; o resto vem
/// da parte quando ela tem, senão fica o acumulado.
fn update_usage(usage: &serde_json::Value, part: Option<&serde_json::Value>) -> serde_json::Value {
    use serde_json::Value;
    let Some(part) = part.filter(|p| p.is_object()) else {
        return usage.clone();
    };
    let positive_or = |key: &str| -> Value {
        match part.get(key) {
            Some(v) if v.as_f64().is_some_and(|n| n > 0.0) => v.clone(),
            _ => usage.get(key).cloned().unwrap_or(Value::Null),
        }
    };
    let nullish_or = |p: Option<&Value>, u: Option<&Value>| -> Value {
        match p {
            Some(v) if !v.is_null() => v.clone(),
            _ => u.cloned().unwrap_or(Value::Null),
        }
    };
    serde_json::json!({
        "input_tokens": positive_or("input_tokens"),
        "cache_creation_input_tokens": positive_or("cache_creation_input_tokens"),
        "cache_read_input_tokens": positive_or("cache_read_input_tokens"),
        "output_tokens": nullish_or(part.get("output_tokens"), usage.get("output_tokens")),
        "server_tool_use": {
            "web_search_requests": nullish_or(
                part.pointer("/server_tool_use/web_search_requests"),
                usage.pointer("/server_tool_use/web_search_requests"),
            ),
            "web_fetch_requests": nullish_or(
                part.pointer("/server_tool_use/web_fetch_requests"),
                usage.pointer("/server_tool_use/web_fetch_requests"),
            ),
        },
        "service_tier": usage.get("service_tier").cloned().unwrap_or(Value::Null),
        "cache_creation": {
            "ephemeral_1h_input_tokens": nullish_or(
                part.pointer("/cache_creation/ephemeral_1h_input_tokens"),
                usage.pointer("/cache_creation/ephemeral_1h_input_tokens"),
            ),
            "ephemeral_5m_input_tokens": nullish_or(
                part.pointer("/cache_creation/ephemeral_5m_input_tokens"),
                usage.pointer("/cache_creation/ephemeral_5m_input_tokens"),
            ),
        },
        "inference_geo": usage.get("inference_geo").cloned().unwrap_or(Value::Null),
        "iterations": nullish_or(part.get("iterations"), usage.get("iterations")),
        "speed": nullish_or(part.get("speed"), usage.get("speed")),
    })
}

/// A entrega por bloco do `queryModel` do CLI: cada `content_block_stop` vira
/// uma mensagem de assistente com o objeto do `message_start` e o `content`
/// trocado pelo bloco (mesmo `message.id` em todas), e o `message_delta`
/// fecha a resposta com `stop_reason` e `usage` finais.
#[derive(Default)]
struct BlockEmitter {
    /// O `request-id` da resposta HTTP em curso.
    request_id: Option<String>,
    /// O `message` cru do `message_start` da resposta em curso.
    partial_message: Option<serde_json::Value>,
    /// O `usage` acumulado pelo `updateUsage` (começa no `EMPTY_USAGE`).
    usage: serde_json::Value,
    stop_reason: Option<String>,
    /// Blocos já entregues da resposta em curso.
    emitted: usize,
    /// `(tool_use.id, uuid do bloco)` de cada `tool_use` entregue na
    /// iteração: o `sourceToolAssistantUUID` dos resultados.
    tool_sources: Vec<(String, String)>,
    /// `(tool_use.id, input normalizado)` dos blocos já entregues, para a
    /// mensagem completa reaproveitar a mesma normalização.
    normalized_inputs: Vec<(String, serde_json::Value)>,
}

impl BlockEmitter {
    /// Uma resposta HTTP nova (ou um retry): o estado da resposta zera, os
    /// `tool_use` já entregues na iteração continuam.
    fn start_response(&mut self, request_id: Option<String>) {
        self.request_id = request_id;
        self.partial_message = None;
        self.usage = empty_usage();
        self.stop_reason = None;
        self.emitted = 0;
        self.normalized_inputs.clear();
    }

    /// Acompanha o evento SSE cru (`message_start` e `message_delta`).
    fn observe(&mut self, event: &serde_json::Value) {
        match event.get("type").and_then(serde_json::Value::as_str) {
            Some("message_start") => {
                let message = event.get("message").cloned().unwrap_or_default();
                self.usage = update_usage(&empty_usage(), message.get("usage"));
                self.partial_message = Some(message);
                self.emitted = 0;
            }
            Some("message_delta") => {
                self.usage = update_usage(&self.usage, event.get("usage"));
                self.stop_reason = event
                    .pointer("/delta/stop_reason")
                    .and_then(serde_json::Value::as_str)
                    .map(str::to_string);
            }
            _ => {}
        }
    }

    fn message_id(&self) -> Option<String> {
        self.partial_message
            .as_ref()
            .and_then(|m| m.get("id"))
            .and_then(serde_json::Value::as_str)
            .map(str::to_string)
    }

    /// A mensagem de um bloco que acabou de fechar (`content_block_stop`).
    fn block_event(&mut self, block: &ContentBlock, model: &str, session_id: &str) -> AgenticEvent {
        let block_json = serde_json::to_value(block).unwrap_or_default();
        let mut message = match self.partial_message.clone() {
            Some(serde_json::Value::Object(m)) => m,
            _ => {
                let mut m = serde_json::Map::new();
                m.insert("id".into(), serde_json::json!(new_uuid()));
                m.insert("type".into(), serde_json::json!("message"));
                m.insert("role".into(), serde_json::json!("assistant"));
                m.insert("model".into(), serde_json::json!(model));
                m.insert("content".into(), serde_json::json!([]));
                m.insert("stop_reason".into(), serde_json::Value::Null);
                m.insert("stop_sequence".into(), serde_json::Value::Null);
                m.insert("usage".into(), empty_usage());
                self.partial_message = Some(serde_json::Value::Object(m.clone()));
                m
            }
        };
        message.insert("content".into(), serde_json::json!([block_json]));
        let uuid = new_uuid();
        if let ContentBlock::ToolUse { id, .. } = block {
            self.tool_sources.push((id.clone(), uuid.clone()));
        }
        self.emitted += 1;
        AgenticEvent::Assistant {
            message: serde_json::Value::Object(message),
            parent_tool_use_id: None,
            uuid,
            session_id: session_id.to_string(),
            timestamp: now_timestamp(),
            request_id: self.request_id.clone(),
            error: None,
            is_api_error: false,
            api_error: None,
            withheld: false,
        }
    }

    /// O fechamento da resposta cujos blocos já saíram; `None` quando nenhum
    /// bloco saiu por aqui (resposta não streamada ou sintetizada).
    fn final_event(&self) -> Option<AgenticEvent> {
        if self.emitted == 0 {
            return None;
        }
        Some(AgenticEvent::AssistantFinal {
            message_id: self.message_id()?,
            stop_reason: self.stop_reason.clone(),
            usage: self.usage.clone(),
        })
    }

    /// Uma resposta inteira que não passou pela entrega por bloco (o
    /// fallback não streamado): sai numa mensagem só, como o CLI a grava.
    fn whole_message_event(&mut self, msg: &AssistantMessage, session_id: &str) -> AgenticEvent {
        let mut event = assistant_event(msg, session_id);
        if let AgenticEvent::Assistant {
            uuid, request_id, ..
        } = &mut event
        {
            *request_id = self.request_id.clone();
            for block in &msg.content {
                if let ContentBlock::ToolUse { id, .. } = block {
                    self.tool_sources.push((id.clone(), uuid.clone()));
                }
            }
        }
        event
    }

    /// O `sourceToolAssistantUUID` de um `tool_use`.
    fn source_of(&self, tool_use_id: &str) -> Option<String> {
        self.tool_sources
            .iter()
            .find(|(id, _)| id == tool_use_id)
            .map(|(_, uuid)| uuid.clone())
    }
}

/// O `createAssistantAPIErrorMessage` que o `queryModel` do CLI entrega
/// quando a resposta para em `max_tokens`: o loop o retém enquanto tenta
/// recuperar e só o entrega quando a recuperação se esgota.
fn max_output_tokens_error_event(max_output_tokens: u32, session_id: &str) -> AgenticEvent {
    let synthetic = crate::internal::transcript_load::synthetic_assistant_message(
        &format!(
            "API Error: Claude's response exceeded the {max_output_tokens} output token maximum. \
             To configure this behavior, set the CLAUDE_CODE_MAX_OUTPUT_TOKENS environment variable."
        ),
        Some("max_output_tokens"),
        Some("max_output_tokens"),
    );
    AgenticEvent::Assistant {
        message: synthetic.get("message").cloned().unwrap_or_default(),
        parent_tool_use_id: None,
        uuid: synthetic
            .get("uuid")
            .and_then(serde_json::Value::as_str)
            .map(str::to_string)
            .unwrap_or_else(new_uuid),
        session_id: session_id.to_string(),
        timestamp: synthetic
            .get("timestamp")
            .and_then(serde_json::Value::as_str)
            .map(str::to_string)
            .unwrap_or_else(now_timestamp),
        request_id: None,
        error: Some("max_output_tokens".to_string()),
        is_api_error: true,
        api_error: Some("max_output_tokens".to_string()),
        withheld: false,
    }
}

// ---------------------------------------------------------------------------
// Agentic loop — faithful port of queryLoop from query.ts
// ---------------------------------------------------------------------------

pub struct AgenticLoop {
    client: AnthropicClient,
    tool_executor: ToolExecutor,
    options: AgenticLoopOptions,
    auto_compact: AutoCompactConfig,
    compaction_engine: CompactionEngine,
    read_file_tracker: ReadFileTracker,
    session_id: String,
    abort: CancellationToken,
}

impl AgenticLoop {
    pub fn new(
        client: AnthropicClient,
        tool_executor: ToolExecutor,
        options: AgenticLoopOptions,
    ) -> Self {
        let auto_compact = AutoCompactConfig::new(
            options.context_window_tokens,
            usize::try_from(options.max_tokens).unwrap_or(usize::MAX),
        );
        let compaction_engine = CompactionEngine::new(client.clone());
        let session_id = options.session_id.clone().unwrap_or_else(new_uuid);
        let abort = options.abort.clone().unwrap_or_default();

        Self {
            client,
            tool_executor,
            auto_compact,
            compaction_engine,
            read_file_tracker: ReadFileTracker::new(),
            session_id,
            abort,
            options,
        }
    }

    pub fn session_id(&self) -> &str {
        &self.session_id
    }

    fn build_request(
        &self,
        messages: &[ApiMessage],
        max_tokens_override: Option<u32>,
        model: &str,
        user_context: Option<&ApiMessage>,
    ) -> CreateMessageRequest {
        let tool_definitions = self.tool_executor.registry.api_definitions();
        // `prependUserContext` acontece antes do `normalizeMessagesForAPI` da
        // camada de API: a mensagem meta se funde com o primeiro turno do
        // usuário, e só existe no corpo que sai.
        let messages: Vec<ApiMessage> = match user_context {
            Some(context) => {
                let mut with_context = Vec::with_capacity(messages.len() + 1);
                with_context.push(context.clone());
                with_context.extend_from_slice(messages);
                normalize_messages_for_api(&with_context)
            }
            None => messages.to_vec(),
        };
        // `normalizeToolInputForAPI` em cada `tool_use` do histórico.
        let messages: Vec<ApiMessage> = messages
            .into_iter()
            .map(|mut message| {
                for block in &mut message.content {
                    if let ContentBlock::ToolUse { name, input, .. } = block {
                        let taken = std::mem::take(input);
                        *input = self.tool_executor.normalize_tool_input_for_api(name, taken);
                    }
                }
                message
            })
            .collect();
        let system = self.system_blocks(&messages);
        CreateMessageRequest {
            model: model.to_string(),
            max_tokens: max_tokens_override.unwrap_or(self.options.max_tokens),
            messages,
            system: if system.is_empty() {
                None
            } else {
                Some(system)
            },
            tools: if tool_definitions.is_empty() {
                None
            } else {
                Some(tool_definitions)
            },
            tool_choice: self.options.tool_choice.clone(),
            stream: true,
            metadata: None,
            stop_sequences: self.options.stop_sequences.clone(),
            temperature: self.options.temperature,
            top_p: None,
            top_k: None,
            thinking: self.options.thinking.clone(),
        }
    }

    /// `runPostCompactCleanup`: na conversa principal, a compactação esquece o
    /// contexto de usuário memoizado, e a próxima consulta relê as memórias.
    fn post_compact_cleanup(&self) {
        if self.options.clear_user_context_on_compact {
            if let Some(cache) = &self.options.user_context {
                cache.clear();
            }
        }
    }

    /// Os campos do frame `init` na ordem de `buildSystemInitMessage`
    /// (`session_id` e `uuid` são do envelope do evento).
    fn init_data(&self, model: &str) -> serde_json::Value {
        let info = &self.options.init_info;
        let mut data = serde_json::Map::new();
        data.insert(
            "cwd".into(),
            self.tool_executor
                .context
                .working_directory
                .display()
                .to_string()
                .into(),
        );
        data.insert(
            "tools".into(),
            serde_json::json!(init_tool_names(&self.tool_executor.registry.names())),
        );
        data.insert("mcp_servers".into(), serde_json::json!(info.mcp_servers));
        data.insert("model".into(), model.into());
        data.insert(
            "permissionMode".into(),
            serde_json::to_value(self.tool_executor.context.mode())
                .unwrap_or(serde_json::Value::Null),
        );
        data.insert(
            "slash_commands".into(),
            serde_json::json!(info.slash_commands),
        );
        data.insert("apiKeySource".into(), info.api_key_source.clone().into());
        if let Some(betas) = &info.betas {
            data.insert("betas".into(), serde_json::json!(betas));
        }
        data.insert(
            "claude_code_version".into(),
            CLAUDE_CODE_REFERENCE_VERSION.into(),
        );
        data.insert("output_style".into(), info.output_style.clone().into());
        data.insert("agents".into(), serde_json::json!(info.agents));
        data.insert("skills".into(), serde_json::json!(info.skills));
        data.insert("plugins".into(), serde_json::json!(info.plugins));
        data.insert(
            "fast_mode_state".into(),
            info.fast_mode_state.clone().into(),
        );
        serde_json::Value::Object(data)
    }

    /// O `system` que sai: cabeçalho de atribuição e prefixo de identidade
    /// (quando configurados) seguidos do prompt, como o
    /// `services/api/claude` do CLI monta (`filter(Boolean)` tira os vazios).
    fn system_blocks(&self, messages: &[ApiMessage]) -> Vec<SystemBlock> {
        let mut blocks = Vec::new();
        if let Some(prefix) = &self.options.system_prefix {
            if let Some(header) = prefix.attribution_header(messages) {
                blocks.push(SystemBlock::text(header));
            }
            if !prefix.identity.is_empty() {
                blocks.push(SystemBlock::text(prefix.identity.clone()));
            }
        }
        blocks.extend(
            self.options
                .system_prompt
                .iter()
                .filter(|b| !b.text.is_empty())
                .cloned(),
        );
        blocks
    }

    fn sys_text(&self) -> String {
        self.options
            .system_prompt
            .iter()
            .map(|b| b.text.as_str())
            .collect::<Vec<_>>()
            .join("\n")
    }

    /// Port of queryLoop() from query.ts — the main agentic loop.
    pub fn stream(mut self) -> Pin<Box<dyn Stream<Item = Result<AgenticEvent>> + Send>> {
        Box::pin(async_stream::stream! {
            let start_time = Instant::now();
            let sid = self.session_id.clone();
            let mut current_model = self.options.model.clone();

            // ─── Initial state (port of state3 = {...}) ───────────────
            let mut state = LoopState {
                messages: self.options.initial_messages.clone(),
                max_output_tokens_override: None,
                max_output_tokens_recovery_count: 0,
                has_attempted_reactive_compact: false,
                stop_hook_active: None,
                turn_count: 1,
                transition: None,
                last_stop_reason: None,
                total_usage: QueryUsage::default(),
                total_cost_usd: 0.0,
                api_duration_ms: 0,
                auto_compact_tracking: AutoCompactTracking::default(),
                model_usage: HashMap::new(),
                permission_denials: Vec::new(),
                usage_anchor: None,
            };

            // O contexto de usuário é lido UMA vez por consulta (o parâmetro
            // `userContext` do `query()`): uma compactação no meio limpa o
            // cache para a próxima consulta, mas esta segue com o valor lido.
            let user_context_message: Option<ApiMessage> = self
                .options
                .user_context
                .as_ref()
                .and_then(|cache| cache.message());

            // `buildSystemInitMessage`, uma vez por consulta.
            yield Ok(AgenticEvent::System {
                subtype: "init".to_string(),
                data: self.init_data(&current_model),
                uuid: new_uuid(),
                session_id: sid.clone(),
            });

            // ═══════════════════════════════════════════════════════════
            // Port: while (!0) { ... } — main query loop
            // Each iteration = one API call + tool execution cycle
            // ═══════════════════════════════════════════════════════════
            'query_loop: loop {
                // ─── Check abort at loop entry ────────────────────────
                if self.abort.is_cancelled() {
                    yield Ok(AgenticEvent::Result {
                        subtype: "error_during_execution".to_string(),
                        duration_ms: start_time.elapsed().as_millis() as u64,
                        duration_api_ms: state.api_duration_ms,
                        is_error: true,
                        num_turns: state.turn_count,
                        result: None,
                        stop_reason: state.last_stop_reason.clone(),
                        total_cost_usd: state.total_cost_usd,
                        usage: state.total_usage.clone(),
                        model_usage: serialize_model_usage(&state.model_usage),
                        permission_denials: state.permission_denials.clone(),
                        errors: vec!["Interrupted by user".to_string()],
                        session_id: sid.clone(),
                        uuid: new_uuid(),
                    });
                    break;
                }

                // ─── messagesForQuery ─────────────────────────────────
                // Port: let messagesForQuery = [...getMessagesAfterCompactBoundary(messages)]
                let mut messages_for_query = get_messages_after_compact_boundary(&state.messages);

                // ─── Apply tool result budget (BEFORE autocompact) ────
                // Port: messagesForQuery = applyToolResultBudget(messagesForQuery, ...)
                // Must happen before autocompact so token counts are accurate.
                apply_tool_result_budget_default_persisting(
                    &mut messages_for_query,
                    self.tool_executor.context.tool_results_dir.as_deref(),
                );

                // ─── Auto-compact ─────────────────────────────────────
                // Port: let { compactionResult, consecutiveFailures } = await deps.autocompact(...)
                let mut compaction_happened = false;

                let context_token_count = hybrid_token_count(
                    &messages_for_query,
                    &self.options.system_prompt,
                    &self.tool_executor.registry.api_definitions(),
                    state.usage_anchor,
                );
                let mut context_token_count = context_token_count;
                if state.auto_compact_tracking.consecutive_failures < 3
                    && self.auto_compact.should_compact(context_token_count)
                {
                    // Primeiro o microcompact, que custa zero: limpa
                    // tool_results antigos e reconta. Só se AINDA estourar o
                    // threshold é que o compact completo (uma chamada de LLM
                    // inteira) roda.
                    let cleared = crate::compact::micro::microcompact_messages(
                        &mut messages_for_query,
                        crate::compact::micro::MICROCOMPACT_KEEP_RECENT,
                    );
                    if cleared > 0 {
                        // O histórico mudou: a âncora de usage ficou obsoleta.
                        state.usage_anchor = None;
                        if let Some(ref rewrite) = self.options.on_history_rewrite {
                            rewrite(messages_for_query.clone());
                        }
                        context_token_count = hybrid_token_count(
                            &messages_for_query,
                            &self.options.system_prompt,
                            &self.tool_executor.registry.api_definitions(),
                            None,
                        );
                        yield Ok(AgenticEvent::System {
                            subtype: "microcompact".to_string(),
                            data: serde_json::json!({
                                "cleared_tool_results": cleared,
                            }),
                            uuid: new_uuid(),
                            session_id: sid.clone(),
                        });
                    }
                }
                if state.auto_compact_tracking.consecutive_failures < 3
                    && self.auto_compact.should_compact(context_token_count)
                {
                    if let Some(ref pre_compact) = self.options.pre_compact_hook {
                        pre_compact("auto".to_string()).await;
                    }
                    match self.compaction_engine.compact(&messages_for_query, &self.sys_text()).await {
                        Ok(compacted) => {
                            messages_for_query = compacted;
                            // Port: insert compact boundary as first message after compaction
                            insert_compact_boundary(&mut messages_for_query);
                            self.post_compact_cleanup();
                            self.auto_compact.record_success();
                            compaction_happened = true;
                            state.usage_anchor = None;
                            state.auto_compact_tracking = AutoCompactTracking {
                                compacted: true,
                                turn_counter: 0,
                                consecutive_failures: 0,
                            };

                            // ─── Post-compact file restoration ───────────
                            // Port of createPostCompactFileAttachments — re-attach
                            // recently read files so the model retains file context.
                            let recent_files = self.read_file_tracker.get_recent_files(10);
                            for file_path in &recent_files {
                                match tokio::fs::read_to_string(file_path).await {
                                    Ok(content) => {
                                        let lines: Vec<&str> = content.lines().collect();
                                        let end = lines.len().min(POST_COMPACT_MAX_LINES_PER_FILE);
                                        let truncated: String = lines[..end].join("\n");
                                        let display_path = file_path.display();
                                        let attachment_text = format!(
                                            "[Post-compact file context: {display_path}]\n{truncated}"
                                        );
                                        messages_for_query.push(
                                            ApiMessage::user(vec![ContentBlock::text(attachment_text)])
                                        );
                                    }
                                    Err(_) => {
                                        // File no longer readable — skip silently
                                    }
                                }
                            }
                            self.read_file_tracker.clear();

                            // O rewrite carrega o histórico COMPLETO pós-compact
                            // (boundary + attachments) e precisa preceder o
                            // evento — o transporte aplica o snapshot quando o
                            // compact_boundary chega.
                            if let Some(ref rewrite) = self.options.on_history_rewrite {
                                rewrite(messages_for_query.clone());
                            }
                            yield Ok(AgenticEvent::System {
                                subtype: "compact_boundary".to_string(),
                                data: serde_json::json!({
                                    "compact_metadata": { "trigger": "auto" }
                                }),
                                uuid: new_uuid(),
                                session_id: sid.clone(),
                            });
                        }
                        Err(_) => {
                            self.auto_compact.record_failure();
                            let next_failures = state.auto_compact_tracking.consecutive_failures + 1;
                            state.auto_compact_tracking.consecutive_failures = next_failures;
                        }
                    }
                }

                // ─── Blocking limit check ─────────────────────────────
                // Port: if (!compactionResult && querySource !== "compact" && ...) {
                //   if (isAtBlockingLimit) return yield error, { reason: "blocking_limit" }
                // }
                if !compaction_happened {
                    // A mesma contagem híbrida do autocompact — duas réguas
                    // divergindo é como se estoura a janela entre elas.
                    let token_count = context_token_count;
                    if is_at_blocking_limit(token_count, self.options.context_window_tokens) {
                        yield Ok(assistant_event(&AssistantMessage {
                            id: new_uuid(),
                            model: current_model.clone(),
                            content: vec![ContentBlock::text(
                                "I'm sorry, but the conversation has become too long. \
                                 Please start a new conversation or use /compact to reduce context.",
                            )],
                            stop_reason: StopReason::EndTurn,
                            usage: Usage::default(),
            api_error: None,
                        }, &sid));
                        yield Ok(AgenticEvent::Result {
                            subtype: "error_during_execution".to_string(),
                            duration_ms: start_time.elapsed().as_millis() as u64,
                            duration_api_ms: state.api_duration_ms,
                            is_error: true,
                            num_turns: state.turn_count,
                            result: None,
                            stop_reason: state.last_stop_reason.clone(),
                            total_cost_usd: state.total_cost_usd,
                            usage: state.total_usage.clone(),
                            model_usage: serialize_model_usage(&state.model_usage),
                            permission_denials: state.permission_denials.clone(),
                            errors: vec!["Prompt is too long".to_string()],
                            session_id: sid.clone(),
                            uuid: new_uuid(),
                        });
                        break;
                    }
                }

                // ─── Normalize messages for API ───────────────────────
                // Port: normalizeMessagesForAPI is called inside deps.callModel
                messages_for_query = normalize_messages_for_api(&messages_for_query);
                ensure_tool_result_pairing(&mut messages_for_query);

                // Os breakpoints de cache não são postos aqui: o AnthropicClient
                // os redistribui no corpo que sai (api::cache_breakpoints).

                // ─── Per-turn tracking ────────────────────────────────
                // Port: let assistantMessages = [], toolResults = [], toolUseBlocks = [],
                //       needsFollowUp = false
                let mut assistant_messages: Vec<AssistantMessage> = Vec::new();
                let mut tool_results: Vec<ApiMessage> = Vec::new();
                let mut tool_use_blocks: Vec<ToolUseBlock> = Vec::new();
                let mut needs_follow_up = false;
                // A entrega por bloco desta iteração (o `assistantMessages`
                // do JS guarda as mensagens por bloco; aqui ficam os uuids).
                let mut blocks = BlockEmitter::default();

                // Variables that survive the fallback loop
                let mut final_assistant: Option<AssistantMessage> = None;
                let mut stream_error: Option<String> = None;

                // ─── API call with fallback retry ─────────────────────
                // Port: let attemptWithFallback = true;
                //       while (attemptWithFallback) { attemptWithFallback = false; try { ... } }
                let mut attempt_with_fallback = true;
                // O `max_tokens` do request, para a mensagem de erro de
                // `max_output_tokens` do CLI.
                let mut request_max_tokens = 0u32;

                while attempt_with_fallback {
                    attempt_with_fallback = false;

                    let request = self.build_request(
                        &messages_for_query,
                        state.max_output_tokens_override,
                        &current_model,
                        user_context_message.as_ref(),
                    );
                    request_max_tokens = request.max_tokens;

                    let api_start = Instant::now();
                    let stream_result = self.client.create_message_with_fallback(request).await;

                    let mut event_stream = match stream_result {
                        Ok(s) => s,
                        Err(e) => {
                            state.api_duration_ms += api_start.elapsed().as_millis() as u64;
                            let err_str = format!("{e}");
                            let is_prompt_too_long_err = err_str.contains("prompt is too long")
                                || err_str.contains("too many tokens");

                            // Port: reactive compact on prompt-too-long
                            if is_prompt_too_long_err && !state.has_attempted_reactive_compact {
                                if let Some(ref pre_compact) = self.options.pre_compact_hook {
                                    pre_compact("reactive".to_string()).await;
                                }
                                match self.compaction_engine.compact(&messages_for_query, &self.sys_text()).await {
                                    Ok(compacted) => {
                                        let mut compacted_with_boundary = compacted;
                                        insert_compact_boundary(&mut compacted_with_boundary);
                                        self.post_compact_cleanup();
                                        state.messages = compacted_with_boundary;
                                        state.usage_anchor = None;
                                        state.has_attempted_reactive_compact = true;
                                        state.transition = Some(Transition::ReactiveCompactRetry);
                                        if let Some(ref rewrite) = self.options.on_history_rewrite {
                                            rewrite(state.messages.clone());
                                        }
                                        yield Ok(AgenticEvent::System {
                                            subtype: "compact_boundary".to_string(),
                                            data: serde_json::json!({
                                                "compact_metadata": { "trigger": "reactive" }
                                            }),
                                            uuid: new_uuid(),
                                            session_id: sid.clone(),
                                        });
                                        continue 'query_loop;
                                    }
                                    Err(_) => {
                                        // Reactive compact failed — fall through to error
                                    }
                                }
                            }

                            // Port: fallback model on overloaded
                            let is_overloaded = err_str.contains("overloaded") || err_str.contains("529");
                            if is_overloaded {
                                if let Some(ref fallback) = self.options.fallback_model {
                                    if *fallback != current_model {
                                        for ev in yield_missing_tool_result_blocks(&blocks.tool_sources, "Model fallback triggered", &sid) {
                                            yield Ok(ev);
                                        }
                                        blocks.tool_sources.clear();
                                        yield Ok(AgenticEvent::System {
                                            subtype: "model_fallback".to_string(),
                                            data: serde_json::json!({
                                                "original_model": current_model,
                                                "fallback_model": fallback,
                                            }),
                                            uuid: new_uuid(),
                                            session_id: sid.clone(),
                                        });
                                        current_model = fallback.clone();
                                        assistant_messages.clear();
                                        tool_use_blocks.clear();
                                        needs_follow_up = false;
                                        attempt_with_fallback = true;
                                        continue; // retry with fallback model
                                    }
                                }
                            }

                            stream_error = Some(err_str);
                            break; // exit fallback loop
                        }
                    };

                    // ─── Stream and accumulate response ───────────────
                    // Port: for await (let message of deps.callModel({...})) { ... }
                    let mut current_assistant_in_stream: Option<AssistantMessage> = None;

                    while let Some(update_result) = event_stream.next().await {
                        if self.abort.is_cancelled() {
                            break;
                        }

                        match update_result {
                            Ok(update) => {
                                if let StreamUpdate::ResponseStarted { ref request_id } = update {
                                    blocks.start_response(request_id.clone());
                                }

                                // O stream quebrou e a camada de API repete a
                                // chamada sem streaming (o `onStreamingFallback`
                                // do CLI): o que o stream já entregou vira
                                // órfão, como o `query` do CLI faz ao marcar
                                // essas mensagens como tombstone. A resposta
                                // da não-streaming chega inteira no
                                // `MessageComplete` seguinte, com o mesmo
                                // `request-id` do stream.
                                if let StreamUpdate::NonStreamingFallback { .. } = update {
                                    let request_id = blocks.request_id.clone();
                                    blocks.start_response(request_id);
                                    blocks.tool_sources.clear();
                                    assistant_messages.clear();
                                    tool_use_blocks.clear();
                                    needs_follow_up = false;
                                    current_assistant_in_stream = None;
                                    continue;
                                }

                                // Cada bloco que fecha sai já como mensagem de
                                // assistente (o `content_block_stop` do
                                // `queryModel`), antes do `stream_event` dele.
                                // O `tool_use` sai já normalizado
                                // (`normalizeContentFromAPI`), e é essa forma
                                // que o cliente, o transcript, a execução e o
                                // histórico enxergam.
                                if let StreamUpdate::ContentBlockComplete { ref block, .. } = update {
                                    let block = match block {
                                        ContentBlock::ToolUse { id, name, input } => {
                                            needs_follow_up = true;
                                            let normalized = self
                                                .tool_executor
                                                .normalize_tool_input(name, input.clone());
                                            blocks
                                                .normalized_inputs
                                                .push((id.clone(), normalized.clone()));
                                            ContentBlock::ToolUse {
                                                id: id.clone(),
                                                name: name.clone(),
                                                input: normalized,
                                            }
                                        }
                                        other => other.clone(),
                                    };
                                    yield Ok(blocks.block_event(&block, &current_model, &sid));
                                }

                                if let StreamUpdate::MessageComplete { ref message } = update {
                                    let mut message = message.clone();
                                    for block in &mut message.content {
                                        if let ContentBlock::ToolUse { id, name, input } = block {
                                            let normalized = match blocks
                                                .normalized_inputs
                                                .iter()
                                                .find(|(done, _)| done == id)
                                            {
                                                Some((_, value)) => value.clone(),
                                                None => self
                                                    .tool_executor
                                                    .normalize_tool_input(name, input.clone()),
                                            };
                                            *input = normalized;
                                        }
                                    }
                                    current_assistant_in_stream = Some(message);
                                }

                                if let StreamUpdate::RawEvent { ref event } = update {
                                    blocks.observe(event);
                                }

                                // Yield streaming events
                                // Só o evento SSE cru vira `stream_event`, como o
                                // `queryModel` do CLI repassa.
                                if let (true, StreamUpdate::RawEvent { event }) =
                                    (self.options.include_stream_events, update)
                                {
                                    yield Ok(AgenticEvent::StreamEvent {
                                        event,
                                        parent_tool_use_id: None,
                                        uuid: new_uuid(),
                                        session_id: sid.clone(),
                                    });
                                }
                            }
                            Err(e) => {
                                let err_str = format!("{e}");

                                // Port: FallbackTriggeredError during streaming
                                let is_overloaded = err_str.contains("overloaded") || err_str.contains("529");
                                if is_overloaded {
                                    if let Some(ref fallback) = self.options.fallback_model {
                                        if *fallback != current_model {
                                            for ev in yield_missing_tool_result_blocks(&blocks.tool_sources, "Model fallback triggered", &sid) {
                                                yield Ok(ev);
                                            }
                                            blocks.tool_sources.clear();
                                            yield Ok(AgenticEvent::System {
                                                subtype: "model_fallback".to_string(),
                                                data: serde_json::json!({
                                                    "original_model": current_model,
                                                    "fallback_model": fallback,
                                                }),
                                                uuid: new_uuid(),
                                                session_id: sid.clone(),
                                            });
                                            current_model = fallback.clone();
                                            assistant_messages.clear();
                                            tool_use_blocks.clear();
                                            needs_follow_up = false;
                                            attempt_with_fallback = true;
                                            break; // break streaming, retry
                                        }
                                    }
                                }

                                // O stream quebrado já foi repetido sem
                                // streaming pela camada de API; um erro que
                                // chega até aqui (a não-streaming também
                                // falhou, ou o fallback está desligado)
                                // encerra o turno, como no CLI.
                                if !attempt_with_fallback {
                                    stream_error = Some(err_str);
                                }
                                break;
                            }
                        }
                    }

                    state.api_duration_ms += api_start.elapsed().as_millis() as u64;

                    if attempt_with_fallback {
                        continue; // retry with fallback
                    }

                    final_assistant = current_assistant_in_stream;
                } // end while attempt_with_fallback

                // ─── Handle stream/API error ──────────────────────────
                // Port: catch (error) { yield* yieldMissingToolResultBlocks(...); yield error; return }
                if let Some(ref err_str) = stream_error {
                    for ev in yield_missing_tool_result_blocks(&blocks.tool_sources, err_str, &sid) {
                        yield Ok(ev);
                    }
                    yield Ok(AgenticEvent::Result {
                        subtype: "error_during_execution".to_string(),
                        duration_ms: start_time.elapsed().as_millis() as u64,
                        duration_api_ms: state.api_duration_ms,
                        is_error: true,
                        num_turns: state.turn_count,
                        result: None,
                        stop_reason: state.last_stop_reason.clone(),
                        total_cost_usd: state.total_cost_usd,
                        usage: state.total_usage.clone(),
                        model_usage: serialize_model_usage(&state.model_usage),
                        permission_denials: state.permission_denials.clone(),
                        errors: vec![err_str.clone()],
                        session_id: sid.clone(),
                        uuid: new_uuid(),
                    });
                    break;
                }

                // ─── Handle abort during streaming ────────────────────
                // Port: if (toolUseContext.abortController.signal.aborted) {
                //   yield* yieldMissingToolResultBlocks(assistantMessages, "Interrupted by user");
                //   return { reason: "aborted_streaming" }
                // }
                if self.abort.is_cancelled() {
                    for ev in yield_missing_tool_result_blocks(&blocks.tool_sources, "Interrupted by user", &sid) {
                        yield Ok(ev);
                    }
                    yield Ok(AgenticEvent::Result {
                        subtype: "error_during_execution".to_string(),
                        duration_ms: start_time.elapsed().as_millis() as u64,
                        duration_api_ms: state.api_duration_ms,
                        is_error: true,
                        num_turns: state.turn_count,
                        result: None,
                        stop_reason: state.last_stop_reason.clone(),
                        total_cost_usd: state.total_cost_usd,
                        usage: state.total_usage.clone(),
                        model_usage: serialize_model_usage(&state.model_usage),
                        permission_denials: state.permission_denials.clone(),
                        errors: vec!["Interrupted by user".to_string()],
                        session_id: sid.clone(),
                        uuid: new_uuid(),
                    });
                    break;
                }

                // ─── Process assistant message ────────────────────────
                let assistant_msg = match final_assistant {
                    Some(msg) => msg,
                    None => {
                        yield Ok(AgenticEvent::Result {
                            subtype: "error_during_execution".to_string(),
                            duration_ms: start_time.elapsed().as_millis() as u64,
                            duration_api_ms: state.api_duration_ms,
                            is_error: true,
                            num_turns: state.turn_count,
                            result: None,
                            stop_reason: state.last_stop_reason.clone(),
                            total_cost_usd: state.total_cost_usd,
                            usage: state.total_usage.clone(),
                            model_usage: serialize_model_usage(&state.model_usage),
                            permission_denials: state.permission_denials.clone(),
                            errors: vec!["Stream ended without message_stop".to_string()],
                            session_id: sid.clone(),
                            uuid: new_uuid(),
                        });
                        break;
                    }
                };

                // Âncora de contagem real: o input desta resposta cobre TUDO
                // que foi enviado (messages_for_query), e o output vira parte
                // do contexto seguinte.
                {
                    let u = &assistant_msg.usage;
                    let context_tokens = u64::from(u.input_tokens)
                        + u64::from(u.cache_read_input_tokens.unwrap_or(0))
                        + u64::from(u.cache_creation_input_tokens.unwrap_or(0))
                        + u64::from(u.output_tokens);
                    state.usage_anchor = Some((messages_for_query.len(), context_tokens));
                }

                // Accumulate usage and cost
                state.total_usage.accumulate(&assistant_msg.usage);
                state.total_cost_usd += calculate_cost(&current_model, &assistant_msg.usage);

                // Accumulate per-model usage
                state.model_usage
                    .entry(current_model.clone())
                    .or_default()
                    .accumulate(&assistant_msg.usage);

                // Capture stop_reason
                state.last_stop_reason = stop_reason_str(&assistant_msg.stop_reason);

                // Collect tool_use blocks from this message
                let msg_tool_uses = assistant_msg.tool_use_blocks();
                if !msg_tool_uses.is_empty() {
                    tool_use_blocks.extend(msg_tool_uses);
                    needs_follow_up = true;
                }

                // ─── Withheld max_output_tokens check ─────────────────
                // Port: if (isWithheldMaxOutputTokens(message)) withheld = true
                // We withhold (don't yield) the assistant message if it's a
                // max_output_tokens stop and there are no tool calls.
                let is_withheld = is_withheld_max_output_tokens(&assistant_msg) && !needs_follow_up;

                // Os blocos já saíram um a um; o que falta é o fechamento
                // (`message_delta`). Uma resposta que não veio por bloco (o
                // fallback não streamado) sai inteira, e um erro de API
                // sintetizado de prompt longo fica retido (o `isWithheld413`
                // do JS) até a compactação reativa decidir.
                if let Some(final_event) = blocks.final_event() {
                    yield Ok(final_event);
                } else if !is_prompt_too_long_message(&assistant_msg) {
                    yield Ok(blocks.whole_message_event(&assistant_msg, &sid));
                }

                assistant_messages.push(assistant_msg.clone());

                // ═══════════════════════════════════════════════════════
                // Port: if (!needsFollowUp) { ... }
                // ═══════════════════════════════════════════════════════
                if !needs_follow_up {
                    // ─── Withheld prompt-too-long (413) check ─────────
                    // Port: isWithheld413 = isApiErrorMessage && isPromptTooLongMessage(lastMessage)
                    // When the API returns a prompt-too-long error as an assistant message
                    // (rather than as an HTTP error), attempt reactive compaction.
                    if is_prompt_too_long_message(&assistant_msg) {
                        if !state.has_attempted_reactive_compact {
                            if let Some(ref pre_compact) = self.options.pre_compact_hook {
                                pre_compact("reactive_413".to_string()).await;
                            }
                            match self.compaction_engine.compact(&messages_for_query, &self.sys_text()).await {
                                Ok(compacted) => {
                                    let mut compacted_with_boundary = compacted;
                                    insert_compact_boundary(&mut compacted_with_boundary);
                                    self.post_compact_cleanup();
                                    state.messages = compacted_with_boundary;
                                    state.has_attempted_reactive_compact = true;
                                    state.transition = Some(Transition::ReactiveCompactRetry);
                                    if let Some(ref rewrite) = self.options.on_history_rewrite {
                                        rewrite(state.messages.clone());
                                    }
                                    yield Ok(AgenticEvent::System {
                                        subtype: "compact_boundary".to_string(),
                                        data: serde_json::json!({
                                            "compact_metadata": { "trigger": "reactive_413" }
                                        }),
                                        uuid: new_uuid(),
                                        session_id: sid.clone(),
                                    });
                                    continue 'query_loop;
                                }
                                Err(_) => {
                                    // Reactive compact failed — surface the error message and break
                                }
                            }
                        }
                        // Compact not attempted or failed — yield error and break
                        // Port: return yield lastMessage, { reason: "prompt_too_long" }
                        yield Ok(blocks.whole_message_event(&assistant_msg, &sid));
                        yield Ok(AgenticEvent::Result {
                            subtype: "error_during_execution".to_string(),
                            duration_ms: start_time.elapsed().as_millis() as u64,
                            duration_api_ms: state.api_duration_ms,
                            is_error: true,
                            num_turns: state.turn_count,
                            result: None,
                            stop_reason: Some("prompt_too_long".to_string()),
                            total_cost_usd: state.total_cost_usd,
                            usage: state.total_usage.clone(),
                            model_usage: serialize_model_usage(&state.model_usage),
                            permission_denials: state.permission_denials.clone(),
                            errors: vec!["Prompt is too long".to_string()],
                            session_id: sid.clone(),
                            uuid: new_uuid(),
                        });
                        break;
                    }

                    // ─── Max output tokens recovery ───────────────────
                    // Port: if (isWithheldMaxOutputTokens(lastMessage)) {
                    //   if (maxOutputTokensRecoveryCount < MAX_OUTPUT_TOKENS_RECOVERY_LIMIT) {
                    //     let recoveryMessage = createUserMessage({content: "..."});
                    //     state3 = {...}; continue;
                    //   }
                    //   yield lastMessage;  // Surface the withheld error
                    // }
                    if is_withheld {
                        if state.max_output_tokens_recovery_count < MAX_OUTPUT_TOKENS_RECOVERY_LIMIT {
                            let recovery_msg = ApiMessage::user(vec![ContentBlock::text(
                                "Output token limit hit. Resume directly \u{2014} no apology, no recap \
                                 of what you were doing. Pick up mid-thought if that is where the \
                                 cut happened. Break remaining work into smaller pieces.",
                            )]);

                            state.messages = messages_for_query;
                            state.messages.push(assistant_msg.to_api_message());
                            state.messages.push(recovery_msg);
                            state.max_output_tokens_recovery_count += 1;
                            state.max_output_tokens_override = None;
                            state.transition = Some(Transition::MaxOutputTokensRecovery {
                                attempt: state.max_output_tokens_recovery_count,
                            });
                            continue 'query_loop;
                        }

                        // Recuperação esgotada: sai o erro de API que o
                        // `queryModel` montou e o loop vinha retendo.
                        yield Ok(max_output_tokens_error_event(request_max_tokens, &sid));
                    }

                    // ─── API error message check ─────────────────────
                    // Port: if (lastMessage?.isApiErrorMessage) return { reason: "completed" }
                    // If the assistant message is itself an API error (e.g. from a non-streaming
                    // fallback that surfaced an error as text), skip stop hooks and return.
                    {
                        // Flag estrutural da camada de API (nunca o texto do
                        // modelo): só uma mensagem SINTETIZADA como erro pula
                        // os stop hooks.
                        let is_api_error_msg = assistant_msg.api_error.is_some();
                        if is_api_error_msg {
                            let last_text = assistant_msg.text();
                            yield Ok(AgenticEvent::Result {
                                subtype: "success".to_string(),
                                duration_ms: start_time.elapsed().as_millis() as u64,
                                duration_api_ms: state.api_duration_ms,
                                is_error: false,
                                num_turns: state.turn_count,
                                result: Some(last_text),
                                stop_reason: state.last_stop_reason.clone(),
                                total_cost_usd: state.total_cost_usd,
                                usage: state.total_usage.clone(),
                                model_usage: serialize_model_usage(&state.model_usage),
                                permission_denials: state.permission_denials.clone(),
                                errors: Vec::new(),
                                session_id: sid.clone(),
                                uuid: new_uuid(),
                            });
                            break;
                        }
                    }

                    // ─── Stop hook ────────────────────────────────────
                    // Port: handleStopHooks() — run user-provided callback
                    // before declaring the turn completed.
                    if let Some(ref stop_hook) = self.options.stop_hook {
                        let hook_ctx = StopHookContext {
                            messages: messages_for_query.iter()
                                .chain(std::iter::once(&assistant_msg.to_api_message()))
                                .cloned()
                                .collect(),
                            system_prompt: self.options.system_prompt.clone(),
                            turn_count: state.turn_count,
                        };
                        let hook_result = stop_hook(hook_ctx).await;

                        if hook_result.prevent_continuation {
                            yield Ok(AgenticEvent::Result {
                                subtype: "success".to_string(),
                                duration_ms: start_time.elapsed().as_millis() as u64,
                                duration_api_ms: state.api_duration_ms,
                                is_error: false,
                                num_turns: state.turn_count,
                                result: Some(assistant_msg.text()),
                                stop_reason: Some("stop_hook_prevented".to_string()),
                                total_cost_usd: state.total_cost_usd,
                                usage: state.total_usage.clone(),
                                model_usage: serialize_model_usage(&state.model_usage),
                                permission_denials: state.permission_denials.clone(),
                                errors: Vec::new(),
                                session_id: sid.clone(),
                                uuid: new_uuid(),
                            });
                            break;
                        }

                        if !hook_result.blocking_messages.is_empty() {
                            let mut next_messages = messages_for_query;
                            next_messages.push(assistant_msg.to_api_message());

                            // O `createUserMessage({content, isMeta: true})`
                            // do `handleStopHooks`.
                            for blocking_msg in &hook_result.blocking_messages {
                                let mut event = user_event(blocking_msg.clone(), &sid);
                                if let AgenticEvent::User { is_meta, .. } = &mut event {
                                    *is_meta = true;
                                }
                                yield Ok(event);
                            }

                            next_messages.extend(hook_result.blocking_messages);
                            state.messages = next_messages;
                            state.stop_hook_active = Some(true);
                            state.transition = Some(Transition::StopHookBlocking);
                            continue 'query_loop;
                        }
                    }

                    // ─── Completed — yield success result ─────────────
                    // Port: return { reason: "completed" }
                    let last_text = assistant_msg.text();
                    yield Ok(AgenticEvent::Result {
                        subtype: "success".to_string(),
                        duration_ms: start_time.elapsed().as_millis() as u64,
                        duration_api_ms: state.api_duration_ms,
                        is_error: false,
                        num_turns: state.turn_count,
                        result: Some(last_text),
                        stop_reason: state.last_stop_reason.clone(),
                        total_cost_usd: state.total_cost_usd,
                        usage: state.total_usage.clone(),
                        model_usage: serialize_model_usage(&state.model_usage),
                        permission_denials: state.permission_denials.clone(),
                        errors: Vec::new(),
                        session_id: sid.clone(),
                        uuid: new_uuid(),
                    });
                    break;
                }

                // ═══════════════════════════════════════════════════════
                // Port: needsFollowUp is true — execute tools
                // Port: let toolUpdates = runTools(toolUseBlocks, assistantMessages, ...)
                // ═══════════════════════════════════════════════════════

                // Stream tool results incrementally — yield each as it completes
                let mut all_execution_results: Vec<crate::tools::framework::ToolExecutionResult> = Vec::new();
                // As mensagens `isMeta` que as tools anexam depois do próprio
                // tool_result (`result.newMessages`), na ordem em que saíram.
                let mut meta_messages: Vec<ApiMessage> = Vec::new();
                // O turno foi interrompido por um deny com `interrupt: true`
                // (e não pelo interrupt do cliente): no JS o `abort()` desse
                // caso não tem o motivo "interrupt", e o loop emite a
                // mensagem de interrupção antes de encerrar.
                let mut interrupted_by_denial = false;
                {
                    use futures::stream::StreamExt as _;
                    let mut result_stream = self.tool_executor.execute_all_stream(tool_use_blocks.clone());
                    while let Some(exec_result) = result_stream.next().await {
                        // Yield an individual tool_result message for each completed tool
                        let single_msg = self.tool_executor.build_tool_results_message(vec![exec_result.clone()]);
                        // O frame leva o `toolUseResult` da tool, como o JS.
                        yield Ok(AgenticEvent::User {
                            message: single_msg,
                            parent_tool_use_id: None,
                            uuid: new_uuid(),
                            session_id: sid.clone(),
                            timestamp: now_timestamp(),
                            tool_use_result: exec_result.result.tool_use_result.clone(),
                            // O bloco de assistente que pediu a tool: é o pai
                            // desta entrada no transcript.
                            source_tool_assistant_uuid: blocks.source_of(&exec_result.tool_use_id),
                            is_meta: false,
                        });
                        // Port: `checkPermissionsAndCallTool` empurra cada
                        // `result.newMessages` logo depois do tool_result da
                        // mesma tool; são mensagens `isMeta` (o documento do
                        // PDF, as páginas extraídas, a nota da imagem
                        // redimensionada) e é assim que o conteúdo chega ao
                        // modelo.
                        for message in &exec_result.result.new_messages {
                            yield Ok(AgenticEvent::User {
                                message: message.clone(),
                                parent_tool_use_id: None,
                                uuid: new_uuid(),
                                session_id: sid.clone(),
                                timestamp: now_timestamp(),
                                tool_use_result: None,
                                source_tool_assistant_uuid: None,
                                is_meta: true,
                            });
                            meta_messages.push(message.clone());
                        }
                        // Port: deny com `interrupt` chama
                        // `toolUseContext.abortController.abort()` na hora. O
                        // transporte que decide a permissão pode já ter
                        // cancelado; cancelar de novo não muda nada.
                        if exec_result.interrupt && exec_result.denied {
                            interrupted_by_denial = true;
                            self.abort.cancel();
                        }
                        all_execution_results.push(exec_result);
                    }
                }

                // Record permission denials structurally — the executor marks
                // them, so no error-text sniffing is involved. Results are
                // matched by tool_use_id because the executor reorders
                // (concurrency-safe tools run first).
                for exec_result in all_execution_results.iter().filter(|r| r.denied) {
                    if let Some(tu) = tool_use_blocks.iter().find(|tu| tu.id == exec_result.tool_use_id) {
                        state.permission_denials.push(serde_json::json!({
                            "tool_name": tu.name,
                            "tool_use_id": tu.id,
                            "tool_input": tu.input,
                        }));
                    }
                }

                // Build combined tool_results message for conversation history
                let tool_results_msg = self.tool_executor.build_tool_results_message(all_execution_results);
                tool_results.push(tool_results_msg.clone());
                // As mensagens meta vão ao histórico DEPOIS do bloco de
                // tool_results: no JS elas se fundem com os resultados na
                // normalização para a API, e o `hoistToolResults` põe os
                // tool_result na frente, que é esta mesma ordem.
                tool_results.extend(meta_messages);

                // ─── Track file reads for post-compact restoration ───
                for tu in &tool_use_blocks {
                    if tu.name == "Read" || tu.name == "FileRead" {
                        if let Some(file_path) = tu.input.get("file_path").and_then(|v| v.as_str()) {
                            self.read_file_tracker.track_read(file_path);
                        }
                    }
                }

                // ─── Abort check after tool execution ─────────────────
                // Port: if (toolUseContext.abortController.signal.aborted) {
                //   return { reason: "aborted_tools" }
                // }
                if self.abort.is_cancelled() {
                    // Port: `if (signal.reason !== "interrupt") yield
                    // createUserInterruptionMessage({ toolUse: true })`. O
                    // interrupt do cliente não gera a mensagem; o deny com
                    // `interrupt` gera, e ela fica no histórico do próximo
                    // turno.
                    if interrupted_by_denial {
                        yield Ok(AgenticEvent::User {
                            message: ApiMessage::user(vec![ContentBlock::text(
                                crate::tools::framework::INTERRUPT_MESSAGE_FOR_TOOL_USE,
                            )]),
                            parent_tool_use_id: None,
                            uuid: new_uuid(),
                            session_id: sid.clone(),
                            timestamp: now_timestamp(),
                            tool_use_result: None,
                            source_tool_assistant_uuid: None,
                            is_meta: false,
                        });
                    }
                    yield Ok(AgenticEvent::Result {
                        subtype: "error_during_execution".to_string(),
                        duration_ms: start_time.elapsed().as_millis() as u64,
                        duration_api_ms: state.api_duration_ms,
                        is_error: true,
                        num_turns: state.turn_count,
                        result: None,
                        stop_reason: state.last_stop_reason.clone(),
                        total_cost_usd: state.total_cost_usd,
                        usage: state.total_usage.clone(),
                        model_usage: serialize_model_usage(&state.model_usage),
                        permission_denials: state.permission_denials.clone(),
                        errors: vec!["Interrupted by user".to_string()],
                        session_id: sid.clone(),
                        uuid: new_uuid(),
                    });
                    break;
                }

                // ─── Post-compact tracking ────────────────────────────
                // Port: if (tracking?.compacted) tracking.turnCounter++
                if state.auto_compact_tracking.compacted {
                    state.auto_compact_tracking.turn_counter += 1;
                }

                // ─── Max turns check ──────────────────────────────────
                // Port: let nextTurnCount = turnCount + 1;
                //       if (maxTurns && nextTurnCount > maxTurns) return { reason: "max_turns" }
                let next_turn_count = state.turn_count + 1;
                if let Some(max) = self.options.max_turns {
                    if next_turn_count > max {
                        yield Ok(AgenticEvent::Result {
                            subtype: "error_max_turns".to_string(),
                            duration_ms: start_time.elapsed().as_millis() as u64,
                            duration_api_ms: state.api_duration_ms,
                            is_error: true,
                            num_turns: next_turn_count,
                            result: None,
                            stop_reason: state.last_stop_reason.clone(),
                            total_cost_usd: state.total_cost_usd,
                            usage: state.total_usage.clone(),
                            model_usage: serialize_model_usage(&state.model_usage),
                            permission_denials: state.permission_denials.clone(),
                            errors: vec![format!("Reached maximum number of turns ({max})")],
                            session_id: sid.clone(),
                            uuid: new_uuid(),
                        });
                        break;
                    }
                }

                // ─── Prepare next iteration ───────────────────────────
                // Port: state3 = {
                //   messages: [...messagesForQuery, ...assistantMessages, ...toolResults],
                //   turnCount: nextTurnCount,
                //   maxOutputTokensRecoveryCount: 0,
                //   hasAttemptedReactiveCompact: false,
                //   transition: { reason: "next_turn" }
                // }
                let mut next_messages = messages_for_query;
                next_messages.push(assistant_msg.to_api_message());
                next_messages.extend(tool_results);

                state.messages = next_messages;
                state.turn_count = next_turn_count;
                state.max_output_tokens_recovery_count = 0;
                state.has_attempted_reactive_compact = false;
                state.max_output_tokens_override = None;
                state.transition = Some(Transition::NextTurn);
            } // end 'query_loop
        })
    }
}

// ---------------------------------------------------------------------------
// Convenience functions
// ---------------------------------------------------------------------------

pub fn agentic_query(
    client: AnthropicClient,
    prompt: &str,
    tool_executor: ToolExecutor,
    options: AgenticLoopOptions,
) -> Pin<Box<dyn Stream<Item = Result<AgenticEvent>> + Send>> {
    let mut opts = options;
    opts.initial_messages
        .push(ApiMessage::user(vec![ContentBlock::text(prompt)]));
    let agentic_loop = AgenticLoop::new(client, tool_executor, opts);
    agentic_loop.stream()
}

pub async fn agentic_query_collect(
    client: AnthropicClient,
    prompt: &str,
    tool_executor: ToolExecutor,
    options: AgenticLoopOptions,
) -> Result<Vec<AgenticEvent>> {
    let stream = agentic_query(client, prompt, tool_executor, options);
    tokio::pin!(stream);
    let mut events = Vec::new();
    while let Some(result) = stream.next().await {
        events.push(result?);
    }
    Ok(events)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_stop_reason_str() {
        assert_eq!(
            stop_reason_str(&StopReason::EndTurn),
            Some("end_turn".to_string())
        );
        assert_eq!(
            stop_reason_str(&StopReason::ToolUse),
            Some("tool_use".to_string())
        );
        assert_eq!(
            stop_reason_str(&StopReason::MaxTokens),
            Some("max_tokens".to_string())
        );
    }

    #[test]
    fn test_query_usage_accumulate() {
        let mut u = QueryUsage::default();
        u.accumulate(&Usage {
            input_tokens: 100,
            output_tokens: 50,
            cache_read_input_tokens: Some(10),
            cache_creation_input_tokens: None,
        });
        assert_eq!(u.input_tokens, 100);
        assert_eq!(u.output_tokens, 50);
        assert_eq!(u.cache_read_input_tokens, 10);
    }

    #[test]
    fn test_result_event_serialization() {
        let event = AgenticEvent::Result {
            subtype: "success".to_string(),
            duration_ms: 1234,
            duration_api_ms: 1000,
            is_error: false,
            num_turns: 3,
            result: Some("hello".to_string()),
            stop_reason: Some("end_turn".to_string()),
            total_cost_usd: 0.01,
            usage: QueryUsage::default(),
            model_usage: None,
            permission_denials: Vec::new(),
            errors: Vec::new(),
            session_id: "sess-123".to_string(),
            uuid: "uuid-456".to_string(),
        };
        let json = serde_json::to_value(&event).unwrap();
        assert_eq!(json["type"], "result");
        assert_eq!(json["subtype"], "success");
        assert_eq!(json["stop_reason"], "end_turn");
        assert_eq!(json["session_id"], "sess-123");
    }

    #[test]
    fn test_options_default() {
        let opts = AgenticLoopOptions::default();
        assert_eq!(opts.max_tokens, 16384);
        assert!(opts.max_turns.is_none());
        assert!(opts.fallback_model.is_none());
    }

    #[test]
    fn test_yield_missing_tool_result_blocks() {
        let mut blocks = BlockEmitter::default();
        blocks.start_response(Some("req_1".to_string()));
        blocks.observe(&serde_json::json!({
            "type": "message_start",
            "message": {"id": "msg_1", "type": "message", "role": "assistant", "model": "m",
                        "content": [], "stop_reason": null, "stop_sequence": null,
                        "usage": {"input_tokens": 3, "output_tokens": 1}}
        }));
        let first = blocks.block_event(
            &ContentBlock::tool_use("t1", "Bash", serde_json::json!({})),
            "m",
            "s",
        );
        blocks.block_event(
            &ContentBlock::tool_use("t2", "Read", serde_json::json!({})),
            "m",
            "s",
        );
        let AgenticEvent::Assistant {
            uuid: first_uuid,
            message,
            request_id,
            ..
        } = first
        else {
            panic!("bloco sem mensagem de assistente");
        };
        assert_eq!(message["id"], "msg_1");
        assert_eq!(message["content"][0]["id"], "t1");
        assert_eq!(request_id.as_deref(), Some("req_1"));

        let results = yield_missing_tool_result_blocks(&blocks.tool_sources, "Interrupted", "s");
        assert_eq!(results.len(), 2);
        for r in &results {
            let AgenticEvent::User {
                message,
                tool_use_result,
                ..
            } = r
            else {
                panic!("resultado sem mensagem de usuário");
            };
            assert_eq!(message.role, Role::User);
            assert!(matches!(
                &message.content[0],
                ContentBlock::ToolResult {
                    is_error: Some(true),
                    ..
                }
            ));
            assert_eq!(
                tool_use_result.as_ref(),
                Some(&serde_json::json!("Interrupted"))
            );
        }
        let AgenticEvent::User {
            source_tool_assistant_uuid,
            ..
        } = &results[0]
        else {
            unreachable!()
        };
        assert_eq!(source_tool_assistant_uuid.as_ref(), Some(&first_uuid));

        blocks.observe(&serde_json::json!({
            "type": "message_delta",
            "delta": {"stop_reason": "tool_use"},
            "usage": {"output_tokens": 9}
        }));
        let Some(AgenticEvent::AssistantFinal {
            message_id,
            stop_reason,
            usage,
        }) = blocks.final_event()
        else {
            panic!("sem fechamento");
        };
        assert_eq!(message_id, "msg_1");
        assert_eq!(stop_reason.as_deref(), Some("tool_use"));
        assert_eq!(usage["input_tokens"], 3);
        assert_eq!(usage["output_tokens"], 9);
        assert_eq!(usage["service_tier"], "standard");
    }

    #[test]
    fn test_is_at_blocking_limit() {
        assert!(!is_at_blocking_limit(100_000, 200_000));
        assert!(is_at_blocking_limit(198_000, 200_000));
        assert!(is_at_blocking_limit(200_000, 200_000));
    }

    #[test]
    fn test_is_prompt_too_long_message() {
        // A detecção é pela flag ESTRUTURAL da camada de API...
        let ptl_msg = AssistantMessage {
            id: "msg_1".to_string(),
            model: "test".to_string(),
            content: vec![ContentBlock::text(
                "Error: prompt is too long (200000 tokens > 128000 max)",
            )],
            stop_reason: StopReason::EndTurn,
            usage: Usage::default(),
            api_error: Some("prompt_too_long".to_string()),
        };
        assert!(is_prompt_too_long_message(&ptl_msg));

        // ...e NUNCA pelo texto: o modelo ESCREVENDO sobre o erro (um
        // rationale citando "prompt is too long") não dispara compactação.
        let text_only = AssistantMessage {
            api_error: None,
            ..ptl_msg.clone()
        };
        assert!(!is_prompt_too_long_message(&text_only));

        let normal_msg = AssistantMessage {
            id: "msg_2".to_string(),
            model: "test".to_string(),
            content: vec![ContentBlock::text("Hello, how can I help?")],
            stop_reason: StopReason::EndTurn,
            usage: Usage::default(),
            api_error: None,
        };
        assert!(!is_prompt_too_long_message(&normal_msg));

        // Texto sobre tokens sem a flag: também NÃO é sinal de erro.
        let tokens_msg = AssistantMessage {
            id: "msg_3".to_string(),
            model: "test".to_string(),
            content: vec![ContentBlock::text("too many tokens in the request")],
            stop_reason: StopReason::EndTurn,
            usage: Usage::default(),
            api_error: None,
        };
        assert!(!is_prompt_too_long_message(&tokens_msg));
    }

    #[test]
    fn test_compact_boundary_message_detection() {
        let boundary = ApiMessage::user(vec![ContentBlock::text(COMPACT_BOUNDARY_MARKER)]);
        assert!(is_compact_boundary_message(&boundary));

        let normal = ApiMessage::user(vec![ContentBlock::text("Hello")]);
        assert!(!is_compact_boundary_message(&normal));

        let assistant = ApiMessage::assistant(vec![ContentBlock::text(COMPACT_BOUNDARY_MARKER)]);
        assert!(!is_compact_boundary_message(&assistant));

        let multi_block = ApiMessage::user(vec![
            ContentBlock::text(COMPACT_BOUNDARY_MARKER),
            ContentBlock::text("extra"),
        ]);
        assert!(!is_compact_boundary_message(&multi_block));
    }

    #[test]
    fn test_get_messages_after_compact_boundary() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("old message 1")]),
            ApiMessage::assistant(vec![ContentBlock::text("old response 1")]),
            ApiMessage::user(vec![ContentBlock::text(COMPACT_BOUNDARY_MARKER)]),
            ApiMessage::user(vec![ContentBlock::text("summary after compact")]),
            ApiMessage::assistant(vec![ContentBlock::text("new response")]),
        ];
        let result = get_messages_after_compact_boundary(&messages);
        assert_eq!(result.len(), 3);
        assert!(is_compact_boundary_message(&result[0]));
    }

    #[test]
    fn test_get_messages_after_compact_boundary_no_boundary() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("hello")]),
            ApiMessage::assistant(vec![ContentBlock::text("hi")]),
        ];
        let result = get_messages_after_compact_boundary(&messages);
        assert_eq!(result.len(), 2);
    }

    #[test]
    fn test_get_messages_after_compact_boundary_multiple_boundaries() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text(COMPACT_BOUNDARY_MARKER)]),
            ApiMessage::user(vec![ContentBlock::text("first compact summary")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 1")]),
            ApiMessage::user(vec![ContentBlock::text(COMPACT_BOUNDARY_MARKER)]),
            ApiMessage::user(vec![ContentBlock::text("second compact summary")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 2")]),
        ];
        let result = get_messages_after_compact_boundary(&messages);
        // Should slice from the LAST boundary (index 3)
        assert_eq!(result.len(), 3);
        assert!(is_compact_boundary_message(&result[0]));
    }

    #[test]
    fn test_insert_compact_boundary() {
        let mut messages = vec![ApiMessage::user(vec![ContentBlock::text("summary")])];
        insert_compact_boundary(&mut messages);
        assert_eq!(messages.len(), 2);
        assert!(is_compact_boundary_message(&messages[0]));
    }
}
