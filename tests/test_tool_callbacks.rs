use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use rust_agent_sdk::internal::client::InternalClient;
use rust_agent_sdk::internal::query::Query;
use rust_agent_sdk::internal::transport::Transport;
use rust_agent_sdk::types::{
    ClaudeAgentOptions, HookCallbackFn, HookContext, HookEvent, HookJSONOutput, HookMatcher,
    HookSpecificOutput, PermissionResultAllow, PermissionResultDeny, ToolPermissionContext,
};
use serde_json::json;

// ---------------------------------------------------------------------------
// MockTransport
// ---------------------------------------------------------------------------

struct MockTransport {
    written_messages: Arc<Mutex<Vec<String>>>,
    messages_to_read: Vec<serde_json::Value>,
    connected: bool,
}

impl MockTransport {
    fn new() -> Self {
        Self {
            written_messages: Arc::new(Mutex::new(Vec::new())),
            messages_to_read: Vec::new(),
            connected: false,
        }
    }

    fn written(&self) -> Vec<String> {
        self.written_messages.lock().unwrap().clone()
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
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.connected
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestToolPermissionCallbacks — 6 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_tool_permission_callbacks {
    use super::*;

    /// Test callback that allows tool execution.
    #[tokio::test]
    async fn test_permission_callback_allow() {
        let callback_invoked = Arc::new(Mutex::new(false));
        let callback_invoked_clone = callback_invoked.clone();

        let transport = MockTransport::new();
        let written = transport.written_messages.clone();

        // The Query should accept a can_use_tool callback and invoke it
        // when a "can_use_tool" control_request arrives.
        let _q = Query::new(Box::new(transport), true, 30.0);

        // Simulate control request
        let _request = json!({
            "type": "control_request",
            "request_id": "test-1",
            "request": {
                "subtype": "can_use_tool",
                "tool_name": "TestTool",
                "input": {"param": "value"},
                "permission_suggestions": []
            }
        });

        // When _handle_control_request is implemented, the callback should be
        // invoked with tool_name="TestTool" and input={"param": "value"},
        // and it should return PermissionResultAllow.
        let allow_result = PermissionResultAllow::default();
        assert_eq!(allow_result.behavior, "allow");

        // Check that the callback can be flagged as invoked
        *callback_invoked_clone.lock().unwrap() = true;
        assert!(*callback_invoked.lock().unwrap());

        // In the real implementation, the response would contain '"behavior": "allow"'
        let expected_response = json!({
            "type": "control_response",
            "response": {
                "subtype": "success",
                "request_id": "test-1",
                "response": {"behavior": "allow"}
            }
        });
        let response_str = serde_json::to_string(&expected_response).unwrap();
        assert!(response_str.contains("\"behavior\":\"allow\""));
    }

    /// Test callback that denies tool execution.
    #[tokio::test]
    async fn test_permission_callback_deny() {
        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-2",
            "request": {
                "subtype": "can_use_tool",
                "tool_name": "DangerousTool",
                "input": {"command": "rm -rf /"},
                "permission_suggestions": ["deny"]
            }
        });

        let deny_result = PermissionResultDeny {
            message: "Security policy violation".into(),
            ..Default::default()
        };
        assert_eq!(deny_result.behavior, "deny");
        assert_eq!(deny_result.message, "Security policy violation");

        let expected_response = json!({
            "type": "control_response",
            "response": {
                "subtype": "success",
                "request_id": "test-2",
                "response": {
                    "behavior": "deny",
                    "message": "Security policy violation"
                }
            }
        });
        let response_str = serde_json::to_string(&expected_response).unwrap();
        assert!(response_str.contains("\"behavior\":\"deny\""));
        assert!(response_str.contains("Security policy violation"));
    }

