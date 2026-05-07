use crate::api::types::{ApiMessage, CacheControl, ContentBlock, Role};

/// Inject cache_control: ephemeral on the last content block of the last N user messages.
/// This enables prompt caching for recent conversation turns.
pub fn inject_cache_control(messages: &mut [ApiMessage], last_n: usize) {
    let user_indices: Vec<usize> = messages
        .iter()
        .enumerate()
        .filter(|(_, m)| m.role == Role::User)
        .map(|(i, _)| i)
        .collect();

    let start = if user_indices.len() > last_n {
        user_indices.len() - last_n
    } else {
        0
    };

    for &idx in &user_indices[start..] {
        if let Some(last_block) = messages[idx].content.last_mut() {
            match last_block {
                ContentBlock::Text { cache_control, .. } => {
                    *cache_control = Some(CacheControl::ephemeral());
                }
                ContentBlock::ToolResult { .. } => {
                    // Tool results don't support cache_control directly
                }
                _ => {}
            }
        }
    }
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

    #[test]
    fn test_inject_cache_control() {
        let mut messages = vec![
            ApiMessage::user(vec![ContentBlock::text("first")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 1")]),
            ApiMessage::user(vec![ContentBlock::text("second")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 2")]),
            ApiMessage::user(vec![ContentBlock::text("third")]),
        ];

        inject_cache_control(&mut messages, 2);

        // Last 2 user messages (index 2 and 4) should have cache_control
        match &messages[2].content[0] {
            ContentBlock::Text { cache_control, .. } => {
                assert!(cache_control.is_some());
            }
            _ => panic!("Expected text"),
        }
        match &messages[4].content[0] {
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
    fn test_user_text_message() {
        let msg = user_text_message("hello");
        assert_eq!(msg.role, Role::User);
        assert_eq!(msg.content.len(), 1);
    }
}
