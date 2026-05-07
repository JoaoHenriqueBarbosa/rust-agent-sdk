use crate::api::types::*;
use crate::errors::{ClaudeSDKError, Result};

// ---------------------------------------------------------------------------
// Stream updates yielded to consumers
// ---------------------------------------------------------------------------

/// Events yielded from the streaming accumulator.
#[derive(Debug, Clone)]
pub enum StreamUpdate {
    /// A text delta was received.
    TextDelta { index: usize, text: String },
    /// A thinking delta was received.
    ThinkingDelta { index: usize, thinking: String },
    /// A tool use block has started streaming.
    ToolUseStart { index: usize, id: String, name: String },
    /// Partial JSON input for a tool use block.
    ToolUseInputDelta { index: usize, partial_json: String },
    /// A content block has been completed.
    ContentBlockComplete { index: usize, block: ContentBlock },
    /// The message is complete with stop reason and usage.
    MessageComplete {
        message: AssistantMessage,
    },
}

/// A complete assistant message accumulated from streaming events.
#[derive(Debug, Clone)]
pub struct AssistantMessage {
    pub id: String,
    pub model: String,
    pub content: Vec<ContentBlock>,
    pub stop_reason: StopReason,
    pub usage: Usage,
}

impl AssistantMessage {
    /// Convert to an ApiMessage for sending back to the API.
    pub fn to_api_message(&self) -> ApiMessage {
        ApiMessage {
            role: Role::Assistant,
            content: self.content.clone(),
        }
    }

    /// Extract all tool_use blocks from this message.
    pub fn tool_use_blocks(&self) -> Vec<ToolUseBlock> {
        self.content
            .iter()
            .filter_map(|block| match block {
                ContentBlock::ToolUse { id, name, input } => Some(ToolUseBlock {
                    id: id.clone(),
                    name: name.clone(),
                    input: input.clone(),
                }),
                _ => None,
            })
            .collect()
    }

    /// Whether this message contains any tool_use blocks.
    pub fn has_tool_use(&self) -> bool {
        self.content.iter().any(|b| matches!(b, ContentBlock::ToolUse { .. }))
    }

    /// Extract the text content from this message (concatenated).
    pub fn text(&self) -> String {
        self.content
            .iter()
            .filter_map(|b| match b {
                ContentBlock::Text { text, .. } => Some(text.as_str()),
                _ => None,
            })
            .collect::<Vec<_>>()
            .join("")
    }
}

/// A tool_use block extracted from an assistant message.
#[derive(Debug, Clone)]
pub struct ToolUseBlock {
    pub id: String,
    pub name: String,
    pub input: serde_json::Value,
}

// ---------------------------------------------------------------------------
// Stream accumulator
// ---------------------------------------------------------------------------

/// Intermediate state of a content block being built up from deltas.
#[derive(Debug, Clone)]
enum BlockState {
    Text {
        text: String,
        cache_control: Option<CacheControl>,
    },
    ToolUse {
        id: String,
        name: String,
        input_json: String,
    },
    Thinking {
        thinking: String,
        signature: Option<String>,
    },
    RedactedThinking,
}

/// Accumulates streaming SSE events into a complete AssistantMessage.
#[derive(Debug)]
pub struct StreamAccumulator {
    blocks: Vec<BlockState>,
    stop_reason: Option<String>,
    usage: Usage,
    message_id: String,
    model: String,
    finalized_blocks: Vec<ContentBlock>,
}

impl StreamAccumulator {
    pub fn new() -> Self {
        Self {
            blocks: Vec::new(),
            stop_reason: None,
            usage: Usage::default(),
            message_id: String::new(),
            model: String::new(),
            finalized_blocks: Vec::new(),
        }
    }

