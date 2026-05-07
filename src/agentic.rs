// Faithful port of ~/claude-code/src/query.ts queryLoop()
// Gated features (reactiveCompact, contextCollapse, skillPrefetch, snipModule,
// taskSummaryModule, jobClassifier) are all `= false` in the external build
// and are omitted entirely.

use std::pin::Pin;
use std::time::Instant;

use futures::stream::{Stream, StreamExt};
use serde::Serialize;
use tokio_util::sync::CancellationToken;

use crate::api::client::AnthropicClient;
use crate::api::streaming::{AssistantMessage, StreamUpdate, ToolUseBlock};
use crate::api::types::*;
use crate::compact::auto_compact::AutoCompactConfig;
use crate::compact::compact::CompactionEngine;
use crate::compact::token_estimation::estimate_message_tokens;
use crate::errors::Result;
use crate::messages::api_format::inject_cache_control;
use crate::messages::normalize::{ensure_tool_result_pairing, normalize_messages_for_api};
use crate::tools::framework::ToolExecutor;

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
        message: AssistantMessage,
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
        #[serde(skip_serializing_if = "Vec::is_empty")]
        errors: Vec<String>,
        session_id: String,
        uuid: String,
    },
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
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
    api_duration_ms: u64,
    auto_compact_tracking: AutoCompactTracking,
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

/// Port of isWithheldMaxOutputTokens from query.ts
fn is_withheld_max_output_tokens(msg: &AssistantMessage) -> bool {
    msg.stop_reason == StopReason::MaxTokens
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
    session_id: String,
    abort: CancellationToken,
}

impl AgenticLoop {
    pub fn new(
        client: AnthropicClient,
        tool_executor: ToolExecutor,
        options: AgenticLoopOptions,
    ) -> Self {
        let auto_compact = AutoCompactConfig::new(options.context_window_tokens);
        let compaction_engine = CompactionEngine::new(client.clone());
        let session_id = new_uuid();
        let abort = options.abort.clone().unwrap_or_default();

        Self {
            client,
            tool_executor,
            auto_compact,
            compaction_engine,
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
                api_duration_ms: 0,
                auto_compact_tracking: AutoCompactTracking::default(),
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
                        total_cost_usd: 0.0,
                        usage: state.total_usage.clone(),
                        errors: vec!["Interrupted by user".to_string()],
                        session_id: sid.clone(),
                        uuid: new_uuid(),
                    });
                    break;
                }

                // ─── messagesForQuery ─────────────────────────────────
                // Port: let messagesForQuery = [...getMessagesAfterCompactBoundary(messages)]
                let mut messages_for_query = state.messages.clone();

                // ─── Auto-compact ─────────────────────────────────────
                // Port: let { compactionResult, consecutiveFailures } = await deps.autocompact(...)
                let mut compaction_happened = false;
                let tool_defs = self.tool_executor.registry.api_definitions();

                if state.auto_compact_tracking.consecutive_failures < 3
                    && self.auto_compact.should_compact(
                        &self.options.system_prompt,
                        &messages_for_query,
                        &tool_defs,
                    )
                {
                    match self.compaction_engine.compact(&messages_for_query, &self.sys_text()).await {
                        Ok(compacted) => {
                            messages_for_query = compacted;
                            self.auto_compact.record_success();
                            compaction_happened = true;
                            state.auto_compact_tracking = AutoCompactTracking {
                                compacted: true,
                                turn_counter: 0,
                                consecutive_failures: 0,
                            };

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
                    let token_count = estimate_message_tokens(&messages_for_query);
                    if is_at_blocking_limit(token_count, self.options.context_window_tokens) {
                        yield Ok(AgenticEvent::Assistant {
                            message: AssistantMessage {
                                id: new_uuid(),
                                model: current_model.clone(),
                                content: vec![ContentBlock::text(
                                    "I'm sorry, but the conversation has become too long. \
                                     Please start a new conversation or use /compact to reduce context.",
                                )],
                                stop_reason: StopReason::EndTurn,
                                usage: Usage::default(),
                            },
                            parent_tool_use_id: None,
                            uuid: new_uuid(),
                            session_id: sid.clone(),
                        });
                        yield Ok(AgenticEvent::Result {
                            subtype: "error_during_execution".to_string(),
                            duration_ms: start_time.elapsed().as_millis() as u64,
                            duration_api_ms: state.api_duration_ms,
                            is_error: true,
                            num_turns: state.turn_count,
                            result: None,
                            stop_reason: state.last_stop_reason.clone(),
                            total_cost_usd: 0.0,
                            usage: state.total_usage.clone(),
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
                inject_cache_control(&mut messages_for_query, self.options.cache_last_n_messages);

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

                while attempt_with_fallback {
                    attempt_with_fallback = false;

                    let request = self.build_request(
                        &messages_for_query,
                        state.max_output_tokens_override,
                        &current_model,
                    );

                    let api_start = Instant::now();
                    let stream_result = self.client.create_message_stream(request).await;

                    let mut event_stream = match stream_result {
                        Ok(s) => s,
                        Err(e) => {
                            state.api_duration_ms += api_start.elapsed().as_millis() as u64;
                            let err_str = format!("{e}");
                            let is_prompt_too_long_err = err_str.contains("prompt is too long")
                                || err_str.contains("too many tokens");

                            // Port: reactive compact on prompt-too-long
                            if is_prompt_too_long_err && !state.has_attempted_reactive_compact {
                                match self.compaction_engine.compact(&messages_for_query, &self.sys_text()).await {
                                    Ok(compacted) => {
                                        state.messages = compacted;
                                        state.has_attempted_reactive_compact = true;
                                        state.transition = Some(Transition::ReactiveCompactRetry);
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
                        total_cost_usd: 0.0,
                        usage: state.total_usage.clone(),
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
                        total_cost_usd: 0.0,
                        usage: state.total_usage.clone(),
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
                            total_cost_usd: 0.0,
                            usage: state.total_usage.clone(),
                            errors: vec!["Stream ended without message_stop".to_string()],
                            session_id: sid.clone(),
                            uuid: new_uuid(),
                        });
                        break;
                    }
                };

                // Accumulate usage
                state.total_usage.accumulate(&assistant_msg.usage);

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
                    yield Ok(AgenticEvent::Assistant {
                        message: assistant_msg.clone(),
                        parent_tool_use_id: None,
                        uuid: new_uuid(),
                        session_id: sid.clone(),
                    });
                }

                assistant_messages.push(assistant_msg.clone());

                // ═══════════════════════════════════════════════════════
                // Port: if (!needsFollowUp) { ... }
                // ═══════════════════════════════════════════════════════
                if !needs_follow_up {
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
                        yield Ok(AgenticEvent::Assistant {
                            message: assistant_msg.clone(),
                            parent_tool_use_id: None,
                            uuid: new_uuid(),
                            session_id: sid.clone(),
                        });
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
                        total_cost_usd: 0.0,
                        usage: state.total_usage.clone(),
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

                let execution_results = self.tool_executor.execute_all(tool_use_blocks.clone()).await;

                // Build tool_result message and yield it
                let tool_results_msg = self.tool_executor.build_tool_results_message(execution_results);

                yield Ok(AgenticEvent::User {
                    message: tool_results_msg.clone(),
                    parent_tool_use_id: None,
                    uuid: new_uuid(),
                    session_id: sid.clone(),
                });

                tool_results.push(tool_results_msg.clone());

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
                        total_cost_usd: 0.0,
                        usage: state.total_usage.clone(),
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
                            total_cost_usd: 0.0,
                            usage: state.total_usage.clone(),
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
}
