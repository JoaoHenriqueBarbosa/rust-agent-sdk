use crate::api::types::{ApiMessage, ContentBlock};

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
    use crate::api::types::Role;

    #[test]
    fn test_user_text_message() {
        let msg = user_text_message("hello");
        assert_eq!(msg.role, Role::User);
        assert_eq!(msg.content.len(), 1);
    }
}
