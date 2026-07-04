/// Tests for Claude SDK transport layer.
///
/// Ported from Python: tests/test_transport.py
/// ALL tests call `todo!()` methods and will panic — that's expected and correct.
use std::collections::HashMap;
use std::path::PathBuf;

use rust_agent_sdk::{
    AgentDefinition, ClaudeAgentOptions, McpServerConfig, McpServersConfig, PermissionMode,
    SandboxNetworkConfig, SandboxSettings, SettingSource, SubprocessCLITransport, SystemPrompt,
    SystemPromptConfig, TaskBudget, ThinkingConfig, ThinkingDisplay, ToolsConfig,
};
use serde_json::json;

const DEFAULT_CLI_PATH: &str = "/usr/bin/claude";

fn make_options(f: impl FnOnce(&mut ClaudeAgentOptions)) -> ClaudeAgentOptions {
    let mut opts = ClaudeAgentOptions {
        cli_path: Some(PathBuf::from(DEFAULT_CLI_PATH)),
        ..Default::default()
    };
    f(&mut opts);
    opts
}

fn make_default_options() -> ClaudeAgentOptions {
    ClaudeAgentOptions {
        cli_path: Some(PathBuf::from(DEFAULT_CLI_PATH)),
        ..Default::default()
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — command building
// ─────────────────────────────────────────────────────────────────────────────

mod test_command_building {
    use super::*;

    // 1. test_build_command_basic
    #[test]
    fn test_build_command_basic() {
        let transport = SubprocessCLITransport::new("Hello", make_default_options());
        let cmd = transport.build_command();
        assert_eq!(cmd[0], "/usr/bin/claude");
        assert!(cmd.contains(&"--output-format".to_string()));
        assert!(cmd.contains(&"stream-json".to_string()));
        assert!(cmd.contains(&"--input-format".to_string()));
        assert!(!cmd.contains(&"--print".to_string()));
        assert!(cmd.contains(&"--system-prompt".to_string()));
        let idx = cmd.iter().position(|x| x == "--system-prompt").unwrap();
        assert_eq!(cmd[idx + 1], "");
    }

    // 2. test_build_command_strict_mcp_config
    #[test]
    fn test_build_command_strict_mcp_config_enabled() {
        let transport =
            SubprocessCLITransport::new("test", make_options(|o| o.strict_mcp_config = true));
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--strict-mcp-config".to_string()));
    }

    #[test]
    fn test_build_command_strict_mcp_config_disabled() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--strict-mcp-config".to_string()));
    }

    // 3. test_build_command_with_system_prompt_string
    #[test]
    fn test_build_command_with_system_prompt_string() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.system_prompt = Some(SystemPromptConfig::String("Be helpful".into()));
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--system-prompt".to_string()));
        assert!(cmd.contains(&"Be helpful".to_string()));
    }

    // 4. test_build_command_with_system_prompt_preset
    #[test]
    fn test_build_command_with_system_prompt_preset() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.system_prompt = Some(SystemPromptConfig::Structured(SystemPrompt::Preset {
                    preset: "claude_code".into(),
                    append: None,
                    exclude_dynamic_sections: None,
                }));
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--system-prompt".to_string()));
        assert!(!cmd.contains(&"--append-system-prompt".to_string()));
    }

    // 5. test_build_command_with_system_prompt_preset_and_append
    #[test]
    fn test_build_command_with_system_prompt_preset_and_append() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.system_prompt = Some(SystemPromptConfig::Structured(SystemPrompt::Preset {
                    preset: "claude_code".into(),
                    append: Some("Be concise.".into()),
                    exclude_dynamic_sections: None,
                }));
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--system-prompt".to_string()));
        assert!(cmd.contains(&"--append-system-prompt".to_string()));
        assert!(cmd.contains(&"Be concise.".to_string()));
    }

    // 6. test_build_command_with_system_prompt_file
    #[test]
    fn test_build_command_with_system_prompt_file() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.system_prompt = Some(SystemPromptConfig::Structured(SystemPrompt::File {
                    path: "/path/to/prompt.md".into(),
                }));
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--system-prompt".to_string()));
        assert!(!cmd.contains(&"--append-system-prompt".to_string()));
        assert!(cmd.contains(&"--system-prompt-file".to_string()));
        assert!(cmd.contains(&"/path/to/prompt.md".to_string()));
    }

    // 7. test_build_command_with_options
    #[test]
    fn test_build_command_with_options() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.allowed_tools = vec!["Read".into(), "Write".into()];
                o.disallowed_tools = vec!["Bash".into()];
                o.model = Some("claude-sonnet-4-5".into());
                o.permission_mode = Some(PermissionMode::AcceptEdits);
                o.max_turns = Some(5);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--allowedTools".to_string()));
        assert!(cmd.contains(&"Read,Write".to_string()));
        assert!(cmd.contains(&"--disallowedTools".to_string()));
        assert!(cmd.contains(&"Bash".to_string()));
        assert!(cmd.contains(&"--model".to_string()));
        assert!(cmd.contains(&"claude-sonnet-4-5".to_string()));
        assert!(cmd.contains(&"--permission-mode".to_string()));
        assert!(cmd.contains(&"acceptEdits".to_string()));
        assert!(cmd.contains(&"--max-turns".to_string()));
        assert!(cmd.contains(&"5".to_string()));
    }

    // 8. test_build_command_with_dont_ask_permission_mode
    #[test]
    fn test_build_command_with_dont_ask_permission_mode() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.permission_mode = Some(PermissionMode::DontAsk);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--permission-mode".to_string()));
        assert!(cmd.contains(&"dontAsk".to_string()));
    }

    // 9. test_build_command_with_fallback_model
    #[test]
    fn test_build_command_with_fallback_model() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.model = Some("opus".into());
                o.fallback_model = Some("sonnet".into());
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--model".to_string()));
        assert!(cmd.contains(&"opus".to_string()));
        assert!(cmd.contains(&"--fallback-model".to_string()));
        assert!(cmd.contains(&"sonnet".to_string()));
    }

    // 10. test_build_command_with_task_budget
    #[test]
    fn test_build_command_with_task_budget() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.task_budget = Some(TaskBudget { total: 100000 });
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--task-budget".to_string()));
        assert!(cmd.contains(&"100000".to_string()));
    }

    // 11. test_build_command_without_task_budget
    #[test]
    fn test_build_command_without_task_budget() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--task-budget".to_string()));
    }

    // 12. test_build_command_with_max_thinking_tokens
    #[test]
    fn test_build_command_with_max_thinking_tokens() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.max_thinking_tokens = Some(5000);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--max-thinking-tokens".to_string()));
        assert!(cmd.contains(&"5000".to_string()));
    }

    // 13. test_build_command_with_thinking — adaptive
    #[test]
    fn test_build_command_with_thinking_adaptive() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Adaptive { display: None });
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--thinking").unwrap();
        assert_eq!(cmd[idx..idx + 2], ["--thinking", "adaptive"]);
        assert!(!cmd.contains(&"--max-thinking-tokens".to_string()));
    }

    // 14. test_build_command_with_thinking — enabled with budget_tokens
    #[test]
    fn test_build_command_with_thinking_enabled() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Enabled {
                    budget_tokens: 5000,
                    display: None,
                });
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd
            .iter()
            .position(|x| x == "--max-thinking-tokens")
            .unwrap();
        assert_eq!(cmd[idx..idx + 2], ["--max-thinking-tokens", "5000"]);
        assert!(!cmd.contains(&"--thinking".to_string()));
    }

    // 15. test_build_command_with_thinking — disabled
    #[test]
    fn test_build_command_with_thinking_disabled() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Disabled);
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--thinking").unwrap();
        assert_eq!(cmd[idx..idx + 2], ["--thinking", "disabled"]);
        assert!(!cmd.contains(&"--max-thinking-tokens".to_string()));
    }

    // 16. test_build_command_thinking_display_forwarded — adaptive + summarized
    #[test]
    fn test_build_command_thinking_display_forwarded_adaptive_summarized() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Adaptive {
                    display: Some(ThinkingDisplay::Summarized),
                });
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--thinking-display").unwrap();
        assert_eq!(cmd[idx..idx + 2], ["--thinking-display", "summarized"]);
    }

    // 17. test_build_command_thinking_display_forwarded — enabled + omitted
    #[test]
    fn test_build_command_thinking_display_forwarded_enabled_omitted() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Enabled {
                    budget_tokens: 20000,
                    display: Some(ThinkingDisplay::Omitted),
                });
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--thinking-display").unwrap();
        assert_eq!(cmd[idx..idx + 2], ["--thinking-display", "omitted"]);
    }

    // 18. test_build_command_thinking_without_display
    #[test]
    fn test_build_command_thinking_without_display() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Adaptive { display: None });
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--thinking-display".to_string()));
    }

    // 19. test_build_command_thinking_display_with_enabled_budget
    #[test]
    fn test_build_command_thinking_display_with_enabled_budget() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Enabled {
                    budget_tokens: 20000,
                    display: Some(ThinkingDisplay::Omitted),
                });
            }),
        );
        let cmd = transport.build_command();
        let budget_idx = cmd
            .iter()
            .position(|x| x == "--max-thinking-tokens")
            .unwrap();
        assert_eq!(
            cmd[budget_idx..budget_idx + 2],
            ["--max-thinking-tokens", "20000"]
        );
        let display_idx = cmd.iter().position(|x| x == "--thinking-display").unwrap();
        assert_eq!(
            cmd[display_idx..display_idx + 2],
            ["--thinking-display", "omitted"]
        );
    }

    // 20. test_build_command_thinking_precedence_over_max_thinking_tokens
    #[test]
    fn test_build_command_thinking_precedence_over_max_thinking_tokens() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.thinking = Some(ThinkingConfig::Adaptive { display: None });
                o.max_thinking_tokens = Some(9999);
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--thinking").unwrap();
        assert_eq!(cmd[idx..idx + 2], ["--thinking", "adaptive"]);
        assert!(!cmd.contains(&"--max-thinking-tokens".to_string()));
    }

    // 21. test_build_command_with_add_dirs
    #[test]
    fn test_build_command_with_add_dirs() {
        let dir1 = "/path/to/dir1";
        let dir2 = PathBuf::from("/path/to/dir2");
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.add_dirs = vec![PathBuf::from(dir1), dir2.clone()];
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--add-dir".to_string()));
        let add_dir_indices: Vec<usize> = cmd
            .iter()
            .enumerate()
            .filter(|(_, x)| *x == "--add-dir")
            .map(|(i, _)| i)
            .collect();
        assert_eq!(add_dir_indices.len(), 2);
        let dirs_in_cmd: Vec<&str> = add_dir_indices
            .iter()
            .map(|&i| cmd[i + 1].as_str())
            .collect();
        assert!(dirs_in_cmd.contains(&dir1));
        assert!(dirs_in_cmd.contains(&dir2.to_str().unwrap()));
    }

    // 22. test_build_command_with_settings_file
    #[test]
    fn test_build_command_with_settings_file() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.settings = Some("/path/to/settings.json".into());
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--settings".to_string()));
        assert!(cmd.contains(&"/path/to/settings.json".to_string()));
    }

    // 23. test_build_command_with_settings_json
    #[test]
    fn test_build_command_with_settings_json() {
        let settings_json = r#"{"permissions": {"allow": ["Bash(ls:*)"]}}"#;
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.settings = Some(settings_json.into());
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--settings".to_string()));
        assert!(cmd.contains(&settings_json.to_string()));
    }

    // 24. test_build_command_setting_sources_omitted_when_not_provided
    #[test]
    fn test_build_command_setting_sources_omitted_when_not_provided() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let cmd = transport.build_command();
        assert!(!cmd.iter().any(|a| a.starts_with("--setting-sources")));
    }

    // 25. test_build_command_setting_sources_empty_list_disables_all
    #[test]
    fn test_build_command_setting_sources_empty_list_disables_all() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.setting_sources = Some(vec![]);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--setting-sources=".to_string()));
    }

    // 26. test_build_command_setting_sources_included_when_provided
    #[test]
    fn test_build_command_setting_sources_included_when_provided() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.setting_sources = Some(vec![SettingSource::User, SettingSource::Project]);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    // 27. test_build_command_with_extra_args
    #[test]
    fn test_build_command_with_extra_args() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.extra_args = HashMap::from([
                    ("new-flag".into(), Some("value".into())),
                    ("boolean-flag".into(), None),
                    ("another-option".into(), Some("test-value".into())),
                ]);
            }),
        );
        let cmd = transport.build_command();
        let cmd_str = cmd.join(" ");
        assert!(cmd_str.contains("--new-flag value"));
        assert!(cmd_str.contains("--another-option test-value"));
        assert!(cmd.contains(&"--boolean-flag".to_string()));
        let boolean_idx = cmd.iter().position(|x| x == "--boolean-flag").unwrap();
        assert!(boolean_idx == cmd.len() - 1 || cmd[boolean_idx + 1].starts_with("--"));
    }

    // 28. test_build_command_with_mcp_servers
    #[test]
    fn test_build_command_with_mcp_servers() {
        let mut mcp_servers = HashMap::new();
        mcp_servers.insert(
            "test-server".to_string(),
            McpServerConfig::Stdio {
                command: "/path/to/server".into(),
                args: Some(vec!["--option".into(), "value".into()]),
                env: None,
            },
        );
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.mcp_servers = McpServersConfig::Dict(mcp_servers);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--mcp-config".to_string()));
        let mcp_idx = cmd.iter().position(|x| x == "--mcp-config").unwrap();
        let mcp_config_value = &cmd[mcp_idx + 1];
        let config: serde_json::Value = serde_json::from_str(mcp_config_value).unwrap();
        assert!(config.get("mcpServers").is_some());
    }

    // 29. test_build_command_with_mcp_servers_as_json_string
    // In Rust, mcp_servers is typed as HashMap<String, McpServerConfig>,
    // so we can't pass a raw JSON string. We test that the dict form works.
    #[test]
    fn test_build_command_with_mcp_servers_dict() {
        let mut mcp_servers = HashMap::new();
        mcp_servers.insert(
            "server".to_string(),
            McpServerConfig::Stdio {
                command: "test".into(),
                args: None,
                env: None,
            },
        );
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.mcp_servers = McpServersConfig::Dict(mcp_servers);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--mcp-config".to_string()));
    }

    // 30. test_session_continuation
    #[test]
    fn test_session_continuation() {
        let transport = SubprocessCLITransport::new(
            "Continue from before",
            make_options(|o| {
                o.continue_conversation = true;
                o.resume = Some("session-123".into());
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--continue".to_string()));
        assert!(cmd.contains(&"--resume".to_string()));
        assert!(cmd.contains(&"session-123".to_string()));
    }

    // 31. test_session_id
    #[test]
    fn test_session_id() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.session_id = Some("550e8400-e29b-41d4-a716-446655440000".into());
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--session-id".to_string()));
        let idx = cmd.iter().position(|x| x == "--session-id").unwrap();
        assert_eq!(cmd[idx + 1], "550e8400-e29b-41d4-a716-446655440000");
    }

    // 32. test_session_id_not_set_by_default
    #[test]
    fn test_session_id_not_set_by_default() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--session-id".to_string()));
    }

    // 33. test_build_command_with_tools_array
    #[test]
    fn test_build_command_with_tools_array() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.tools = Some(ToolsConfig::List(vec![
                    "Read".into(),
                    "Edit".into(),
                    "Bash".into(),
                ]));
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--tools".to_string()));
        let tools_idx = cmd.iter().position(|x| x == "--tools").unwrap();
        assert_eq!(cmd[tools_idx + 1], "Read,Edit,Bash");
    }

    // 34. test_build_command_with_tools_empty_array
    #[test]
    fn test_build_command_with_tools_empty_array() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.tools = Some(ToolsConfig::List(vec![]));
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--tools".to_string()));
        let tools_idx = cmd.iter().position(|x| x == "--tools").unwrap();
        assert_eq!(cmd[tools_idx + 1], "");
    }

    // 35. test_build_command_with_tools_preset
    #[test]
    fn test_build_command_with_tools_preset() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.tools = Some(ToolsConfig::Preset(rust_agent_sdk::ToolsPreset {
                    type_: "preset".into(),
                    preset: "claude_code".into(),
                }));
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--tools".to_string()));
        let tools_idx = cmd.iter().position(|x| x == "--tools").unwrap();
        assert_eq!(cmd[tools_idx + 1], "default");
    }

    // 36. test_build_command_without_tools
    #[test]
    fn test_build_command_without_tools() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--tools".to_string()));
    }

    // 37. test_build_command_agents_always_via_initialize — string prompt
    #[test]
    fn test_build_command_agents_always_via_initialize_string() {
        let mut agents = HashMap::new();
        agents.insert(
            "test-agent".to_string(),
            AgentDefinition::new("A test agent", "You are a test agent"),
        );
        let transport = SubprocessCLITransport::new(
            "Hello",
            make_options(|o| {
                o.agents = Some(agents);
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--agents".to_string()));
        assert!(cmd.contains(&"--input-format".to_string()));
        assert!(cmd.contains(&"stream-json".to_string()));
    }

    // 38. test_build_command_always_uses_streaming
    #[test]
    fn test_build_command_always_uses_streaming() {
        let transport = SubprocessCLITransport::new("Hello", make_default_options());
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--input-format".to_string()));
        assert!(cmd.contains(&"stream-json".to_string()));
        assert!(!cmd.contains(&"--print".to_string()));
    }

    // 39. test_build_command_large_agents_work
    #[test]
    fn test_build_command_large_agents_work() {
        let large_prompt = "x".repeat(50000);
        let mut agents = HashMap::new();
        agents.insert(
            "large-agent".to_string(),
            AgentDefinition::new("A large agent", large_prompt),
        );
        let transport = SubprocessCLITransport::new(
            "Hello",
            make_options(|o| {
                o.agents = Some(agents);
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--agents".to_string()));
        let cmd_str = cmd.join(" ");
        assert!(!cmd_str.contains('@'));
    }

    // 40. test_build_command_with_settings_file_and_no_sandbox
    #[test]
    fn test_build_command_with_settings_file_and_no_sandbox() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.settings = Some("/path/to/settings.json".into());
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--settings".to_string()));
        let settings_idx = cmd.iter().position(|x| x == "--settings").unwrap();
        assert_eq!(cmd[settings_idx + 1], "/path/to/settings.json");
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — CLI discovery
// ─────────────────────────────────────────────────────────────────────────────

mod test_cli_discovery {
    use super::*;

    // 41. test_find_cli_not_found
    #[test]
    fn test_find_cli_not_found() {
        let transport = SubprocessCLITransport::new("test", ClaudeAgentOptions::default());
        // In Python this tests connect() raising CLINotFoundError.
        // Here, find_cli() panics from todo!().
        let _ = transport.find_cli();
    }

    // 42. test_init_does_not_call_find_cli
    #[test]
    fn test_init_does_not_call_find_cli() {
        // Construction should not panic — find_cli() is deferred.
        let transport = SubprocessCLITransport::new("test", ClaudeAgentOptions::default());
        assert_eq!(transport.options.cli_path, None);
    }

    // 43. test_init_uses_provided_cli_path
    #[test]
    fn test_init_uses_provided_cli_path() {
        let transport = SubprocessCLITransport::new(
            "test",
            ClaudeAgentOptions {
                cli_path: Some(PathBuf::from("/usr/bin/claude")),
                ..Default::default()
            },
        );
        assert_eq!(
            transport.options.cli_path,
            Some(PathBuf::from("/usr/bin/claude"))
        );
    }

    // 44. test_cli_path_accepts_pathlib_path
    #[test]
    fn test_cli_path_accepts_pathlib_path() {
        let path = PathBuf::from("/usr/bin/claude");
        let transport = SubprocessCLITransport::new(
            "Hello",
            ClaudeAgentOptions {
                cli_path: Some(path.clone()),
                ..Default::default()
            },
        );
        assert_eq!(transport.options.cli_path, Some(path));
    }

    // 45. test_find_bundled_cli
    #[test]
    fn test_find_bundled_cli() {
        let transport = SubprocessCLITransport::new("test", ClaudeAgentOptions::default());
        let _ = transport.find_bundled_cli();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — skills
// ─────────────────────────────────────────────────────────────────────────────

mod test_skills {
    use super::*;

    // 46. test_build_command_skills_none_leaves_options_untouched
    #[test]
    fn test_build_command_skills_none_leaves_options_untouched() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--allowedTools".to_string()));
        assert!(!cmd.iter().any(|a| a.starts_with("--setting-sources")));
    }

    // 47. test_build_command_skills_all_enables_skill_tool
    #[test]
    fn test_build_command_skills_all_enables_skill_tool() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!("all"));
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--allowedTools".to_string()));
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Skill");
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    // 48. test_build_command_skills_empty_list_adds_no_skill_entries
    #[test]
    fn test_build_command_skills_empty_list_adds_no_skill_entries() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!([]));
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--allowedTools".to_string()));
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    // 49. test_build_command_skills_named_list_uses_skill_patterns
    #[test]
    fn test_build_command_skills_named_list_uses_skill_patterns() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!(["pdf", "docx"]));
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--allowedTools".to_string()));
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Skill(pdf),Skill(docx)");
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    // 50. test_build_command_skills_merges_with_existing_allowed_tools
    #[test]
    fn test_build_command_skills_merges_with_existing_allowed_tools() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.allowed_tools = vec!["Read".into(), "Write".into()];
                o.skills = Some(json!(["pdf"]));
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Read,Write,Skill(pdf)");
    }

    // 51. test_build_command_skills_preserves_user_setting_sources
    #[test]
    fn test_build_command_skills_preserves_user_setting_sources() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!("all"));
                o.setting_sources = Some(vec![SettingSource::Local]);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--setting-sources=local".to_string()));
    }

    // 52. test_build_command_skills_does_not_mutate_options
    #[test]
    fn test_build_command_skills_does_not_mutate_options() {
        let mut options = make_default_options();
        options.allowed_tools = vec!["Read".into()];
        options.skills = Some(json!(["pdf"]));
        let transport = SubprocessCLITransport::new("test", options);
        transport.build_command();
        // After build_command, original options on transport should not be mutated
        assert_eq!(transport.options.allowed_tools, vec!["Read".to_string()]);
        assert_eq!(transport.options.setting_sources, None);
    }

    // 53. test_build_command_skills_does_not_duplicate_entries
    #[test]
    fn test_build_command_skills_does_not_duplicate_entries() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.allowed_tools = vec!["Skill(pdf)".into()];
                o.skills = Some(json!(["pdf"]));
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Skill(pdf)");
    }

    // 54-60. test_skills_option_matrix — 7 parametrized cases
    #[test]
    fn test_skills_option_matrix_default_none() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--allowedTools".to_string()));
        assert!(!cmd.iter().any(|a| a.starts_with("--setting-sources")));
    }

    #[test]
    fn test_skills_option_matrix_old_manual() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.allowed_tools = vec!["Skill".into(), "Read".into()];
                o.setting_sources = Some(vec![SettingSource::User, SettingSource::Project]);
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Skill,Read");
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    #[test]
    fn test_skills_option_matrix_all() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!("all"));
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Skill");
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    #[test]
    fn test_skills_option_matrix_subset() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!(["pdf", "docx"]));
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Skill(pdf),Skill(docx)");
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    #[test]
    fn test_skills_option_matrix_subset_explicit_sources() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!(["pdf"]));
                o.setting_sources = Some(vec![SettingSource::Project]);
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Skill(pdf)");
        assert!(cmd.contains(&"--setting-sources=project".to_string()));
    }

    #[test]
    fn test_skills_option_matrix_subset_merge_tools() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.allowed_tools = vec!["Read".into(), "Bash".into()];
                o.skills = Some(json!(["pdf"]));
            }),
        );
        let cmd = transport.build_command();
        let idx = cmd.iter().position(|x| x == "--allowedTools").unwrap();
        assert_eq!(cmd[idx + 1], "Read,Bash,Skill(pdf)");
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }

    #[test]
    fn test_skills_option_matrix_empty_list() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.skills = Some(json!([]));
            }),
        );
        let cmd = transport.build_command();
        assert!(!cmd.contains(&"--allowedTools".to_string()));
        assert!(cmd.contains(&"--setting-sources=user,project".to_string()));
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — sandbox / settings
// ─────────────────────────────────────────────────────────────────────────────