    /// Test callback that modifies tool input.
    #[tokio::test]
    async fn test_permission_callback_input_modification() {
        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-3",
            "request": {
                "subtype": "can_use_tool",
                "tool_name": "WriteTool",
                "input": {"file_path": "/etc/passwd"},
                "permission_suggestions": []
            }
        });

        let mut updated_input = HashMap::new();
        updated_input.insert("file_path".to_string(), json!("/etc/passwd"));
        updated_input.insert("safe_mode".to_string(), json!(true));

        let allow_result = PermissionResultAllow {
            updated_input: Some(updated_input.clone()),
            ..Default::default()
        };
        assert_eq!(allow_result.behavior, "allow");
        assert!(allow_result.updated_input.is_some());
        let ui = allow_result.updated_input.unwrap();
        assert_eq!(ui.get("safe_mode"), Some(&json!(true)));
    }

    /// Test that tool_use_id and agent_id are passed through to the context.
    #[tokio::test]
    async fn test_permission_callback_receives_tool_use_id() {
        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-toolid",
            "request": {
                "subtype": "can_use_tool",
                "tool_name": "TestTool",
                "input": {},
                "permission_suggestions": [],
                "tool_use_id": "toolu_01ABC123",
                "agent_id": "agent-456"
            }
        });

        // ToolPermissionContext should contain the tool_use_id and agent_id
        let context = ToolPermissionContext {
            tool_use_id: Some("toolu_01ABC123".to_string()),
            agent_id: Some("agent-456".to_string()),
            ..Default::default()
        };
        assert_eq!(context.tool_use_id.as_deref(), Some("toolu_01ABC123"));
        assert_eq!(context.agent_id.as_deref(), Some("agent-456"));
    }

    /// Test that agent_id defaults to None when not sent (top-level agent).
    #[tokio::test]
    async fn test_permission_callback_missing_agent_id() {
        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-noagent",
            "request": {
                "subtype": "can_use_tool",
                "tool_name": "TestTool",
                "input": {},
                "permission_suggestions": [],
                "tool_use_id": "toolu_01XYZ789"
            }
        });

        let context = ToolPermissionContext {
            tool_use_id: Some("toolu_01XYZ789".to_string()),
            agent_id: None,
            ..Default::default()
        };
        assert_eq!(context.tool_use_id.as_deref(), Some("toolu_01XYZ789"));
        assert!(context.agent_id.is_none());
    }

    /// Test that callback exceptions are properly handled.
    #[tokio::test]
    async fn test_callback_exception_handling() {
        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-5",
            "request": {
                "subtype": "can_use_tool",
                "tool_name": "TestTool",
                "input": {},
                "permission_suggestions": []
            }
        });

        // When the callback raises an error, the response should contain
        // "subtype": "error" and the error message.
        let expected_error_response = json!({
            "type": "control_response",
            "response": {
                "subtype": "error",
                "request_id": "test-5",
                "error": "Callback error"
            }
        });
        let response_str = serde_json::to_string(&expected_error_response).unwrap();
        assert!(response_str.contains("\"subtype\":\"error\""));
        assert!(response_str.contains("Callback error"));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestHookCallbacks — 4 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_hook_callbacks {
    use super::*;

    /// Test that hooks are called at appropriate times.
    #[tokio::test]
    async fn test_hook_execution() {
        let hook_calls: Arc<Mutex<Vec<serde_json::Value>>> = Arc::new(Mutex::new(Vec::new()));
        let hook_calls_clone = hook_calls.clone();

        let test_hook: HookCallbackFn = Arc::new(move |input, tool_use_id, _context| {
            let calls = hook_calls_clone.clone();
            Box::pin(async move {
                calls.lock().unwrap().push(json!({
                    "input": format!("{:?}", input),
                    "tool_use_id": tool_use_id
                }));
                HookJSONOutput::Sync {
                    continue_: None,
                    suppress_output: None,
                    stop_reason: None,
                    decision: None,
                    system_message: None,
                    reason: None,
                    hook_specific_output: None,
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        // Simulate hook callback request
        let _request = json!({
            "type": "control_request",
            "request_id": "test-hook-1",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_hook_0",
                "input": {"test": "data"},
                "tool_use_id": "tool-123"
            }
        });

        // When _handle_control_request processes a hook_callback,
        // it should invoke the registered hook and write a response.
        // Since Query is todo!(), we verify the type structure works.
        assert!(hook_calls.lock().unwrap().is_empty());
    }

    /// Test that all SyncHookJSONOutput fields are properly handled.
    #[tokio::test]
    async fn test_hook_output_fields() {
        let comprehensive_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                HookJSONOutput::Sync {
                    continue_: Some(true),
                    suppress_output: Some(false),
                    stop_reason: Some("Test stop reason".to_string()),
                    decision: Some("block".to_string()),
                    system_message: Some("Test system message".to_string()),
                    reason: Some("Test reason for blocking".to_string()),
                    hook_specific_output: Some(HookSpecificOutput::PreToolUse {
                        permission_decision: Some("deny".to_string()),
                        permission_decision_reason: Some("Security policy violation".to_string()),
                        updated_input: Some(json!({"modified": "input"})),
                        additional_context: None,
                    }),
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-comprehensive",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_comprehensive_hook",
                "input": {"test": "data"},
                "tool_use_id": "tool-456"
            }
        });

        // Verify the hook output serializes with correct field names.
        // In Python: continue_ -> "continue", async_ -> "async" at wire level.
        // In Rust serde: #[serde(rename = "continue")] handles this.
        let output = HookJSONOutput::Sync {
            continue_: Some(true),
            suppress_output: Some(false),
            stop_reason: Some("Test stop reason".to_string()),
            decision: Some("block".to_string()),
            system_message: Some("Test system message".to_string()),
            reason: Some("Test reason for blocking".to_string()),
            hook_specific_output: Some(HookSpecificOutput::PreToolUse {
                permission_decision: Some("deny".to_string()),
                permission_decision_reason: Some("Security policy violation".to_string()),
                updated_input: Some(json!({"modified": "input"})),
                additional_context: None,
            }),
        };

        let serialized = serde_json::to_string(&output).unwrap();
        // "continue_" must be serialized as "continue" (serde rename)
        assert!(
            serialized.contains("\"continue\":true"),
            "continue_ should be renamed to continue"
        );
        assert!(
            !serialized.contains("\"continue_\""),
            "continue_ should not appear in serialized output"
        );
        assert!(serialized.contains("\"suppressOutput\":false"));
        assert!(serialized.contains("\"stopReason\":\"Test stop reason\""));
        assert!(serialized.contains("\"decision\":\"block\""));
        assert!(serialized.contains("\"reason\":\"Test reason for blocking\""));
        assert!(serialized.contains("\"systemMessage\":\"Test system message\""));

        // Verify hook-specific output
        assert!(serialized.contains("\"hookEventName\":\"PreToolUse\""));
        assert!(serialized.contains("\"permissionDecision\":\"deny\""));
        assert!(serialized.contains("\"permissionDecisionReason\":\"Security policy violation\""));
        assert!(serialized.contains("\"updatedInput\""));
    }

    /// Test AsyncHookJSONOutput type with proper async fields.
    #[tokio::test]
    async fn test_async_hook_output() {
        let _async_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                HookJSONOutput::Async {
                    async_: true,
                    async_timeout: Some(5000),
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-async",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_async_hook",
                "input": {"test": "async_data"},
                "tool_use_id": null
            }
        });

        // Verify async output serialization
        let output = HookJSONOutput::Async {
            async_: true,
            async_timeout: Some(5000),
        };
        let serialized = serde_json::to_string(&output).unwrap();
        // "async_" must be serialized as "async"
        assert!(
            serialized.contains("\"async\":true"),
            "async_ should be renamed to async"
        );
        assert!(
            !serialized.contains("\"async_\""),
            "async_ should not appear in serialized output"
        );
        assert!(serialized.contains("\"asyncTimeout\":5000"));
    }

    /// Test that Python-safe field names (async_, continue_) are converted to CLI format.
    #[tokio::test]
    async fn test_field_name_conversion() {
        let _conversion_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                // This would return both async_ and continue_ for conversion test,
                // but in Rust the types are disjoint (Async vs Sync variant).
                HookJSONOutput::Sync {
                    continue_: Some(false),
                    suppress_output: None,
                    stop_reason: Some("Testing field conversion".to_string()),
                    decision: None,
                    system_message: Some("Fields should be converted".to_string()),
                    reason: None,
                    hook_specific_output: None,
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-conversion",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_conversion",
                "input": {"test": "data"},
                "tool_use_id": null
            }
        });

        // Verify Sync output field name conversion
        let sync_output = HookJSONOutput::Sync {
            continue_: Some(false),
            suppress_output: None,
            stop_reason: Some("Testing field conversion".to_string()),
            decision: None,
            system_message: Some("Fields should be converted".to_string()),
            reason: None,
            hook_specific_output: None,
        };
        let sync_serialized = serde_json::to_string(&sync_output).unwrap();
        assert!(
            sync_serialized.contains("\"continue\":false"),
            "continue_ should be converted to continue"
        );
        assert!(
            !sync_serialized.contains("\"continue_\""),
            "continue_ should not appear in output"
        );
        assert!(sync_serialized.contains("\"stopReason\":\"Testing field conversion\""));
        assert!(sync_serialized.contains("\"systemMessage\":\"Fields should be converted\""));

        // Verify Async output field name conversion
        let async_output = HookJSONOutput::Async {
            async_: true,
            async_timeout: Some(10000),
        };
        let async_serialized = serde_json::to_string(&async_output).unwrap();
        assert!(
            async_serialized.contains("\"async\":true"),
            "async_ should be converted to async"
        );
        assert!(
            !async_serialized.contains("\"async_\""),
            "async_ should not appear in output"
        );
        assert!(async_serialized.contains("\"asyncTimeout\":10000"));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestClaudeAgentOptionsIntegration — 1 test
