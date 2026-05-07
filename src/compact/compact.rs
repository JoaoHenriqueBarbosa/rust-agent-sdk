use crate::api::client::AnthropicClient;
use crate::api::types::*;
use crate::errors::Result;

/// Engine for compacting conversation history via API summarization.
pub struct CompactionEngine {
    client: AnthropicClient,
    summary_model: String,
    summary_max_tokens: u32,
}

impl CompactionEngine {
    pub fn new(client: AnthropicClient) -> Self {
        Self {
            summary_model: client.default_model.clone(),
            summary_max_tokens: 8192,
            client,
        }
    }

    pub fn with_summary_model(mut self, model: impl Into<String>) -> Self {
        self.summary_model = model.into();
        self
    }

    /// Compact a conversation by summarizing its history.
    /// Returns a new message list with a single user message containing the summary.
    pub async fn compact(
        &self,
        messages: &[ApiMessage],
        system_prompt_text: &str,
    ) -> Result<Vec<ApiMessage>> {
        if messages.is_empty() {
            return Ok(Vec::new());
        }

        // Extract textual content from all messages, stripping images
        let conversation_text = extract_conversation_text(messages);

        if conversation_text.is_empty() {
            return Ok(messages.to_vec());
        }

        // Create a summarization request
        let summary_system = vec![SystemBlock::text(SUMMARIZATION_PROMPT)];

        let summary_messages = vec![ApiMessage::user(vec![ContentBlock::text(format!(
            "Here is the conversation to summarize. The system prompt is:\n\n{system_prompt_text}\n\n\
             ---\n\nConversation:\n\n{conversation_text}"
        ))])];

        let request = CreateMessageRequest {
            model: self.summary_model.clone(),
            max_tokens: self.summary_max_tokens,
            messages: summary_messages,
            system: Some(summary_system),
            tools: None,
            tool_choice: None,
            stream: false,
            metadata: None,
            stop_sequences: None,
            temperature: Some(0.0),
            top_p: None,
            top_k: None,
            thinking: None,
        };

        let response = self.client.create_message(request).await?;

        // Extract summary text from response
        let summary = response
            .content
            .iter()
            .filter_map(|b| match b {
                ContentBlock::Text { text, .. } => Some(text.as_str()),
                _ => None,
            })
            .collect::<Vec<_>>()
            .join("");

        if summary.is_empty() {
            return Ok(messages.to_vec());
        }

        // Return a new message list with just the summary
        Ok(vec![ApiMessage::user(vec![ContentBlock::text(format!(
            "[Conversation summary - previous messages were compacted]\n\n{summary}"
        ))])])
    }
}

/// Extract readable text from messages for summarization.
fn extract_conversation_text(messages: &[ApiMessage]) -> String {
    let mut parts = Vec::new();

    for msg in messages {
        let role = match msg.role {
            Role::User => "User",
            Role::Assistant => "Assistant",
        };

        for block in &msg.content {
            match block {
                ContentBlock::Text { text, .. } => {
                    if !text.is_empty() {
                        parts.push(format!("{role}: {text}"));
                    }
                }
                ContentBlock::ToolUse { name, input, .. } => {
                    let input_str = serde_json::to_string(input).unwrap_or_default();
                    let truncated = if input_str.len() > 200 {
                        format!("{}...", &input_str[..200])
                    } else {
                        input_str
                    };
                    parts.push(format!("{role}: [Tool: {name}({truncated})]"));
                }
                ContentBlock::ToolResult { content, is_error, .. } => {
                    let error_tag = if *is_error == Some(true) { " ERROR" } else { "" };
                    if let Some(blocks) = content {
                        for c in blocks {
                            if let ToolResultContent::Text { text } = c {
                                let truncated = if text.len() > 500 {
                                    format!("{}...", &text[..500])
                                } else {
                                    text.clone()
                                };
                                parts.push(format!("{role}: [Tool Result{error_tag}: {truncated}]"));
                            }
                        }
                    }
                }
                ContentBlock::Thinking { thinking, .. } => {
                    if !thinking.is_empty() {
                        let truncated = if thinking.len() > 300 {
                            format!("{}...", &thinking[..300])
                        } else {
                            thinking.clone()
                        };
                        parts.push(format!("{role}: [Thinking: {truncated}]"));
                    }
                }
                _ => {}
            }
        }
    }

    parts.join("\n\n")
}

const SUMMARIZATION_PROMPT: &str = "\
You are a conversation summarizer. Your task is to create a concise but comprehensive \
summary of the conversation provided. The summary should:

1. Preserve all important decisions, conclusions, and action items
2. Maintain the context of what was being worked on
3. Include relevant file paths, code changes, and technical details
4. Note any errors encountered and how they were resolved
5. Preserve the current state of any ongoing tasks

Be concise but thorough. The summary will be used to continue the conversation \
without access to the original messages.";

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_conversation_text() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("Hello, can you help me?")]),
            ApiMessage::assistant(vec![ContentBlock::text("Of course! What do you need?")]),
            ApiMessage::user(vec![ContentBlock::text("Read this file")]),
        ];

        let text = extract_conversation_text(&messages);
        assert!(text.contains("User: Hello"));
        assert!(text.contains("Assistant: Of course"));
        assert!(text.contains("User: Read this file"));
    }

    #[test]
    fn test_extract_with_tool_use() {
        let messages = vec![
            ApiMessage::assistant(vec![
                ContentBlock::text("Let me read that."),
                ContentBlock::tool_use("t1", "Read", serde_json::json!({"file_path": "/tmp/test.txt"})),
            ]),
            ApiMessage::user(vec![ContentBlock::ToolResult {
                tool_use_id: "t1".to_string(),
                content: Some(vec![ToolResultContent::Text { text: "file contents here".to_string() }]),
                is_error: None,
            }]),
        ];

        let text = extract_conversation_text(&messages);
        assert!(text.contains("[Tool: Read"));
        assert!(text.contains("[Tool Result: file contents here]"));
    }

    #[test]
    fn test_extract_empty() {
        let text = extract_conversation_text(&[]);
        assert!(text.is_empty());
    }
}
