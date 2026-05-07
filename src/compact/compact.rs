use futures::StreamExt;

use crate::api::client::AnthropicClient;
use crate::api::streaming::AssistantMessage;
use crate::api::types::*;
use crate::compact::token_estimation::estimate_message_tokens;
use crate::errors::{ClaudeSDKError, Result};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COMPACT_MAX_OUTPUT_TOKENS: u32 = 8192;
const MAX_PTL_RETRIES: u32 = 3;
const PROMPT_TOO_LONG_PREFIX: &str = "prompt is too long";

// ---------------------------------------------------------------------------
// Compact prompt — faithful port of getCompactPrompt() from prompt.ts
// ---------------------------------------------------------------------------

fn get_compact_prompt(custom_instructions: Option<&str>) -> String {
    let mut prompt = String::from(
        "CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.\n\
         \n\
         - Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.\n\
         - You already have all the context you need in the conversation above.\n\
         - Tool calls will be REJECTED and will waste your only turn \u{2014} you will fail the task.\n\
         - Your entire response must be plain text: an <analysis> block followed by a <summary> block.\n\
         \n\
         Create a detailed summary of the conversation so far. Capture technical details, \
         code patterns, and decisions essential for continuing without losing context.\n\
         \n\
         Before your summary, wrap analysis in <analysis> tags. For each section of the conversation, identify:\n\
         - User's explicit requests and intents\n\
         - Your approach and key decisions\n\
         - Technical concepts, code patterns, file names, code snippets, function signatures, file edits\n\
         - Errors encountered and how they were fixed\n\
         - User feedback, especially \"do this differently\" instructions\n\
         \n\
         Sections:\n\
         1. Primary Request and Intent: All user requests and intents in detail\n\
         2. Key Technical Concepts: Technologies, frameworks, concepts discussed\n\
         3. Files and Code Sections: Files examined/modified/created with full snippets and why they matter (focus on recent messages)\n\
         4. Errors and fixes: All errors, how fixed, user feedback on them\n\
         5. Problem Solving: Problems solved and ongoing troubleshooting\n\
         6. All user messages: ALL non-tool-result user messages (critical for understanding feedback and intent)\n\
         7. Pending Tasks: Tasks explicitly asked but not yet done\n\
         8. Current Work: What was being worked on immediately before this request (include file names, code snippets)\n\
         9. Optional Next Step: ONLY if directly in line with the user's most recent request. Include verbatim quotes from the conversation showing where you left off. Do NOT add tangential or old tasks.\n\
         \n\
         <example>\n\
         <analysis>\n\
         [thought process]\n\
         </analysis>\n\
         \n\
         <summary>\n\
         1. Primary Request and Intent:\n\
         \x20  [description]\n\
         \n\
         2. Key Technical Concepts:\n\
         \x20  - [concept]\n\
         \n\
         3. Files and Code Sections:\n\
         \x20  - [filename]\n\
         \x20     - [why important]\n\
         \x20     - [snippet]\n\
         \n\
         4. Errors and fixes:\n\
         \x20   - [error]: [fix] [user feedback]\n\
         \n\
         5. Problem Solving:\n\
         \x20  [description]\n\
         \n\
         6. All user messages:\n\
         \x20   - [message]\n\
         \n\
         7. Pending Tasks:\n\
         \x20  - [task]\n\
         \n\
         8. Current Work:\n\
         \x20  [description]\n\
         \n\
         9. Optional Next Step:\n\
         \x20  [step or omit]\n\
         \n\
         </summary>\n\
         </example>\n\
         \n\
         Follow the structure above. If the context includes additional summarization instructions, follow them too.\n",
    );

    if let Some(instructions) = custom_instructions {
        let trimmed = instructions.trim();
        if !trimmed.is_empty() {
            prompt.push_str(&format!(
                "\nAdditional Instructions:\n{trimmed}"
            ));
        }
    }

    prompt.push_str(
        "\n\nREMINDER: No tools. Plain text only \u{2014} <analysis> then <summary>. Tool calls = task failure.",
    );

    prompt
}

// ---------------------------------------------------------------------------
// Summary formatting — port of formatCompactSummary() from prompt.ts
// ---------------------------------------------------------------------------