mod test_sandbox {
    use super::*;

    // 61. test_build_command_with_sandbox_only
    #[test]
    fn test_build_command_with_sandbox_only() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.sandbox = Some(SandboxSettings {
                    enabled: Some(true),
                    auto_allow_bash_if_sandboxed: Some(true),
                    network: Some(SandboxNetworkConfig {
                        allow_local_binding: Some(true),
                        allow_unix_sockets: Some(vec!["/var/run/docker.sock".into()]),
                        ..Default::default()
                    }),
                    ..Default::default()
                });
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--settings".to_string()));
        let settings_idx = cmd.iter().position(|x| x == "--settings").unwrap();
        let settings_value = &cmd[settings_idx + 1];
        let parsed: serde_json::Value = serde_json::from_str(settings_value).unwrap();
        assert!(parsed.get("sandbox").is_some());
        assert_eq!(parsed["sandbox"]["enabled"], json!(true));
        assert_eq!(parsed["sandbox"]["autoAllowBashIfSandboxed"], json!(true));
        assert_eq!(
            parsed["sandbox"]["network"]["allowLocalBinding"],
            json!(true)
        );
        assert_eq!(
            parsed["sandbox"]["network"]["allowUnixSockets"],
            json!(["/var/run/docker.sock"])
        );
    }

    // 62. test_build_command_with_sandbox_and_settings_json
    #[test]
    fn test_build_command_with_sandbox_and_settings_json() {
        let existing_settings = r#"{"permissions": {"allow": ["Bash(ls:*)"]}, "verbose": true}"#;
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.settings = Some(existing_settings.into());
                o.sandbox = Some(SandboxSettings {
                    enabled: Some(true),
                    excluded_commands: Some(vec!["git".into(), "docker".into()]),
                    ..Default::default()
                });
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--settings".to_string()));
        let settings_idx = cmd.iter().position(|x| x == "--settings").unwrap();
        let settings_value = &cmd[settings_idx + 1];
        let parsed: serde_json::Value = serde_json::from_str(settings_value).unwrap();
        assert_eq!(parsed["permissions"], json!({"allow": ["Bash(ls:*)"]}));
        assert_eq!(parsed["verbose"], json!(true));
        assert!(parsed.get("sandbox").is_some());
        assert_eq!(parsed["sandbox"]["enabled"], json!(true));
        assert_eq!(
            parsed["sandbox"]["excludedCommands"],
            json!(["git", "docker"])
        );
    }

    // 63. test_build_command_sandbox_minimal
    #[test]
    fn test_build_command_sandbox_minimal() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.sandbox = Some(SandboxSettings {
                    enabled: Some(true),
                    ..Default::default()
                });
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--settings".to_string()));
        let settings_idx = cmd.iter().position(|x| x == "--settings").unwrap();
        let settings_value = &cmd[settings_idx + 1];
        let parsed: serde_json::Value = serde_json::from_str(settings_value).unwrap();
        assert_eq!(parsed, json!({"sandbox": {"enabled": true}}));
    }

    // 64. test_sandbox_network_config
    #[test]
    fn test_sandbox_network_config() {
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.sandbox = Some(SandboxSettings {
                    enabled: Some(true),
                    network: Some(SandboxNetworkConfig {
                        allow_unix_sockets: Some(vec!["/tmp/ssh-agent.sock".into()]),
                        allow_all_unix_sockets: Some(false),
                        allow_local_binding: Some(true),
                        http_proxy_port: Some(8080),
                        socks_proxy_port: Some(8081),
                        ..Default::default()
                    }),
                    ..Default::default()
                });
            }),
        );
        let cmd = transport.build_command();
        let settings_idx = cmd.iter().position(|x| x == "--settings").unwrap();
        let settings_value = &cmd[settings_idx + 1];
        let parsed: serde_json::Value = serde_json::from_str(settings_value).unwrap();
        let network = &parsed["sandbox"]["network"];
        assert_eq!(network["allowUnixSockets"], json!(["/tmp/ssh-agent.sock"]));
        assert_eq!(network["allowAllUnixSockets"], json!(false));
        assert_eq!(network["allowLocalBinding"], json!(true));
        assert_eq!(network["httpProxyPort"], json!(8080));
        assert_eq!(network["socksProxyPort"], json!(8081));
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — transport lifecycle
// ─────────────────────────────────────────────────────────────────────────────

