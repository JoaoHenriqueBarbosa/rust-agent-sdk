use crate::api::types::{ApiMessage, ContentBlock, SystemBlock};

/// Estimate token count for a text string.
/// Uses the ~4 chars per token heuristic (conservative estimate).
pub fn estimate_tokens(text: &str) -> usize {
    // ~4 chars per token is the standard heuristic for English/code.
    // This slightly overestimates which is safer for threshold checks.
    (text.len() + 3) / 4
}

/// Estimate token count for a single content block.
pub fn estimate_block_tokens(block: &ContentBlock) -> usize {
    match block {
        ContentBlock::Text { text, .. } => estimate_tokens(text),
        ContentBlock::Image { .. } => 1000, // Fixed estimate for images
        ContentBlock::ToolUse { input, name, .. } => {
            estimate_tokens(name) + estimate_tokens(&input.to_string())
        }
        ContentBlock::ToolResult { content, .. } => {
            content.as_ref().map_or(0, |blocks| {
                blocks.iter().map(|c| match c {
                    crate::api::types::ToolResultContent::Text { text } => estimate_tokens(text),
                    crate::api::types::ToolResultContent::Image { .. } => 1000,
                }).sum()
            })
        }
        ContentBlock::Thinking { thinking, .. } => estimate_tokens(thinking),
        ContentBlock::RedactedThinking { .. } => 100, // Opaque, can't estimate
    }
}

/// Estimate total token count for a list of messages.
pub fn estimate_message_tokens(messages: &[ApiMessage]) -> usize {
    messages.iter().map(|m| {
        // ~4 tokens overhead per message (role, formatting)
        4 + m.content.iter().map(estimate_block_tokens).sum::<usize>()
    }).sum()
}

/// Estimate token count for system prompt blocks.
pub fn estimate_system_tokens(system: &[SystemBlock]) -> usize {
    system.iter().map(|b| estimate_tokens(&b.text)).sum()
}

/// Estimate token count for tool definitions.
pub fn estimate_tool_definition_tokens(tools: &[crate::api::types::ToolDefinition]) -> usize {
    tools.iter().map(|t| {
        let name_tokens = estimate_tokens(&t.name);
        let desc_tokens = t.description.as_ref().map_or(0, |d| estimate_tokens(d));
        let schema_tokens = estimate_tokens(&t.input_schema.to_string());
        name_tokens + desc_tokens + schema_tokens
    }).sum()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::types::*;

    #[test]
    fn test_estimate_tokens() {
        assert_eq!(estimate_tokens(""), 0);
        assert_eq!(estimate_tokens("test"), 1); // 4 chars = 1 token
        assert_eq!(estimate_tokens("hello world"), 3); // 11 chars ≈ 3 tokens
    }

    #[test]
    fn test_estimate_message_tokens() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("Hello, how are you?")]),
            ApiMessage::assistant(vec![ContentBlock::text("I'm doing well, thanks!")]),
        ];
        let tokens = estimate_message_tokens(&messages);
        // ~19 + ~23 chars = ~42 chars / 4 ≈ ~10 tokens + 8 overhead = ~18
        assert!(tokens > 0);
        assert!(tokens < 50);
    }

    #[test]
    fn test_estimate_block_tokens_tool_use() {
        let block = ContentBlock::tool_use("id", "Bash", serde_json::json!({"command": "ls -la"}));
        let tokens = estimate_block_tokens(&block);
        assert!(tokens > 0);
    }

    #[test]
    fn test_estimate_system_tokens() {
        let system = vec![
            SystemBlock::text("You are a helpful assistant."),
            SystemBlock::text_cached("Additional context here."),
        ];
        let tokens = estimate_system_tokens(&system);
        assert!(tokens > 0);
    }
}