fn format_compact_summary(summary: &str) -> String {
    // Strip <analysis>...</analysis> block
    let without_analysis = strip_tag_block(summary, "analysis");

    // Extract <summary>...</summary> content and replace with "Summary:\n{content}"
    let formatted = if let Some(content) = extract_tag_content(&without_analysis, "summary") {
        without_analysis.replace(
            &find_tag_block(&without_analysis, "summary").unwrap_or_default(),
            &format!("Summary:\n{}", content.trim()),
        )
    } else {
        without_analysis
    };

    // Collapse multiple blank lines
    collapse_blank_lines(&formatted).trim().to_string()
}

fn strip_tag_block(text: &str, tag: &str) -> String {
    let open = format!("<{tag}>");
    let close = format!("</{tag}>");
    if let Some(start) = text.find(&open) {
        if let Some(end) = text[start..].find(&close) {
            let mut result = String::with_capacity(text.len());
            result.push_str(&text[..start]);
            result.push_str(&text[start + end + close.len()..]);
            return result;
        }
    }
    text.to_string()
}

fn find_tag_block(text: &str, tag: &str) -> Option<String> {
    let open = format!("<{tag}>");
    let close = format!("</{tag}>");
    let start = text.find(&open)?;
    let end = text[start..].find(&close)?;
    Some(text[start..start + end + close.len()].to_string())
}

fn extract_tag_content(text: &str, tag: &str) -> Option<String> {
    let open = format!("<{tag}>");
    let close = format!("</{tag}>");
    let start = text.find(&open)? + open.len();
    let end_offset = text[start..].find(&close)?;
    Some(text[start..start + end_offset].to_string())
}

fn collapse_blank_lines(text: &str) -> String {
    let mut result = String::with_capacity(text.len());
    let mut prev_was_blank = false;
    for line in text.lines() {
        let is_blank = line.trim().is_empty();
        if is_blank && prev_was_blank {
            continue;
        }
        if !result.is_empty() {
            result.push('\n');
        }
        result.push_str(line);
        prev_was_blank = is_blank;
    }
    result
}

// ---------------------------------------------------------------------------
// CompactUserSummaryMessage — port of getCompactUserSummaryMessage()
// ---------------------------------------------------------------------------

fn get_compact_user_summary_message(summary: &str) -> String {
    format!(
        "This session is being continued from a previous conversation that ran out of context. \
         The summary below covers the earlier portion of the conversation.\n\n{}",
        format_compact_summary(summary),
    )
}

// ---------------------------------------------------------------------------
// CompactionResult
// ---------------------------------------------------------------------------

/// Result of a conversation compaction operation.
#[derive(Debug, Clone)]
pub struct CompactionResult {
    /// Compacted message list (summary user message + assistant ack).
    pub summary_messages: Vec<ApiMessage>,
    /// Estimated token count before compaction.
    pub pre_compact_token_count: usize,
    /// Estimated token count after compaction (from API usage).
    pub post_compact_token_count: usize,
    /// Raw usage reported by the compaction API call.
    pub compaction_usage: Option<Usage>,
}

