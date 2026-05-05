use crate::errors::ClaudeSDKError;
use crate::types::{
    AssistantMessage, ContentBlock, Message, MirrorErrorMessage, RateLimitEvent,
    RateLimitInfo, RateLimitStatus, RateLimitType, ResultMessage, ServerToolResultBlock,
    ServerToolUseBlock, StreamEvent, SystemMessage, TaskNotificationMessage,
    TaskProgressMessage, TaskStartedMessage, TextBlock, ThinkingBlock, ToolResultBlock,
    ToolResultContent, ToolUseBlock, UserMessage, MessageContent,
};

/// Parse a raw JSON message dict into a typed Message.
///
/// Returns Ok(None) for unknown message types (forward compatibility).
/// Returns Err(MessageParseError) for malformed messages.
pub fn parse_message(
    data: &serde_json::Value,
) -> std::result::Result<Option<Message>, ClaudeSDKError> {
    if !data.is_object() {
        let type_name = if data.is_string() {
            "str"
        } else if data.is_array() {
            "list"
        } else if data.is_number() {
            "int"
        } else if data.is_boolean() {
            "bool"
        } else if data.is_null() {
            "NoneType"
        } else {
            "unknown"
        };
        return Err(ClaudeSDKError::MessageParse {
            message: format!(
                "Invalid message data type (expected dict, got {type_name})"
            ),
            data: Some(data.clone()),
        });
    }

    let message_type = data.get("type").and_then(|v| v.as_str());
    let message_type = match message_type {
        Some(t) => t,
        None => {
            return Err(ClaudeSDKError::MessageParse {
                message: "Message missing 'type' field".into(),
                data: Some(data.clone()),
            });
        }
    };

    match message_type {
        "user" => parse_user_message(data),
        "assistant" => parse_assistant_message(data),
        "system" => parse_system_message(data),
        "result" => parse_result_message(data),
        "stream_event" => parse_stream_event(data),
        "rate_limit_event" => parse_rate_limit_event(data),
        _ => Ok(None),
    }
}

fn parse_user_message(
    data: &serde_json::Value,
) -> std::result::Result<Option<Message>, ClaudeSDKError> {
    let msg = data.get("message").ok_or_else(|| ClaudeSDKError::MessageParse {
        message: "Missing required field in user message: 'message'".into(),
        data: Some(data.clone()),
    })?;

    let parent_tool_use_id = data
        .get("parent_tool_use_id")
        .and_then(|v| v.as_str())
        .map(String::from);
    let tool_use_result = data.get("tool_use_result").and_then(|v| {
        if v.is_null() {
            None
        } else {
            Some(v.clone())
        }
    });
    let uuid = data.get("uuid").and_then(|v| v.as_str()).map(String::from);

    let content_val = msg.get("content").ok_or_else(|| ClaudeSDKError::MessageParse {
        message: "Missing required field in user message: 'content'".into(),
        data: Some(data.clone()),
    })?;

    let content = if let Some(arr) = content_val.as_array() {
        let mut blocks = Vec::new();
        for block in arr {
            let block_type = block
                .get("type")
                .and_then(|v| v.as_str())
                .unwrap_or("");
            match block_type {
                "text" => {
                    blocks.push(ContentBlock::Text(TextBlock {
                        text: block["text"].as_str().unwrap_or("").to_string(),
                    }));
                }
                "tool_use" => {
                    blocks.push(ContentBlock::ToolUse(ToolUseBlock {
                        id: block["id"].as_str().unwrap_or("").to_string(),
                        name: block["name"].as_str().unwrap_or("").to_string(),
                        input: block.get("input").cloned().unwrap_or(serde_json::Value::Object(Default::default())),
                    }));
                }
                "tool_result" => {
                    let content = block.get("content").and_then(|c| {
                        if c.is_null() {
                            None
                        } else if let Some(s) = c.as_str() {
                            Some(ToolResultContent::Text(s.to_string()))
                        } else if c.is_array() {
                            Some(ToolResultContent::Blocks(
                                c.as_array().unwrap().clone(),
                            ))
                        } else {
                            None
                        }
                    });
                    let is_error = block.get("is_error").and_then(|v| v.as_bool());
                    blocks.push(ContentBlock::ToolResult(ToolResultBlock {
                        tool_use_id: block["tool_use_id"]
                            .as_str()
                            .unwrap_or("")
                            .to_string(),
                        content,
                        is_error,
                    }));
                }
                _ => {}
            }
        }
        MessageContent::Blocks(blocks)
    } else if let Some(s) = content_val.as_str() {
        MessageContent::Text(s.to_string())
    } else {
        return Err(ClaudeSDKError::MessageParse {
            message: "Missing required field in user message: 'content'".into(),
            data: Some(data.clone()),
        });
    };

    Ok(Some(Message::User(UserMessage {
        content,
        uuid,
        parent_tool_use_id,
        tool_use_result,
    })))
}

