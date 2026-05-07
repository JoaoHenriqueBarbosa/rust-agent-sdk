use std::pin::Pin;
use std::time::Instant;

use futures::stream::{Stream, StreamExt};
use serde::Serialize;

use crate::api::client::AnthropicClient;
use crate::api::streaming::{AssistantMessage, StreamUpdate};
use crate::api::types::*;
use crate::compact::auto_compact::AutoCompactConfig;
use crate::compact::compact::CompactionEngine;
use crate::errors::{ClaudeSDKError, Result};
use crate::messages::api_format::inject_cache_control;
use crate::tools::framework::{ToolExecutor, ToolResult as FwToolResult};

// ---------------------------------------------------------------------------
// SDK message types — mirrors the TS SDKMessage contract
// ---------------------------------------------------------------------------

/// Usage tracking across the entire query.
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

/// Events yielded from the agentic loop.
/// Mirrors the TS SDKMessage union type — every event carries uuid and session_id.
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum AgenticEvent {
    /// A complete assistant message (SDKAssistantMessage).
    #[serde(rename = "assistant")]
    Assistant {
        message: AssistantMessage,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
    },

    /// A user message with tool results (SDKUserMessage).
    #[serde(rename = "user")]
    User {
        message: ApiMessage,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
    },

    /// Streaming event (SDKPartialAssistantMessage / stream_event).
    #[serde(rename = "stream_event")]
    StreamEvent {
        event: StreamUpdate,
        parent_tool_use_id: Option<String>,
        uuid: String,
        session_id: String,
    },

    /// System init message (SDKSystemMessage).
    #[serde(rename = "system")]
    System {
        subtype: String,
        #[serde(flatten)]
        data: serde_json::Value,
        uuid: String,
        session_id: String,
    },

    /// Successful result (SDKResultSuccess).
    #[serde(rename = "result")]
    ResultSuccess {
        subtype: String,       // "success"
        duration_ms: u64,
        duration_api_ms: u64,
        is_error: bool,
        num_turns: u32,
        result: String,
        stop_reason: Option<String>,
        total_cost_usd: f64,
        usage: QueryUsage,
        session_id: String,
        uuid: String,
    },

    /// Error result (SDKResultError).
    #[serde(rename = "result")]
    ResultError {
        subtype: String,       // "error_during_execution", "error_max_turns", etc
        duration_ms: u64,
        duration_api_ms: u64,
        is_error: bool,
        num_turns: u32,
        stop_reason: Option<String>,
        total_cost_usd: f64,
        usage: QueryUsage,
        errors: Vec<String>,
        session_id: String,
        uuid: String,
    },
}

// ---------------------------------------------------------------------------
// Agentic loop configuration
// ---------------------------------------------------------------------------

/// Options for configuring the agentic loop.
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
    /// Number of recent user messages to apply cache_control on.
    pub cache_last_n_messages: usize,
    /// Context window size for auto-compact (default 200k).
    pub context_window_tokens: usize,
    /// Include partial streaming events in the output.
    pub include_stream_events: bool,
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
        }
    }
}

// ---------------------------------------------------------------------------
// Loop state — mirrors TS query.ts State
// ---------------------------------------------------------------------------

/// Why the previous iteration continued.
#[derive(Debug, Clone)]
enum Transition {
    NextTurn,
    ReactiveCompactRetry,
    MaxOutputTokensRecovery { attempt: u32 },
}

/// Mutable state carried between loop iterations.
struct LoopState {
    messages: Vec<ApiMessage>,
    max_output_tokens_recovery_count: u32,
    has_attempted_reactive_compact: bool,
    turn_count: u32,
    transition: Option<Transition>,
    /// Last stop_reason seen from an assistant message.
    last_stop_reason: Option<String>,
    /// Accumulated usage across the entire query.
    total_usage: QueryUsage,
    /// API time tracking.
    api_duration_ms: u64,
}

const MAX_OUTPUT_TOKENS_RECOVERY_LIMIT: u32 = 3;

// ---------------------------------------------------------------------------
// Agentic loop
// ---------------------------------------------------------------------------

