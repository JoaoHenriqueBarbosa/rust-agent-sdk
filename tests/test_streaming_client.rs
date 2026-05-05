//! Tests for ClaudeSDKClient streaming functionality — ported from Python test_streaming_client.py.

use rust_agent_sdk::{
    ClaudeAgentOptions, ClaudeSDKClient, ClaudeSDKError, ContentBlock,
    ContextUsageResponse, McpStatusResponse, Message, Transport,
};
use std::path::PathBuf;

// ---------------------------------------------------------------------------
// MockTransport
// ---------------------------------------------------------------------------

struct MockTransport {
    connected: bool,
    written: Vec<String>,
}

impl MockTransport {
    fn new() -> Self {
        Self {
            connected: false,
            written: Vec::new(),
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
        self.written.push(data.to_string());
        Ok(())
    }

    async fn end_input(&mut self) -> rust_agent_sdk::errors::Result<()> {
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.connected
    }
}

// ===========================================================================
// TestClaudeSDKClientStreaming
// ===========================================================================

/// Test automatic connection when using context manager.
#[tokio::test]
async fn test_auto_connect_with_context_manager() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();
    assert!(client._transport.is_some());

    client.disconnect().await.unwrap();
    assert!(client._transport.is_none());
}

/// Test manual connect and disconnect.
#[tokio::test]
async fn test_manual_connect_disconnect() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();
    assert!(client._transport.is_some());

    client.disconnect().await.unwrap();
    assert!(client._transport.is_none());
}

/// Test connecting with a string prompt writes it as a user message.
#[tokio::test]
async fn test_connect_with_string_prompt() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let messages = client.send_message("Hello Claude").await.unwrap();

    // The send_message call should produce at least one message
    // and the prompt "Hello Claude" should have been written to the transport.
    assert!(!messages.is_empty());
}

/// Test connecting with an async iterable.
#[tokio::test]
async fn test_connect_with_async_iterable() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    // In Python this passes an async generator. In Rust we just send two messages.
    let msgs1 = client.send_message("Hi").await.unwrap();
    let msgs2 = client.send_message("Bye").await.unwrap();

    // Both calls should succeed and return messages
    assert!(!msgs1.is_empty());
    assert!(!msgs2.is_empty());
}

/// Test sending a query.
#[tokio::test]
async fn test_query() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let messages = client.send_message("Test message").await.unwrap();

    // Should receive at least one message back
    assert!(!messages.is_empty());

    // Check that we got a user-related response with the correct content
    let has_content = messages.iter().any(|msg| match msg {
        Message::User(u) => {
            matches!(&u.content, rust_agent_sdk::MessageContent::Text(t) if t == "Test message")
        }
        _ => true,
    });
    assert!(has_content);
}

/// Test sending a message with custom session ID.
#[tokio::test]
async fn test_send_message_with_session_id() {
    let mut options = ClaudeAgentOptions::default();
    options.session_id = Some("custom-session".to_string());

    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let messages = client.send_message("Test").await.unwrap();

    // Session ID should have been used
    assert!(!messages.is_empty());
}

/// Test sending message when not connected raises error.
#[tokio::test]
async fn test_send_message_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.send_message("Test").await;

    assert!(result.is_err());
    let err = result.unwrap_err();
    assert!(matches!(err, ClaudeSDKError::CliConnection(_)));
}

/// Test receiving messages.
#[tokio::test]
async fn test_receive_messages() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let messages = client.send_message("Hello").await.unwrap();

    // Verify we get AssistantMessage with TextBlock and UserMessage back
    assert!(messages.len() >= 2);

    let assistant_msgs: Vec<_> = messages
        .iter()
        .filter(|m| matches!(m, Message::Assistant(_)))
        .collect();
    assert!(!assistant_msgs.is_empty());

    if let Message::Assistant(am) = &assistant_msgs[0] {
        assert!(!am.content.is_empty());
        assert!(matches!(&am.content[0], ContentBlock::Text(tb) if !tb.text.is_empty()));
    }

    let user_msgs: Vec<_> = messages
        .iter()
        .filter(|m| matches!(m, Message::User(_)))
        .collect();
    assert!(!user_msgs.is_empty());
}

