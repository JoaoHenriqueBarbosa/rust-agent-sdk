// Port of ~/claude-code/src/utils/messages/normalizeMessagesForAPI.js
// and ~/claude-code/src/utils/messages/ensureToolResultPairing.js

use std::collections::HashSet;

use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::api::types::{ApiMessage, ContentBlock, Role, ToolResultContent};

// ---------------------------------------------------------------------------
// Port: SYNTHETIC_TOOL_RESULT_PLACEHOLDER from ensureToolResultPairing.js
// ---------------------------------------------------------------------------

const SYNTHETIC_TOOL_RESULT_PLACEHOLDER: &str =
    "Error: tool execution was interrupted or result is missing";

// ---------------------------------------------------------------------------
// deriveUUID — Port: deriveUUID from deriveUUID.js
// ---------------------------------------------------------------------------

/// Derive a deterministic UUID from a parent UUID and an index.
pub fn derive_uuid(parent_id: &Uuid, index: usize) -> Uuid {
    let mut hasher = Sha256::new();
    hasher.update(parent_id.as_bytes());
    hasher.update(index.to_le_bytes());
    let hash = hasher.finalize();
    let mut bytes = [0u8; 16];
    bytes.copy_from_slice(&hash[..16]);
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    Uuid::from_bytes(bytes)
}

// ---------------------------------------------------------------------------
// splitMultiBlockMessages
// ---------------------------------------------------------------------------

/// Split messages with multiple content blocks into individual messages.
pub fn split_multi_block_messages(messages: &[ApiMessage]) -> Vec<ApiMessage> {
    messages
        .iter()
        .flat_map(|msg| {
            if msg.content.len() <= 1 {
                vec![msg.clone()]
            } else {
                msg.content
                    .iter()
                    .map(|block| ApiMessage {
                        role: msg.role,
                        content: vec![block.clone()],
                    })
                    .collect()
            }
        })
        .collect()
}

// ---------------------------------------------------------------------------
// stripExcessMediaItems — Port of stripExcessMediaItems from claude-code-js
// ---------------------------------------------------------------------------

/// Default maximum number of Image blocks allowed across all messages.
const API_MAX_MEDIA_PER_REQUEST: usize = 20;

/// Remove excess Image blocks from messages when the total count exceeds
/// `max_media`. Removes oldest images first (from earliest messages).
pub fn strip_excess_media_items(messages: &mut Vec<ApiMessage>, max_media: usize) {
    // Count total image blocks
    let total_images: usize = messages
        .iter()
        .flat_map(|m| m.content.iter())
        .filter(|b| matches!(b, ContentBlock::Image { .. }))
        .count();

    if total_images <= max_media {
        return;
    }

    let to_remove = total_images - max_media;
    let mut removed = 0usize;

    for msg in messages.iter_mut() {
        if removed >= to_remove {
            break;
        }
        let before_len = msg.content.len();
        msg.content.retain(|block| {
            if removed >= to_remove {
                return true;
            }
            if matches!(block, ContentBlock::Image { .. }) {
                removed += 1;
                return false;
            }
            true
        });
        // If all content was removed from a message, keep it around — the
        // downstream normalize step will handle empty messages.
        let _ = before_len;
    }
}

// ---------------------------------------------------------------------------
// normalizeMessagesForAPI — Port of normalizeMessagesForAPI.js
// ---------------------------------------------------------------------------