fn parse_assistant_message(
    data: &serde_json::Value,
) -> std::result::Result<Option<Message>, ClaudeSDKError> {
    let msg = data.get("message").ok_or_else(|| ClaudeSDKError::MessageParse {
        message: "Missing required field in assistant message: 'message'".into(),
        data: Some(data.clone()),
    })?;

    let content_arr = msg
        .get("content")
        .and_then(|v| v.as_array())
        .ok_or_else(|| ClaudeSDKError::MessageParse {
            message: "Missing required field in assistant message: 'content'".into(),
            data: Some(data.clone()),
        })?;

    let model = msg
        .get("model")
        .and_then(|v| v.as_str())
        .ok_or_else(|| ClaudeSDKError::MessageParse {
            message: "Missing required field in assistant message: 'model'".into(),
            data: Some(data.clone()),
        })?
        .to_string();

    let mut content_blocks = Vec::new();
    for block in content_arr {
        let block_type = block.get("type").and_then(|v| v.as_str()).unwrap_or("");
        match block_type {
            "text" => {
                content_blocks.push(ContentBlock::Text(TextBlock {
                    text: block["text"].as_str().unwrap_or("").to_string(),
                }));
            }
            "thinking" => {
                content_blocks.push(ContentBlock::Thinking(ThinkingBlock {
                    thinking: block["thinking"].as_str().unwrap_or("").to_string(),
                    signature: block["signature"].as_str().unwrap_or("").to_string(),
                }));
            }
            "tool_use" => {
                content_blocks.push(ContentBlock::ToolUse(ToolUseBlock {
                    id: block["id"].as_str().unwrap_or("").to_string(),
                    name: block["name"].as_str().unwrap_or("").to_string(),
                    input: block.get("input").cloned().unwrap_or(serde_json::Value::Object(Default::default())),
                }));
            }
            "tool_result" => {
                let content = block.get("content").and_then(|c| {
                    if c.is_null() {
                        None
                    } else if let Some(s) = c.as_str() {
                        Some(ToolResultContent::Text(s.to_string()))
                    } else if c.is_array() {
                        Some(ToolResultContent::Blocks(c.as_array().unwrap().clone()))
                    } else {
                        None
                    }
                });
                content_blocks.push(ContentBlock::ToolResult(ToolResultBlock {
                    tool_use_id: block["tool_use_id"].as_str().unwrap_or("").to_string(),
                    content,
                    is_error: block.get("is_error").and_then(|v| v.as_bool()),
                }));
            }
            "server_tool_use" => {
                content_blocks.push(ContentBlock::ServerToolUse(ServerToolUseBlock {
                    id: block["id"].as_str().unwrap_or("").to_string(),
                    name: block["name"].as_str().unwrap_or("").to_string(),
                    input: block.get("input").cloned().unwrap_or(serde_json::Value::Object(Default::default())),
                }));
            }
            "advisor_tool_result" => {
                content_blocks.push(ContentBlock::ServerToolResult(ServerToolResultBlock {
                    tool_use_id: block["tool_use_id"].as_str().unwrap_or("").to_string(),
                    content: block.get("content").cloned().unwrap_or(serde_json::Value::Null),
                }));
            }
            _ => {}
        }
    }

    Ok(Some(Message::Assistant(AssistantMessage {
        content: content_blocks,
        model,
        parent_tool_use_id: data
            .get("parent_tool_use_id")
            .and_then(|v| v.as_str())
            .map(String::from),
        error: data
            .get("error")
            .and_then(|v| v.as_str())
            .map(String::from),
        usage: msg.get("usage").and_then(|v| {
            if v.is_null() {
                None
            } else {
                Some(v.clone())
            }
        }),
        message_id: msg
            .get("id")
            .and_then(|v| v.as_str())
            .map(String::from),
        stop_reason: msg
            .get("stop_reason")
            .and_then(|v| v.as_str())
            .map(String::from),
        session_id: data
            .get("session_id")
            .and_then(|v| v.as_str())
            .map(String::from),
        uuid: data.get("uuid").and_then(|v| v.as_str()).map(String::from),
    })))
}

