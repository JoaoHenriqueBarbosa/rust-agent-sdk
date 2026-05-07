use std::pin::Pin;

use futures::stream::{Stream, StreamExt};

use crate::api::client::AnthropicClient;
use crate::api::streaming::{AssistantMessage, StreamUpdate, ToolUseBlock};
use crate::api::types::*;
use crate::compact::auto_compact::AutoCompactConfig;
use crate::compact::compact::CompactionEngine;
use crate::errors::{ClaudeSDKError, Result};
use crate::messages::api_format::inject_cache_control;
use crate::tools::framework::{ToolExecutor, ToolResult as FwToolResult};

// ---------------------------------------------------------------------------
// Agentic events
// ---------------------------------------------------------------------------

/// Events yielded from the agentic loop.
#[derive(Debug, Clone)]
pub enum AgenticEvent {
    /// Streaming delta from the API.
    Stream(StreamUpdate),
    /// A complete assistant message has been received.
    AssistantMessage(AssistantMessage),
    /// Tool execution started.
    ToolExecutionStart { tool_use_id: String, tool_name: String },
    /// Tool execution completed.
    ToolExecutionComplete { tool_use_id: String, tool_name: String, result: FwToolResult },
    /// The loop has finished.
    Done { reason: StopReason, turns: u32 },
    /// An error occurred but the loop may continue.
    Error(String),
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
            cache_last_n_messages: 3,
            context_window_tokens: 200_000,
        }
    }
}

// ---------------------------------------------------------------------------
// Agentic loop
// ---------------------------------------------------------------------------

/// The core agentic loop: calls the API, executes tools, repeats.
pub struct AgenticLoop {
    client: AnthropicClient,
    tool_executor: ToolExecutor,
    options: AgenticLoopOptions,
    messages: Vec<ApiMessage>,
    auto_compact: AutoCompactConfig,
    compaction_engine: CompactionEngine,
}

impl AgenticLoop {
    pub fn new(
        client: AnthropicClient,
        tool_executor: ToolExecutor,
        options: AgenticLoopOptions,
    ) -> Self {
        let auto_compact = AutoCompactConfig::new(options.context_window_tokens);
        let compaction_engine = CompactionEngine::new(client.clone());

        Self {
            client,
            tool_executor,
            messages: options.initial_messages.clone(),
            auto_compact,
            compaction_engine,
            options,
        }
    }

    /// Get current messages.
    pub fn messages(&self) -> &[ApiMessage] {
        &self.messages
    }