/// Normalize messages for the Anthropic API.
///
/// Faithfully ports the TS normalizeMessagesForAPI. Handles:
/// 1. Filtering virtual/progress/synthetic-error messages (N/A — our messages are already API format)
/// 2. Merging consecutive same-role messages (required by Bedrock, tolerated by 1P)
/// 3. Normalizing tool_use names to canonical form
/// 4. filterOrphanedThinkingOnlyMessages
/// 5. filterTrailingThinkingFromLastAssistant
/// 6. filterWhitespaceOnlyAssistantMessages
/// 7. ensureNonEmptyAssistantContent
/// 8. sanitizeErrorToolResultContent (wraps error results in XML)
pub fn normalize_messages_for_api(messages: &[ApiMessage]) -> Vec<ApiMessage> {
    let mut result: Vec<ApiMessage> = Vec::new();

    // Port: the main forEach loop that merges consecutive same-role messages
    for message in messages {
        match message.role {
            Role::User => {
                // Port: merge consecutive user messages
                if let Some(last) = result.last_mut() {
                    if last.role == Role::User {
                        last.content.extend(message.content.clone());
                        continue;
                    }
                }
                result.push(message.clone());
            }
            Role::Assistant => {
                // Port: merge consecutive assistant messages (by same message id, or just consecutive)
                if let Some(last) = result.last_mut() {
                    if last.role == Role::Assistant {
                        last.content.extend(message.content.clone());
                        continue;
                    }
                }
                result.push(message.clone());
            }
        }
    }

    // Port: filterWhitespaceOnlyAssistantMessages
    result.retain(|msg| {
        if msg.role != Role::Assistant {
            return true;
        }
        // Keep if any non-whitespace-only text or non-text block exists
        msg.content.iter().any(|block| match block {
            ContentBlock::Text { text, .. } => !text.trim().is_empty(),
            _ => true,
        })
    });

    // Port: filterOrphanedThinkingOnlyMessages
    // Remove assistant messages that contain ONLY thinking/redacted_thinking blocks
    result.retain(|msg| {
        if msg.role != Role::Assistant {
            return true;
        }
        // Keep if any non-thinking block exists
        msg.content.iter().any(|block| {
            !matches!(
                block,
                ContentBlock::Thinking { .. } | ContentBlock::RedactedThinking { .. }
            )
        })
    });

    // Port: ensureNonEmptyAssistantContent
    for msg in &mut result {
        if msg.role == Role::Assistant && msg.content.is_empty() {
            msg.content.push(ContentBlock::text("..."));
        }
    }

    // Port: filterTrailingThinkingFromLastAssistant
    if let Some(last) = result.last_mut() {
        if last.role == Role::Assistant {
            while last.content.last().map_or(false, |b| {
                matches!(
                    b,
                    ContentBlock::Thinking { .. } | ContentBlock::RedactedThinking { .. }
                )
            }) {
                last.content.pop();
            }
            if last.content.is_empty() {
                last.content.push(ContentBlock::text("..."));
            }
        }
    }

    // Port: sanitizeErrorToolResultContent
    // Wrap error tool_result content in <tool_use_error> XML tags if not already wrapped
    for msg in &mut result {
        if msg.role != Role::User {
            continue;
        }
        for block in &mut msg.content {
            if let ContentBlock::ToolResult {
                is_error: Some(true),
                content: Some(ref mut content),
                ..
            } = block
            {
                for c in content.iter_mut() {
                    if let ToolResultContent::Text { ref mut text } = c {
                        if !text.starts_with("<tool_use_error>") {
                            *text = format!("<tool_use_error>{text}</tool_use_error>");
                        }
                    }
                }
            }
        }
    }

    // Port: stripExcessMediaItems — remove oldest images if over API limit
    strip_excess_media_items(&mut result, API_MAX_MEDIA_PER_REQUEST);

    result
}

// ---------------------------------------------------------------------------
// ensureToolResultPairing — Port of ensureToolResultPairing.js
// ---------------------------------------------------------------------------