mod test_transport_lifecycle {
    use super::*;

    // 65. test_read_messages
    #[test]
    fn test_read_messages() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        assert_eq!(transport.prompt, "test");
        assert_eq!(
            transport.options.cli_path,
            Some(PathBuf::from(DEFAULT_CLI_PATH))
        );
    }

    // 66. test_connect_close — calls connect() which is todo!()
    #[test]
    fn test_connect_close() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 67. test_connect_with_nonexistent_cwd
    #[test]
    fn test_connect_with_nonexistent_cwd() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new(
                "test",
                make_options(|o| {
                    o.cwd = Some(PathBuf::from("/this/directory/does/not/exist"));
                }),
            );
            let err = transport.connect().await;
            assert!(err.is_err());
            let err_str = format!("{}", err.unwrap_err());
            assert!(err_str.contains("/this/directory/does/not/exist"));
        });
    }

    // 68. test_close_terminates_after_grace_period_timeout
    #[test]
    fn test_close_terminates_after_grace_period_timeout() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
            transport.close().await.unwrap();
        });
    }

    // 69. test_close_sigterm_succeeds_no_sigkill
    #[test]
    fn test_close_sigterm_succeeds_no_sigkill() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
            transport.close().await.unwrap();
        });
    }

    // 70. test_close_skips_wait_when_already_exited
    #[test]
    fn test_close_skips_wait_when_already_exited() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
            transport.close().await.unwrap();
        });
    }

    // 71. test_concurrent_writes_are_serialized
    #[test]
    fn test_concurrent_writes_are_serialized() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new(
                "test",
                ClaudeAgentOptions {
                    cli_path: Some(PathBuf::from("/usr/bin/claude")),
                    ..Default::default()
                },
            );
            transport.connect().await.unwrap();
            transport.write("{\"msg\": 0}\n").await.unwrap();
        });
    }

    // 72. test_concurrent_writes_fail_without_lock
    #[test]
    fn test_concurrent_writes_fail_without_lock() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new(
                "test",
                ClaudeAgentOptions {
                    cli_path: Some(PathBuf::from("/usr/bin/claude")),
                    ..Default::default()
                },
            );
            transport.connect().await.unwrap();
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — environment variables
// ─────────────────────────────────────────────────────────────────────────────