fn parse_system_message(
    data: &serde_json::Value,
) -> std::result::Result<Option<Message>, ClaudeSDKError> {
    let subtype = data
        .get("subtype")
        .and_then(|v| v.as_str())
        .ok_or_else(|| ClaudeSDKError::MessageParse {
            message: "Missing required field in system message: 'subtype'".into(),
            data: Some(data.clone()),
        })?;

    match subtype {
        "task_started" => {
            let task_id = require_str(data, "task_id", "system", data)?;
            let description = require_str(data, "description", "system", data)?;
            let uuid = require_str(data, "uuid", "system", data)?;
            let session_id = require_str(data, "session_id", "system", data)?;

            Ok(Some(Message::TaskStarted(TaskStartedMessage {
                subtype: subtype.to_string(),
                data: data.clone(),
                task_id,
                description,
                uuid,
                session_id,
                tool_use_id: data.get("tool_use_id").and_then(|v| v.as_str()).map(String::from),
                task_type: data.get("task_type").and_then(|v| v.as_str()).map(String::from),
            })))
        }
        "task_progress" => {
            let task_id = require_str(data, "task_id", "system", data)?;
            let description = require_str(data, "description", "system", data)?;
            let uuid = require_str(data, "uuid", "system", data)?;
            let session_id = require_str(data, "session_id", "system", data)?;
            let usage = data.get("usage").cloned().ok_or_else(|| ClaudeSDKError::MessageParse {
                message: "Missing required field in system message: 'usage'".into(),
                data: Some(data.clone()),
            })?;

            Ok(Some(Message::TaskProgress(TaskProgressMessage {
                subtype: subtype.to_string(),
                data: data.clone(),
                task_id,
                description,
                usage,
                uuid,
                session_id,
                tool_use_id: data.get("tool_use_id").and_then(|v| v.as_str()).map(String::from),
                last_tool_name: data.get("last_tool_name").and_then(|v| v.as_str()).map(String::from),
            })))
        }
        "task_notification" => {
            let task_id = require_str(data, "task_id", "system", data)?;
            let status = require_str(data, "status", "system", data)?;
            let output_file = require_str(data, "output_file", "system", data)?;
            let summary = require_str(data, "summary", "system", data)?;
            let uuid = require_str(data, "uuid", "system", data)?;
            let session_id = require_str(data, "session_id", "system", data)?;

            Ok(Some(Message::TaskNotification(TaskNotificationMessage {
                subtype: subtype.to_string(),
                data: data.clone(),
                task_id,
                status,
                output_file,
                summary,
                uuid,
                session_id,
                tool_use_id: data.get("tool_use_id").and_then(|v| v.as_str()).map(String::from),
                usage: data.get("usage").and_then(|v| {
                    if v.is_null() { None } else { Some(v.clone()) }
                }),
            })))
        }
        "mirror_error" => {
            Ok(Some(Message::MirrorError(MirrorErrorMessage {
                subtype: subtype.to_string(),
                data: data.clone(),
                key: data.get("key").and_then(|v| {
                    serde_json::from_value(v.clone()).ok()
                }),
                error: data
                    .get("error")
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string(),
            })))
        }
        _ => {
            Ok(Some(Message::System(SystemMessage {
                subtype: subtype.to_string(),
                data: data.clone(),
            })))
        }
    }
}

fn parse_result_message(
    data: &serde_json::Value,
) -> std::result::Result<Option<Message>, ClaudeSDKError> {
    let subtype = require_str(data, "subtype", "result", data)?;
    let duration_ms = require_i64(data, "duration_ms", "result", data)?;
    let duration_api_ms = require_i64(data, "duration_api_ms", "result", data)?;
    let is_error = data
        .get("is_error")
        .and_then(|v| v.as_bool())
        .ok_or_else(|| ClaudeSDKError::MessageParse {
            message: "Missing required field in result message: 'is_error'".into(),
            data: Some(data.clone()),
        })?;
    let num_turns = require_i64(data, "num_turns", "result", data)?;
    let session_id = require_str(data, "session_id", "result", data)?;

    Ok(Some(Message::Result(ResultMessage {
        subtype,
        duration_ms,
        duration_api_ms,
        is_error,
        num_turns,
        session_id,
        stop_reason: data.get("stop_reason").and_then(|v| v.as_str()).map(String::from),
        total_cost_usd: data.get("total_cost_usd").and_then(|v| v.as_f64()),
        usage: data.get("usage").and_then(|v| {
            if v.is_null() { None } else { Some(v.clone()) }
        }),
        result: data.get("result").and_then(|v| v.as_str()).map(String::from),
        structured_output: data.get("structured_output").and_then(|v| {
            if v.is_null() { None } else { Some(v.clone()) }
        }),
        model_usage: data.get("modelUsage").and_then(|v| {
            if v.is_null() { None } else { Some(v.clone()) }
        }),
        permission_denials: data.get("permission_denials").and_then(|v| {
            v.as_array().map(|a| a.clone())
        }),
        errors: data.get("errors").and_then(|v| {
            v.as_array().map(|a| {
                a.iter()
                    .filter_map(|e| e.as_str().map(String::from))
                    .collect()
            })
        }),
        uuid: data.get("uuid").and_then(|v| v.as_str()).map(String::from),
    })))
}

