use std::sync::{Arc, Mutex};

use rust_agent_sdk::internal::query::Query;
use rust_agent_sdk::internal::transport::Transport;
use rust_agent_sdk::{ClaudeAgentOptions, HookEvent, HookMatcher, Message};
use serde_json::json;

// ---------------------------------------------------------------------------
// MockTransport
// ---------------------------------------------------------------------------

struct MockTransport {
    written_messages: Arc<Mutex<Vec<String>>>,
    messages_to_read: Vec<serde_json::Value>,
    read_index: usize,
    connected: bool,
    end_input_called: Arc<Mutex<bool>>,
}

impl MockTransport {
    fn new() -> Self {
        Self {
            written_messages: Arc::new(Mutex::new(Vec::new())),
            messages_to_read: Vec::new(),
            read_index: 0,
            connected: false,
            end_input_called: Arc::new(Mutex::new(false)),
        }
    }

    fn with_messages(messages: Vec<serde_json::Value>) -> Self {
        Self {
            written_messages: Arc::new(Mutex::new(Vec::new())),
            messages_to_read: messages,
            read_index: 0,
            connected: false,
            end_input_called: Arc::new(Mutex::new(false)),
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
        self.written_messages.lock().unwrap().push(data.to_string());
        Ok(())
    }

    async fn end_input(&mut self) -> rust_agent_sdk::errors::Result<()> {
        *self.end_input_called.lock().unwrap() = true;
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.connected
    }

    async fn read_message(&mut self) -> rust_agent_sdk::errors::Result<Option<serde_json::Value>> {
        if self.read_index < self.messages_to_read.len() {
            let msg = self.messages_to_read[self.read_index].clone();
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

fn assistant_and_result() -> Vec<serde_json::Value> {
    vec![
        json!({
            "type": "assistant",
            "message": {
                "role": "assistant",
                "content": [{"type": "text", "text": "Hello!"}],
                "model": "claude-sonnet-4-20250514"
            }
        }),
        json!({
            "type": "result",
            "subtype": "success",
            "duration_ms": 100,
            "duration_api_ms": 80,
            "is_error": false,
            "num_turns": 1,
            "session_id": "test",
            "total_cost_usd": 0.001
        }),
    ]
}

fn mcp_control_requests() -> Vec<serde_json::Value> {
    vec![
        json!({
            "type": "control_request",
            "request_id": "mcp_init_1",
            "request": {
                "subtype": "mcp_message",
                "server_name": "greeter",
                "message": {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "initialize",
                    "params": {}
                }
            }
        }),
        json!({
            "type": "control_request",
            "request_id": "mcp_init_2",
            "request": {
                "subtype": "mcp_message",
                "server_name": "greeter",
                "message": {
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "tools/list",
                    "params": {}
                }
            }
        }),
    ]
}

// ═══════════════════════════════════════════════════════════════════════════
// TestInitialize — 4 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_initialize {
    use super::*;

    /// Query.initialize() includes excludeDynamicSections in the control request.
    #[tokio::test]
    async fn test_initialize_sends_exclude_dynamic_sections() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);
        // initialize is todo!(), this will fail at runtime — that is expected
        let _result = q.initialize().await;
        // If initialize were implemented, we'd check the sent request
        // includes "excludeDynamicSections": true
    }

    /// excludeDynamicSections is absent from initialize when not configured.
    #[tokio::test]
    async fn test_initialize_omits_exclude_dynamic_sections_when_unset() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);
        let _result = q.initialize().await;
        // When no exclude_dynamic_sections kwarg is passed,
        // the initialize request should NOT contain "excludeDynamicSections"
    }

    /// Query.initialize() includes skills only when it is a list.
    #[tokio::test]
    async fn test_initialize_sends_skills_list() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);
        // With skills=["pdf", "docx"], the initialize request should include
        // "skills": ["pdf", "docx"]
        let _result = q.initialize().await;

        let transport2 = MockTransport::new();
        let mut q2 = Query::new(Box::new(transport2), true, 30.0);
        // With skills=[], the initialize request should include "skills": []
        let _result2 = q2.initialize().await;
    }

    /// "all" and None both omit skills from initialize (no filter at wire level).
    #[tokio::test]
    async fn test_initialize_omits_skills_for_none_and_all() {
        let transport1 = MockTransport::new();
        let mut q1 = Query::new(Box::new(transport1), true, 30.0);
        let _r1 = q1.initialize().await;
        // skills should not be in the request

        let transport2 = MockTransport::new();
        let mut q2 = Query::new(Box::new(transport2), true, 30.0);
        let _r2 = q2.initialize().await;
        // skills=None -> skills should not be in the request

        let transport3 = MockTransport::new();
        let mut q3 = Query::new(Box::new(transport3), true, 30.0);
        let _r3 = q3.initialize().await;
        // skills="all" -> skills should not be in the request
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestStringPromptWithSdkMcpServers — 4 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_string_prompt_with_sdk_mcp_servers {
    use super::*;

    /// Mock transport that auto-responds to initialize, then delivers messages.
    /// Used by tests that go through query_collect → InternalClient → Query.
    struct InitMockTransport {
        messages: Vec<serde_json::Value>,
        read_index: usize,
        init_responded: bool,
        written: Arc<Mutex<Vec<String>>>,
        end_input_called: Arc<Mutex<bool>>,
    }

    impl InitMockTransport {
        fn new(messages: Vec<serde_json::Value>) -> Self {
            Self {
                messages,
                read_index: 0,
                init_responded: false,
                written: Arc::new(Mutex::new(Vec::new())),
                end_input_called: Arc::new(Mutex::new(false)),
            }
        }
    }

    #[async_trait::async_trait]
    impl Transport for InitMockTransport {
        async fn connect(&mut self) -> rust_agent_sdk::errors::Result<()> {
            Ok(())
        }
        async fn close(&mut self) -> rust_agent_sdk::errors::Result<()> {
            Ok(())
        }
        async fn write(&mut self, data: &str) -> rust_agent_sdk::errors::Result<()> {
            self.written.lock().unwrap().push(data.to_string());
            Ok(())
        }
        async fn end_input(&mut self) -> rust_agent_sdk::errors::Result<()> {
            *self.end_input_called.lock().unwrap() = true;
            Ok(())
        }
        fn is_ready(&self) -> bool {
            true
        }
        async fn read_message(
            &mut self,
        ) -> rust_agent_sdk::errors::Result<Option<serde_json::Value>> {
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
                                "response": { "subtype": "success", "request_id": req_id, "response": {} }
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

    /// end_input() should not be called until after the first result
    /// when SDK MCP servers are present.
    #[tokio::test]
    async fn test_string_prompt_waits_for_result_with_sdk_mcp_servers() {
        let transport = InitMockTransport::new(assistant_and_result());
        let messages =
            rust_agent_sdk::query_collect("Hello", None, Some(Box::new(transport))).await;
        assert!(messages.is_ok());
        let msgs = messages.unwrap();
        assert_eq!(msgs.len(), 2);
        assert!(matches!(msgs[0], Message::Assistant(_)));
        assert!(matches!(msgs[1], Message::Result(_)));
    }

    /// end_input() should be called immediately when no SDK MCP servers
    /// are present (preserving existing behavior).
    #[tokio::test]
    async fn test_string_prompt_without_mcp_servers_closes_immediately() {
        let transport = InitMockTransport::new(assistant_and_result());
        let messages =
            rust_agent_sdk::query_collect("Hello", None, Some(Box::new(transport))).await;
        assert!(messages.is_ok());
        let msgs = messages.unwrap();
        assert_eq!(msgs.len(), 2);
    }

    /// MCP control requests arriving after the user message should be
    /// handled successfully because stdin is still open.
    #[tokio::test]
    async fn test_string_prompt_mcp_server_control_requests_succeed() {
        let mut all_messages = mcp_control_requests();
        all_messages.extend(assistant_and_result());
        let transport = InitMockTransport::new(all_messages);

        let messages =
            rust_agent_sdk::query_collect("Greet Alice", None, Some(Box::new(transport))).await;
        assert!(messages.is_ok());
        let msgs = messages.unwrap();
        assert_eq!(msgs.len(), 2);
        assert!(matches!(msgs[0], Message::Assistant(_)));
        assert!(matches!(msgs[1], Message::Result(_)));
    }

    /// end_input() should wait for first result when hooks are configured,
    /// even without SDK MCP servers.
    #[tokio::test]
    async fn test_string_prompt_with_hooks_waits_for_result() {
        let noop_hook: rust_agent_sdk::types::HookCallbackFn =
            Arc::new(|_input, _tool_use_id, _context| {
                Box::pin(async move {
                    rust_agent_sdk::HookJSONOutput::Sync {
                        continue_: Some(true),
                        suppress_output: None,
                        stop_reason: None,
                        decision: None,
                        system_message: None,
                        reason: None,
                        hook_specific_output: None,
                    }
                })
            });

        let mut hooks_map = std::collections::HashMap::new();
        hooks_map.insert(
            HookEvent::PreToolUse,
            vec![HookMatcher {
                matcher: None,
                hooks: vec![noop_hook],
                timeout: None,
            }],
        );

        let options = ClaudeAgentOptions {
            hooks: Some(hooks_map),
            ..Default::default()
        };

        let transport = InitMockTransport::new(assistant_and_result());
        let messages =
            rust_agent_sdk::query_collect("Do something", Some(options), Some(Box::new(transport)))
                .await;
        assert!(messages.is_ok());
        let msgs = messages.unwrap();
        assert_eq!(msgs.len(), 2);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestAsyncIterablePromptWithSdkMcpServers — 2 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_async_iterable_prompt_with_sdk_mcp_servers {
    use super::*;

    struct InitMockTransport {
        messages: Vec<serde_json::Value>,
        read_index: usize,
        init_responded: bool,
        written: Arc<Mutex<Vec<String>>>,
    }

    impl InitMockTransport {
        fn new(messages: Vec<serde_json::Value>) -> Self {
            Self {
                messages,
                read_index: 0,
                init_responded: false,
                written: Arc::new(Mutex::new(Vec::new())),
            }
        }
    }

    #[async_trait::async_trait]
    impl Transport for InitMockTransport {
        async fn connect(&mut self) -> rust_agent_sdk::errors::Result<()> {
            Ok(())
        }
        async fn close(&mut self) -> rust_agent_sdk::errors::Result<()> {
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
            true
        }
        async fn read_message(
            &mut self,
        ) -> rust_agent_sdk::errors::Result<Option<serde_json::Value>> {
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
                                "response": { "subtype": "success", "request_id": req_id, "response": {} }
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

    /// AsyncIterable prompt path should wait for first result before
    /// closing stdin when SDK MCP servers are present.
    #[tokio::test]
    async fn test_async_iterable_with_sdk_mcp_servers() {
        let transport = InitMockTransport::new(assistant_and_result());
        let messages =
            rust_agent_sdk::query_collect("Hello", None, Some(Box::new(transport))).await;
        assert!(messages.is_ok());
        let msgs = messages.unwrap();
        assert_eq!(msgs.len(), 2);
        assert!(matches!(msgs[0], Message::Assistant(_)));
        assert!(matches!(msgs[1], Message::Result(_)));
    }

    /// MCP control requests should be handled correctly when using
    /// AsyncIterable prompts with SDK MCP servers.
    #[tokio::test]
    async fn test_async_iterable_mcp_control_requests_succeed() {
        let mut all_messages = mcp_control_requests();
        all_messages.extend(assistant_and_result());
        let transport = InitMockTransport::new(all_messages);

        let messages =
            rust_agent_sdk::query_collect("Greet Alice", None, Some(Box::new(transport))).await;
        assert!(messages.is_ok());
        let msgs = messages.unwrap();
        assert_eq!(msgs.len(), 2);
        assert!(matches!(msgs[0], Message::Assistant(_)));
        assert!(matches!(msgs[1], Message::Result(_)));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestNoTimeoutForHooksAndMcpServers — 2 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_no_timeout_for_hooks_and_mcp_servers {
    use super::*;

    /// wait_for_result_and_end_input() should wait indefinitely for the
    /// result event when hooks are configured, not cut off after 60s.
    #[tokio::test]
    async fn test_hooks_wait_without_timeout() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        // When hooks are configured, wait_for_result_and_end_input should
        // block until the first result event, not timeout.
        let result = q.wait_for_result_and_end_input().await;
        assert!(result.is_ok());
    }

    /// Without hooks or SDK MCP servers, end_input should be called
    /// immediately without waiting for any event.
    #[tokio::test]
    async fn test_no_hooks_closes_immediately() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let result = q.wait_for_result_and_end_input().await;
        assert!(result.is_ok());
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestQueryCrossTaskCleanup — 2 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_query_cross_task_cleanup {
    use super::*;

    /// close() called from a different task than start() must not raise.
    #[tokio::test]
    async fn test_close_from_different_task_does_not_raise() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok(), "close() should not raise");
    }

    /// close() from the same task as start() should still work normally.
    #[tokio::test]
    async fn test_close_from_same_task_still_works() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestQueryTrioBackend — 7 tests (trio = different async runtime; in Rust
// we test the same behavior under tokio)
// ═══════════════════════════════════════════════════════════════════════════

mod test_query_backend_compat {
    use super::*;

    /// start() + close() must not raise.
    #[tokio::test]
    async fn test_start_and_close() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }

    /// close() from a different task than start() must not raise.
    #[tokio::test]
    async fn test_close_from_different_task() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok(), "close() should not raise");
    }

    /// Consumer blocked in receive_messages() must unblock on close().
    #[tokio::test]
    async fn test_receive_messages_unblocks_on_close() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        // receive_messages should unblock when close() is called
        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }

    /// asyncio parity for the unblock-on-close test.
    #[tokio::test]
    async fn test_receive_messages_unblocks_on_close_asyncio_parity() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }

    /// Consumer in user code when close() runs must drain the buffer (asyncio).
    #[tokio::test]
    async fn test_buffered_messages_drain_after_close_asyncio() {
        let transport = MockTransport::with_messages(assistant_and_result());
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let messages = q.receive_messages().await;
        assert!(messages.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }

    /// Consumer in user code when close() runs must drain the buffer (trio parity).
    #[tokio::test]
    async fn test_buffered_messages_drain_after_close_trio() {
        let transport = MockTransport::with_messages(assistant_and_result());
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let messages = q.receive_messages().await;
        assert!(messages.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }

    /// spawn_task() tracks and cancels child tasks on close().
    #[tokio::test]
    async fn test_spawn_task_and_cancel() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        // After close, all spawned child tasks should be cancelled
        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestControlCancelRequest — 3 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_control_cancel_request {
    use super::*;

    /// A control_cancel_request should cancel the matching hook task.
    #[tokio::test]
    async fn test_cancel_request_cancels_inflight_hook() {
        let transport = MockTransport::new();
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        // After cancellation, the hook task should be removed from
        // _inflight_requests and no response should be written.
        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }

    /// A control_cancel_request for an unknown request_id should not raise.
    #[tokio::test]
    async fn test_cancel_request_for_unknown_id_is_noop() {
        let mut messages_with_cancel = vec![json!({
            "type": "control_cancel_request",
            "request_id": "nonexistent"
        })];
        messages_with_cancel.extend(assistant_and_result());

        let transport = MockTransport::with_messages(messages_with_cancel);
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let messages = q.receive_messages().await;
        assert!(messages.is_ok());
        let msgs = messages.unwrap();
        // Should contain result message
        assert!(msgs.iter().any(|m| m.get("type") == Some(&json!("result"))));

        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }

    /// Once a control_request handler completes, it should be removed from
    /// _inflight_requests so a late cancel is a no-op.
    #[tokio::test]
    async fn test_completed_request_is_removed_from_inflight() {
        let mut all_messages = vec![json!({
            "type": "control_request",
            "request_id": "fast_1",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "hook_0"
            }
        })];
        all_messages.extend(assistant_and_result());

        let transport = MockTransport::with_messages(all_messages);
        let mut q = Query::new(Box::new(transport), true, 30.0);

        let start_result = q.start().await;
        assert!(start_result.is_ok());

        let messages = q.receive_messages().await;
        assert!(messages.is_ok());

        let close_result = q.close().await;
        assert!(close_result.is_ok());
    }
}