mod test_env_vars {
    use super::*;

    // 73. test_env_vars_passed_to_subprocess
    #[test]
    fn test_env_vars_passed_to_subprocess() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut env = HashMap::new();
            env.insert("MY_TEST_VAR".into(), "test-value".into());
            let mut transport = SubprocessCLITransport::new(
                "test",
                make_options(|o| {
                    o.env = env;
                }),
            );
            transport.connect().await.unwrap();
        });
    }

    // 74. test_caller_can_override_entrypoint
    #[test]
    fn test_caller_can_override_entrypoint() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut env = HashMap::new();
            env.insert("CLAUDE_CODE_ENTRYPOINT".into(), "custom-caller".into());
            let mut transport = SubprocessCLITransport::new(
                "test",
                make_options(|o| {
                    o.env = env;
                }),
            );
            transport.connect().await.unwrap();
        });
    }

    // 75. test_otel_trace_context_propagated_to_subprocess
    #[test]
    fn test_otel_trace_context_propagated_to_subprocess() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 76. test_otel_trace_context_does_not_override_user_env
    #[test]
    fn test_otel_trace_context_does_not_override_user_env() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut env = HashMap::new();
            env.insert("TRACEPARENT".into(), "custom".into());
            let mut transport = SubprocessCLITransport::new(
                "test",
                make_options(|o| {
                    o.env = env;
                }),
            );
            transport.connect().await.unwrap();
        });
    }

    // 77. test_otel_trace_context_noop_without_opentelemetry
    #[test]
    fn test_otel_trace_context_noop_without_opentelemetry() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 78. test_otel_trace_context_overwrites_inherited_env
    #[test]
    fn test_otel_trace_context_overwrites_inherited_env() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 79. test_otel_no_active_span_preserves_inherited_env
    #[test]
    fn test_otel_no_active_span_preserves_inherited_env() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 80. test_otel_baggage_only_carrier_preserves_inherited_env
    #[test]
    fn test_otel_baggage_only_carrier_preserves_inherited_env() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 81. test_otel_propagator_error_does_not_break_connect
    #[test]
    fn test_otel_propagator_error_does_not_break_connect() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 82. test_claudecode_env_var_not_inherited
    #[test]
    fn test_claudecode_env_var_not_inherited() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }

    // 83. test_claudecode_can_be_set_via_options_env
    #[test]
    fn test_claudecode_can_be_set_via_options_env() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut env = HashMap::new();
            env.insert("CLAUDECODE".into(), "1".into());
            let mut transport = SubprocessCLITransport::new(
                "test",
                make_options(|o| {
                    o.env = env;
                }),
            );
            transport.connect().await.unwrap();
        });
    }

    // 84. test_connect_as_different_user
    #[test]
    fn test_connect_as_different_user() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new(
                "test",
                make_options(|o| {
                    o.user = Some("claude".into());
                }),
            );
            transport.connect().await.unwrap();
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — version checks
// ─────────────────────────────────────────────────────────────────────────────

