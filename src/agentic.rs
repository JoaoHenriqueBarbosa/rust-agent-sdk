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
use crate::messages::api_format::inject_cache_control;
use crate::messages::normalize::{apply_tool_result_budget_default_persisting, ensure_tool_result_pairing, normalize_messages_for_api};
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
    dyn Fn(StopHookContext) -> Pin<Box<dyn Future<Output = StopHookResult> + Send>>
        + Send
        + Sync,
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
    #[serde(rename = "assistant")]
    Assistant {
        /// Nested message object matching TS SDK shape:
        /// { id, role, model, content, stop_reason, usage, type: "message" }
        message: serde_json::Value,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
    },

    #[serde(rename = "user")]
    User {
        message: ApiMessage,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
    },

    #[serde(rename = "stream_event")]
    StreamEvent {
        event: StreamUpdate,
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
const COMPACT_BOUNDARY_MARKER: &str = "[COMPACT_BOUNDARY]";

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
    messages.insert(0, ApiMessage::user(vec![ContentBlock::text(COMPACT_BOUNDARY_MARKER)]));
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
            usize::try_from(context_tokens).unwrap_or(usize::MAX).saturating_add(delta)
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

/// Port of yieldMissingToolResultBlocks from query.ts
/// Creates error tool_result messages for all tool_use blocks in assistant messages
/// that don't have a matching result yet.
fn yield_missing_tool_result_blocks(
    assistant_messages: &[AssistantMessage],
    error_message: &str,
) -> Vec<ApiMessage> {
    let mut result_messages = Vec::new();
    for assistant_msg in assistant_messages {
        for block in &assistant_msg.content {
            if let ContentBlock::ToolUse { id, .. } = block {
                result_messages.push(ApiMessage::user(vec![ContentBlock::ToolResult {
                    tool_use_id: id.clone(),
                    content: Some(vec![ToolResultContent::text(error_message)]),
                    is_error: Some(true),
                    cache_control: None,
                }]));
            }
        }
    }
    result_messages
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
    ) -> CreateMessageRequest {
        let tool_definitions = self.tool_executor.registry.api_definitions();
        CreateMessageRequest {
            model: model.to_string(),
            max_tokens: max_tokens_override.unwrap_or(self.options.max_tokens),
            messages: messages.to_vec(),
            system: if self.options.system_prompt.is_empty() {
                None
            } else {
                Some(self.options.system_prompt.clone())
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

            // Yield system init
            yield Ok(AgenticEvent::System {
                subtype: "init".to_string(),
                data: serde_json::json!({
                    "model": current_model,
                    "tools": self.tool_executor.registry.names(),
                    "cwd": self.tool_executor.context.working_directory.display().to_string(),
                    "permissionMode": format!("{:?}", self.tool_executor.context.permission_mode),
                }),
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

                // ─── Inject cache_control ─────────────────────────────
                inject_cache_control(&mut messages_for_query, &mut self.options.system_prompt);

                // ─── Per-turn tracking ────────────────────────────────
                // Port: let assistantMessages = [], toolResults = [], toolUseBlocks = [],
                //       needsFollowUp = false
                let mut assistant_messages: Vec<AssistantMessage> = Vec::new();
                let mut tool_results: Vec<ApiMessage> = Vec::new();
                let mut tool_use_blocks: Vec<ToolUseBlock> = Vec::new();
                let mut needs_follow_up = false;

                // Variables that survive the fallback loop
                let mut final_assistant: Option<AssistantMessage> = None;
                let mut stream_error: Option<String> = None;

                // ─── API call with fallback retry ─────────────────────
                // Port: let attemptWithFallback = true;
                //       while (attemptWithFallback) { attemptWithFallback = false; try { ... } }
                let mut attempt_with_fallback = true;
                // Erro no MEIO do stream (conexão caindo, gateway instável)
                // re-tenta a chamada inteira em vez de perder o turno — um
                // tool_use quase completo descartado custa um turno de LLM.
                let mut stream_retries = 0u32;
                const MAX_STREAM_RETRIES: u32 = 3;

                while attempt_with_fallback {
                    attempt_with_fallback = false;

                    let request = self.build_request(
                        &messages_for_query,
                        state.max_output_tokens_override,
                        &current_model,
                    );

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
                                        for msg in yield_missing_tool_result_blocks(&assistant_messages, "Model fallback triggered") {
                                            yield Ok(AgenticEvent::User {
                                                message: msg,
                                                parent_tool_use_id: None,
                                                uuid: new_uuid(),
                                                session_id: sid.clone(),
                                            });
                                        }
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
                                // Track tool_use blocks as they complete
                                if let StreamUpdate::ContentBlockComplete { ref block, .. } = update {
                                    if matches!(block, ContentBlock::ToolUse { .. }) {
                                        needs_follow_up = true;
                                    }
                                }

                                if let StreamUpdate::MessageComplete { ref message } = update {
                                    current_assistant_in_stream = Some(message.clone());
                                }

                                // Yield streaming events
                                if self.options.include_stream_events {
                                    yield Ok(AgenticEvent::StreamEvent {
                                        event: update,
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
                                            for msg in yield_missing_tool_result_blocks(&assistant_messages, "Model fallback triggered") {
                                                yield Ok(AgenticEvent::User {
                                                    message: msg,
                                                    parent_tool_use_id: None,
                                                    uuid: new_uuid(),
                                                    session_id: sid.clone(),
                                                });
                                            }
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

                                if !attempt_with_fallback {
                                    if stream_retries < MAX_STREAM_RETRIES {
                                        stream_retries += 1;
                                        // Backoff curto e crescente; o retry
                                        // de ABERTURA já mora no client — este
                                        // cobre a conexão que morreu no meio.
                                        tokio::time::sleep(std::time::Duration::from_millis(
                                            500 * u64::from(stream_retries),
                                        ))
                                        .await;
                                        assistant_messages.clear();
                                        tool_use_blocks.clear();
                                        needs_follow_up = false;
                                        current_assistant_in_stream = None;
                                        attempt_with_fallback = true;
                                    } else {
                                        stream_error = Some(err_str);
                                    }
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
                    for msg in yield_missing_tool_result_blocks(&assistant_messages, err_str) {
                        yield Ok(AgenticEvent::User {
                            message: msg,
                            parent_tool_use_id: None,
                            uuid: new_uuid(),
                            session_id: sid.clone(),
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
                    for msg in yield_missing_tool_result_blocks(&assistant_messages, "Interrupted by user") {
                        yield Ok(AgenticEvent::User {
                            message: msg,
                            parent_tool_use_id: None,
                            uuid: new_uuid(),
                            session_id: sid.clone(),
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

                if !is_withheld {
                    // Port: if (!withheld) yield yieldMessage
                    yield Ok(assistant_event(&assistant_msg, &sid));
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
                        yield Ok(assistant_event(&assistant_msg, &sid));
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

                        // Recovery exhausted — surface the withheld message
                        yield Ok(assistant_event(&assistant_msg, &sid));
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

                            for blocking_msg in &hook_result.blocking_messages {
                                yield Ok(AgenticEvent::User {
                                    message: blocking_msg.clone(),
                                    parent_tool_use_id: None,
                                    uuid: new_uuid(),
                                    session_id: sid.clone(),
                                });
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
                {
                    use futures::stream::StreamExt as _;
                    let mut result_stream = self.tool_executor.execute_all_stream(tool_use_blocks.clone());
                    while let Some(exec_result) = result_stream.next().await {
                        // Yield an individual tool_result message for each completed tool
                        let single_msg = self.tool_executor.build_tool_results_message(vec![exec_result.clone()]);
                        yield Ok(AgenticEvent::User {
                            message: single_msg,
                            parent_tool_use_id: None,
                            uuid: new_uuid(),
                            session_id: sid.clone(),
                        });
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
        let msg = AssistantMessage {
            id: "msg_1".to_string(),
            model: "test".to_string(),
            content: vec![
                ContentBlock::text("Let me help"),
                ContentBlock::tool_use("t1", "Bash", serde_json::json!({})),
                ContentBlock::tool_use("t2", "Read", serde_json::json!({})),
            ],
            stop_reason: StopReason::ToolUse,
            usage: Usage::default(),
            api_error: None,
        };

        let results = yield_missing_tool_result_blocks(&[msg], "Interrupted");
        assert_eq!(results.len(), 2);
        for r in &results {
            assert_eq!(r.role, Role::User);
            assert_eq!(r.content.len(), 1);
            assert!(matches!(
                &r.content[0],
                ContentBlock::ToolResult {
                    is_error: Some(true),
                    ..
                }
            ));
        }
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
            content: vec![ContentBlock::text("Error: prompt is too long (200000 tokens > 128000 max)")],
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
        let mut messages = vec![
            ApiMessage::user(vec![ContentBlock::text("summary")]),
        ];
        insert_compact_boundary(&mut messages);
        assert_eq!(messages.len(), 2);
        assert!(is_compact_boundary_message(&messages[0]));
    }
}