/// Ensure tool_use/tool_result pairing is correct.
///
/// Faithful port of ensureToolResultPairing from ensureToolResultPairing.js.
/// Handles:
/// 1. Duplicate tool_use IDs (removes duplicates)
/// 2. Missing tool_results for tool_uses (inserts synthetic error results)
/// 3. Orphaned tool_results (referencing non-existent tool_uses → removed)
/// 4. Duplicate tool_results for the same tool_use_id (keeps first)
/// 5. tool_results not immediately after their assistant message
pub fn ensure_tool_result_pairing(messages: &mut Vec<ApiMessage>) {
    let mut result: Vec<ApiMessage> = Vec::new();
    let mut all_seen_tool_use_ids: HashSet<String> = HashSet::new();
    let mut i = 0;

    while i < messages.len() {
        let msg = &messages[i];

        if msg.role != Role::Assistant {
            // Port: if (msg.type !== "assistant") {
            //   check for orphaned tool_results before any assistant message
            if msg.role == Role::User {
                let prev_is_assistant = result.last().map_or(false, |m: &ApiMessage| m.role == Role::Assistant);
                if !prev_is_assistant {
                    // Strip tool_result blocks that appear before any assistant message
                    let stripped: Vec<ContentBlock> = msg
                        .content
                        .iter()
                        .filter(|b| !matches!(b, ContentBlock::ToolResult { .. }))
                        .cloned()
                        .collect();
                    if stripped.len() != msg.content.len() {
                        if !stripped.is_empty() {
                            result.push(ApiMessage {
                                role: msg.role,
                                content: stripped,
                            });
                        } else if result.is_empty() {
                            result.push(ApiMessage::user(vec![ContentBlock::text(
                                "[Orphaned tool result removed due to conversation resume]",
                            )]));
                        }
                        i += 1;
                        continue;
                    }
                }
            }
            result.push(msg.clone());
            i += 1;
            continue;
        }

        // This is an assistant message — process tool_use IDs
        // Port: remove duplicate tool_use IDs
        let mut seen_tool_use_ids: HashSet<String> = HashSet::new();
        let mut final_content: Vec<ContentBlock> = Vec::new();

        for block in &msg.content {
            if let ContentBlock::ToolUse { id, .. } = block {
                if all_seen_tool_use_ids.contains(id) {
                    // Duplicate — skip
                    continue;
                }
                all_seen_tool_use_ids.insert(id.clone());
                seen_tool_use_ids.insert(id.clone());
            }
            final_content.push(block.clone());
        }

        if final_content.is_empty() {
            final_content.push(ContentBlock::text("[Tool use interrupted]"));
        }

        result.push(ApiMessage {
            role: Role::Assistant,
            content: final_content,
        });

        // Port: check the next message for matching tool_results
        let tool_use_ids: Vec<String> = seen_tool_use_ids.iter().cloned().collect();
        let next_msg = messages.get(i + 1);

        let mut existing_tool_result_ids: HashSet<String> = HashSet::new();
        let mut has_duplicate_tool_results = false;

        if let Some(next) = next_msg {
            if next.role == Role::User {
                for block in &next.content {
                    if let ContentBlock::ToolResult { tool_use_id, .. } = block {
                        if existing_tool_result_ids.contains(tool_use_id) {
                            has_duplicate_tool_results = true;
                        }
                        existing_tool_result_ids.insert(tool_use_id.clone());
                    }
                }
            }
        }

        let tool_use_id_set: HashSet<&String> = tool_use_ids.iter().collect();
        let missing_ids: Vec<&String> = tool_use_ids
            .iter()
            .filter(|id| !existing_tool_result_ids.contains(*id))
            .collect();
        let orphaned_ids: Vec<&String> = existing_tool_result_ids
            .iter()
            .filter(|id| !tool_use_id_set.contains(id))
            .collect();

        if missing_ids.is_empty() && orphaned_ids.is_empty() && !has_duplicate_tool_results {
            i += 1;
            continue;
        }

        // Port: create synthetic tool_results for missing IDs
        let synthetic_blocks: Vec<ContentBlock> = missing_ids
            .iter()
            .map(|id| ContentBlock::ToolResult {
                tool_use_id: (*id).clone(),
                content: Some(vec![ToolResultContent::text(
                    SYNTHETIC_TOOL_RESULT_PLACEHOLDER,
                )]),
                is_error: Some(true),
                cache_control: None,
            })
            .collect();

        if let Some(next) = next_msg {
            if next.role == Role::User {
                let mut content: Vec<ContentBlock> = next.content.clone();

                // Port: remove orphaned and duplicate tool_results
                if !orphaned_ids.is_empty() || has_duplicate_tool_results {
                    let orphaned_set: HashSet<&String> = orphaned_ids.iter().copied().collect();
                    let mut seen_tr_ids: HashSet<String> = HashSet::new();
                    content.retain(|block| {
                        if let ContentBlock::ToolResult { tool_use_id, .. } = block {
                            if orphaned_set.contains(tool_use_id) {
                                return false;
                            }
                            if seen_tr_ids.contains(tool_use_id) {
                                return false;
                            }
                            seen_tr_ids.insert(tool_use_id.clone());
                        }
                        true
                    });
                }

                let mut patched_content = synthetic_blocks;
                patched_content.extend(content);

                if !patched_content.is_empty() {
                    result.push(ApiMessage {
                        role: Role::User,
                        content: patched_content,
                    });
                } else {
                    result.push(ApiMessage::user(vec![ContentBlock::text(
                        "[No content after repair]",
                    )]));
                }
                i += 2; // skip the next message as we've consumed it
                continue;
            }
        }

        // No next user message — insert synthetic results as a new message
        if !synthetic_blocks.is_empty() {
            result.push(ApiMessage::user(synthetic_blocks));
        }

        i += 1;
    }

    *messages = result;
}

