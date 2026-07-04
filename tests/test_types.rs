use rust_agent_sdk::{
    AgentDefinition, AssistantMessage, ClaudeAgentOptions, ContentBlock, HookInput,
    HookSpecificOutput, McpServerConfig, McpServerConnectionStatus, McpServerInfo, McpServerStatus,
    McpStatusResponse, McpToolAnnotations, McpToolInfo, MessageContent, PermissionMode,
    ResultMessage, SystemPromptConfig, TextBlock, ThinkingBlock, ToolResultBlock,
    ToolResultContent, ToolUseBlock, UserMessage,
};
use serde_json::json;

// ─────────────────────────────────────────────────────────────────────────────
// TestMessageTypes
// ─────────────────────────────────────────────────────────────────────────────

mod test_message_types {
    use super::*;

    #[test]
    fn test_user_message_creation() {
        let msg = UserMessage::new("Hello, Claude!");
        assert_eq!(msg.content, MessageContent::Text("Hello, Claude!".into()));
    }

    #[test]
    fn test_assistant_message_with_text() {
        let text_block = TextBlock::new("Hello, human!");
        let msg = AssistantMessage::new(
            vec![ContentBlock::Text(text_block)],
            "claude-opus-4-1-20250805",
        );
        assert_eq!(msg.content.len(), 1);
        match &msg.content[0] {
            ContentBlock::Text(tb) => assert_eq!(tb.text, "Hello, human!"),
            _ => panic!("expected Text block"),
        }
    }

    #[test]
    fn test_assistant_message_with_thinking() {
        let thinking_block = ThinkingBlock::new("I'm thinking...", "sig-123");
        let msg = AssistantMessage::new(
            vec![ContentBlock::Thinking(thinking_block)],
            "claude-opus-4-1-20250805",
        );
        assert_eq!(msg.content.len(), 1);
        match &msg.content[0] {
            ContentBlock::Thinking(tb) => {
                assert_eq!(tb.thinking, "I'm thinking...");
                assert_eq!(tb.signature, "sig-123");
            }
            _ => panic!("expected Thinking block"),
        }
    }

    #[test]
    fn test_tool_use_block() {
        let block = ToolUseBlock::new("tool-123", "Read", json!({"file_path": "/test.txt"}));
        assert_eq!(block.id, "tool-123");
        assert_eq!(block.name, "Read");
        assert_eq!(block.input["file_path"], "/test.txt");
    }

    #[test]
    fn test_tool_result_block() {
        let mut block = ToolResultBlock::new("tool-123");
        block.content = Some(ToolResultContent::Text("File contents here".into()));
        block.is_error = Some(false);
        assert_eq!(block.tool_use_id, "tool-123");
        assert_eq!(
            block.content,
            Some(ToolResultContent::Text("File contents here".into()))
        );
        assert_eq!(block.is_error, Some(false));
    }

