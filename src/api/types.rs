use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize)]
pub struct CreateMessageRequest {
    pub model: String,
    pub max_tokens: u32,
    pub messages: Vec<ApiMessage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<Vec<SystemBlock>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tools: Option<Vec<ToolDefinition>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tool_choice: Option<ToolChoice>,
    pub stream: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<Metadata>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop_sequences: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_p: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_k: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thinking: Option<ThinkingParam>,
}

impl CreateMessageRequest {
    pub fn new(model: impl Into<String>, max_tokens: u32, messages: Vec<ApiMessage>) -> Self {
        Self {
            model: model.into(),
            max_tokens,
            messages,
            system: None,
            tools: None,
            tool_choice: None,
            stream: false,
            metadata: None,
            stop_sequences: None,
            temperature: None,
            top_p: None,
            top_k: None,
            thinking: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiMessage {
    pub role: Role,
    pub content: Vec<ContentBlock>,
}

impl ApiMessage {
    pub fn user(content: Vec<ContentBlock>) -> Self {
        Self { role: Role::User, content }
    }

    pub fn assistant(content: Vec<ContentBlock>) -> Self {
        Self { role: Role::Assistant, content }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Role {
    User,
    Assistant,
}

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ContentBlock {
    #[serde(rename = "text")]
    Text {
        text: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        cache_control: Option<CacheControl>,
    },
    #[serde(rename = "image")]
    Image {
        source: ImageSource,
    },
    #[serde(rename = "tool_use")]
    ToolUse {
        id: String,
        name: String,
        input: serde_json::Value,
    },
    #[serde(rename = "tool_result")]
    ToolResult {
        tool_use_id: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        content: Option<Vec<ToolResultContent>>,
        #[serde(skip_serializing_if = "Option::is_none")]
        is_error: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        cache_control: Option<CacheControl>,
    },
    #[serde(rename = "thinking")]
    Thinking {
        thinking: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        signature: Option<String>,
    },
    #[serde(rename = "redacted_thinking")]
    RedactedThinking {
        data: String,
    },
}

impl ContentBlock {
    pub fn text(text: impl Into<String>) -> Self {
        Self::Text { text: text.into(), cache_control: None }
    }

    pub fn text_cached(text: impl Into<String>) -> Self {
        Self::Text {
            text: text.into(),
            cache_control: Some(CacheControl::ephemeral()),
        }
    }

    pub fn tool_use(id: impl Into<String>, name: impl Into<String>, input: serde_json::Value) -> Self {
        Self::ToolUse { id: id.into(), name: name.into(), input }
    }

    pub fn tool_result(tool_use_id: impl Into<String>, content: Vec<ToolResultContent>, is_error: bool) -> Self {
        Self::ToolResult {
            tool_use_id: tool_use_id.into(),
            content: if content.is_empty() { None } else { Some(content) },
            is_error: if is_error { Some(true) } else { None },
            cache_control: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ToolResultContent {
    #[serde(rename = "text")]
    Text { text: String },
    #[serde(rename = "image")]
    Image {
        source: ImageSource,
    },
}

impl ToolResultContent {
    pub fn text(text: impl Into<String>) -> Self {
        Self::Text { text: text.into() }
    }

    pub fn image_base64(data: impl Into<String>, media_type: impl Into<String>) -> Self {
        Self::Image {
            source: ImageSource {
                r#type: "base64".to_string(),
                media_type: media_type.into(),
                data: data.into(),
            },
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageSource {
    pub r#type: String,
    pub media_type: String,
    pub data: String,
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemBlock {
    pub r#type: String,
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cache_control: Option<CacheControl>,
}

impl SystemBlock {
    pub fn text(text: impl Into<String>) -> Self {
        Self {
            r#type: "text".to_string(),
            text: text.into(),
            cache_control: None,
        }
    }

    pub fn text_cached(text: impl Into<String>) -> Self {
        Self {
            r#type: "text".to_string(),
            text: text.into(),
            cache_control: Some(CacheControl::ephemeral()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheControl {
    pub r#type: String,
}

impl CacheControl {
    pub fn ephemeral() -> Self {
        Self { r#type: "ephemeral".to_string() }
    }
}

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolDefinition {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub input_schema: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cache_control: Option<CacheControl>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ToolChoice {
    #[serde(rename = "auto")]
    Auto,
    #[serde(rename = "any")]
    Any,
    #[serde(rename = "tool")]
    Tool { name: String },
}

// ---------------------------------------------------------------------------
// Thinking
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThinkingParam {
    pub r#type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub budget_tokens: Option<u32>,
}

impl ThinkingParam {
    pub fn enabled(budget_tokens: u32) -> Self {
        Self { r#type: "enabled".to_string(), budget_tokens: Some(budget_tokens) }
    }

    pub fn disabled() -> Self {
        Self { r#type: "disabled".to_string(), budget_tokens: None }
    }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Metadata {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Deserialize)]
pub struct ApiResponse {
    pub id: String,
    pub r#type: String,
    pub role: Role,
    pub content: Vec<ContentBlock>,
    pub model: String,
    pub stop_reason: Option<String>,
    pub stop_sequence: Option<String>,
    pub usage: Usage,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Usage {
    #[serde(default)]
    pub input_tokens: u32,
    #[serde(default)]
    pub output_tokens: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cache_creation_input_tokens: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cache_read_input_tokens: Option<u32>,
}

// ---------------------------------------------------------------------------
// Streaming event types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "type")]
pub enum StreamEvent {
    #[serde(rename = "message_start")]
    MessageStart { message: MessageStartPayload },
    #[serde(rename = "content_block_start")]
    ContentBlockStart {
        index: usize,
        content_block: ContentBlockStart,
    },
    #[serde(rename = "content_block_delta")]
    ContentBlockDelta { index: usize, delta: Delta },
    #[serde(rename = "content_block_stop")]
    ContentBlockStop { index: usize },
    #[serde(rename = "message_delta")]
    MessageDelta {
        delta: MessageDeltaPayload,
        #[serde(default)]
        usage: Option<Usage>,
    },
    #[serde(rename = "message_stop")]
    MessageStop,
    #[serde(rename = "ping")]
    Ping,
    #[serde(rename = "error")]
    Error { error: ApiError },
}

#[derive(Debug, Clone, Deserialize)]
pub struct MessageStartPayload {
    pub id: String,
    pub model: String,
    pub role: Role,
    #[serde(default)]
    pub usage: Option<Usage>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "type")]
pub enum ContentBlockStart {
    #[serde(rename = "text")]
    Text {
        #[serde(default)]
        text: String,
    },
    #[serde(rename = "tool_use")]
    ToolUse { id: String, name: String },
    #[serde(rename = "thinking")]
    Thinking {
        #[serde(default)]
        thinking: String,
    },
    #[serde(rename = "redacted_thinking")]
    RedactedThinking,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "type")]
pub enum Delta {
    #[serde(rename = "text_delta")]
    TextDelta { text: String },
    #[serde(rename = "input_json_delta")]
    InputJsonDelta { partial_json: String },
    #[serde(rename = "thinking_delta")]
    ThinkingDelta { thinking: String },
    #[serde(rename = "signature_delta")]
    SignatureDelta { signature: String },
}

#[derive(Debug, Clone, Deserialize)]
pub struct MessageDeltaPayload {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop_reason: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop_sequence: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiError {
    pub r#type: String,
    pub message: String,
}

// ---------------------------------------------------------------------------
// Stop reasons
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub enum StopReason {
    #[serde(rename = "end_turn")]
    EndTurn,
    #[serde(rename = "tool_use")]
    ToolUse,
    #[serde(rename = "max_tokens")]
    MaxTokens,
    #[serde(rename = "stop_sequence")]
    StopSequence,
    #[serde(untagged)]
    Unknown(String),
}

impl From<&str> for StopReason {
    fn from(s: &str) -> Self {
        match s {
            "end_turn" => StopReason::EndTurn,
            "tool_use" => StopReason::ToolUse,
            "max_tokens" => StopReason::MaxTokens,
            "stop_sequence" => StopReason::StopSequence,
            other => StopReason::Unknown(other.to_string()),
        }
    }
}

impl From<Option<&String>> for StopReason {
    fn from(s: Option<&String>) -> Self {
        match s {
            Some(s) => StopReason::from(s.as_str()),
            None => StopReason::Unknown("none".to_string()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_serialize_create_message_request() {
        let req = CreateMessageRequest {
            model: "claude-sonnet-4-20250514".to_string(),
            max_tokens: 8192,
            messages: vec![ApiMessage::user(vec![ContentBlock::text("Hello")])],
            system: Some(vec![SystemBlock::text_cached("You are helpful.")]),
            tools: None,
            tool_choice: None,
            stream: true,
            metadata: None,
            stop_sequences: None,
            temperature: None,
            top_p: None,
            top_k: None,
            thinking: None,
        };

        let json = serde_json::to_value(&req).unwrap();
        assert_eq!(json["model"], "claude-sonnet-4-20250514");
        assert_eq!(json["stream"], true);
        assert_eq!(json["messages"][0]["role"], "user");
        assert_eq!(json["messages"][0]["content"][0]["type"], "text");
        assert_eq!(json["messages"][0]["content"][0]["text"], "Hello");
        assert_eq!(json["system"][0]["cache_control"]["type"], "ephemeral");
        // Optional fields should not appear when None
        assert!(json.get("tools").is_none());
        assert!(json.get("temperature").is_none());
    }

    #[test]
    fn test_deserialize_stream_events() {
        let msg_start = r#"{"type":"message_start","message":{"id":"msg_123","model":"claude-sonnet-4-20250514","role":"assistant","usage":{"input_tokens":100,"output_tokens":0}}}"#;
        let event: StreamEvent = serde_json::from_str(msg_start).unwrap();
        match event {
            StreamEvent::MessageStart { message } => {
                assert_eq!(message.id, "msg_123");
                assert_eq!(message.role, Role::Assistant);
            }
            _ => panic!("Expected MessageStart"),
        }

        let text_start = r#"{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}"#;
        let event: StreamEvent = serde_json::from_str(text_start).unwrap();
        match event {
            StreamEvent::ContentBlockStart { index, content_block } => {
                assert_eq!(index, 0);
                assert!(matches!(content_block, ContentBlockStart::Text { .. }));
            }
            _ => panic!("Expected ContentBlockStart"),
        }

        let text_delta = r#"{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}"#;
        let event: StreamEvent = serde_json::from_str(text_delta).unwrap();
        match event {
            StreamEvent::ContentBlockDelta { index, delta } => {
                assert_eq!(index, 0);
                match delta {
                    Delta::TextDelta { text } => assert_eq!(text, "Hello"),
                    _ => panic!("Expected TextDelta"),
                }
            }
            _ => panic!("Expected ContentBlockDelta"),
        }

        let tool_use_start = r#"{"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_123","name":"Bash"}}"#;
        let event: StreamEvent = serde_json::from_str(tool_use_start).unwrap();
        match event {
            StreamEvent::ContentBlockStart { index, content_block } => {
                assert_eq!(index, 1);
                match content_block {
                    ContentBlockStart::ToolUse { id, name } => {
                        assert_eq!(id, "toolu_123");
                        assert_eq!(name, "Bash");
                    }
                    _ => panic!("Expected ToolUse start"),
                }
            }
            _ => panic!("Expected ContentBlockStart"),
        }

        let msg_delta = r#"{"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":42}}"#;
        let event: StreamEvent = serde_json::from_str(msg_delta).unwrap();
        match event {
            StreamEvent::MessageDelta { delta, usage } => {
                assert_eq!(delta.stop_reason.as_deref(), Some("end_turn"));
                assert_eq!(usage.unwrap().output_tokens, 42);
            }
            _ => panic!("Expected MessageDelta"),
        }

        let msg_stop = r#"{"type":"message_stop"}"#;
        let event: StreamEvent = serde_json::from_str(msg_stop).unwrap();
        assert!(matches!(event, StreamEvent::MessageStop));

        let ping = r#"{"type":"ping"}"#;
        let event: StreamEvent = serde_json::from_str(ping).unwrap();
        assert!(matches!(event, StreamEvent::Ping));
    }

    #[test]
    fn test_content_block_serialization_roundtrip() {
        let block = ContentBlock::tool_use("toolu_1", "Bash", serde_json::json!({"command": "ls"}));
        let json = serde_json::to_string(&block).unwrap();
        let parsed: ContentBlock = serde_json::from_str(&json).unwrap();
        match parsed {
            ContentBlock::ToolUse { id, name, input } => {
                assert_eq!(id, "toolu_1");
                assert_eq!(name, "Bash");
                assert_eq!(input["command"], "ls");
            }
            _ => panic!("Expected ToolUse"),
        }
    }

    #[test]
    fn test_tool_result_content() {
        let block = ContentBlock::tool_result("toolu_1", vec![ToolResultContent::text("ok")], false);
        let json = serde_json::to_value(&block).unwrap();
        assert_eq!(json["type"], "tool_result");
        assert_eq!(json["tool_use_id"], "toolu_1");
        assert!(json.get("is_error").is_none()); // false → omitted
        assert_eq!(json["content"][0]["type"], "text");
        assert_eq!(json["content"][0]["text"], "ok");
    }

    #[test]
    fn test_stop_reason_from_str() {
        assert_eq!(StopReason::from("end_turn"), StopReason::EndTurn);
        assert_eq!(StopReason::from("tool_use"), StopReason::ToolUse);
        assert_eq!(StopReason::from("max_tokens"), StopReason::MaxTokens);
        assert_eq!(StopReason::from("stop_sequence"), StopReason::StopSequence);
        assert_eq!(StopReason::from("something"), StopReason::Unknown("something".to_string()));
    }

    #[test]
    fn test_thinking_block_deserialization() {
        let thinking_start = r#"{"type":"content_block_start","index":0,"content_block":{"type":"thinking","thinking":""}}"#;
        let event: StreamEvent = serde_json::from_str(thinking_start).unwrap();
        assert!(matches!(event, StreamEvent::ContentBlockStart { index: 0, content_block: ContentBlockStart::Thinking { .. } }));

        let thinking_delta = r#"{"type":"content_block_delta","index":0,"delta":{"type":"thinking_delta","thinking":"Let me think..."}}"#;
        let event: StreamEvent = serde_json::from_str(thinking_delta).unwrap();
        match event {
            StreamEvent::ContentBlockDelta { delta: Delta::ThinkingDelta { thinking }, .. } => {
                assert_eq!(thinking, "Let me think...");
            }
            _ => panic!("Expected ThinkingDelta"),
        }
    }
}