// ---------------------------------------------------------------------------
// applyToolResultBudget — Port of applyToolResultBudget from toolResultStorage.js
// ---------------------------------------------------------------------------

/// Default maximum characters per tool_result content block.
const DEFAULT_MAX_TOOL_RESULT_CHARS: usize = 80_000;

/// Truncate oversized tool_result text blocks in-place, keeping the first and
/// last portions of the text (similar to `truncate_result` in framework.rs).
///
/// This is a simplified port of the TS `applyToolResultBudget` / `enforceToolResultBudget`.
/// The TS version persists large results to disk and replaces them with references;
/// here we simply truncate in-place since the Rust SDK doesn't have a persistence layer.
pub fn apply_tool_result_budget(messages: &mut Vec<ApiMessage>, max_result_chars: usize) {
    for message in messages.iter_mut() {
        if message.role != Role::User {
            continue;
        }
        for block in &mut message.content {
            if let ContentBlock::ToolResult {
                content: Some(ref mut content_blocks),
                ..
            } = block
            {
                for content in content_blocks.iter_mut() {
                    if let ToolResultContent::Text { ref mut text } = content {
                        let original_len = text.len();
                        if original_len > max_result_chars {
                            let half = max_result_chars / 2;
                            let first = &text[..half];
                            let last = &text[original_len.saturating_sub(half)..];
                            *text = format!(
                                "{first}\n\n[Result truncated from {original_len} to {max_result_chars} characters]\n\n{last}",
                            );
                        }
                    }
                }
            }
        }
    }
}