// ---------------------------------------------------------------------------
// CompactionEngine
// ---------------------------------------------------------------------------

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
            summary_max_tokens: COMPACT_MAX_OUTPUT_TOKENS,
            client,
        }
    }

    pub fn with_summary_model(mut self, model: impl Into<String>) -> Self {
        self.summary_model = model.into();
        self
    }

    /// Compact a conversation by summarizing its history.
    ///
    /// Faithful port of compactConversation() + streamCompactSummary() from the TS
    /// source. Uses streaming API, includes PTL (prompt-too-long) retry loop with
    /// head truncation, and returns a structured CompactionResult.
    pub async fn compact(
        &self,
        messages: &[ApiMessage],
        system_prompt_text: &str,
    ) -> Result<Vec<ApiMessage>> {
        let result = self
            .compact_full(messages, system_prompt_text, None)
            .await?;
        Ok(result.summary_messages)
    }

    /// Full compaction returning detailed CompactionResult.
    pub async fn compact_full(
        &self,
        messages: &[ApiMessage],
        system_prompt_text: &str,
        custom_instructions: Option<&str>,
    ) -> Result<CompactionResult> {
        if messages.is_empty() {
            return Err(ClaudeSDKError::sdk("Not enough messages to compact"));
        }

        let pre_compact_token_count = estimate_message_tokens(messages);

        // Build the compact prompt as a user message appended after the conversation
        let compact_prompt = get_compact_prompt(custom_instructions);

        // PTL retry loop — port of the for(;;) loop in compactConversation()
        let mut messages_to_summarize: Vec<ApiMessage> = messages.to_vec();
        let mut ptl_attempts: u32 = 0;
        let (summary_text, usage) = loop {
            let (assistant_msg, usage) = self
                .stream_compact_summary(
                    &messages_to_summarize,
                    &compact_prompt,
                    system_prompt_text,
                )
                .await?;

            let text = assistant_msg.text();

            // Check for prompt-too-long response
            if !text
                .to_lowercase()
                .starts_with(PROMPT_TOO_LONG_PREFIX)
            {
                break (text, usage);
            }

            ptl_attempts += 1;
            if ptl_attempts > MAX_PTL_RETRIES {
                return Err(ClaudeSDKError::sdk(
                    "Compaction failed: prompt is too long even after maximum truncation retries",
                ));
            }

            // Truncate head of messages and retry — port of truncateHeadForPTLRetry()
            let truncated = truncate_head_for_ptl_retry(&messages_to_summarize);
            match truncated {
                Some(t) if !t.is_empty() => {
                    messages_to_summarize = t;
                }
                _ => {
                    return Err(ClaudeSDKError::sdk(
                        "Compaction failed: prompt is too long and cannot be truncated further",
                    ));
                }
            }
        };

        if summary_text.is_empty() {
            return Err(ClaudeSDKError::sdk(
                "Failed to generate conversation summary - response did not contain valid text content",
            ));
        }

        // Build summary messages — single user message with the compacted summary
        let summary_content = get_compact_user_summary_message(&summary_text);
        let summary_messages = vec![ApiMessage::user(vec![ContentBlock::text(summary_content)])];

        let post_compact_token_count = usage
            .as_ref()
            .map(|u| (u.input_tokens + u.output_tokens) as usize)
            .unwrap_or(0);

        Ok(CompactionResult {
            summary_messages,
            pre_compact_token_count,
            post_compact_token_count,
            compaction_usage: usage,
        })
    }

    /// Stream a compaction summary request and accumulate into an AssistantMessage.
    ///
    /// Port of streamCompactSummary() — sends the conversation messages + a compact
    /// prompt to the streaming API, collects all events, and returns the final
    /// assistant message + usage.
    async fn stream_compact_summary(
        &self,
        conversation_messages: &[ApiMessage],
        compact_prompt: &str,
        system_prompt_text: &str,
    ) -> Result<(AssistantMessage, Option<Usage>)> {
        // Build messages: stripped conversation + summary request
        let mut api_messages = strip_images_from_messages(conversation_messages);
        api_messages.push(ApiMessage::user(vec![ContentBlock::text(compact_prompt)]));

        let system = vec![SystemBlock::text(format!(
            "You are a helpful AI assistant tasked with summarizing conversations.\n\n\
             The original system prompt for context:\n{system_prompt_text}"
        ))];

        let request = CreateMessageRequest {
            model: self.summary_model.clone(),
            max_tokens: self.summary_max_tokens,
            messages: api_messages,
            system: Some(system),
            tools: None,
            tool_choice: None,
            stream: true,
            metadata: None,
            stop_sequences: None,
            temperature: Some(0.0),
            top_p: None,
            top_k: None,
            thinking: Some(ThinkingParam::disabled()),
        };

        let mut stream = self.client.create_message_stream(request).await?;

        // Accumulate all stream events into a final AssistantMessage
        let mut final_message: Option<AssistantMessage> = None;

        while let Some(update_result) = stream.next().await {
            let update = update_result?;
            if let crate::api::streaming::StreamUpdate::MessageComplete { message } = update {
                final_message = Some(message);
            }
        }

        match final_message {
            Some(msg) => {
                let usage = Some(msg.usage.clone());
                Ok((msg, usage))
            }
            None => Err(ClaudeSDKError::sdk(
                "Compact streaming completed without a final message",
            )),
        }
    }
}