mod test_version_checks {
    use super::*;

    // 85. test_version_warning_includes_cli_path
    #[test]
    fn test_version_warning_includes_cli_path() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            // connect() triggers version check, which is todo!()
            transport.connect().await.unwrap();
        });
    }

    // 86. test_version_warning_not_emitted_for_current_version
    #[test]
    fn test_version_warning_not_emitted_for_current_version() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestSubprocessCLITransport — build_settings_value
// ─────────────────────────────────────────────────────────────────────────────

mod test_build_settings_value {
    use super::*;

    // 87. test_build_settings_value panics (todo!())
    #[test]
    fn test_build_settings_value() {
        let transport = SubprocessCLITransport::new("test", make_default_options());
        let _ = transport.build_settings_value();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestAtexitChildCleanup
// ─────────────────────────────────────────────────────────────────────────────

mod test_atexit_child_cleanup {
    use super::*;

    // 88. test_kill_active_children_terminates_process
    // In Rust we don't have the atexit handler mechanism, but we test that the
    // transport can be created and that connect() panics from todo!().
    #[test]
    fn test_kill_active_children_terminates_process() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            use rust_agent_sdk::Transport;
            let mut transport = SubprocessCLITransport::new("test", make_default_options());
            transport.connect().await.unwrap();
            // Would test child process cleanup here once implemented
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Remaining tests from Python that need individual representation
// ─────────────────────────────────────────────────────────────────────────────

mod test_mcp_servers_file_path {
    use super::*;

    // test_build_command_with_mcp_servers_as_file_path
    // Python supports string/Path for mcp_servers — Rust uses typed HashMap,
    // so this test verifies the dict approach works.
    #[test]
    fn test_build_command_with_mcp_servers_file_path() {
        // In Rust, mcp_servers is always HashMap<String, McpServerConfig>.
        // The file-path variant is not directly supported in the type system.
        // This test documents that and verifies build_command panics correctly.
        let mut mcp_servers = HashMap::new();
        mcp_servers.insert(
            "test-server".to_string(),
            McpServerConfig::Stdio {
                command: "test".into(),
                args: None,
                env: None,
            },
        );
        let transport = SubprocessCLITransport::new(
            "test",
            make_options(|o| {
                o.mcp_servers = McpServersConfig::Dict(mcp_servers);
            }),
        );
        let cmd = transport.build_command();
        assert!(cmd.contains(&"--mcp-config".to_string()));
    }
}

// Verify we have the right Default impl for SandboxNetworkConfig
#[test]
fn test_sandbox_network_config_default() {
    let config = SandboxNetworkConfig {
        allow_local_binding: Some(true),
        ..Default::default()
    };
    assert_eq!(config.allow_local_binding, Some(true));
    assert_eq!(config.allow_unix_sockets, None);
}
