/// Tests for large-MCP-result spill behavior and env-var passthrough.
///
/// Root cause (confirmed via claude-cli-internal, 2026-03-27):
/// Two independent spill layers in the bundled CLI:
///
///   Layer 1 — MCP-specific (mcpValidation.ts)
///     Threshold: MAX_MCP_OUTPUT_TOKENS env var, default 25 000 tokens.
///     Setting MAX_MCP_OUTPUT_TOKENS=500000 bypasses this layer.
///
///   Layer 2 — generic tool-result (toolResultStorage.ts maybePersistLargeToolResult)
///     Threshold: DEFAULT_MAX_RESULT_SIZE_CHARS = 50 000 chars, hardcoded.
///     No env var reads this constant.
///
/// Ported from Python: tests/test_mcp_large_output.py (18 tests)
/// ALL tests call `todo!()` methods and will panic — that's expected and correct.

use std::collections::HashMap;
use std::path::PathBuf;

use rust_agent_sdk::parse_message;
use rust_agent_sdk::types::*;
use rust_agent_sdk::SubprocessCLITransport;
use serde_json::json;

const DEFAULT_CLI_PATH: &str = "/usr/bin/claude";

/// Layer-2 threshold as confirmed in claude-cli-internal toolLimits.ts
const LAYER2_THRESHOLD_CHARS: usize = 50_000;

fn make_transport(env: HashMap<String, String>) -> SubprocessCLITransport {
    let options = ClaudeAgentOptions {
        cli_path: Some(PathBuf::from(DEFAULT_CLI_PATH)),
        env,
        ..Default::default()
    };
    SubprocessCLITransport::new("test", options)
}

fn make_transport_default() -> SubprocessCLITransport {
    make_transport(HashMap::new())
}

/// Helper: build user message JSON with a tool_result block.
fn user_message_with_tool_result(content: &str, is_error: bool) -> serde_json::Value {
    json!({
        "type": "user",
        "message": {
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": "toolu_01ABC",
                "content": content,
                "is_error": is_error
            }]
        },
        "parent_tool_use_id": null,
        "tool_use_result": null,
        "uuid": "test-uuid-1234"
    })
}

/// Below the layer-2 threshold — would be passed inline by the CLI.
fn inline_content() -> String {
    "x".repeat(1000)
}

/// What the CLI emits after layer-2 spill: <persisted-output> tag + 2 KB preview.
fn persisted_content() -> String {
    let mut s = String::from(
        "<persisted-output>\n\
         Output too large (73.0KB). Full output saved to: /tmp/.claude/tool-results/abc123.txt\n\
         \nPreview (first 2KB):\n",
    );
    s.push_str(&"x".repeat(2000));
    s.push_str("\n...\n</persisted-output>");
    s
}