    #[test]
    fn test_result_message() {
        let mut msg = ResultMessage::new("success", 1500, 1200, false, 1, "session-123");
        msg.total_cost_usd = Some(0.01);
        assert_eq!(msg.subtype, "success");
        assert_eq!(msg.total_cost_usd, Some(0.01));
        assert_eq!(msg.session_id, "session-123");
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestOptions
// ─────────────────────────────────────────────────────────────────────────────

mod test_options {
    use super::*;

    #[test]
    fn test_default_options() {
        let options = ClaudeAgentOptions::default();
        assert!(options.allowed_tools.is_empty());
        assert!(options.system_prompt.is_none());
        assert!(options.permission_mode.is_none());
        assert!(!options.continue_conversation);
        assert!(options.disallowed_tools.is_empty());
    }

    #[test]
    fn test_claude_code_options_with_tools() {
        let options = ClaudeAgentOptions {
            allowed_tools: vec!["Read".into(), "Write".into(), "Edit".into()],
            disallowed_tools: vec!["Bash".into()],
            ..Default::default()
        };
        assert_eq!(options.allowed_tools, vec!["Read", "Write", "Edit"]);
        assert_eq!(options.disallowed_tools, vec!["Bash"]);
    }

    #[test]
    fn test_claude_code_options_with_permission_mode() {
        let options = ClaudeAgentOptions {
            permission_mode: Some(PermissionMode::BypassPermissions),
            ..Default::default()
        };
        assert_eq!(
            options.permission_mode,
            Some(PermissionMode::BypassPermissions)
        );

        let options_plan = ClaudeAgentOptions {
            permission_mode: Some(PermissionMode::Plan),
            ..Default::default()
        };
        assert_eq!(options_plan.permission_mode, Some(PermissionMode::Plan));

        let options_default = ClaudeAgentOptions {
            permission_mode: Some(PermissionMode::Default),
            ..Default::default()
        };
        assert_eq!(
            options_default.permission_mode,
            Some(PermissionMode::Default)
        );

        let options_accept = ClaudeAgentOptions {
            permission_mode: Some(PermissionMode::AcceptEdits),
            ..Default::default()
        };
        assert_eq!(
            options_accept.permission_mode,
            Some(PermissionMode::AcceptEdits)
        );

        let options_dont_ask = ClaudeAgentOptions {
            permission_mode: Some(PermissionMode::DontAsk),
            ..Default::default()
        };
        assert_eq!(
            options_dont_ask.permission_mode,
            Some(PermissionMode::DontAsk)
        );

        let options_auto = ClaudeAgentOptions {
            permission_mode: Some(PermissionMode::Auto),
            ..Default::default()
        };
        assert_eq!(options_auto.permission_mode, Some(PermissionMode::Auto));
    }

    #[test]
    fn test_claude_code_options_with_system_prompt_string() {
        let options = ClaudeAgentOptions {
            system_prompt: Some(SystemPromptConfig::String(
                "You are a helpful assistant.".into(),
            )),
            ..Default::default()
        };
        assert_eq!(
            options.system_prompt,
            Some(SystemPromptConfig::String(
                "You are a helpful assistant.".into()
            ))
        );
    }

    #[test]
    fn test_claude_code_options_with_system_prompt_preset() {
        let options = ClaudeAgentOptions {
            system_prompt: Some(SystemPromptConfig::Structured(
                rust_agent_sdk::SystemPrompt::Preset {
                    preset: "claude_code".into(),
                    append: None,
                    exclude_dynamic_sections: None,
                },
            )),
            ..Default::default()
        };
        let json_val = serde_json::to_value(&options.system_prompt).unwrap();
        assert_eq!(json_val, json!({"type": "preset", "preset": "claude_code"}));
    }

    #[test]
    fn test_claude_code_options_with_system_prompt_preset_and_append() {
        let options = ClaudeAgentOptions {
            system_prompt: Some(SystemPromptConfig::Structured(
                rust_agent_sdk::SystemPrompt::Preset {
                    preset: "claude_code".into(),
                    append: Some("Be concise.".into()),
                    exclude_dynamic_sections: None,
                },
            )),
            ..Default::default()
        };
        let json_val = serde_json::to_value(&options.system_prompt).unwrap();
        assert_eq!(
            json_val,
            json!({"type": "preset", "preset": "claude_code", "append": "Be concise."})
        );
    }

    #[test]
    fn test_claude_code_options_with_system_prompt_preset_exclude_dynamic_sections() {
        let options = ClaudeAgentOptions {
            system_prompt: Some(SystemPromptConfig::Structured(
                rust_agent_sdk::SystemPrompt::Preset {
                    preset: "claude_code".into(),
                    append: None,
                    exclude_dynamic_sections: Some(true),
                },
            )),
            ..Default::default()
        };
        let json_val = serde_json::to_value(&options.system_prompt).unwrap();
        assert_eq!(
            json_val,
            json!({"type": "preset", "preset": "claude_code", "exclude_dynamic_sections": true})
        );
    }

    #[test]
    fn test_claude_code_options_with_system_prompt_file() {
        let options = ClaudeAgentOptions {
            system_prompt: Some(SystemPromptConfig::Structured(
                rust_agent_sdk::SystemPrompt::File {
                    path: "/path/to/prompt.md".into(),
                },
            )),
            ..Default::default()
        };
        let json_val = serde_json::to_value(&options.system_prompt).unwrap();
        assert_eq!(
            json_val,
            json!({"type": "file", "path": "/path/to/prompt.md"})
        );
    }

    #[test]
    fn test_claude_code_options_with_session_continuation() {
        let options = ClaudeAgentOptions {
            continue_conversation: true,
            resume: Some("session-123".into()),
            ..Default::default()
        };
        assert!(options.continue_conversation);
        assert_eq!(options.resume, Some("session-123".into()));
    }

    #[test]
    fn test_claude_code_options_with_model_specification() {
        let options = ClaudeAgentOptions {
            model: Some("claude-sonnet-4-5".into()),
            permission_prompt_tool_name: Some("CustomTool".into()),
            ..Default::default()
        };
        assert_eq!(options.model, Some("claude-sonnet-4-5".into()));
        assert_eq!(
            options.permission_prompt_tool_name,
            Some("CustomTool".into())
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestHookInputTypes
// ─────────────────────────────────────────────────────────────────────────────

mod test_hook_input_types {
    use super::*;

    #[test]
    fn test_notification_hook_input() {
        let hook_input = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "Notification",
            "message": "Task completed",
            "notification_type": "info",
        });
        assert_eq!(hook_input["hook_event_name"], "Notification");
        assert_eq!(hook_input["message"], "Task completed");
        assert_eq!(hook_input["notification_type"], "info");

        let parsed: HookInput = serde_json::from_value(hook_input).unwrap();
        match parsed {
            HookInput::Notification {
                message,
                notification_type,
                ..
            } => {
                assert_eq!(message, "Task completed");
                assert_eq!(notification_type, "info");
            }
            _ => panic!("expected Notification variant"),
        }
    }

    #[test]
    fn test_notification_hook_input_with_title() {
        let hook_input = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "Notification",
            "message": "Task completed",
            "notification_type": "info",
            "title": "Success",
        });
        assert_eq!(hook_input["title"], "Success");

        let parsed: HookInput = serde_json::from_value(hook_input).unwrap();
        match parsed {
            HookInput::Notification { title, .. } => {
                assert_eq!(title, Some("Success".into()));
            }
            _ => panic!("expected Notification variant"),
        }
    }

    #[test]
    fn test_subagent_start_hook_input() {
        let hook_input = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "SubagentStart",
            "agent_id": "agent-42",
            "agent_type": "researcher",
        });
        assert_eq!(hook_input["hook_event_name"], "SubagentStart");
        assert_eq!(hook_input["agent_id"], "agent-42");
        assert_eq!(hook_input["agent_type"], "researcher");