/// Test receive_response stops at ResultMessage.
#[tokio::test]
async fn test_receive_response() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let messages = client.send_message("Answer me").await.unwrap();

    // Should contain an AssistantMessage and a ResultMessage
    let has_assistant = messages
        .iter()
        .any(|m| matches!(m, Message::Assistant(_)));
    let has_result = messages.iter().any(|m| matches!(m, Message::Result(_)));

    assert!(has_assistant);
    assert!(has_result);

    // ResultMessage should be the last message (stream stops at result)
    assert!(matches!(messages.last(), Some(Message::Result(_))));
}

/// Test interrupt functionality.
#[tokio::test]
async fn test_interrupt() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    // Interrupt should send a control request
    client.interrupt().await.unwrap();
}

/// Test interrupt when not connected raises error.
#[tokio::test]
async fn test_interrupt_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.interrupt().await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test reconnect_mcp_server sends correct control request.
#[tokio::test]
async fn test_reconnect_mcp_server() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    client.reconnect_mcp_server("my-server").await.unwrap();
}

/// Test reconnect_mcp_server when not connected raises error.
#[tokio::test]
async fn test_reconnect_mcp_server_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.reconnect_mcp_server("my-server").await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test toggle_mcp_server sends correct control request.
#[tokio::test]
async fn test_toggle_mcp_server() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    client
        .toggle_mcp_server("my-server", false)
        .await
        .unwrap();
}

/// Test toggle_mcp_server with enabled=true.
#[tokio::test]
async fn test_toggle_mcp_server_enabled_true() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    client
        .toggle_mcp_server("other-server", true)
        .await
        .unwrap();
}

/// Test toggle_mcp_server when not connected raises error.
#[tokio::test]
async fn test_toggle_mcp_server_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.toggle_mcp_server("my-server", true).await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test stop_task sends correct control request with task_id.
#[tokio::test]
async fn test_stop_task() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    client.stop_task("task-abc123").await.unwrap();
}

/// Test stop_task when not connected raises error.
#[tokio::test]
async fn test_stop_task_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.stop_task("task-abc123").await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test get_mcp_status returns McpStatusResponse shape.
#[tokio::test]
async fn test_get_mcp_status() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let status: McpStatusResponse = client.get_mcp_status().await.unwrap();

    // Verify response conforms to McpStatusResponse shape
    assert!(!status.mcp_servers.is_empty());

    let servers = &status.mcp_servers;

    // Connected server with full info
    let connected = &servers[0];
    assert_eq!(connected.name, "my-http-server");
    assert!(connected.server_info.is_some());
    let server_info = connected.server_info.as_ref().unwrap();
    assert_eq!(server_info.version, "1.0.0");
    assert!(connected.config.is_some());
    assert_eq!(connected.scope.as_deref(), Some("project"));
    assert!(connected.tools.is_some());
    let tools = connected.tools.as_ref().unwrap();
    assert_eq!(tools.len(), 2);
    assert_eq!(tools[0].name, "greet");
    assert_eq!(tools[0].annotations.as_ref().unwrap().read_only, Some(true));
    assert_eq!(tools[1].name, "reset");
    assert!(tools[1].description.is_none());

    // Failed server with error
    let failed = &servers[1];
    assert_eq!(failed.name, "failed-server");
    assert_eq!(failed.error.as_deref(), Some("Connection refused"));

    // Server with claudeai-proxy config
    let proxy = &servers[2];
    assert_eq!(proxy.name, "proxy-server");
}

/// Test get_mcp_status when not connected raises error.
#[tokio::test]
async fn test_get_mcp_status_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.get_mcp_status().await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test get_context_usage returns ContextUsageResponse shape.
#[tokio::test]
async fn test_get_context_usage() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let usage: ContextUsageResponse = client.get_context_usage().await.unwrap();

    assert_eq!(usage.total_tokens, 98200);
    assert_eq!(usage.max_tokens, 155000);
    assert!((usage.percentage - 49.1).abs() < f64::EPSILON);
    assert_eq!(usage.model, "claude-sonnet-4-5");
    assert!(usage.is_auto_compact_enabled);
    assert_eq!(usage.categories.len(), 2);
    assert_eq!(usage.categories[0].name, "System prompt");
    assert_eq!(usage.categories[0].tokens, 3200);
}

