use sha2::{Sha256, Digest};
use uuid::Uuid;

use crate::api::types::ApiMessage;

/// Derive a deterministic UUID from a parent UUID and an index.
/// Used when splitting multi-block messages into single-block messages.
pub fn derive_uuid(parent_id: &Uuid, index: usize) -> Uuid {
    let mut hasher = Sha256::new();
    hasher.update(parent_id.as_bytes());
    hasher.update(index.to_le_bytes());
    let hash = hasher.finalize();
    let mut bytes = [0u8; 16];
    bytes.copy_from_slice(&hash[..16]);
    // Set version 5 bits (name-based SHA-1, but we use SHA-256)
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    Uuid::from_bytes(bytes)
}

/// Split messages with multiple content blocks into individual messages.
/// Each resulting message has exactly one content block.
/// This simplifies tracking and persistence.
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
        let a = derive_uuid(&parent1, 0);
        let b = derive_uuid(&parent2, 0);
        assert_ne!(a, b);
    }

    #[test]
    fn test_split_single_block_unchanged() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("hello")]),
        ];
        let split = split_multi_block_messages(&messages);
        assert_eq!(split.len(), 1);
    }

    #[test]
    fn test_split_multi_block() {
        let messages = vec![ApiMessage::assistant(vec![
            ContentBlock::text("Let me help."),
            ContentBlock::tool_use("t1", "Bash", serde_json::json!({"command": "ls"})),
        ])];

        let split = split_multi_block_messages(&messages);
        assert_eq!(split.len(), 2);
        assert_eq!(split[0].role, Role::Assistant);
        assert_eq!(split[0].content.len(), 1);
        assert_eq!(split[1].content.len(), 1);
    }

    #[test]
    fn test_split_empty() {
        let split = split_multi_block_messages(&[]);
        assert!(split.is_empty());
    }

    #[test]
    fn test_split_preserves_role() {
        let messages = vec![
            ApiMessage::user(vec![
                ContentBlock::text("first"),
                ContentBlock::text("second"),
            ]),
        ];
        let split = split_multi_block_messages(&messages);
        assert_eq!(split.len(), 2);
        assert_eq!(split[0].role, Role::User);
        assert_eq!(split[1].role, Role::User);
    }
}