        let parsed: HookInput = serde_json::from_value(hook_input).unwrap();
        match parsed {
            HookInput::SubagentStart {
                agent_id,
                agent_type,
                ..
            } => {
                assert_eq!(agent_id, "agent-42");
                assert_eq!(agent_type, "researcher");
            }
            _ => panic!("expected SubagentStart variant"),
        }
    }

    #[test]
    fn test_pre_tool_use_hook_input_with_agent_id() {
        // Tool called from inside a sub-agent: agent_id present
        let hook_input = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "PreToolUse",
            "tool_name": "Bash",
            "tool_input": {"command": "echo hello"},
            "tool_use_id": "toolu_abc123",
            "agent_id": "agent-42",
            "agent_type": "researcher",
        });
        assert_eq!(hook_input.get("agent_id").unwrap(), "agent-42");
        assert_eq!(hook_input.get("agent_type").unwrap(), "researcher");

        let parsed: HookInput = serde_json::from_value(hook_input).unwrap();
        match &parsed {
            HookInput::PreToolUse {
                agent_id,
                agent_type,
                ..
            } => {
                assert_eq!(agent_id.as_deref(), Some("agent-42"));
                assert_eq!(agent_type.as_deref(), Some("researcher"));
            }
            _ => panic!("expected PreToolUse variant"),
        }

        // Tool called on the main thread: agent_id absent. Still type-valid.
        let hook_input_main = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "PreToolUse",
            "tool_name": "Bash",
            "tool_input": {"command": "echo hello"},
            "tool_use_id": "toolu_def456",
        });
        assert!(hook_input_main.get("agent_id").is_none());

        let parsed_main: HookInput = serde_json::from_value(hook_input_main).unwrap();
        match &parsed_main {
            HookInput::PreToolUse { agent_id, .. } => {
                assert!(agent_id.is_none());
            }
            _ => panic!("expected PreToolUse variant"),
        }
    }

    #[test]
    fn test_post_tool_use_hook_input_with_agent_id() {
        let hook_input = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "PostToolUse",
            "tool_name": "Bash",
            "tool_input": {"command": "echo hello"},
            "tool_response": {"content": [{"type": "text", "text": "hello"}]},
            "tool_use_id": "toolu_abc123",
            "agent_id": "agent-42",
        });
        assert_eq!(hook_input.get("agent_id").unwrap(), "agent-42");

        let parsed: HookInput = serde_json::from_value(hook_input).unwrap();
        match &parsed {
            HookInput::PostToolUse { agent_id, .. } => {
                assert_eq!(agent_id.as_deref(), Some("agent-42"));
            }
            _ => panic!("expected PostToolUse variant"),
        }
    }

    #[test]
    fn test_permission_request_hook_input() {
        let hook_input = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "PermissionRequest",
            "tool_name": "Bash",
            "tool_input": {"command": "ls"},
        });
        assert_eq!(hook_input["hook_event_name"], "PermissionRequest");
        assert_eq!(hook_input["tool_name"], "Bash");
        assert_eq!(hook_input["tool_input"], json!({"command": "ls"}));

        let parsed: HookInput = serde_json::from_value(hook_input).unwrap();
        match &parsed {
            HookInput::PermissionRequest {
                tool_name,
                tool_input,
                ..
            } => {
                assert_eq!(tool_name, "Bash");
                assert_eq!(*tool_input, json!({"command": "ls"}));
            }
            _ => panic!("expected PermissionRequest variant"),
        }
    }

    #[test]
    fn test_permission_request_hook_input_with_suggestions() {
        let hook_input = json!({
            "session_id": "sess-1",
            "transcript_path": "/tmp/transcript",
            "cwd": "/home/user",
            "hook_event_name": "PermissionRequest",
            "tool_name": "Bash",
            "tool_input": {"command": "ls"},
            "permission_suggestions": [{"type": "allow", "rule": "Bash(*)"}],
        });
        let suggestions = hook_input["permission_suggestions"].as_array().unwrap();
        assert_eq!(suggestions.len(), 1);

        let parsed: HookInput = serde_json::from_value(hook_input).unwrap();
        match &parsed {
            HookInput::PermissionRequest {
                permission_suggestions,
                ..
            } => {
                let s = permission_suggestions.as_ref().unwrap();
                assert_eq!(s.len(), 1);
            }
            _ => panic!("expected PermissionRequest variant"),
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestHookSpecificOutputTypes
// ─────────────────────────────────────────────────────────────────────────────

mod test_hook_specific_output_types {
    use super::*;

    #[test]
    fn test_notification_hook_specific_output() {
        let output = json!({
            "hookEventName": "Notification",
            "additionalContext": "Extra info",
        });
        assert_eq!(output["hookEventName"], "Notification");
        assert_eq!(output["additionalContext"], "Extra info");

        let parsed: HookSpecificOutput = serde_json::from_value(output).unwrap();
        match &parsed {
            HookSpecificOutput::Notification {
                additional_context, ..
            } => {
                assert_eq!(additional_context.as_deref(), Some("Extra info"));
            }
            _ => panic!("expected Notification variant"),
        }
    }

    #[test]
    fn test_subagent_start_hook_specific_output() {
        let output = json!({
            "hookEventName": "SubagentStart",
            "additionalContext": "Starting subagent for research",
        });
        assert_eq!(output["hookEventName"], "SubagentStart");

        let parsed: HookSpecificOutput = serde_json::from_value(output).unwrap();
        match &parsed {
            HookSpecificOutput::SubagentStart {
                additional_context, ..
            } => {
                assert_eq!(
                    additional_context.as_deref(),
                    Some("Starting subagent for research")
                );
            }
            _ => panic!("expected SubagentStart variant"),
        }
    }

    #[test]
    fn test_permission_request_hook_specific_output() {
        let output = json!({
            "hookEventName": "PermissionRequest",
            "decision": {"type": "allow"},
        });
        assert_eq!(output["hookEventName"], "PermissionRequest");
        assert_eq!(output["decision"], json!({"type": "allow"}));

        let parsed: HookSpecificOutput = serde_json::from_value(output).unwrap();
        match &parsed {
            HookSpecificOutput::PermissionRequest { decision } => {
                assert_eq!(*decision, json!({"type": "allow"}));
            }
            _ => panic!("expected PermissionRequest variant"),
        }
    }

    #[test]
    fn test_pre_tool_use_output_has_additional_context() {
        let output = json!({
            "hookEventName": "PreToolUse",
            "additionalContext": "context for claude",
        });
        assert_eq!(output["additionalContext"], "context for claude");

        let parsed: HookSpecificOutput = serde_json::from_value(output).unwrap();
        match &parsed {
            HookSpecificOutput::PreToolUse {
                additional_context, ..
            } => {
                assert_eq!(additional_context.as_deref(), Some("context for claude"));
            }
            _ => panic!("expected PreToolUse variant"),
        }
    }

    #[test]
    fn test_post_tool_use_output_has_updated_mcp_tool_output() {
        let output = json!({
            "hookEventName": "PostToolUse",
            "updatedMCPToolOutput": {"result": "modified"},
        });
        assert_eq!(
            output["updatedMCPToolOutput"],
            json!({"result": "modified"})
        );

        let parsed: HookSpecificOutput = serde_json::from_value(output).unwrap();
        match &parsed {
            HookSpecificOutput::PostToolUse {
                updated_mcp_tool_output,
                ..
            } => {
                assert_eq!(
                    *updated_mcp_tool_output.as_ref().unwrap(),
                    json!({"result": "modified"})
                );
            }
            _ => panic!("expected PostToolUse variant"),
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestMcpServerStatusTypes
// ─────────────────────────────────────────────────────────────────────────────

mod test_mcp_server_status_types {
    use super::*;

    #[test]
    fn test_mcp_server_status_importable_from_package() {
        // Verify that all MCP-related types exist and are importable.
        // The `use` at the top of this file already imports them; this test
        // simply exercises the types so they are not dead code.
        let _status: McpServerConnectionStatus = McpServerConnectionStatus::Connected;
        let _info = McpServerInfo {
            name: "x".into(),
            version: "1".into(),
        };
        let _tool = McpToolInfo {
            name: "t".into(),
            description: None,
            annotations: None,
        };
        let _annotations = McpToolAnnotations {
            read_only: None,
            destructive: None,
            open_world: None,
        };
        let _config = McpServerConfig::Http {
            url: "http://x".into(),
            headers: None,
        };
        let _server = McpServerStatus {
            name: "s".into(),
            status: McpServerConnectionStatus::Pending,
            server_info: None,
            error: None,
            config: None,
            scope: None,
            tools: None,
        };
        let _response = McpStatusResponse {
            mcp_servers: vec![],
        };
    }

    #[test]
    fn test_mcp_server_status_connected() {
        let status_json = json!({
            "name": "my-server",
            "status": "connected",
            "serverInfo": {"name": "my-server", "version": "1.2.3"},
            "config": {"type": "http", "url": "https://example.com"},
            "scope": "project",
            "tools": [
                {
                    "name": "greet",
                    "description": "Greet a user",
                    "annotations": {
                        "readOnly": true,
                        "destructive": false,
                        "openWorld": false,
                    },
                }
            ],
        });
        let status: McpServerStatus = serde_json::from_value(status_json).unwrap();
        assert_eq!(status.name, "my-server");
        assert_eq!(status.status, McpServerConnectionStatus::Connected);
        assert_eq!(status.server_info.as_ref().unwrap().version, "1.2.3");
        let tools = status.tools.as_ref().unwrap();
        let annotations = tools[0].annotations.as_ref().unwrap();
        assert_eq!(annotations.read_only, Some(true));
    }

    #[test]
    fn test_mcp_server_status_minimal() {
        let status_json = json!({"name": "pending-server", "status": "pending"});
        let status: McpServerStatus = serde_json::from_value(status_json.clone()).unwrap();
        assert_eq!(status.name, "pending-server");
        assert_eq!(status.status, McpServerConnectionStatus::Pending);
        assert!(status.error.is_none());
        assert!(status.config.is_none());
        // Also verify the raw JSON doesn't contain keys
        assert!(status_json.get("error").is_none());
        assert!(status_json.get("config").is_none());
    }

    #[test]
    fn test_mcp_server_status_failed_with_error() {
        let status_json = json!({
            "name": "broken-server",
            "status": "failed",
            "error": "Connection refused",
        });
        let status: McpServerStatus = serde_json::from_value(status_json).unwrap();
        assert_eq!(status.status, McpServerConnectionStatus::Failed);
        assert_eq!(status.error.as_deref(), Some("Connection refused"));
    }

    #[test]
    fn test_mcp_server_status_config_claudeai_proxy() {
        let status_json = json!({
            "name": "proxy-server",
            "status": "needs-auth",
            "config": {
                "type": "claudeai-proxy",
                "url": "https://claude.ai/proxy",
                "id": "proxy-abc",
            },
        });
        let status: McpServerStatus = serde_json::from_value(status_json).unwrap();
        match &status.config {
            Some(McpServerConfig::ClaudeAIProxy { url: _, id }) => {
                assert_eq!(id, "proxy-abc");
            }
            other => panic!("expected ClaudeAIProxy config, got {:?}", other),
        }
    }

    #[test]
    fn test_mcp_status_response_wraps_servers() {
        let response_json = json!({
            "mcpServers": [
                {"name": "a", "status": "connected"},
                {"name": "b", "status": "disabled"},
            ]
        });
        let response: McpStatusResponse = serde_json::from_value(response_json).unwrap();
        assert_eq!(response.mcp_servers.len(), 2);
        assert_eq!(
            response.mcp_servers[0].status,
            McpServerConnectionStatus::Connected
        );
        assert_eq!(
            response.mcp_servers[1].status,
            McpServerConnectionStatus::Disabled
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestAgentDefinition
// ─────────────────────────────────────────────────────────────────────────────

mod test_agent_definition {
    use super::*;

    /// Mirror the Python serializer: serialize to JSON then strip null fields.
    fn serialize(agent: &AgentDefinition) -> serde_json::Value {
        let val = serde_json::to_value(agent).unwrap();
        strip_nulls(val)
    }

    fn strip_nulls(val: serde_json::Value) -> serde_json::Value {
        match val {
            serde_json::Value::Object(map) => {
                let filtered: serde_json::Map<String, serde_json::Value> = map
                    .into_iter()
                    .filter(|(_, v)| !v.is_null())
                    .map(|(k, v)| (k, strip_nulls(v)))
                    .collect();
                serde_json::Value::Object(filtered)
            }
            other => other,
        }
    }

    #[test]
    fn test_minimal_definition_omits_unset_fields() {
        let agent = AgentDefinition::new("test", "You are a test");
        let payload = serialize(&agent);
        assert_eq!(
            payload,
            json!({"description": "test", "prompt": "You are a test"})
        );
    }

    #[test]
    fn test_skills_and_memory_serialize_with_cli_keys() {
        let agent = AgentDefinition {
            skills: Some(vec!["skill-a".into(), "skill-b".into()]),
            memory: Some("project".into()),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);
        assert_eq!(payload["skills"], json!(["skill-a", "skill-b"]));
        assert_eq!(payload["memory"], "project");
    }

    #[test]
    fn test_mcp_servers_serializes_as_camelcase() {
        let agent = AgentDefinition {
            mcp_servers: Some(vec![
                json!("slack"),
                json!({"local": {"command": "python", "args": ["server.py"]}}),
            ]),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);

        assert!(payload.get("mcpServers").is_some());
        assert!(payload.get("mcp_servers").is_none());
        assert_eq!(payload["mcpServers"][0], "slack");
        assert_eq!(payload["mcpServers"][1]["local"]["command"], "python");
    }

    #[test]
    fn test_disallowed_tools_and_max_turns_serialize_as_camelcase() {
        let agent = AgentDefinition {
            disallowed_tools: Some(vec!["Bash".into(), "Write".into()]),
            max_turns: Some(10),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);

        assert_eq!(payload["disallowedTools"], json!(["Bash", "Write"]));
        assert!(payload.get("disallowed_tools").is_none());
        assert_eq!(payload["maxTurns"], 10);
        assert!(payload.get("max_turns").is_none());
    }

    #[test]
    fn test_initial_prompt_serializes_as_camelcase() {
        let agent = AgentDefinition {
            initial_prompt: Some("/review-pr 123".into()),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);

        assert_eq!(payload["initialPrompt"], "/review-pr 123");
        assert!(payload.get("initial_prompt").is_none());
    }

    #[test]
    fn test_model_accepts_full_model_id() {
        let agent = AgentDefinition {
            model: Some("claude-opus-4-5".into()),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);
        assert_eq!(payload["model"], "claude-opus-4-5");
    }

    #[test]
    fn test_background_serializes_correctly() {
        let agent = AgentDefinition {
            background: Some(true),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);
        assert_eq!(payload["background"], true);
    }

    #[test]
    fn test_effort_accepts_named_level() {
        let agent = AgentDefinition {
            effort: Some(json!("high")),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);
        assert_eq!(payload["effort"], "high");
    }

    #[test]
    fn test_effort_accepts_integer() {
        let agent = AgentDefinition {
            effort: Some(json!(32000)),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);
        assert_eq!(payload["effort"], 32000);
    }

    #[test]
    fn test_permission_mode_serializes_as_camelcase() {
        let agent = AgentDefinition {
            permission_mode: Some(PermissionMode::BypassPermissions),
            ..AgentDefinition::new("test", "p")
        };
        let payload = serialize(&agent);

        assert_eq!(payload["permissionMode"], "bypassPermissions");
        assert!(payload.get("permission_mode").is_none());
    }

    #[test]
    fn test_new_fields_omitted_when_none() {
        let agent = AgentDefinition::new("test", "p");
        let payload = serialize(&agent);

        assert!(payload.get("background").is_none());
        assert!(payload.get("effort").is_none());
        assert!(payload.get("permissionMode").is_none());
    }
}