// ---------------------------------------------------------------------------
// truncateHeadForPTLRetry — port of truncateHeadForPTLRetry() from TS
//
// Groups messages into "API rounds" (user→assistant pairs), drops ~20% of
// groups from the head, and returns the remaining messages.
// ---------------------------------------------------------------------------

fn truncate_head_for_ptl_retry(messages: &[ApiMessage]) -> Option<Vec<ApiMessage>> {
    let groups = group_messages_by_api_round(messages);

    // Need at least 2 groups to drop from the head
    if groups.len() < 2 {
        return None;
    }

    // Drop ~20% of groups from the head (minimum 1)
    let drop_count = std::cmp::max(1, groups.len() / 5);
    let drop_count = std::cmp::min(drop_count, groups.len() - 1);

    let remaining: Vec<ApiMessage> = groups[drop_count..]
        .iter()
        .flat_map(|g| g.iter().cloned())
        .collect();

    if remaining.is_empty() {
        return None;
    }

    // If the first message is assistant, prepend a placeholder user message
    // so the API round structure stays valid
    if remaining[0].role == Role::Assistant {
        let mut result = vec![ApiMessage::user(vec![ContentBlock::text(
            "[Earlier context was truncated for compaction]",
        )])];
        result.extend(remaining);
        Some(result)
    } else {
        Some(remaining)
    }
}

/// Group messages into API rounds. Each round starts with a user message
/// and continues until the next user message (inclusive of assistant
/// messages between them).
fn group_messages_by_api_round(messages: &[ApiMessage]) -> Vec<Vec<ApiMessage>> {
    let mut groups: Vec<Vec<ApiMessage>> = Vec::new();

    for msg in messages {
        if msg.role == Role::User {
            groups.push(vec![msg.clone()]);
        } else if let Some(last_group) = groups.last_mut() {
            last_group.push(msg.clone());
        } else {
            // Assistant message before any user message — start a new group
            groups.push(vec![msg.clone()]);
        }
    }

    groups
}

// ---------------------------------------------------------------------------
// Strip images — port of stripImagesFromMessages()
// ---------------------------------------------------------------------------

fn strip_images_from_messages(messages: &[ApiMessage]) -> Vec<ApiMessage> {
    messages
        .iter()
        .map(|msg| {
            let content: Vec<ContentBlock> = msg
                .content
                .iter()
                .filter_map(|block| match block {
                    ContentBlock::Image { .. } => None,
                    ContentBlock::ToolResult {
                        tool_use_id,
                        content,
                        is_error,
                        ..
                    } => {
                        // Strip image blocks from tool results
                        let stripped: Option<Vec<ToolResultContent>> =
                            content.as_ref().map(|blocks| {
                                blocks
                                    .iter()
                                    .filter(|c| !matches!(c, ToolResultContent::Image { .. }))
                                    .cloned()
                                    .collect()
                            });
                        Some(ContentBlock::ToolResult {
                            tool_use_id: tool_use_id.clone(),
                            content: stripped,
                            is_error: *is_error,
                            cache_control: None,
                        })
                    }
                    other => Some(other.clone()),
                })
                .collect();

            ApiMessage {
                role: msg.role,
                content,
            }
        })
        .collect()
}

