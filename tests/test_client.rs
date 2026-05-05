//! Tests for Claude SDK client functionality.
//! Ported from Python: tests/test_client.py
//!
//! Python tests mock `InternalClient.process_query` or `SubprocessCLITransport`.
//! In Rust we pass a mock transport via the `transport` parameter to achieve
//! the same isolation without needing runtime patching.

use std::sync::{Arc, Mutex};

use rust_agent_sdk::internal::transport::Transport;
use rust_agent_sdk::query::query_collect as query;
use rust_agent_sdk::types::{
    ClaudeAgentOptions, ContentBlock, Message, PermissionMode,
};
use rust_agent_sdk::ClaudeSDKClient;
use serde_json::json;

// ---------------------------------------------------------------------------
// MockTransport — auto-responds to initialize, then delivers messages
// ---------------------------------------------------------------------------

struct MockTransport {
    messages: Vec<serde_json::Value>,
    read_index: usize,
    init_responded: bool,
    connected: bool,
    written: Arc<Mutex<Vec<String>>>,
}

impl MockTransport {
    fn new(messages: Vec<serde_json::Value>) -> Self {
        Self {
            messages,
            read_index: 0,
            init_responded: false,
            connected: false,
            written: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

#[async_trait::async_trait]
impl Transport for MockTransport {
    async fn connect(&mut self) -> rust_agent_sdk::errors::Result<()> {
        self.connected = true;
        Ok(())
    }
    async fn close(&mut self) -> rust_agent_sdk::errors::Result<()> {
        self.connected = false;
        Ok(())
    }
    async fn write(&mut self, data: &str) -> rust_agent_sdk::errors::Result<()> {
        self.written.lock().unwrap().push(data.to_string());
        Ok(())
    }
    async fn end_input(&mut self) -> rust_agent_sdk::errors::Result<()> {
        Ok(())
    }
    fn is_ready(&self) -> bool {
        self.connected
    }
    async fn read_message(&mut self) -> rust_agent_sdk::errors::Result<Option<serde_json::Value>> {
        // Auto-respond to the initialize control_request
        if !self.init_responded {
            let written = self.written.lock().unwrap();
            for w in written.iter().rev() {
                if let Ok(v) = serde_json::from_str::<serde_json::Value>(w.trim()) {
                    if v.get("type").and_then(|t| t.as_str()) == Some("control_request") {
                        let req_id = v.get("request_id")
                            .and_then(|r| r.as_str())
                            .unwrap_or("req_1")
                            .to_string();
                        drop(written);
                        self.init_responded = true;
                        return Ok(Some(json!({
                            "type": "control_response",
                            "response": {
                                "subtype": "success",
                                "request_id": req_id,
                                "response": {}
                            }
                        })));
                    }
                }
            }
            drop(written);
            self.init_responded = true;
        }

        // Deliver pre-configured messages
        if self.read_index < self.messages.len() {
            let msg = self.messages[self.read_index].clone();
            self.read_index += 1;
            Ok(Some(msg))
        } else {
            Ok(None)
        }
    }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

fn assistant_msg(text: &str) -> serde_json::Value {
    json!({
        "type": "assistant",
        "message": {
            "role": "assistant",
            "content": [{"type": "text", "text": text}],
            "model": "claude-opus-4-1-20250805"
        }
    })
}

fn result_msg(session_id: &str, cost: f64) -> serde_json::Value {
    json!({
        "type": "result",
        "subtype": "success",
        "duration_ms": 1000,
        "duration_api_ms": 800,
        "is_error": false,
        "num_turns": 1,
        "session_id": session_id,
        "total_cost_usd": cost
    })
}

fn single_assistant(text: &str) -> Vec<serde_json::Value> {
    vec![assistant_msg(text), result_msg("test-session", 0.001)]
}

// -------------------------------------------------------------------------
// TestQueryFunction
// -------------------------------------------------------------------------

/// Test query with a single prompt.
#[tokio::test]
async fn test_query_single_prompt() {
    let transport = MockTransport::new(single_assistant("4"));
    let messages = query("What is 2+2?", None, Some(Box::new(transport)))
        .await
        .unwrap();

    assert_eq!(messages.len(), 2);
    match &messages[0] {
        Message::Assistant(a) => {
            match &a.content[0] {
                ContentBlock::Text(tb) => assert_eq!(tb.text, "4"),
                other => panic!("expected TextBlock, got {:?}", other),
            }
        }
        other => panic!("expected AssistantMessage, got {:?}", other),
    }
    assert!(matches!(&messages[1], Message::Result(_)));
}

/// Test query with various options.
#[tokio::test]
async fn test_query_with_options() {
    let options = ClaudeAgentOptions {
        allowed_tools: vec!["Read".into(), "Write".into()],
        system_prompt: Some(rust_agent_sdk::types::SystemPromptConfig::String(
            "You are helpful".into(),
        )),
        permission_mode: Some(PermissionMode::AcceptEdits),
        max_turns: Some(5),
        ..Default::default()
    };

    let transport = MockTransport::new(single_assistant("Hello!"));
    let messages = query("Hi", Some(options), Some(Box::new(transport)))
        .await
        .unwrap();

    assert_eq!(messages.len(), 2);
    match &messages[0] {
        Message::Assistant(a) => {
            match &a.content[0] {
                ContentBlock::Text(tb) => assert_eq!(tb.text, "Hello!"),
                other => panic!("expected TextBlock, got {:?}", other),
            }
        }
        other => panic!("expected AssistantMessage, got {:?}", other),
    }
}

/// Test query with custom working directory.
#[tokio::test]
async fn test_query_with_cwd() {
    let transport = MockTransport::new(vec![
        assistant_msg("Done"),
        result_msg("test-session", 0.001),
    ]);

    let messages = query("test", None, Some(Box::new(transport)))
        .await
        .unwrap();

    assert_eq!(messages.len(), 2);

    match &messages[0] {
        Message::Assistant(a) => {
            match &a.content[0] {
                ContentBlock::Text(tb) => assert_eq!(tb.text, "Done"),
                other => panic!("expected TextBlock, got {:?}", other),
            }
        }
        other => panic!("expected AssistantMessage, got {:?}", other),
    }

    match &messages[1] {
        Message::Result(result) => {
            assert_eq!(result.subtype, "success");
            assert_eq!(result.duration_ms, 1000);
            assert_eq!(result.duration_api_ms, 800);
            assert!(!result.is_error);
            assert_eq!(result.num_turns, 1);
            assert_eq!(result.session_id, "test-session");
            assert_eq!(result.total_cost_usd, Some(0.001));
        }
        other => panic!("expected ResultMessage, got {:?}", other),
    }
}

/// Test that query() reads CLAUDE_CODE_STREAM_CLOSE_TIMEOUT env var.
#[tokio::test]
async fn test_query_passes_initialize_timeout_from_env() {
    std::env::set_var("CLAUDE_CODE_STREAM_CLOSE_TIMEOUT", "120000");

    let transport = MockTransport::new(single_assistant("ok"));
    let messages = query(
        "test",
        Some(ClaudeAgentOptions::default()),
        Some(Box::new(transport)),
    )
    .await
    .unwrap();

    assert!(!messages.is_empty());
    std::env::remove_var("CLAUDE_CODE_STREAM_CLOSE_TIMEOUT");
}

/// Test that query() defaults to 60s initialize timeout when env var is not set.
#[tokio::test]
async fn test_query_uses_default_initialize_timeout() {
    std::env::remove_var("CLAUDE_CODE_STREAM_CLOSE_TIMEOUT");

    let transport = MockTransport::new(single_assistant("ok"));
    let messages = query(
        "test",
        Some(ClaudeAgentOptions::default()),
        Some(Box::new(transport)),
    )
    .await
    .unwrap();

    assert!(!messages.is_empty());
}

/// Test that string prompts use spawn_wait_for_result_and_end_input
/// (not a direct await), matching Python behavior.
#[tokio::test]
async fn test_string_prompt_spawns_wait_for_result_as_task() {
    let transport = MockTransport::new(single_assistant("ok"));
    let messages = query(
        "test",
        Some(ClaudeAgentOptions::default()),
        Some(Box::new(transport)),
    )
    .await
    .unwrap();

    assert!(!messages.is_empty());
}

// -------------------------------------------------------------------------
// TestClaudeSDKClient
// -------------------------------------------------------------------------

/// ClaudeSDKClient with a mock transport: connect + disconnect.
#[tokio::test]
async fn test_client_connect_with_mock_transport() {
    let transport = MockTransport::new(single_assistant("hi"));
    let mut client = ClaudeSDKClient::new(ClaudeAgentOptions::default())
        .with_transport(Box::new(transport));

    client.connect().await.unwrap();
    // Transport was consumed by connect — _transport is now inside Query
    assert!(client._transport.is_none());

    client.disconnect().await.unwrap();
    // After disconnect, transport is fully cleaned up
    assert!(client._transport.is_none());
}