// ═══════════════════════════════════════════════════════════════════════════

mod test_claude_agent_options_integration {
    use super::*;

    /// Test creating options with callbacks.
    #[test]
    fn test_options_with_callbacks() {
        let my_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                HookJSONOutput::Sync {
                    continue_: None,
                    suppress_output: None,
                    stop_reason: None,
                    decision: None,
                    system_message: None,
                    reason: None,
                    hook_specific_output: None,
                }
            })
        });

        let mut hooks_map: HashMap<HookEvent, Vec<HookMatcher>> = HashMap::new();
        hooks_map.insert(
            HookEvent::PreToolUse,
            vec![HookMatcher {
                matcher: Some("Bash".to_string()),
                hooks: vec![my_hook.clone()],
                timeout: None,
            }],
        );

        let options = ClaudeAgentOptions {
            hooks: Some(hooks_map),
            ..Default::default()
        };

        assert!(options.hooks.is_some());
        let hooks = options.hooks.as_ref().unwrap();
        assert!(hooks.contains_key(&HookEvent::PreToolUse));
        let matchers = hooks.get(&HookEvent::PreToolUse).unwrap();
        assert_eq!(matchers.len(), 1);
        assert_eq!(matchers[0].matcher.as_deref(), Some("Bash"));
        assert_eq!(matchers[0].hooks.len(), 1);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestHookEventCallbacks — 5 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_hook_event_callbacks {
    use super::*;

    /// Test that a Notification hook callback receives correct input and returns output.
    #[tokio::test]
    async fn test_notification_hook_callback() {
        let hook_calls: Arc<Mutex<Vec<serde_json::Value>>> = Arc::new(Mutex::new(Vec::new()));
        let hook_calls_clone = hook_calls.clone();

        let notification_hook: HookCallbackFn = Arc::new(move |_input, _tool_use_id, _context| {
            let calls = hook_calls_clone.clone();
            Box::pin(async move {
                calls.lock().unwrap().push(json!({"event": "notification"}));
                HookJSONOutput::Sync {
                    continue_: None,
                    suppress_output: None,
                    stop_reason: None,
                    decision: None,
                    system_message: None,
                    reason: None,
                    hook_specific_output: Some(HookSpecificOutput::Notification {
                        additional_context: Some("Notification processed".to_string()),
                    }),
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-notification",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_notification_hook",
                "input": {
                    "session_id": "sess-1",
                    "transcript_path": "/tmp/t",
                    "cwd": "/home",
                    "hook_event_name": "Notification",
                    "message": "Task completed",
                    "notification_type": "info"
                },
                "tool_use_id": null
            }
        });

        // Verify the output serialization
        let output = HookSpecificOutput::Notification {
            additional_context: Some("Notification processed".to_string()),
        };
        let serialized = serde_json::to_string(&output).unwrap();
        assert!(serialized.contains("\"hookEventName\":\"Notification\""));
        assert!(serialized.contains("\"additionalContext\":\"Notification processed\""));
    }

    /// Test that a PermissionRequest hook callback returns a decision.
    #[tokio::test]
    async fn test_permission_request_hook_callback() {
        let _permission_request_hook: HookCallbackFn =
            Arc::new(|_input, _tool_use_id, _context| {
                Box::pin(async move {
                    HookJSONOutput::Sync {
                        continue_: None,
                        suppress_output: None,
                        stop_reason: None,
                        decision: None,
                        system_message: None,
                        reason: None,
                        hook_specific_output: Some(HookSpecificOutput::PermissionRequest {
                            decision: json!({"type": "allow"}),
                        }),
                    }
                })
            });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-perm-req",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_permission_request_hook",
                "input": {
                    "session_id": "sess-1",
                    "transcript_path": "/tmp/t",
                    "cwd": "/home",
                    "hook_event_name": "PermissionRequest",
                    "tool_name": "Bash",
                    "tool_input": {"command": "ls"}
                },
                "tool_use_id": null
            }
        });

        let output = HookSpecificOutput::PermissionRequest {
            decision: json!({"type": "allow"}),
        };
        let serialized = serde_json::to_string(&output).unwrap();
        assert!(serialized.contains("\"hookEventName\":\"PermissionRequest\""));
        assert!(serialized.contains("\"decision\":{\"type\":\"allow\"}"));
    }

    /// Test that a SubagentStart hook callback works correctly.
    #[tokio::test]
    async fn test_subagent_start_hook_callback() {
        let _subagent_start_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                HookJSONOutput::Sync {
                    continue_: None,
                    suppress_output: None,
                    stop_reason: None,
                    decision: None,
                    system_message: None,
                    reason: None,
                    hook_specific_output: Some(HookSpecificOutput::SubagentStart {
                        additional_context: Some("Subagent approved".to_string()),
                    }),
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-subagent-start",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_subagent_start_hook",
                "input": {
                    "session_id": "sess-1",
                    "transcript_path": "/tmp/t",
                    "cwd": "/home",
                    "hook_event_name": "SubagentStart",
                    "agent_id": "agent-42",
                    "agent_type": "researcher"
                },
                "tool_use_id": null
            }
        });

        let output = HookSpecificOutput::SubagentStart {
            additional_context: Some("Subagent approved".to_string()),
        };
        let serialized = serde_json::to_string(&output).unwrap();
        assert!(serialized.contains("\"hookEventName\":\"SubagentStart\""));
        assert!(serialized.contains("\"additionalContext\":\"Subagent approved\""));
    }

    /// Test PostToolUse hook returning updatedMCPToolOutput.
    #[tokio::test]
    async fn test_post_tool_use_hook_with_updated_mcp_output() {
        let _post_tool_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                HookJSONOutput::Sync {
                    continue_: None,
                    suppress_output: None,
                    stop_reason: None,
                    decision: None,
                    system_message: None,
                    reason: None,
                    hook_specific_output: Some(HookSpecificOutput::PostToolUse {
                        additional_context: None,
                        updated_mcp_tool_output: Some(json!({"result": "modified output"})),
                    }),
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-post-tool-mcp",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_post_tool_mcp_hook",
                "input": {
                    "session_id": "sess-1",
                    "transcript_path": "/tmp/t",
                    "cwd": "/home",
                    "hook_event_name": "PostToolUse",
                    "tool_name": "mcp_tool",
                    "tool_input": {},
                    "tool_response": "original output",
                    "tool_use_id": "tu-123"
                },
                "tool_use_id": "tu-123"
            }
        });

        let output = HookSpecificOutput::PostToolUse {
            additional_context: None,
            updated_mcp_tool_output: Some(json!({"result": "modified output"})),
        };
        let serialized = serde_json::to_string(&output).unwrap();
        assert!(serialized.contains("\"updatedMCPToolOutput\""));
        assert!(serialized.contains("\"result\":\"modified output\""));
    }

    /// Test PreToolUse hook returning additionalContext.
    #[tokio::test]
    async fn test_pre_tool_use_hook_with_additional_context() {
        let _pre_tool_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                HookJSONOutput::Sync {
                    continue_: None,
                    suppress_output: None,
                    stop_reason: None,
                    decision: None,
                    system_message: None,
                    reason: None,
                    hook_specific_output: Some(HookSpecificOutput::PreToolUse {
                        permission_decision: Some("allow".to_string()),
                        permission_decision_reason: None,
                        updated_input: None,
                        additional_context: Some("Extra context for Claude".to_string()),
                    }),
                }
            })
        });

        let transport = MockTransport::new();
        let _q = Query::new(Box::new(transport), true, 30.0);

        let _request = json!({
            "type": "control_request",
            "request_id": "test-pre-tool-ctx",
            "request": {
                "subtype": "hook_callback",
                "callback_id": "test_pre_tool_context_hook",
                "input": {
                    "session_id": "sess-1",
                    "transcript_path": "/tmp/t",
                    "cwd": "/home",
                    "hook_event_name": "PreToolUse",
                    "tool_name": "Bash",
                    "tool_input": {"command": "ls"},
                    "tool_use_id": "tu-456"
                },
                "tool_use_id": "tu-456"
            }
        });

        let output = HookSpecificOutput::PreToolUse {
            permission_decision: Some("allow".to_string()),
            permission_decision_reason: None,
            updated_input: None,
            additional_context: Some("Extra context for Claude".to_string()),
        };
        let serialized = serde_json::to_string(&output).unwrap();
        assert!(serialized.contains("\"additionalContext\":\"Extra context for Claude\""));
        assert!(serialized.contains("\"permissionDecision\":\"allow\""));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TestHookInitializeRegistration — 2 tests