/// The core agentic loop: calls the API, executes tools, repeats.
///
/// Faithful port of the TS queryLoop in query.ts with:
/// - State machine with explicit transitions
/// - Proactive auto-compact (threshold-based)
/// - Reactive compact on prompt-too-long errors
/// - Max output tokens recovery (up to 3 retries with recovery message)
/// - Stop hooks (TODO: not yet implemented)
/// - Session ID and UUID on every yielded event
pub struct AgenticLoop {
    client: AnthropicClient,
    tool_executor: ToolExecutor,
    options: AgenticLoopOptions,
    auto_compact: AutoCompactConfig,
    compaction_engine: CompactionEngine,
    session_id: String,
}

impl AgenticLoop {
    pub fn new(
        client: AnthropicClient,
        tool_executor: ToolExecutor,
        options: AgenticLoopOptions,
    ) -> Self {
        let auto_compact = AutoCompactConfig::new(options.context_window_tokens);
        let compaction_engine = CompactionEngine::new(client.clone());
        let session_id = uuid::Uuid::new_v4().to_string();

        Self {
            client,
            tool_executor,
            auto_compact,
            compaction_engine,
            session_id,
            options,
        }
    }

    pub fn session_id(&self) -> &str {
        &self.session_id
    }

    fn new_uuid(&self) -> String {
        uuid::Uuid::new_v4().to_string()
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

    /// Run the agentic loop, yielding events as they occur.
    pub fn stream(mut self) -> Pin<Box<dyn Stream<Item = Result<AgenticEvent>> + Send>> {
        Box::pin(async_stream::stream! {
            let start_time = Instant::now();

            let mut state = LoopState {
                messages: self.options.initial_messages.clone(),
                max_output_tokens_recovery_count: 0,
                has_attempted_reactive_compact: false,
                turn_count: 1,
                transition: None,
                last_stop_reason: None,
                total_usage: QueryUsage::default(),
                api_duration_ms: 0,
            };

            // Yield system init message
            yield Ok(AgenticEvent::System {
                subtype: "init".to_string(),
                data: serde_json::json!({
                    "model": self.options.model,
                    "tools": self.tool_executor.registry.names(),
                    "cwd": self.tool_executor.context.working_directory.display().to_string(),
                }),
                uuid: self.new_uuid(),
                session_id: self.session_id.clone(),
            });

            loop {
                // Check max_turns
                if let Some(max) = self.options.max_turns {
                    if state.turn_count > max {
                        yield Ok(AgenticEvent::ResultError {
                            subtype: "error_max_turns".to_string(),
                            duration_ms: start_time.elapsed().as_millis() as u64,
                            duration_api_ms: state.api_duration_ms,
                            is_error: true,
                            num_turns: state.turn_count,
                            stop_reason: state.last_stop_reason.clone(),
                            total_cost_usd: 0.0,
                            usage: state.total_usage.clone(),
                            errors: vec![format!("Reached maximum number of turns ({})", max)],
                            session_id: self.session_id.clone(),
                            uuid: self.new_uuid(),
                        });
                        break;
                    }
                }

                let mut messages_for_query = state.messages.clone();

                // Proactive auto-compact
                let tool_defs = self.tool_executor.registry.api_definitions();
                if self.auto_compact.should_compact(
                    &self.options.system_prompt,
                    &messages_for_query,
                    &tool_defs,
                ) {
                    let sys_text = self.options.system_prompt.iter()
                        .map(|b| b.text.as_str()).collect::<Vec<_>>().join("\n");
                    match self.compaction_engine.compact(&messages_for_query, &sys_text).await {
                        Ok(compacted) => {
                            messages_for_query = compacted;
                            self.auto_compact.record_success();
                        }
                        Err(e) => {
                            self.auto_compact.record_failure();
                            yield Ok(AgenticEvent::System {
                                subtype: "compact_error".to_string(),
                                data: serde_json::json!({"error": e.to_string()}),
                                uuid: self.new_uuid(),
                                session_id: self.session_id.clone(),
                            });
                        }
                    }
                }

                // Inject cache_control on recent messages
                inject_cache_control(&mut messages_for_query, self.options.cache_last_n_messages);

                // Build API request
                let tool_definitions = self.tool_executor.registry.api_definitions();
                let request = CreateMessageRequest {
                    model: self.options.model.clone(),
                    max_tokens: self.options.max_tokens,
                    messages: messages_for_query.clone(),
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
                };

                // Call API
                let api_start = Instant::now();
                let mut event_stream = match self.client.create_message_stream(request).await {
                    Ok(s) => s,
                    Err(ref e) if !state.has_attempted_reactive_compact && (
                        format!("{e}").contains("prompt is too long")
                        || format!("{e}").contains("too many tokens")
                    ) => {
                        // Reactive compact: prompt too long
                        let sys_text = self.options.system_prompt.iter()
                            .map(|b| b.text.as_str()).collect::<Vec<_>>().join("\n");
                        match self.compaction_engine.compact(&messages_for_query, &sys_text).await {
                            Ok(compacted) => {
                                state.messages = compacted;
                                state.has_attempted_reactive_compact = true;
                                state.transition = Some(Transition::ReactiveCompactRetry);
                                continue;
                            }
                            Err(ce) => {
                                yield Err(ClaudeSDKError::sdk(format!(
                                    "Reactive compaction failed: {ce}"
                                )));
                                break;
                            }
                        }
                    }
                    Err(e) => {
                        yield Err(e);
                        break;
                    }
                };

                // Stream and accumulate response
                let mut assistant_message: Option<AssistantMessage> = None;
                let mut tool_use_blocks = Vec::new();
                let mut needs_follow_up = false;

                while let Some(update_result) = event_stream.next().await {
                    match update_result {
                        Ok(update) => {
                            // Track tool_use blocks as they arrive
                            if let StreamUpdate::ContentBlockComplete { ref block, .. } = update {
                                if let ContentBlock::ToolUse { .. } = block {
                                    needs_follow_up = true;
                                }
                            }

                            if let StreamUpdate::MessageComplete { ref message } = update {
                                assistant_message = Some(message.clone());
                            }

                            // Yield streaming events if enabled
                            if self.options.include_stream_events {
                                yield Ok(AgenticEvent::StreamEvent {
                                    event: update,
                                    parent_tool_use_id: None,
                                    uuid: self.new_uuid(),
                                    session_id: self.session_id.clone(),
                                });
                            }
                        }
                        Err(e) => {
                            yield Err(e);
                            break;
                        }
                    }
                }

                state.api_duration_ms += api_start.elapsed().as_millis() as u64;

                let assistant_msg = match assistant_message {
                    Some(msg) => msg,
                    None => {
                        yield Err(ClaudeSDKError::sdk("Stream ended without message_stop"));
                        break;
                    }
                };

                // Accumulate usage
                state.total_usage.accumulate(&assistant_msg.usage);

                // Track stop_reason
                state.last_stop_reason = Self::stop_reason_str(&assistant_msg.stop_reason);

                // Extract tool_use blocks
                tool_use_blocks = assistant_msg.tool_use_blocks();
                if !tool_use_blocks.is_empty() {
                    needs_follow_up = true;
                }

                // Yield the assistant message
                yield Ok(AgenticEvent::Assistant {
                    message: assistant_msg.clone(),
                    parent_tool_use_id: None,
                    uuid: self.new_uuid(),
                    session_id: self.session_id.clone(),
                });

                if !needs_follow_up {
                    // Check for withheld max_output_tokens — retry with recovery message
                    if assistant_msg.stop_reason == StopReason::MaxTokens
                        && state.max_output_tokens_recovery_count < MAX_OUTPUT_TOKENS_RECOVERY_LIMIT
                    {
                        let recovery_msg = ApiMessage::user(vec![ContentBlock::text(
                            "Output token limit hit. Resume directly — no apology, no recap of what you were doing. \
                             Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces."
                        )]);

                        state.messages = messages_for_query;
                        state.messages.push(assistant_msg.to_api_message());
                        state.messages.push(recovery_msg);
                        state.max_output_tokens_recovery_count += 1;
                        state.transition = Some(Transition::MaxOutputTokensRecovery {
                            attempt: state.max_output_tokens_recovery_count,
                        });
                        continue;
                    }

                    // Done — yield result
                    let last_text = assistant_msg.text();
                    yield Ok(AgenticEvent::ResultSuccess {
                        subtype: "success".to_string(),
                        duration_ms: start_time.elapsed().as_millis() as u64,
                        duration_api_ms: state.api_duration_ms,
                        is_error: false,
                        num_turns: state.turn_count,
                        result: last_text,
                        stop_reason: state.last_stop_reason.clone(),
                        total_cost_usd: 0.0,
                        usage: state.total_usage.clone(),
                        session_id: self.session_id.clone(),
                        uuid: self.new_uuid(),
                    });
                    break;
                }

                // Execute tools
                let execution_results = self.tool_executor.execute_all(tool_use_blocks).await;

                // Build tool results message
                let tool_results_msg = self.tool_executor.build_tool_results_message(execution_results);

                // Yield user message with tool results
                yield Ok(AgenticEvent::User {
                    message: tool_results_msg.clone(),
                    parent_tool_use_id: None,
                    uuid: self.new_uuid(),
                    session_id: self.session_id.clone(),
                });

                // Append messages for next iteration
                state.messages = messages_for_query;
                state.messages.push(assistant_msg.to_api_message());
                state.messages.push(tool_results_msg);

                // Reset recovery state on successful tool turn
                state.max_output_tokens_recovery_count = 0;
                state.has_attempted_reactive_compact = false;
                state.turn_count += 1;
                state.transition = Some(Transition::NextTurn);
            }
        })
    }
}

// ---------------------------------------------------------------------------
// Convenience functions
// ---------------------------------------------------------------------------

/// Execute a one-shot agentic query. Returns a stream of events.
pub fn agentic_query(
    client: AnthropicClient,
    prompt: &str,
    tool_executor: ToolExecutor,
    options: AgenticLoopOptions,
) -> Pin<Box<dyn Stream<Item = Result<AgenticEvent>> + Send>> {
    let mut opts = options;
    opts.initial_messages.push(ApiMessage::user(vec![ContentBlock::text(prompt)]));

    let agentic_loop = AgenticLoop::new(client, tool_executor, opts);
    agentic_loop.stream()
}

/// Execute a one-shot agentic query and collect all events.
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
    fn test_agentic_loop_options_default() {
        let opts = AgenticLoopOptions::default();
        assert_eq!(opts.max_tokens, 16384);
        assert!(opts.max_turns.is_none());
        assert!(opts.initial_messages.is_empty());
    }