// ---------------------------------------------------------------------------
// Legacy text extraction (kept for backward compatibility with tests)
// ---------------------------------------------------------------------------

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
                cache_control: None,
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

    #[test]
    fn test_get_compact_prompt_without_custom_instructions() {
        let prompt = get_compact_prompt(None);
        assert!(prompt.contains("CRITICAL: Respond with TEXT ONLY"));
        assert!(prompt.contains("Create a detailed summary"));
        assert!(prompt.contains("<analysis>"));
        assert!(prompt.contains("<summary>"));
        assert!(prompt.contains("REMINDER: No tools"));
        assert!(!prompt.contains("Additional Instructions"));
    }

    #[test]
    fn test_get_compact_prompt_with_custom_instructions() {
        let prompt = get_compact_prompt(Some("Focus on database changes"));
        assert!(prompt.contains("Additional Instructions:"));
        assert!(prompt.contains("Focus on database changes"));
    }

    #[test]
    fn test_format_compact_summary_with_tags() {
        let raw = "<analysis>some thinking here</analysis>\n\n<summary>1. Primary Request\n2. Concepts</summary>";
        let formatted = format_compact_summary(raw);
        assert!(!formatted.contains("<analysis>"));
        assert!(!formatted.contains("</analysis>"));
        assert!(formatted.contains("Summary:"));
        assert!(formatted.contains("1. Primary Request"));
    }

    #[test]
    fn test_format_compact_summary_no_tags() {
        let raw = "Just a plain summary text.";
        let formatted = format_compact_summary(raw);
        assert_eq!(formatted, "Just a plain summary text.");
    }

    #[test]
    fn test_get_compact_user_summary_message() {
        let msg = get_compact_user_summary_message("Test summary");
        assert!(msg.contains("This session is being continued"));
        assert!(msg.contains("Test summary"));
    }

    #[test]
    fn test_group_messages_by_api_round() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("q1")]),
            ApiMessage::assistant(vec![ContentBlock::text("a1")]),
            ApiMessage::user(vec![ContentBlock::text("q2")]),
            ApiMessage::assistant(vec![ContentBlock::text("a2")]),
            ApiMessage::user(vec![ContentBlock::text("q3")]),
            ApiMessage::assistant(vec![ContentBlock::text("a3")]),
        ];

        let groups = group_messages_by_api_round(&messages);
        assert_eq!(groups.len(), 3);
        assert_eq!(groups[0].len(), 2); // user + assistant
        assert_eq!(groups[1].len(), 2);
        assert_eq!(groups[2].len(), 2);
    }

    #[test]
    fn test_truncate_head_for_ptl_retry() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("q1")]),
            ApiMessage::assistant(vec![ContentBlock::text("a1")]),
            ApiMessage::user(vec![ContentBlock::text("q2")]),
            ApiMessage::assistant(vec![ContentBlock::text("a2")]),
            ApiMessage::user(vec![ContentBlock::text("q3")]),
            ApiMessage::assistant(vec![ContentBlock::text("a3")]),
            ApiMessage::user(vec![ContentBlock::text("q4")]),
            ApiMessage::assistant(vec![ContentBlock::text("a4")]),
            ApiMessage::user(vec![ContentBlock::text("q5")]),
            ApiMessage::assistant(vec![ContentBlock::text("a5")]),
        ];

        let truncated = truncate_head_for_ptl_retry(&messages).unwrap();
        // 5 groups, drop 20% = 1 group -> 4 groups remain = 8 messages
        assert_eq!(truncated.len(), 8);
        // First message should be q2 (group[1] start)
        match &truncated[0].content[0] {
            ContentBlock::Text { text, .. } => assert_eq!(text, "q2"),
            _ => panic!("Expected text block"),
        }
    }

    #[test]
    fn test_truncate_head_single_group_returns_none() {
        let messages = vec![
            ApiMessage::user(vec![ContentBlock::text("only one question")]),
            ApiMessage::assistant(vec![ContentBlock::text("only one answer")]),
        ];

        assert!(truncate_head_for_ptl_retry(&messages).is_none());
    }

    #[test]
    fn test_strip_images_from_messages() {
        let messages = vec![
            ApiMessage::user(vec![
                ContentBlock::text("Look at this"),
                ContentBlock::Image {
                    source: ImageSource {
                        r#type: "base64".to_string(),
                        media_type: "image/png".to_string(),
                        data: "fake".to_string(),
                    },
                },
            ]),
            ApiMessage::assistant(vec![ContentBlock::text("I see it")]),
        ];

        let stripped = strip_images_from_messages(&messages);
        assert_eq!(stripped.len(), 2);
        assert_eq!(stripped[0].content.len(), 1); // Image removed
        match &stripped[0].content[0] {
            ContentBlock::Text { text, .. } => assert_eq!(text, "Look at this"),
            _ => panic!("Expected text"),
        }
    }

    #[test]
    fn test_collapse_blank_lines() {
        let input = "line1\n\n\n\nline2\n\n\nline3";
        let result = collapse_blank_lines(input);
        assert_eq!(result, "line1\n\nline2\n\nline3");
    }
}