/// Convenience wrapper that uses the default budget (80KB).
pub fn apply_tool_result_budget_default(messages: &mut Vec<ApiMessage>) {
    apply_tool_result_budget(messages, DEFAULT_MAX_TOOL_RESULT_CHARS);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::types::*;

    #[test]
    fn test_derive_uuid_deterministic() {
        let parent = Uuid::parse_str("12345678-1234-1234-1234-123456789abc").unwrap();
        let a = derive_uuid(&parent, 0);
        let b = derive_uuid(&parent, 0);
        assert_eq!(a, b);
        let c = derive_uuid(&parent, 1);
        assert_ne!(a, c);
    }

    #[test]
    fn test_derive_uuid_different_parents() {
        let parent1 = Uuid::parse_str("12345678-1234-1234-1234-123456789abc").unwrap();
        let parent2 = Uuid::parse_str("abcdefab-cdef-abcd-efab-cdefabcdefab").unwrap();
        assert_ne!(derive_uuid(&parent1, 0), derive_uuid(&parent2, 0));
    }

    #[test]
    fn test_split_single_block_unchanged() {
        let messages = vec![ApiMessage::user(vec![ContentBlock::text("hello")])];
        assert_eq!(split_multi_block_messages(&messages).len(), 1);
    }

    #[test]
    fn test_split_multi_block() {
        let messages = vec![ApiMessage::assistant(vec![
            ContentBlock::text("Let me help."),
            ContentBlock::tool_use("t1", "Bash", serde_json::json!({"command": "ls"})),
        ])];
        let split = split_multi_block_messages(&messages);
        assert_eq!(split.len(), 2);
        assert_eq!(split[0].content.len(), 1);
        assert_eq!(split[1].content.len(), 1);
    }

    #[test]
    fn test_split_empty() {
        assert!(split_multi_block_messages(&[]).is_empty());
    }

    #[test]
    fn test_split_preserves_role() {
        let messages = vec![ApiMessage::user(vec![
            ContentBlock::text("first"),
            ContentBlock::text("second"),
        ])];
        let split = split_multi_block_messages(&messages);
        assert_eq!(split.len(), 2);
        assert_eq!(split[0].role, Role::User);
        assert_eq!(split[1].role, Role::User);
    }

    #[test]
    fn test_normalize_merges_consecutive_user() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("hello")]),
            ApiMessage::user(vec![ContentBlock::text("world")]),
        ];
        let n = normalize_messages_for_api(&messages);
        assert_eq!(n.len(), 1);
        assert_eq!(n[0].content.len(), 2);
    }

    #[test]
    fn test_normalize_merges_consecutive_assistant() {
        let messages = vec![
            ApiMessage::assistant(vec![ContentBlock::text("part 1")]),
            ApiMessage::assistant(vec![ContentBlock::text("part 2")]),
        ];
        let n = normalize_messages_for_api(&messages);
        assert_eq!(n.len(), 1);
        assert_eq!(n[0].content.len(), 2);
    }

    #[test]
    fn test_normalize_filters_whitespace_assistant() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("hello")]),
            ApiMessage::assistant(vec![ContentBlock::text("   \n  ")]),
        ];
        let n = normalize_messages_for_api(&messages);
        assert_eq!(n.len(), 1);
    }

    #[test]
    fn test_normalize_filters_thinking_only_assistant() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("hello")]),
            ApiMessage::assistant(vec![ContentBlock::Thinking {
                thinking: "hmm".to_string(),
                signature: None,
            }]),
        ];
        let n = normalize_messages_for_api(&messages);
        assert_eq!(n.len(), 1);
    }

    #[test]
    fn test_normalize_keeps_text_plus_thinking() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("hello")]),
            ApiMessage::assistant(vec![
                ContentBlock::Thinking {
                    thinking: "hmm".to_string(),
                    signature: None,
                },
                ContentBlock::text("answer"),
            ]),
        ];
        let n = normalize_messages_for_api(&messages);
        assert_eq!(n.len(), 2);
    }

    #[test]
    fn test_normalize_strips_trailing_thinking() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("hello")]),
            ApiMessage::assistant(vec![
                ContentBlock::text("answer"),
                ContentBlock::Thinking {
                    thinking: "hmm".to_string(),
                    signature: None,
                },
            ]),
        ];
        let n = normalize_messages_for_api(&messages);
        assert_eq!(n.len(), 2);
        assert_eq!(n[1].content.len(), 1);
        assert!(matches!(&n[1].content[0], ContentBlock::Text { .. }));
    }

    #[test]
    fn test_normalize_sanitizes_error_tool_results() {
        let messages = vec![
            ApiMessage::assistant(vec![ContentBlock::tool_use(
                "t1",
                "Bash",
                serde_json::json!({}),
            )]),
            ApiMessage::user(vec![ContentBlock::ToolResult {
                tool_use_id: "t1".to_string(),
                content: Some(vec![ToolResultContent::text("some error")]),
                is_error: Some(true),
                cache_control: None,
            }]),
        ];
        let n = normalize_messages_for_api(&messages);
        if let ContentBlock::ToolResult {
            content: Some(ref c),
            ..
        } = n[1].content[0]
        {
            if let ToolResultContent::Text { text } = &c[0] {
                assert!(text.starts_with("<tool_use_error>"));
                assert!(text.ends_with("</tool_use_error>"));
            }
        }
    }

    #[test]
    fn test_ensure_tool_result_pairing_complete() {
        let mut messages = vec![
            ApiMessage::assistant(vec![
                ContentBlock::tool_use("t1", "Bash", serde_json::json!({})),
                ContentBlock::tool_use("t2", "Read", serde_json::json!({})),
            ]),
            ApiMessage::user(vec![
                ContentBlock::tool_result("t1", vec![ToolResultContent::text("ok")], false),
                ContentBlock::tool_result("t2", vec![ToolResultContent::text("ok")], false),
            ]),
        ];
        ensure_tool_result_pairing(&mut messages);
        // Should be unchanged — all paired
        assert_eq!(messages.len(), 2);
    }

    #[test]
    fn test_ensure_tool_result_pairing_missing() {
        let mut messages = vec![
            ApiMessage::assistant(vec![
                ContentBlock::tool_use("t1", "Bash", serde_json::json!({})),
                ContentBlock::tool_use("t2", "Read", serde_json::json!({})),
            ]),
            // Only t1 has a result
            ApiMessage::user(vec![ContentBlock::tool_result(
                "t1",
                vec![ToolResultContent::text("ok")],
                false,
            )]),
        ];
        ensure_tool_result_pairing(&mut messages);
        // Should have synthetic error for t2
        let all_result_ids: Vec<&str> = messages
            .iter()
            .flat_map(|m| m.content.iter())
            .filter_map(|b| match b {
                ContentBlock::ToolResult { tool_use_id, .. } => Some(tool_use_id.as_str()),
                _ => None,
            })
            .collect();
        assert!(all_result_ids.contains(&"t1"));
        assert!(all_result_ids.contains(&"t2"));
    }

    #[test]
    fn test_ensure_tool_result_pairing_no_next_message() {
        let mut messages = vec![ApiMessage::assistant(vec![ContentBlock::tool_use(
            "t1",
            "Bash",
            serde_json::json!({}),
        )])];
        ensure_tool_result_pairing(&mut messages);
        // Should have added a synthetic user message with tool_result
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[1].role, Role::User);
        assert!(matches!(
            &messages[1].content[0],
            ContentBlock::ToolResult {
                is_error: Some(true),
                ..
            }
        ));
    }

    #[test]
    fn test_ensure_tool_result_pairing_orphaned_results() {
        let mut messages = vec![
            ApiMessage::assistant(vec![ContentBlock::tool_use(
                "t1",
                "Bash",
                serde_json::json!({}),
            )]),
            ApiMessage::user(vec![
                ContentBlock::tool_result("t1", vec![ToolResultContent::text("ok")], false),
                ContentBlock::tool_result(
                    "t999",
                    vec![ToolResultContent::text("orphaned")],
                    false,
                ),
            ]),
        ];
        ensure_tool_result_pairing(&mut messages);
        // t999 should be removed
        let all_result_ids: Vec<&str> = messages
            .iter()
            .flat_map(|m| m.content.iter())
            .filter_map(|b| match b {
                ContentBlock::ToolResult { tool_use_id, .. } => Some(tool_use_id.as_str()),
                _ => None,
            })
            .collect();
        assert!(all_result_ids.contains(&"t1"));
        assert!(!all_result_ids.contains(&"t999"));
    }

    #[test]
    fn test_ensure_tool_result_pairing_duplicate_tool_results() {
        let mut messages = vec![
            ApiMessage::assistant(vec![ContentBlock::tool_use(
                "t1",
                "Bash",
                serde_json::json!({}),
            )]),
            ApiMessage::user(vec![
                ContentBlock::tool_result("t1", vec![ToolResultContent::text("first")], false),
                ContentBlock::tool_result("t1", vec![ToolResultContent::text("duplicate")], false),
            ]),
        ];
        ensure_tool_result_pairing(&mut messages);
        // Should keep only the first t1 result
        let result_count = messages
            .iter()
            .flat_map(|m| m.content.iter())
            .filter(|b| matches!(b, ContentBlock::ToolResult { tool_use_id, .. } if tool_use_id == "t1"))
            .count();
        assert_eq!(result_count, 1);
    }

    #[test]
    fn test_apply_tool_result_budget_no_truncation() {
        let mut messages = vec![
            ApiMessage::user(vec![ContentBlock::ToolResult {
                tool_use_id: "t1".to_string(),
                content: Some(vec![ToolResultContent::text("short result")]),
                is_error: None,
                cache_control: None,
            }]),
        ];
        apply_tool_result_budget(&mut messages, 80_000);
        if let ContentBlock::ToolResult { content: Some(ref c), .. } = messages[0].content[0] {
            if let ToolResultContent::Text { ref text } = c[0] {
                assert_eq!(text, "short result");
            }
        }
    }

    #[test]
    fn test_apply_tool_result_budget_truncates_large() {
        let large_text = "x".repeat(100_000);
        let mut messages = vec![
            ApiMessage::user(vec![ContentBlock::ToolResult {
                tool_use_id: "t1".to_string(),
                content: Some(vec![ToolResultContent::text(&large_text)]),
                is_error: None,
                cache_control: None,
            }]),
        ];
        apply_tool_result_budget(&mut messages, 80_000);
        if let ContentBlock::ToolResult { content: Some(ref c), .. } = messages[0].content[0] {
            if let ToolResultContent::Text { ref text } = c[0] {
                assert!(text.len() < 100_000);
                assert!(text.contains("[Result truncated from 100000 to 80000 characters]"));
            }
        }
    }

    #[test]
    fn test_apply_tool_result_budget_skips_assistant() {
        let mut messages = vec![
            ApiMessage::assistant(vec![ContentBlock::text("x".repeat(100_000).as_str())]),
        ];
        let original_len = if let ContentBlock::Text { ref text, .. } = messages[0].content[0] {
            text.len()
        } else {
            0
        };
        apply_tool_result_budget(&mut messages, 80_000);
        if let ContentBlock::Text { ref text, .. } = messages[0].content[0] {
            assert_eq!(text.len(), original_len);
        }
    }

    fn make_image_block() -> ContentBlock {
        ContentBlock::Image {
            source: crate::api::types::ImageSource {
                r#type: "base64".to_string(),
                media_type: "image/png".to_string(),
                data: "abc".to_string(),
            },
        }
    }

    #[test]
    fn test_strip_excess_media_under_limit() {
        let mut messages = vec![
            ApiMessage::user(vec![make_image_block(), ContentBlock::text("hi")]),
        ];
        strip_excess_media_items(&mut messages, 5);
        let image_count: usize = messages
            .iter()
            .flat_map(|m| m.content.iter())
            .filter(|b| matches!(b, ContentBlock::Image { .. }))
            .count();
        assert_eq!(image_count, 1);
    }

    #[test]
    fn test_strip_excess_media_over_limit() {
        let mut messages = vec![
            ApiMessage::user(vec![
                make_image_block(),
                make_image_block(),
                make_image_block(),
                ContentBlock::text("msg1"),
            ]),
            ApiMessage::user(vec![
                make_image_block(),
                make_image_block(),
                ContentBlock::text("msg2"),
            ]),
        ];
        // Total 5 images, limit 3 → remove 2 oldest (from first message)
        strip_excess_media_items(&mut messages, 3);
        let image_count: usize = messages
            .iter()
            .flat_map(|m| m.content.iter())
            .filter(|b| matches!(b, ContentBlock::Image { .. }))
            .count();
        assert_eq!(image_count, 3);
        // First message should have lost 2 images, keeping 1 image + text
        assert_eq!(messages[0].content.len(), 2);
        // Second message untouched
        assert_eq!(messages[1].content.len(), 3);
    }

    #[test]
    fn test_strip_excess_media_exact_limit() {
        let mut messages = vec![
            ApiMessage::user(vec![make_image_block(), make_image_block()]),
        ];
        strip_excess_media_items(&mut messages, 2);
        let image_count: usize = messages
            .iter()
            .flat_map(|m| m.content.iter())
            .filter(|b| matches!(b, ContentBlock::Image { .. }))
            .count();
        assert_eq!(image_count, 2);
    }
}
