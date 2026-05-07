use crate::api::types::{ApiMessage, CacheControl, ContentBlock, Role, SystemBlock, ToolResultContent};

/// Maximum number of cache_control breakpoints allowed by the API.
const MAX_CACHE_BREAKPOINTS: usize = 4;

/// Minimum character length for a tool_result to be considered "large" enough to cache.
const LARGE_TOOL_RESULT_THRESHOLD: usize = 1000;

/// Represents a location where cache_control can be injected.
#[derive(Debug)]
enum CacheTarget {
    /// Last system block.
    SystemBlock { index: usize },
    /// Last text block in a user message.
    UserMessageTextBlock { msg_index: usize },
    /// A tool_result block with large content.
    ToolResultBlock { msg_index: usize, block_index: usize, content_len: usize },
}

/// Inject cache_control breakpoints following the addCacheBreakpoints strategy.
///
/// Priority order (up to MAX_CACHE_BREAKPOINTS total):
///   1. Last system block
///   2. Last user message (last text block)
///   3. Second-to-last user message (last text block)
///   4. Largest tool_result block with content > LARGE_TOOL_RESULT_THRESHOLD chars
pub fn inject_cache_control(
    messages: &mut [ApiMessage],
    system: &mut [SystemBlock],
) {
    let mut budget = MAX_CACHE_BREAKPOINTS;

    // 1. Last system block
    if budget > 0 {
        if let Some(last_sys) = system.last_mut() {
            last_sys.cache_control = Some(CacheControl::ephemeral());
            budget -= 1;
        }
    }

    // Collect user message indices (for priority 2 & 3)
    let user_indices: Vec<usize> = messages
        .iter()
        .enumerate()
        .filter(|(_, m)| m.role == Role::User)
        .map(|(i, _)| i)
        .collect();

    // 2. Last user message
    if budget > 0 {
        if let Some(&last_user_idx) = user_indices.last() {
            if set_cache_on_last_text_block(&mut messages[last_user_idx]) {
                budget -= 1;
            }
        }
    }

    // 3. Second-to-last user message
    if budget > 0 && user_indices.len() >= 2 {
        let second_last_idx = user_indices[user_indices.len() - 2];
        if set_cache_on_last_text_block(&mut messages[second_last_idx]) {
            budget -= 1;
        }
    }

    // 4. Largest tool_result block above threshold
    if budget > 0 {
        let mut best: Option<(usize, usize, usize)> = None; // (msg_index, block_index, content_len)

        for (msg_idx, msg) in messages.iter().enumerate() {
            if msg.role != Role::User {
                continue;
            }
            for (block_idx, block) in msg.content.iter().enumerate() {
                if let ContentBlock::ToolResult { content, cache_control, .. } = block {
                    // Skip if already has cache_control
                    if cache_control.is_some() {
                        continue;
                    }
                    let len = tool_result_content_len(content.as_deref());
                    if len > LARGE_TOOL_RESULT_THRESHOLD {
                        if best.map_or(true, |(_, _, best_len)| len > best_len) {
                            best = Some((msg_idx, block_idx, len));
                        }
                    }
                }
            }
        }

        if let Some((msg_idx, block_idx, _)) = best {
            if let ContentBlock::ToolResult { cache_control, .. } =
                &mut messages[msg_idx].content[block_idx]
            {
                *cache_control = Some(CacheControl::ephemeral());
            }
        }
    }
}

/// Set cache_control on the last text block of a message. Returns true if set.
fn set_cache_on_last_text_block(message: &mut ApiMessage) -> bool {
    // Walk backwards to find the last text block
    for block in message.content.iter_mut().rev() {
        match block {
            ContentBlock::Text { cache_control, .. } => {
                *cache_control = Some(CacheControl::ephemeral());
                return true;
            }
            _ => continue,
        }
    }
    false
}

/// Calculate total character length of tool_result content.
fn tool_result_content_len(content: Option<&[ToolResultContent]>) -> usize {
    content.map_or(0, |blocks| {
        blocks
            .iter()
            .map(|c| match c {
                ToolResultContent::Text { text } => text.len(),
                ToolResultContent::Image { .. } => 0,
            })
            .sum()
    })
}

/// Build a user message from a text prompt.
pub fn user_text_message(text: impl Into<String>) -> ApiMessage {
    ApiMessage::user(vec![ContentBlock::text(text)])
}