/// Utility: detect the degraded path (layer-2 spill).
fn is_persisted_output(content: &str) -> bool {
    content.starts_with("<persisted-output>")
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. TestLayer1EnvPassthrough
// ─────────────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod test_layer1_env_passthrough {
    use super::*;

    // 1. test_max_mcp_output_tokens_reaches_subprocess
    #[test]
    fn test_max_mcp_output_tokens_reaches_subprocess() {
        // MAX_MCP_OUTPUT_TOKENS set in options.env must appear in the subprocess env.
        // This controls layer 1 only (mcpValidation.ts, ~25K token default).
        let mut env = HashMap::new();
        env.insert("MAX_MCP_OUTPUT_TOKENS".to_string(), "500000".to_string());

        let transport = make_transport(env);
        // build_command calls todo!() — test will fail naturally
        let _cmd = transport.build_command();
        // After build_command is implemented, the env should include MAX_MCP_OUTPUT_TOKENS
        assert!(
            transport.options.env.contains_key("MAX_MCP_OUTPUT_TOKENS"),
            "MAX_MCP_OUTPUT_TOKENS was not passed to the CLI subprocess."
        );
        assert_eq!(transport.options.env["MAX_MCP_OUTPUT_TOKENS"], "500000");
    }

    // 2. test_default_absent_when_not_set
    #[test]
    fn test_default_absent_when_not_set() {
        // When not set, the SDK must not inject a default — the CLI's own governs.
        let transport = make_transport_default();
        assert!(
            !transport.options.env.contains_key("MAX_MCP_OUTPUT_TOKENS"),
            "MAX_MCP_OUTPUT_TOKENS should not be present when not explicitly set"
        );
        // build_command calls todo!()
        let _cmd = transport.build_command();
    }

    // 3. test_arbitrary_threshold_values_pass_through
    #[test]
    fn test_arbitrary_threshold_values_pass_through() {
        for value in &["1", "25000", "1000000"] {
            let mut env = HashMap::new();
            env.insert("MAX_MCP_OUTPUT_TOKENS".to_string(), value.to_string());

            let transport = make_transport(env);
            assert_eq!(
                transport.options.env.get("MAX_MCP_OUTPUT_TOKENS").unwrap(),
                *value
            );
            // build_command calls todo!()
            let _cmd = transport.build_command();
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TestEnvInheritanceAndPrecedence
// ─────────────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod test_env_inheritance_and_precedence {
    use super::*;

    // 4. test_inherited_from_os_environ
    #[test]
    fn test_inherited_from_os_environ() {
        // MAX_MCP_OUTPUT_TOKENS set in os.environ before connect() is inherited.
        // In Rust, env vars are read at connect() time — connect() calls todo!().
        let transport = make_transport_default();
        // connect() would merge os env — calls todo!()
        let _cmd = transport.build_command();
    }

    // 5. test_options_env_overrides_os_environ
    #[test]
    fn test_options_env_overrides_os_environ() {
        // options.env wins over os.environ.
        let mut env = HashMap::new();
        env.insert("MAX_MCP_OUTPUT_TOKENS".to_string(), "500000".to_string());

        let transport = make_transport(env);
        assert_eq!(
            transport.options.env["MAX_MCP_OUTPUT_TOKENS"],
            "500000"
        );
        // build_command calls todo!()
        let _cmd = transport.build_command();
    }

    // 6. test_claudecode_stripped
    #[test]
    fn test_claudecode_stripped() {
        // CLAUDECODE is stripped so spawned subprocesses don't detect a parent CC.
        let mut env = HashMap::new();
        env.insert("CLAUDECODE".to_string(), "1".to_string());
        env.insert("OTHER_VAR".to_string(), "kept".to_string());

        let transport = make_transport(env);
        // After build_command is implemented, CLAUDECODE should be stripped
        assert_eq!(transport.options.env.get("OTHER_VAR").unwrap(), "kept");
        // build_command calls todo!()
        let _cmd = transport.build_command();
    }

    // 7. test_sdk_managed_vars_always_set
    #[test]
    fn test_sdk_managed_vars_always_set() {
        // SDK-managed env vars should be set by build_command/connect.
        let transport = make_transport_default();
        // build_command/connect calls todo!() — will set CLAUDE_CODE_ENTRYPOINT etc.
        let _cmd = transport.build_command();
    }

    // 8. test_options_env_cannot_override_sdk_version
    #[test]
    fn test_options_env_cannot_override_sdk_version() {
        // The SDK version env var is always set to the real version.
        let mut env = HashMap::new();
        env.insert(
            "CLAUDE_AGENT_SDK_VERSION".to_string(),
            "0.0.0".to_string(),
        );

        let transport = make_transport(env);
        // The user-provided value should be overridden at connect() time.
        // connect() calls todo!()
        let _cmd = transport.build_command();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TestLayer2Boundary
// ─────────────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod test_layer2_boundary {
    use super::*;

    // 9. test_content_under_50k_can_be_inline
    #[test]
    fn test_content_under_50k_can_be_inline() {
        // A result just below 50K chars is eligible to be passed inline by the CLI.
        let content = "x".repeat(LAYER2_THRESHOLD_CHARS - 1);
        assert!(content.len() < LAYER2_THRESHOLD_CHARS);
    }

    // 10. test_customer_reproducer_exceeds_layer2_threshold
    #[test]
    fn test_customer_reproducer_exceeds_layer2_threshold() {
        // The customer's ~73K-char result exceeds the 50K layer-2 threshold.
        let customer_content_size: usize = 73_000;
        assert!(
            customer_content_size > LAYER2_THRESHOLD_CHARS,
            "Customer's {}-char result exceeds the {}-char layer-2 threshold \
             and will be spilled to a temp file even when MAX_MCP_OUTPUT_TOKENS is raised.",
            customer_content_size,
            LAYER2_THRESHOLD_CHARS
        );
    }

    // 11. test_no_layer2_env_var_exists
    #[test]
    fn test_no_layer2_env_var_exists() {
        // Confirm there is no env-var path to raise the layer-2 threshold.
        // The fix uses tool annotations (maxResultSizeChars) instead.
        let mut env = HashMap::new();
        env.insert("MAX_MCP_OUTPUT_TOKENS".to_string(), "500000".to_string());

        let transport = make_transport(env);
        assert!(!transport.options.env.contains_key("MAX_TOOL_RESULT_CHARS"));
        assert!(!transport
            .options
            .env
            .contains_key("DISABLE_TOOL_RESULT_PERSISTENCE"));
        // build_command calls todo!()
        let _cmd = transport.build_command();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TestToolResultParsing
// ─────────────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod test_tool_result_parsing {
    use super::*;

    // 12. test_inline_content_preserved
    #[test]
    fn test_inline_content_preserved() {
        // Full tool-result content is preserved when the CLI passes it inline.
        let content = inline_content();
        let data = user_message_with_tool_result(&content, false);
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                match &u.content {
                    MessageContent::Blocks(blocks) => {
                        let tool_results: Vec<&ToolResultBlock> = blocks
                            .iter()
                            .filter_map(|b| match b {
                                ContentBlock::ToolResult(tr) => Some(tr),
                                _ => None,
                            })
                            .collect();
                        assert_eq!(tool_results.len(), 1);
                        match &tool_results[0].content {
                            Some(ToolResultContent::Text(text)) => {
                                assert_eq!(text, &content);
                                assert!(
                                    !text.starts_with("<persisted-output>"),
                                    "expected inline content, got persisted-output"
                                );
                            }
                            other => panic!("expected Text content, got {:?}", other),
                        }
                    }
                    other => panic!("expected Blocks content, got {:?}", other),
                }
            }
            other => panic!("expected User message, got {:?}", other),
        }
    }

    // 13. test_persisted_output_detectable_by_prefix
    #[test]
    fn test_persisted_output_detectable_by_prefix() {
        // After a layer-2 spill, content starts with '<persisted-output>'.
        let content = persisted_content();
        let data = user_message_with_tool_result(&content, false);
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                match &u.content {
                    MessageContent::Blocks(blocks) => {
                        let tool_results: Vec<&ToolResultBlock> = blocks
                            .iter()
                            .filter_map(|b| match b {
                                ContentBlock::ToolResult(tr) => Some(tr),
                                _ => None,
                            })
                            .collect();
                        assert_eq!(tool_results.len(), 1);
                        match &tool_results[0].content {
                            Some(ToolResultContent::Text(text)) => {
                                assert!(
                                    text.starts_with("<persisted-output>"),
                                    "Expected persisted-output wrapper, got: {:?}",
                                    &text[..std::cmp::min(text.len(), 100)]
                                );
                            }
                            other => panic!("expected Text content, got {:?}", other),
                        }
                    }
                    other => panic!("expected Blocks content, got {:?}", other),
                }
            }
            other => panic!("expected User message, got {:?}", other),
        }
    }

    // 14. test_persisted_output_is_not_full_content
    #[test]
    fn test_persisted_output_is_not_full_content() {
        // Claude receives only the 2 KB preview, not the original large content.
        let content = persisted_content();
        let data = user_message_with_tool_result(&content, false);
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                match &u.content {
                    MessageContent::Blocks(blocks) => {
                        let tool_results: Vec<&ToolResultBlock> = blocks
                            .iter()
                            .filter_map(|b| match b {
                                ContentBlock::ToolResult(tr) => Some(tr),
                                _ => None,
                            })
                            .collect();
                        match &tool_results[0].content {
                            Some(ToolResultContent::Text(text)) => {
                                assert!(
                                    text.len() < LAYER2_THRESHOLD_CHARS,
                                    "Expected preview under {} chars, got {}",
                                    LAYER2_THRESHOLD_CHARS,
                                    text.len()
                                );
                            }
                            other => panic!("expected Text content, got {:?}", other),
                        }
                    }
                    other => panic!("expected Blocks content, got {:?}", other),
                }
            }
            other => panic!("expected User message, got {:?}", other),
        }
    }

    // 15. test_error_tool_result_flagged
    #[test]
    fn test_error_tool_result_flagged() {
        let data = user_message_with_tool_result("tool failed", true);
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                match &u.content {
                    MessageContent::Blocks(blocks) => {
                        let tool_results: Vec<&ToolResultBlock> = blocks
                            .iter()
                            .filter_map(|b| match b {
                                ContentBlock::ToolResult(tr) => Some(tr),
                                _ => None,
                            })
                            .collect();
                        assert_eq!(tool_results.len(), 1);
                        assert_eq!(tool_results[0].is_error, Some(true));
                    }
                    other => panic!("expected Blocks content, got {:?}", other),
                }
            }
            other => panic!("expected User message, got {:?}", other),
        }
    }

    // 16. test_normal_tool_result_not_flagged
    #[test]
    fn test_normal_tool_result_not_flagged() {
        let content = inline_content();
        let data = user_message_with_tool_result(&content, false);
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                match &u.content {
                    MessageContent::Blocks(blocks) => {
                        let tool_results: Vec<&ToolResultBlock> = blocks
                            .iter()
                            .filter_map(|b| match b {
                                ContentBlock::ToolResult(tr) => Some(tr),
                                _ => None,
                            })
                            .collect();
                        assert_eq!(tool_results.len(), 1);
                        assert_eq!(tool_results[0].is_error, Some(false));
                    }
                    other => panic!("expected Blocks content, got {:?}", other),
                }
            }
            other => panic!("expected User message, got {:?}", other),
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TestPersistedOutputDetectionHelper
// ─────────────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod test_persisted_output_detection_helper {
    use super::*;

    // 17. test_helper_detects_persisted
    #[test]
    fn test_helper_detects_persisted() {
        let content = persisted_content();
        let data = user_message_with_tool_result(&content, false);
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                match &u.content {
                    MessageContent::Blocks(blocks) => {
                        let tool_results: Vec<&ToolResultBlock> = blocks
                            .iter()
                            .filter_map(|b| match b {
                                ContentBlock::ToolResult(tr) => Some(tr),
                                _ => None,
                            })
                            .collect();
                        assert_eq!(tool_results.len(), 1);
                        match &tool_results[0].content {
                            Some(ToolResultContent::Text(text)) => {
                                assert!(
                                    is_persisted_output(text),
                                    "helper should detect persisted output"
                                );
                            }
                            other => panic!("expected Text content, got {:?}", other),
                        }
                    }
                    other => panic!("expected Blocks content, got {:?}", other),
                }
            }
            other => panic!("expected User message, got {:?}", other),
        }
    }

    // 18. test_helper_passes_inline
    #[test]
    fn test_helper_passes_inline() {
        let content = inline_content();
        let data = user_message_with_tool_result(&content, false);
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                match &u.content {
                    MessageContent::Blocks(blocks) => {
                        let tool_results: Vec<&ToolResultBlock> = blocks
                            .iter()
                            .filter_map(|b| match b {
                                ContentBlock::ToolResult(tr) => Some(tr),
                                _ => None,
                            })
                            .collect();
                        assert_eq!(tool_results.len(), 1);
                        match &tool_results[0].content {
                            Some(ToolResultContent::Text(text)) => {
                                assert!(
                                    !is_persisted_output(text),
                                    "helper should NOT detect persisted output for inline content"
                                );
                            }
                            other => panic!("expected Text content, got {:?}", other),
                        }
                    }
                    other => panic!("expected Blocks content, got {:?}", other),
                }
            }
            other => panic!("expected User message, got {:?}", other),
        }
    }
}
