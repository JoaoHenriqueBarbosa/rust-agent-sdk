//! Integration tests for Claude SDK.
//!
//! These tests verify end-to-end functionality with mocked CLI responses.
//! Ported from Python: tests/test_integration.py
//!
//! Python tests mock `SubprocessCLITransport` and `Query.initialize`.
//! In Rust we pass a mock transport that auto-responds to initialize.

use std::sync::{Arc, Mutex};

use rust_agent_sdk::errors::ClaudeSDKError;
use rust_agent_sdk::internal::transport::Transport;
use rust_agent_sdk::query::query_collect as query;
use rust_agent_sdk::types::{ClaudeAgentOptions, ContentBlock, Message};
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
        if !self.init_responded {
            let written = self.written.lock().unwrap();
            for w in written.iter().rev() {
                if let Ok(v) = serde_json::from_str::<serde_json::Value>(w.trim()) {
                    if v.get("type").and_then(|t| t.as_str()) == Some("control_request") {
                        let req_id = v
                            .get("request_id")
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

fn tool_use_assistant() -> serde_json::Value {
    json!({
        "type": "assistant",
        "message": {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "Let me read that file for you."},
                {
                    "type": "tool_use",
                    "id": "tool-123",
                    "name": "Read",
                    "input": {"file_path": "/test.txt"}
                }
            ],
            "model": "claude-opus-4-1-20250805"
        }
    })
}

// -------------------------------------------------------------------------
// TestIntegration
// -------------------------------------------------------------------------

/// Test a simple query with text response.
#[tokio::test]
async fn test_simple_query_response() {
    let transport = MockTransport::new(vec![
        assistant_msg("2 + 2 equals 4"),
        result_msg("test-session", 0.001),
    ]);

    let messages = query("What is 2 + 2?", None, Some(Box::new(transport)))
        .await
        .unwrap();

    assert_eq!(messages.len(), 2);

    match &messages[0] {
        Message::Assistant(assistant) => {
            assert_eq!(assistant.content.len(), 1);
            match &assistant.content[0] {
                ContentBlock::Text(tb) => assert_eq!(tb.text, "2 + 2 equals 4"),
                other => panic!("expected TextBlock, got {:?}", other),
            }
        }
        other => panic!("expected AssistantMessage, got {:?}", other),
    }

    match &messages[1] {
        Message::Result(result) => {
            assert_eq!(result.total_cost_usd, Some(0.001));
            assert_eq!(result.session_id, "test-session");
        }
        other => panic!("expected ResultMessage, got {:?}", other),
    }
}

/// Test query that uses tools.
#[tokio::test]
async fn test_query_with_tool_use() {
    let transport = MockTransport::new(vec![
        tool_use_assistant(),
        result_msg("test-session-2", 0.002),
    ]);

    let options = ClaudeAgentOptions {
        allowed_tools: vec!["Read".into()],
        ..Default::default()
    };

    let messages = query("Read /test.txt", Some(options), Some(Box::new(transport)))
        .await
        .unwrap();

    assert_eq!(messages.len(), 2);

    match &messages[0] {
        Message::Assistant(assistant) => {
            assert_eq!(assistant.content.len(), 2);

            match &assistant.content[0] {
                ContentBlock::Text(tb) => {
                    assert_eq!(tb.text, "Let me read that file for you.");
                }
                other => panic!("expected TextBlock, got {:?}", other),
            }

            match &assistant.content[1] {
                ContentBlock::ToolUse(tool_use) => {
                    assert_eq!(tool_use.name, "Read");
                    assert_eq!(tool_use.input["file_path"], "/test.txt");
                }
                other => panic!("expected ToolUseBlock, got {:?}", other),
            }
        }
        other => panic!("expected AssistantMessage, got {:?}", other),
    }
}

/// Test handling when CLI is not found (no transport provided, no CLI on PATH).
#[tokio::test]
async fn test_cli_not_found() {
    // Set cli_path to a nonexistent binary so the transport fails to spawn
    let options = ClaudeAgentOptions {
        cli_path: Some(std::path::PathBuf::from("/nonexistent/path/to/claude")),
        ..Default::default()
    };

    let result = query("test", Some(options), None).await;

    match result {
        Err(ClaudeSDKError::CliConnection(msg)) => {
            assert!(
                msg.contains("No such file") || msg.contains("not found"),
                "error message should indicate missing binary, got: {}",
                msg
            );
        }
        Err(other) => panic!("expected CliConnection error, got: {:?}", other),
        Ok(_) => panic!("expected error, got Ok"),
    }
}

/// Test query with continue_conversation option.
#[tokio::test]
async fn test_continuation_option() {
    let transport = MockTransport::new(vec![
        assistant_msg("Continuing from previous conversation"),
        result_msg("test-session", 0.001),
    ]);

    let options = ClaudeAgentOptions {
        continue_conversation: true,
        ..Default::default()
    };

    let messages = query("Continue", Some(options), Some(Box::new(transport)))
        .await
        .unwrap();

    assert!(!messages.is_empty());

    match &messages[0] {
        Message::Assistant(assistant) => match &assistant.content[0] {
            ContentBlock::Text(tb) => {
                assert_eq!(tb.text, "Continuing from previous conversation");
            }
            other => panic!("expected TextBlock, got {:?}", other),
        },
        other => panic!("expected AssistantMessage, got {:?}", other),
    }
}

/// Test query with max_budget_usd option.
#[tokio::test]
async fn test_max_budget_usd_option() {
    let transport = MockTransport::new(vec![
        assistant_msg("Starting to read..."),
        json!({
            "type": "result",
            "subtype": "error_max_budget_usd",
            "duration_ms": 500,
            "duration_api_ms": 400,
            "is_error": false,
            "num_turns": 1,
            "session_id": "test-session-budget",
            "total_cost_usd": 0.0002,
            "usage": {
                "input_tokens": 100,
                "output_tokens": 50
            }
        }),
    ]);

    let options = ClaudeAgentOptions {
        max_budget_usd: Some(0.0001),
        ..Default::default()
    };

    let messages = query("Read the readme", Some(options), Some(Box::new(transport)))
        .await
        .unwrap();

    assert_eq!(messages.len(), 2);

    match &messages[1] {
        Message::Result(result) => {
            assert_eq!(result.subtype, "error_max_budget_usd");
            assert!(!result.is_error);
            assert_eq!(result.total_cost_usd, Some(0.0002));
            assert!(result.total_cost_usd.unwrap() > 0.0);
        }
        other => panic!("expected ResultMessage, got {:?}", other),
    }
}