/// Build an assistant message with text content.
pub fn assistant_text_message(text: impl Into<String>) -> ApiMessage {
    ApiMessage::assistant(vec![ContentBlock::text(text)])
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::types::ToolResultContent;

    #[test]
    fn test_inject_cache_control_basic() {
        let mut system = vec![
            SystemBlock::text("You are a helpful assistant."),
            SystemBlock::text("Extra context."),
        ];
        let mut messages = vec![
            ApiMessage::user(vec![ContentBlock::text("first")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 1")]),
            ApiMessage::user(vec![ContentBlock::text("second")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 2")]),
            ApiMessage::user(vec![ContentBlock::text("third")]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // Last system block should have cache_control
        assert!(system.last().unwrap().cache_control.is_some());
        // First system block should NOT
        assert!(system[0].cache_control.is_none());

        // Last user message (index 4) should have cache_control
        match &messages[4].content[0] {
            ContentBlock::Text { cache_control, .. } => {
                assert!(cache_control.is_some());
            }
            _ => panic!("Expected text"),
        }

        // Second-to-last user message (index 2) should have cache_control
        match &messages[2].content[0] {
            ContentBlock::Text { cache_control, .. } => {
                assert!(cache_control.is_some());
            }
            _ => panic!("Expected text"),
        }

        // First user message should NOT have cache_control
        match &messages[0].content[0] {
            ContentBlock::Text { cache_control, .. } => {
                assert!(cache_control.is_none());
            }
            _ => panic!("Expected text"),
        }
    }

    #[test]
    fn test_inject_cache_control_large_tool_result() {
        let mut system = vec![SystemBlock::text("system")];
        let large_content = "x".repeat(2000);
        let mut messages = vec![
            ApiMessage::user(vec![
                ContentBlock::tool_result(
                    "tool_1",
                    vec![ToolResultContent::text(&large_content)],
                    false,
                ),
                ContentBlock::text("question"),
            ]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // System block: cached
        assert!(system[0].cache_control.is_some());

        // Last user text block: cached
        match &messages[0].content[1] {
            ContentBlock::Text { cache_control, .. } => {
                assert!(cache_control.is_some());
            }
            _ => panic!("Expected text"),
        }

        // Large tool_result: cached (we have budget: 4 - 1 system - 1 user = 2 remaining)
        match &messages[0].content[0] {
            ContentBlock::ToolResult { cache_control, .. } => {
                assert!(cache_control.is_some());
            }
            _ => panic!("Expected tool_result"),
        }
    }

    #[test]
    fn test_inject_cache_control_small_tool_result_not_cached() {
        let mut system = vec![SystemBlock::text("system")];
        let small_content = "short";
        let mut messages = vec![
            ApiMessage::user(vec![
                ContentBlock::tool_result(
                    "tool_1",
                    vec![ToolResultContent::text(small_content)],
                    false,
                ),
                ContentBlock::text("question"),
            ]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // Small tool_result should NOT be cached
        match &messages[0].content[0] {
            ContentBlock::ToolResult { cache_control, .. } => {
                assert!(cache_control.is_none());
            }
            _ => panic!("Expected tool_result"),
        }
    }

    #[test]
    fn test_inject_cache_control_respects_budget() {
        let mut system = vec![SystemBlock::text("system")];
        let large_content = "x".repeat(5000);
        let large_content2 = "y".repeat(3000);
        // 4 user messages + 2 large tool results = more than 4 candidates
        let mut messages = vec![
            ApiMessage::user(vec![
                ContentBlock::tool_result("t1", vec![ToolResultContent::text(&large_content)], false),
                ContentBlock::text("q1"),
            ]),
            ApiMessage::assistant(vec![ContentBlock::text("a1")]),
            ApiMessage::user(vec![
                ContentBlock::tool_result("t2", vec![ToolResultContent::text(&large_content2)], false),
                ContentBlock::text("q2"),
            ]),
            ApiMessage::assistant(vec![ContentBlock::text("a2")]),
            ApiMessage::user(vec![ContentBlock::text("q3")]),
            ApiMessage::assistant(vec![ContentBlock::text("a3")]),
            ApiMessage::user(vec![ContentBlock::text("q4")]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // Count total cache_control blocks
        let mut count = 0;
        for s in &system {
            if s.cache_control.is_some() {
                count += 1;
            }
        }
        for m in &messages {
            for b in &m.content {
                match b {
                    ContentBlock::Text { cache_control: Some(_), .. } => count += 1,
                    ContentBlock::ToolResult { cache_control: Some(_), .. } => count += 1,
                    _ => {}
                }
            }
        }

        assert!(count <= MAX_CACHE_BREAKPOINTS, "Should not exceed {MAX_CACHE_BREAKPOINTS} breakpoints, got {count}");
    }

    #[test]
    fn test_user_text_message() {
        let msg = user_text_message("hello");
        assert_eq!(msg.role, Role::User);
        assert_eq!(msg.content.len(), 1);
    }
}