    /// Run the agentic loop, yielding events as they occur.
    pub fn stream(mut self) -> Pin<Box<dyn Stream<Item = Result<AgenticEvent>> + Send>> {
        Box::pin(async_stream::stream! {
            let mut turn: u32 = 0;
            let mut current_max_tokens = self.options.max_tokens;

            loop {
                // Check max_turns
                if let Some(max) = self.options.max_turns {
                    if turn >= max {
                        yield Ok(AgenticEvent::Done {
                            reason: StopReason::Unknown("max_turns".to_string()),
                            turns: turn,
                        });
                        break;
                    }
                }

                // Proactive auto-compact
                let tool_defs = self.tool_executor.registry.api_definitions();
                if self.auto_compact.should_compact(
                    &self.options.system_prompt,
                    &self.messages,
                    &tool_defs,
                ) {
                    match self.compaction_engine.compact(
                        &self.messages,
                        &self.options.system_prompt.iter().map(|b| b.text.as_str()).collect::<Vec<_>>().join("\n"),
                    ).await {
                        Ok(compacted) => {
                            self.messages = compacted;
                            self.auto_compact.record_success();
                        }
                        Err(e) => {
                            self.auto_compact.record_failure();
                            yield Ok(AgenticEvent::Error(format!("Compaction failed: {e}")));
                        }
                    }
                }

                // Inject cache_control on recent messages
                inject_cache_control(&mut self.messages, self.options.cache_last_n_messages);

                // Build and send API request
                let tool_definitions = self.tool_executor.registry.api_definitions();
                let request = CreateMessageRequest {
                    model: self.options.model.clone(),
                    max_tokens: current_max_tokens,
                    messages: self.messages.clone(),
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

                let mut event_stream = match self.client.create_message_stream(request).await {
                    Ok(s) => s,
                    Err(ref e) if format!("{e}").contains("prompt is too long")
                        || format!("{e}").contains("too many tokens") =>
                    {
                        // Reactive compact: context too long
                        let sys_text = self.options.system_prompt.iter()
                            .map(|b| b.text.as_str())
                            .collect::<Vec<_>>().join("\n");
                        match self.compaction_engine.compact(&self.messages, &sys_text).await {
                            Ok(compacted) => {
                                self.messages = compacted;
                                continue; // Retry with compacted messages
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

                // Accumulate streaming events
                let mut assistant_message: Option<AssistantMessage> = None;

                while let Some(update_result) = event_stream.next().await {
                    match update_result {
                        Ok(update) => {
                            match &update {
                                StreamUpdate::MessageComplete { message } => {
                                    assistant_message = Some(message.clone());
                                }
                                _ => {}
                            }
                            yield Ok(AgenticEvent::Stream(update));
                        }
                        Err(e) => {
                            yield Err(e);
                            break;
                        }
                    }
                }

                let assistant_msg = match assistant_message {
                    Some(msg) => msg,
                    None => {
                        yield Err(ClaudeSDKError::sdk("Stream ended without message_stop"));
                        break;
                    }
                };

                // Yield the complete assistant message
                yield Ok(AgenticEvent::AssistantMessage(assistant_msg.clone()));

                // Check stop reason
                match &assistant_msg.stop_reason {
                    StopReason::MaxTokens => {
                        // Max output tokens recovery: escalate and retry
                        if current_max_tokens < 65536 {
                            current_max_tokens = (current_max_tokens * 2).min(65536);
                            // Append the partial assistant message and continue
                            self.messages.push(assistant_msg.to_api_message());
                            turn += 1;
                            continue;
                        }
                        // Can't escalate further
                        yield Ok(AgenticEvent::Done {
                            reason: StopReason::MaxTokens,
                            turns: turn + 1,
                        });
                        break;
                    }
                    StopReason::EndTurn | StopReason::StopSequence => {
                        if !assistant_msg.has_tool_use() {
                            yield Ok(AgenticEvent::Done {
                                reason: assistant_msg.stop_reason.clone(),
                                turns: turn + 1,
                            });
                            break;
                        }
                        // Has tool_use even with end_turn — execute tools
                    }
                    StopReason::ToolUse => {
                        // Expected — continue to tool execution
                    }
                    StopReason::Unknown(reason) => {
                        yield Ok(AgenticEvent::Done {
                            reason: StopReason::Unknown(reason.clone()),
                            turns: turn + 1,
                        });
                        break;
                    }
                }

                // Extract and execute tool_use blocks
                let tool_uses = assistant_msg.tool_use_blocks();
                if tool_uses.is_empty() {
                    yield Ok(AgenticEvent::Done {
                        reason: assistant_msg.stop_reason.clone(),
                        turns: turn + 1,
                    });
                    break;
                }

                // Emit tool execution start events
                for tu in &tool_uses {
                    yield Ok(AgenticEvent::ToolExecutionStart {
                        tool_use_id: tu.id.clone(),
                        tool_name: tu.name.clone(),
                    });
                }

                // Execute tools
                let execution_results = self.tool_executor.execute_all(tool_uses).await;

                // Emit tool execution complete events
                for result in &execution_results {
                    yield Ok(AgenticEvent::ToolExecutionComplete {
                        tool_use_id: result.tool_use_id.clone(),
                        tool_name: String::new(), // We don't have the name in ToolExecutionResult
                        result: result.result.clone(),
                    });
                }

                // Build tool results message
                let tool_results_msg = self.tool_executor.build_tool_results_message(execution_results);

                // Append messages for next turn
                self.messages.push(assistant_msg.to_api_message());
                self.messages.push(tool_results_msg);

                // Reset max_tokens after successful turn
                current_max_tokens = self.options.max_tokens;
                turn += 1;
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
    fn test_agentic_event_variants() {
        // Just verify the types exist and can be created
        let _event = AgenticEvent::Done {
            reason: StopReason::EndTurn,
            turns: 1,
        };
        let _event = AgenticEvent::Error("test".to_string());
    }
}