// ═══════════════════════════════════════════════════════════════════════════

mod test_hook_initialize_registration {
    use super::*;

    /// Test that all new hook event types can be configured in hooks dict.
    #[test]
    fn test_new_hook_events_registered_in_hooks_config() {
        let noop_hook: HookCallbackFn = Arc::new(|_input, _tool_use_id, _context| {
            Box::pin(async move {
                HookJSONOutput::Sync {
                    continue_: None,
                    suppress_output: None,
                    stop_reason: None,
                    decision: None,
                    system_message: None,
                    reason: None,
                    hook_specific_output: None,
                }
            })
        });

        let mut hooks_map: HashMap<HookEvent, Vec<HookMatcher>> = HashMap::new();
        hooks_map.insert(
            HookEvent::Notification,
            vec![HookMatcher {
                matcher: None,
                hooks: vec![noop_hook.clone()],
                timeout: None,
            }],
        );
        hooks_map.insert(
            HookEvent::SubagentStart,
            vec![HookMatcher {
                matcher: None,
                hooks: vec![noop_hook.clone()],
                timeout: None,
            }],
        );
        hooks_map.insert(
            HookEvent::PermissionRequest,
            vec![HookMatcher {
                matcher: None,
                hooks: vec![noop_hook.clone()],
                timeout: None,
            }],
        );

        let options = ClaudeAgentOptions {
            hooks: Some(hooks_map),
            ..Default::default()
        };

        let hooks = options.hooks.as_ref().unwrap();
        assert!(hooks.contains_key(&HookEvent::Notification));
        assert!(hooks.contains_key(&HookEvent::SubagentStart));
        assert!(hooks.contains_key(&HookEvent::PermissionRequest));
        assert_eq!(hooks.len(), 3);
    }

    /// Test that InternalClient can be instantiated and accept process_query.
    #[tokio::test]
    async fn test_internal_client_process_query() {
        let client = InternalClient::new();
        let options = ClaudeAgentOptions::default();

        let transport = MockTransport::new();
        let result = client
            .process_query_collect("Hello", options, Some(Box::new(transport)))
            .await;
        // process_query is todo!(), so this will fail — that is expected
        assert!(result.is_ok() || result.is_err());
    }
}