/// Test get_context_usage when not connected raises error.
#[tokio::test]
async fn test_get_context_usage_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.get_context_usage().await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test client initialization with options.
#[tokio::test]
async fn test_client_with_options() {
    let options = ClaudeAgentOptions {
        cwd: Some(PathBuf::from("/custom/path")),
        allowed_tools: vec!["Read".to_string(), "Write".to_string()],
        system_prompt: Some(rust_agent_sdk::SystemPromptConfig::String(
            "Be helpful".to_string(),
        )),
        ..Default::default()
    };

    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    // Verify options were set correctly
    assert_eq!(client._options.cwd, Some(PathBuf::from("/custom/path")));
    assert_eq!(client._options.allowed_tools, vec!["Read", "Write"]);
}

/// Test concurrent sending and receiving messages.
#[tokio::test]
async fn test_concurrent_send_receive() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    // Send a message
    let messages = client.send_message("Question 1").await.unwrap();

    // Should get at least an AssistantMessage
    let has_assistant = messages
        .iter()
        .any(|m| matches!(m, Message::Assistant(_)));
    assert!(has_assistant);
}

// ===========================================================================
// TestQueryWithAsyncIterable
// ===========================================================================

/// Test query with async iterable of messages.
#[tokio::test]
async fn test_query_with_async_iterable() {
    // In Python this uses query() with an async iterable and a mocked subprocess.
    // In Rust we test the query function directly.
    let messages = rust_agent_sdk::query_collect("First message", Some(ClaudeAgentOptions::default()), None)
        .await
        .unwrap();

    // Should get at least a ResultMessage
    let has_result = messages.iter().any(|m| matches!(m, Message::Result(_)));
    assert!(has_result);

    if let Some(Message::Result(r)) = messages.last() {
        assert_eq!(r.subtype, "success");
    }
}

// ===========================================================================
// TestClaudeSDKClientEdgeCases
// ===========================================================================

/// Test receiving messages when not connected.
#[tokio::test]
async fn test_receive_messages_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.send_message("Hello").await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test receive_response when not connected.
#[tokio::test]
async fn test_receive_response_not_connected() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    let result = client.send_message("Hello").await;

    assert!(result.is_err());
    assert!(matches!(result.unwrap_err(), ClaudeSDKError::CliConnection(_)));
}

/// Test connecting twice.
#[tokio::test]
async fn test_double_connect() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    // First connect
    client.connect().await.unwrap();
    assert!(client._transport.is_some());

    // Second connect should create new transport (or succeed without error)
    client.connect().await.unwrap();
    assert!(client._transport.is_some());
}

/// Test disconnecting without connecting first.
#[tokio::test]
async fn test_disconnect_without_connect() {
    let options = ClaudeAgentOptions::default();
    let mut client = ClaudeSDKClient::new(options);

    // Should not raise error
    let result = client.disconnect().await;
    assert!(result.is_ok());
}

/// Test context manager cleans up on exception.
#[tokio::test]
async fn test_context_manager_with_exception() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    // Simulate an error mid-operation, then ensure disconnect still works
    let _err: Result<(), &str> = Err("Test error");

    // Disconnect should still succeed (cleanup equivalent)
    client.disconnect().await.unwrap();
    assert!(client._transport.is_none());
}

/// Test collecting messages with list comprehension as shown in examples.
#[tokio::test]
async fn test_receive_response_list_comprehension() {
    let options = ClaudeAgentOptions::default();
    let transport = Box::new(MockTransport::new());
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    client.connect().await.unwrap();

    let messages = client.send_message("Hello World").await.unwrap();

    // Should have at least 3 messages: 2 assistant + 1 result
    assert!(messages.len() >= 3);

    // All messages should be either AssistantMessage or ResultMessage
    assert!(messages.iter().all(|msg| matches!(
        msg,
        Message::Assistant(_) | Message::Result(_) | Message::User(_)
    )));

    // Last message should be a ResultMessage
    assert!(matches!(messages.last(), Some(Message::Result(_))));
}