    /// Process a single streaming event, returning an optional update.
    pub fn process_event(&mut self, event: StreamEvent) -> Result<Option<StreamUpdate>> {
        match event {
            StreamEvent::MessageStart { message } => {
                self.message_id = message.id;
                self.model = message.model;
                if let Some(u) = message.usage {
                    self.usage = u;
                }
                Ok(None)
            }

            StreamEvent::ContentBlockStart { index, content_block } => {
                // Ensure blocks vec is large enough
                while self.blocks.len() <= index {
                    self.blocks.push(BlockState::Text {
                        text: String::new(),
                        cache_control: None,
                    });
                }

                let (state, update) = match content_block {
                    ContentBlockStart::Text { text } => (
                        BlockState::Text { text: text.clone(), cache_control: None },
                        if text.is_empty() {
                            None
                        } else {
                            Some(StreamUpdate::TextDelta { index, text })
                        },
                    ),
                    ContentBlockStart::ToolUse { id, name } => (
                        BlockState::ToolUse {
                            id: id.clone(),
                            name: name.clone(),
                            input_json: String::new(),
                        },
                        Some(StreamUpdate::ToolUseStart { index, id, name }),
                    ),
                    ContentBlockStart::Thinking { thinking } => (
                        BlockState::Thinking {
                            thinking: thinking.clone(),
                            signature: None,
                        },
                        if thinking.is_empty() {
                            None
                        } else {
                            Some(StreamUpdate::ThinkingDelta { index, thinking })
                        },
                    ),
                    ContentBlockStart::RedactedThinking => (
                        BlockState::RedactedThinking,
                        None,
                    ),
                };

                self.blocks[index] = state;
                Ok(update)
            }

            StreamEvent::ContentBlockDelta { index, delta } => {
                if index >= self.blocks.len() {
                    return Err(ClaudeSDKError::message_parse(
                        format!("Delta for unknown block index {index}"),
                        None,
                    ));
                }

                let update = match (&mut self.blocks[index], delta) {
                    (BlockState::Text { text, .. }, Delta::TextDelta { text: delta_text }) => {
                        text.push_str(&delta_text);
                        Some(StreamUpdate::TextDelta { index, text: delta_text })
                    }
                    (BlockState::ToolUse { input_json, .. }, Delta::InputJsonDelta { partial_json }) => {
                        input_json.push_str(&partial_json);
                        Some(StreamUpdate::ToolUseInputDelta { index, partial_json })
                    }
                    (BlockState::Thinking { thinking, .. }, Delta::ThinkingDelta { thinking: delta }) => {
                        thinking.push_str(&delta);
                        Some(StreamUpdate::ThinkingDelta { index, thinking: delta })
                    }
                    (BlockState::Thinking { signature, .. }, Delta::SignatureDelta { signature: sig }) => {
                        let s = signature.get_or_insert_with(String::new);
                        s.push_str(&sig);
                        None
                    }
                    _ => None,
                };

                Ok(update)
            }

            StreamEvent::ContentBlockStop { index } => {
                if index >= self.blocks.len() {
                    return Err(ClaudeSDKError::message_parse(
                        format!("Stop for unknown block index {index}"),
                        None,
                    ));
                }

                let block = self.finalize_block(index)?;
                let update = StreamUpdate::ContentBlockComplete { index, block: block.clone() };
                self.finalized_blocks.push(block);
                Ok(Some(update))
            }

            StreamEvent::MessageDelta { delta, usage } => {
                self.stop_reason = delta.stop_reason;
                if let Some(u) = usage {
                    self.usage.output_tokens = u.output_tokens;
                    if u.input_tokens > 0 {
                        self.usage.input_tokens = u.input_tokens;
                    }
                }
                Ok(None)
            }

            StreamEvent::MessageStop => {
                let msg = self.build_message();
                Ok(Some(StreamUpdate::MessageComplete { message: msg }))
            }

            StreamEvent::Ping => Ok(None),

            StreamEvent::Error { error } => {
                Err(ClaudeSDKError::sdk(format!("API stream error: {} - {}", error.r#type, error.message)))
            }
        }
    }

    /// Finalize a block at the given index into a ContentBlock.
    fn finalize_block(&self, index: usize) -> Result<ContentBlock> {
        match &self.blocks[index] {
            BlockState::Text { text, cache_control } => {
                Ok(ContentBlock::Text {
                    text: text.clone(),
                    cache_control: cache_control.clone(),
                })
            }
            BlockState::ToolUse { id, name, input_json } => {
                let input = if input_json.is_empty() {
                    serde_json::Value::Object(serde_json::Map::new())
                } else {
                    serde_json::from_str(input_json).map_err(|e| {
                        ClaudeSDKError::json_decode(input_json.clone(), e)
                    })?
                };
                Ok(ContentBlock::ToolUse {
                    id: id.clone(),
                    name: name.clone(),
                    input,
                })
            }
            BlockState::Thinking { thinking, signature } => {
                Ok(ContentBlock::Thinking {
                    thinking: thinking.clone(),
                    signature: signature.clone(),
                })
            }
            BlockState::RedactedThinking => {
                Ok(ContentBlock::RedactedThinking {
                    data: String::new(),
                })
            }
        }
    }

    /// Build the final AssistantMessage from accumulated state.
    fn build_message(&self) -> AssistantMessage {
        AssistantMessage {
            id: self.message_id.clone(),
            model: self.model.clone(),
            content: self.finalized_blocks.clone(),
            stop_reason: StopReason::from(self.stop_reason.as_ref()),
            usage: self.usage.clone(),
        }
    }

    /// Consume the accumulator and return the final message.
    pub fn finalize(self) -> AssistantMessage {
        AssistantMessage {
            id: self.message_id,
            model: self.model,
            content: self.finalized_blocks,
            stop_reason: StopReason::from(self.stop_reason.as_ref()),
            usage: self.usage,
        }
    }
}

// ---------------------------------------------------------------------------
// SSE line parser
// ---------------------------------------------------------------------------

/// Parse a raw SSE data line into a StreamEvent.
pub fn parse_sse_data(data: &str) -> Result<StreamEvent> {
    serde_json::from_str(data).map_err(|e| ClaudeSDKError::json_decode(data.to_string(), e))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_events() -> Vec<StreamEvent> {
        vec![
            serde_json::from_str(r#"{"type":"message_start","message":{"id":"msg_01","model":"claude-sonnet-4-20250514","role":"assistant","usage":{"input_tokens":50,"output_tokens":0}}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" world"}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_stop","index":0}"#).unwrap(),
            serde_json::from_str(r#"{"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":10}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"message_stop"}"#).unwrap(),
        ]
    }

    #[test]
    fn test_accumulator_simple_text() {
        let events = make_events();
        let mut acc = StreamAccumulator::new();

        let mut updates = vec![];
        for event in events {
            if let Some(u) = acc.process_event(event).unwrap() {
                updates.push(u);
            }
        }

        // Should have: TextDelta("Hello"), TextDelta(" world"), ContentBlockComplete, MessageComplete
        assert!(updates.len() >= 3);

        // Last should be MessageComplete
        match updates.last().unwrap() {
            StreamUpdate::MessageComplete { message } => {
                assert_eq!(message.id, "msg_01");
                assert_eq!(message.model, "claude-sonnet-4-20250514");
                assert_eq!(message.text(), "Hello world");
                assert_eq!(message.stop_reason, StopReason::EndTurn);
                assert_eq!(message.usage.input_tokens, 50);
                assert_eq!(message.usage.output_tokens, 10);
                assert!(!message.has_tool_use());
            }
            _ => panic!("Expected MessageComplete"),
        }
    }

    #[test]
    fn test_accumulator_with_tool_use() {
        let events: Vec<StreamEvent> = vec![
            serde_json::from_str(r#"{"type":"message_start","message":{"id":"msg_02","model":"claude-sonnet-4-20250514","role":"assistant","usage":{"input_tokens":100,"output_tokens":0}}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Let me read that file."}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_stop","index":0}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_abc","name":"Read"}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"file_path\":"}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\"/tmp/test.txt\"}"}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_stop","index":1}"#).unwrap(),
            serde_json::from_str(r#"{"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"output_tokens":50}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"message_stop"}"#).unwrap(),
        ];

        let mut acc = StreamAccumulator::new();
        let mut final_msg = None;

        for event in events {
            if let Some(StreamUpdate::MessageComplete { message }) = acc.process_event(event).unwrap() {
                final_msg = Some(message);
            }
        }

        let msg = final_msg.unwrap();
        assert_eq!(msg.stop_reason, StopReason::ToolUse);
        assert!(msg.has_tool_use());

        let tool_uses = msg.tool_use_blocks();
        assert_eq!(tool_uses.len(), 1);
        assert_eq!(tool_uses[0].name, "Read");
        assert_eq!(tool_uses[0].id, "toolu_abc");
        assert_eq!(tool_uses[0].input["file_path"], "/tmp/test.txt");

        assert_eq!(msg.text(), "Let me read that file.");
    }

    #[test]
    fn test_accumulator_with_thinking() {
        let events: Vec<StreamEvent> = vec![
            serde_json::from_str(r#"{"type":"message_start","message":{"id":"msg_03","model":"claude-sonnet-4-20250514","role":"assistant","usage":{"input_tokens":50,"output_tokens":0}}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_start","index":0,"content_block":{"type":"thinking","thinking":""}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":0,"delta":{"type":"thinking_delta","thinking":"Let me think about this..."}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":0,"delta":{"type":"signature_delta","signature":"sig123"}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_stop","index":0}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_start","index":1,"content_block":{"type":"text","text":""}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_delta","index":1,"delta":{"type":"text_delta","text":"Here is my answer."}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"content_block_stop","index":1}"#).unwrap(),
            serde_json::from_str(r#"{"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":30}}"#).unwrap(),
            serde_json::from_str(r#"{"type":"message_stop"}"#).unwrap(),
        ];

        let mut acc = StreamAccumulator::new();
        let mut final_msg = None;

        for event in events {
            if let Some(StreamUpdate::MessageComplete { message }) = acc.process_event(event).unwrap() {
                final_msg = Some(message);
            }
        }

        let msg = final_msg.unwrap();
        assert_eq!(msg.content.len(), 2);

        match &msg.content[0] {
            ContentBlock::Thinking { thinking, signature } => {
                assert_eq!(thinking, "Let me think about this...");
                assert_eq!(signature.as_deref(), Some("sig123"));
            }
            _ => panic!("Expected Thinking block"),
        }

        assert_eq!(msg.text(), "Here is my answer.");
    }

    #[test]
    fn test_parse_sse_data() {
        let data = r#"{"type":"ping"}"#;
        let event = parse_sse_data(data).unwrap();
        assert!(matches!(event, StreamEvent::Ping));

        let bad_data = "not json";
        assert!(parse_sse_data(bad_data).is_err());
    }

    #[test]
    fn test_assistant_message_helpers() {
        let msg = AssistantMessage {
            id: "msg_1".to_string(),
            model: "claude-sonnet-4-20250514".to_string(),
            content: vec![
                ContentBlock::text("Hello"),
                ContentBlock::tool_use("t1", "Bash", serde_json::json!({"command": "ls"})),
                ContentBlock::text(" world"),
            ],
            stop_reason: StopReason::ToolUse,
            usage: Usage::default(),
        };

        assert!(msg.has_tool_use());
        assert_eq!(msg.text(), "Hello world");

        let tools = msg.tool_use_blocks();
        assert_eq!(tools.len(), 1);
        assert_eq!(tools[0].name, "Bash");

        let api_msg = msg.to_api_message();
        assert_eq!(api_msg.role, Role::Assistant);
        assert_eq!(api_msg.content.len(), 3);
    }
}