    #[test]
    fn test_stop_reason_str() {
        assert_eq!(AgenticLoop::stop_reason_str(&StopReason::EndTurn), Some("end_turn".to_string()));
        assert_eq!(AgenticLoop::stop_reason_str(&StopReason::ToolUse), Some("tool_use".to_string()));
        assert_eq!(AgenticLoop::stop_reason_str(&StopReason::MaxTokens), Some("max_tokens".to_string()));
        assert_eq!(AgenticLoop::stop_reason_str(&StopReason::StopSequence), Some("stop_sequence".to_string()));
    }

    #[test]
    fn test_query_usage_accumulate() {
        let mut usage = QueryUsage::default();
        usage.accumulate(&Usage {
            input_tokens: 100,
            output_tokens: 50,
            cache_read_input_tokens: Some(10),
            cache_creation_input_tokens: Some(5),
        });
        assert_eq!(usage.input_tokens, 100);
        assert_eq!(usage.output_tokens, 50);
        assert_eq!(usage.cache_read_input_tokens, 10);

        usage.accumulate(&Usage {
            input_tokens: 200,
            output_tokens: 30,
            cache_read_input_tokens: None,
            cache_creation_input_tokens: None,
        });
        assert_eq!(usage.input_tokens, 300);
        assert_eq!(usage.output_tokens, 80);
        assert_eq!(usage.cache_read_input_tokens, 10);
    }

    #[test]
    fn test_agentic_event_serialization() {
        let event = AgenticEvent::ResultSuccess {
            subtype: "success".to_string(),
            duration_ms: 1234,
            duration_api_ms: 1000,
            is_error: false,
            num_turns: 3,
            result: "hello".to_string(),
            stop_reason: Some("end_turn".to_string()),
            total_cost_usd: 0.01,
            usage: QueryUsage::default(),
            session_id: "sess-123".to_string(),
            uuid: "uuid-456".to_string(),
        };

        let json = serde_json::to_value(&event).unwrap();
        assert_eq!(json["type"], "result");
        assert_eq!(json["subtype"], "success");
        assert_eq!(json["stop_reason"], "end_turn");
        assert_eq!(json["session_id"], "sess-123");
        assert_eq!(json["num_turns"], 3);
    }
}