fn parse_stream_event(
    data: &serde_json::Value,
) -> std::result::Result<Option<Message>, ClaudeSDKError> {
    let uuid = require_str(data, "uuid", "stream_event", data)?;
    let session_id = require_str(data, "session_id", "stream_event", data)?;
    let event = data.get("event").cloned().ok_or_else(|| ClaudeSDKError::MessageParse {
        message: "Missing required field in stream_event message: 'event'".into(),
        data: Some(data.clone()),
    })?;

    Ok(Some(Message::Stream(StreamEvent {
        uuid,
        session_id,
        event,
        parent_tool_use_id: data
            .get("parent_tool_use_id")
            .and_then(|v| v.as_str())
            .map(String::from),
    })))
}

fn parse_rate_limit_event(
    data: &serde_json::Value,
) -> std::result::Result<Option<Message>, ClaudeSDKError> {
    let info = data.get("rate_limit_info").ok_or_else(|| ClaudeSDKError::MessageParse {
        message: "Missing required field in rate_limit_event message: 'rate_limit_info'".into(),
        data: Some(data.clone()),
    })?;

    let status_str = info.get("status").and_then(|v| v.as_str()).ok_or_else(|| {
        ClaudeSDKError::MessageParse {
            message: "Missing required field in rate_limit_event message: 'status'".into(),
            data: Some(data.clone()),
        }
    })?;

    let status = match status_str {
        "allowed" => RateLimitStatus::Allowed,
        "allowed_warning" => RateLimitStatus::AllowedWarning,
        "rejected" => RateLimitStatus::Rejected,
        other => {
            return Err(ClaudeSDKError::MessageParse {
                message: format!("Unknown rate limit status: {other}"),
                data: Some(data.clone()),
            });
        }
    };

    let rate_limit_type = info.get("rateLimitType").and_then(|v| v.as_str()).and_then(|s| {
        match s {
            "five_hour" => Some(RateLimitType::FiveHour),
            "seven_day" => Some(RateLimitType::SevenDay),
            "seven_day_opus" => Some(RateLimitType::SevenDayOpus),
            "seven_day_sonnet" => Some(RateLimitType::SevenDaySonnet),
            "overage" => Some(RateLimitType::Overage),
            _ => None,
        }
    });

    let overage_status = info.get("overageStatus").and_then(|v| v.as_str()).and_then(|s| {
        match s {
            "allowed" => Some(RateLimitStatus::Allowed),
            "allowed_warning" => Some(RateLimitStatus::AllowedWarning),
            "rejected" => Some(RateLimitStatus::Rejected),
            _ => None,
        }
    });

    let uuid = require_str(data, "uuid", "rate_limit_event", data)?;
    let session_id = require_str(data, "session_id", "rate_limit_event", data)?;

    Ok(Some(Message::RateLimit(RateLimitEvent {
        rate_limit_info: RateLimitInfo {
            status,
            resets_at: info.get("resetsAt").and_then(|v| v.as_i64()),
            rate_limit_type,
            utilization: info.get("utilization").and_then(|v| v.as_f64()),
            overage_status,
            overage_resets_at: info.get("overageResetsAt").and_then(|v| v.as_i64()),
            overage_disabled_reason: info
                .get("overageDisabledReason")
                .and_then(|v| v.as_str())
                .map(String::from),
            raw: info.clone(),
        },
        uuid,
        session_id,
    })))
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn require_str(
    data: &serde_json::Value,
    field: &str,
    msg_type: &str,
    original: &serde_json::Value,
) -> std::result::Result<String, ClaudeSDKError> {
    data.get(field)
        .and_then(|v| v.as_str())
        .map(String::from)
        .ok_or_else(|| ClaudeSDKError::MessageParse {
            message: format!("Missing required field in {msg_type} message: '{field}'"),
            data: Some(original.clone()),
        })
}

fn require_i64(
    data: &serde_json::Value,
    field: &str,
    msg_type: &str,
    original: &serde_json::Value,
) -> std::result::Result<i64, ClaudeSDKError> {
    data.get(field)
        .and_then(|v| v.as_i64())
        .ok_or_else(|| ClaudeSDKError::MessageParse {
            message: format!("Missing required field in {msg_type} message: '{field}'"),
            data: Some(original.clone()),
        })
}
