use rust_agent_sdk::errors::ClaudeSDKError;
use rust_agent_sdk::parse_message;
use rust_agent_sdk::types::*;
use serde_json::json;

#[cfg(test)]
mod test_message_parser {
    use super::*;

    // -----------------------------------------------------------------------
    // User messages
    // -----------------------------------------------------------------------

    #[test]
    fn test_parse_valid_user_message() {
        let data = json!({
            "type": "user",
            "message": {"content": [{"type": "text", "text": "Hello"}]}
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => match &u.content {
                MessageContent::Blocks(blocks) => {
                    assert_eq!(blocks.len(), 1);
                    assert!(matches!(&blocks[0], ContentBlock::Text(t) if t.text == "Hello"));
                }
                _ => panic!("expected Blocks"),
            },
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_with_uuid() {
        let data = json!({
            "type": "user",
            "uuid": "msg-abc123-def456",
            "message": {"content": [{"type": "text", "text": "Hello"}]}
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                assert_eq!(u.uuid.as_deref(), Some("msg-abc123-def456"));
                match &u.content {
                    MessageContent::Blocks(blocks) => assert_eq!(blocks.len(), 1),
                    _ => panic!("expected Blocks"),
                }
            }
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_with_tool_use() {
        let data = json!({
            "type": "user",
            "message": {
                "content": [
                    {"type": "text", "text": "Let me read this file"},
                    {
                        "type": "tool_use",
                        "id": "tool_456",
                        "name": "Read",
                        "input": {"file_path": "/example.txt"}
                    }
                ]
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => match &u.content {
                MessageContent::Blocks(blocks) => {
                    assert_eq!(blocks.len(), 2);
                    assert!(matches!(&blocks[0], ContentBlock::Text(_)));
                    match &blocks[1] {
                        ContentBlock::ToolUse(t) => {
                            assert_eq!(t.id, "tool_456");
                            assert_eq!(t.name, "Read");
                            assert_eq!(t.input, json!({"file_path": "/example.txt"}));
                        }
                        _ => panic!("expected ToolUse block"),
                    }
                }
                _ => panic!("expected Blocks"),
            },
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_with_tool_result() {
        let data = json!({
            "type": "user",
            "message": {
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": "tool_789",
                        "content": "File contents here"
                    }
                ]
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => match &u.content {
                MessageContent::Blocks(blocks) => {
                    assert_eq!(blocks.len(), 1);
                    match &blocks[0] {
                        ContentBlock::ToolResult(t) => {
                            assert_eq!(t.tool_use_id, "tool_789");
                            assert_eq!(
                                t.content,
                                Some(ToolResultContent::Text("File contents here".to_string()))
                            );
                        }
                        _ => panic!("expected ToolResult block"),
                    }
                }
                _ => panic!("expected Blocks"),
            },
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_with_tool_result_error() {
        let data = json!({
            "type": "user",
            "message": {
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": "tool_error",
                        "content": "File not found",
                        "is_error": true
                    }
                ]
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => match &u.content {
                MessageContent::Blocks(blocks) => {
                    assert_eq!(blocks.len(), 1);
                    match &blocks[0] {
                        ContentBlock::ToolResult(t) => {
                            assert_eq!(t.tool_use_id, "tool_error");
                            assert_eq!(
                                t.content,
                                Some(ToolResultContent::Text("File not found".to_string()))
                            );
                            assert_eq!(t.is_error, Some(true));
                        }
                        _ => panic!("expected ToolResult block"),
                    }
                }
                _ => panic!("expected Blocks"),
            },
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_with_mixed_content() {
        let data = json!({
            "type": "user",
            "message": {
                "content": [
                    {"type": "text", "text": "Here's what I found:"},
                    {
                        "type": "tool_use",
                        "id": "use_1",
                        "name": "Search",
                        "input": {"query": "test"}
                    },
                    {
                        "type": "tool_result",
                        "tool_use_id": "use_1",
                        "content": "Search results"
                    },
                    {"type": "text", "text": "What do you think?"}
                ]
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => match &u.content {
                MessageContent::Blocks(blocks) => {
                    assert_eq!(blocks.len(), 4);
                    assert!(matches!(&blocks[0], ContentBlock::Text(_)));
                    assert!(matches!(&blocks[1], ContentBlock::ToolUse(_)));
                    assert!(matches!(&blocks[2], ContentBlock::ToolResult(_)));
                    assert!(matches!(&blocks[3], ContentBlock::Text(_)));
                }
                _ => panic!("expected Blocks"),
            },
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_inside_subagent() {
        let data = json!({
            "type": "user",
            "message": {"content": [{"type": "text", "text": "Hello"}]},
            "parent_tool_use_id": "toolu_01Xrwd5Y13sEHtzScxR77So8"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                assert_eq!(
                    u.parent_tool_use_id.as_deref(),
                    Some("toolu_01Xrwd5Y13sEHtzScxR77So8")
                );
            }
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_with_tool_use_result() {
        let tool_result_data = json!({
            "filePath": "/path/to/file.py",
            "oldString": "old code",
            "newString": "new code",
            "originalFile": "full file contents",
            "structuredPatch": [
                {
                    "oldStart": 33,
                    "oldLines": 7,
                    "newStart": 33,
                    "newLines": 7,
                    "lines": [
                        "   # comment",
                        "-      old line",
                        "+      new line"
                    ]
                }
            ],
            "userModified": false,
            "replaceAll": false
        });
        let data = json!({
            "type": "user",
            "message": {
                "role": "user",
                "content": [
                    {
                        "tool_use_id": "toolu_vrtx_01KXWexk3NJdwkjWzPMGQ2F1",
                        "type": "tool_result",
                        "content": "The file has been updated."
                    }
                ]
            },
            "parent_tool_use_id": null,
            "session_id": "84afb479-17ae-49af-8f2b-666ac2530c3a",
            "uuid": "2ace3375-1879-48a0-a421-6bce25a9295a",
            "tool_use_result": tool_result_data
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                let tur = u.tool_use_result.as_ref().unwrap();
                assert_eq!(tur["filePath"], "/path/to/file.py");
                assert_eq!(tur["oldString"], "old code");
                assert_eq!(tur["newString"], "new code");
                assert_eq!(tur["structuredPatch"][0]["oldStart"], 33);
                assert_eq!(
                    u.uuid.as_deref(),
                    Some("2ace3375-1879-48a0-a421-6bce25a9295a")
                );
            }
            _ => panic!("expected User message"),
        }
    }

    #[test]
    fn test_parse_user_message_with_string_content_and_tool_use_result() {
        let tool_result_data = json!({"filePath": "/path/to/file.py", "userModified": true});
        let data = json!({
            "type": "user",
            "message": {"content": "Simple string content"},
            "tool_use_result": tool_result_data
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::User(u) => {
                assert!(
                    matches!(&u.content, MessageContent::Text(s) if s == "Simple string content")
                );
                assert_eq!(u.tool_use_result, Some(tool_result_data));
            }
            _ => panic!("expected User message"),
        }
    }

    // -----------------------------------------------------------------------
    // Assistant messages
    // -----------------------------------------------------------------------

    #[test]
    fn test_parse_valid_assistant_message() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {"type": "text", "text": "Hello"},
                    {
                        "type": "tool_use",
                        "id": "tool_123",
                        "name": "Read",
                        "input": {"file_path": "/test.txt"}
                    }
                ],
                "model": "claude-opus-4-1-20250805"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(a.content.len(), 2);
                assert!(matches!(&a.content[0], ContentBlock::Text(_)));
                assert!(matches!(&a.content[1], ContentBlock::ToolUse(_)));
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_thinking() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {
                        "type": "thinking",
                        "thinking": "I'm thinking about the answer...",
                        "signature": "sig-123"
                    },
                    {"type": "text", "text": "Here's my response"}
                ],
                "model": "claude-opus-4-1-20250805"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(a.content.len(), 2);
                match &a.content[0] {
                    ContentBlock::Thinking(t) => {
                        assert_eq!(t.thinking, "I'm thinking about the answer...");
                        assert_eq!(t.signature, "sig-123");
                    }
                    _ => panic!("expected Thinking block"),
                }
                match &a.content[1] {
                    ContentBlock::Text(t) => {
                        assert_eq!(t.text, "Here's my response");
                    }
                    _ => panic!("expected Text block"),
                }
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_server_tool_use() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {
                        "type": "server_tool_use",
                        "id": "srvtoolu_01ABC",
                        "name": "advisor",
                        "input": {}
                    }
                ],
                "model": "claude-sonnet-4-5"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(a.content.len(), 1);
                match &a.content[0] {
                    ContentBlock::ServerToolUse(s) => {
                        assert_eq!(s.id, "srvtoolu_01ABC");
                        assert_eq!(s.name, "advisor");
                        assert_eq!(s.input, json!({}));
                    }
                    _ => panic!("expected ServerToolUse block"),
                }
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_server_tool_result() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {
                        "type": "advisor_tool_result",
                        "tool_use_id": "srvtoolu_01ABC",
                        "content": {
                            "type": "advisor_result",
                            "text": "Consider edge cases around empty input."
                        }
                    }
                ],
                "model": "claude-sonnet-4-5"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(a.content.len(), 1);
                match &a.content[0] {
                    ContentBlock::ServerToolResult(r) => {
                        assert_eq!(r.tool_use_id, "srvtoolu_01ABC");
                        assert_eq!(
                            r.content,
                            json!({
                                "type": "advisor_result",
                                "text": "Consider edge cases around empty input."
                            })
                        );
                    }
                    _ => panic!("expected ServerToolResult block"),
                }
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_redacted_advisor_result() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {
                        "type": "advisor_tool_result",
                        "tool_use_id": "srvtoolu_01ABC",
                        "content": {
                            "type": "advisor_redacted_result",
                            "encrypted_content": "EuYDCioIDhgC..."
                        }
                    }
                ],
                "model": "claude-sonnet-4-5"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => match &a.content[0] {
                ContentBlock::ServerToolResult(r) => {
                    assert_eq!(r.content["type"], "advisor_redacted_result");
                    assert_eq!(r.content["encrypted_content"], "EuYDCioIDhgC...");
                }
                _ => panic!("expected ServerToolResult block"),
            },
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_usage() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [{"type": "text", "text": "hi"}],
                "model": "claude-opus-4-5",
                "usage": {
                    "input_tokens": 100,
                    "output_tokens": 50,
                    "cache_read_input_tokens": 2000,
                    "cache_creation_input_tokens": 500
                }
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                let usage = a.usage.unwrap();
                assert_eq!(
                    usage,
                    json!({
                        "input_tokens": 100,
                        "output_tokens": 50,
                        "cache_read_input_tokens": 2000,
                        "cache_creation_input_tokens": 500
                    })
                );
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_without_usage() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [{"type": "text", "text": "hi"}],
                "model": "claude-opus-4-5"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert!(a.usage.is_none());
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_inside_subagent() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {"type": "text", "text": "Hello"},
                    {
                        "type": "tool_use",
                        "id": "tool_123",
                        "name": "Read",
                        "input": {"file_path": "/test.txt"}
                    }
                ],
                "model": "claude-opus-4-1-20250805"
            },
            "parent_tool_use_id": "toolu_01Xrwd5Y13sEHtzScxR77So8"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(
                    a.parent_tool_use_id.as_deref(),
                    Some("toolu_01Xrwd5Y13sEHtzScxR77So8")
                );
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_without_error() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [{"type": "text", "text": "Hello"}],
                "model": "claude-opus-4-5-20251101"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert!(a.error.is_none());
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_authentication_error() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {"type": "text", "text": "Invalid API key \u{00b7} Fix external API key"}
                ],
                "model": "<synthetic>"
            },
            "session_id": "test-session",
            "error": "authentication_failed"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(a.error.as_deref(), Some("authentication_failed"));
                assert_eq!(a.content.len(), 1);
                assert!(matches!(&a.content[0], ContentBlock::Text(_)));
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_unknown_error() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [
                    {
                        "type": "text",
                        "text": "API Error: 500 {\"type\":\"error\",\"error\":{\"type\":\"api_error\",\"message\":\"Internal server error\"}}"
                    }
                ],
                "model": "<synthetic>"
            },
            "session_id": "test-session",
            "error": "unknown"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(a.error.as_deref(), Some("unknown"));
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_rate_limit_error() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [{"type": "text", "text": "Rate limit exceeded"}],
                "model": "<synthetic>"
            },
            "error": "rate_limit"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(a.error.as_deref(), Some("rate_limit"));
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_with_all_fields() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [{"type": "text", "text": "Hello"}],
                "model": "claude-sonnet-4-5-20250929",
                "id": "msg_01HRq7YZE3apPqSHydvG77Ve",
                "stop_reason": "end_turn",
                "usage": {"input_tokens": 10, "output_tokens": 5}
            },
            "session_id": "fdf2d90a-fd9e-4736-ae35-806edd13643f",
            "uuid": "0dbd2453-1209-4fe9-bd51-4102f64e33df"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert_eq!(
                    a.message_id.as_deref(),
                    Some("msg_01HRq7YZE3apPqSHydvG77Ve")
                );
                assert_eq!(a.stop_reason.as_deref(), Some("end_turn"));
                assert_eq!(
                    a.session_id.as_deref(),
                    Some("fdf2d90a-fd9e-4736-ae35-806edd13643f")
                );
                assert_eq!(
                    a.uuid.as_deref(),
                    Some("0dbd2453-1209-4fe9-bd51-4102f64e33df")
                );
                assert_eq!(
                    a.usage,
                    Some(json!({"input_tokens": 10, "output_tokens": 5}))
                );
            }
            _ => panic!("expected Assistant message"),
        }
    }

    #[test]
    fn test_parse_assistant_message_optional_fields_absent() {
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [{"type": "text", "text": "hi"}],
                "model": "claude-opus-4-5"
            }
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Assistant(a) => {
                assert!(a.message_id.is_none());
                assert!(a.stop_reason.is_none());
                assert!(a.session_id.is_none());
                assert!(a.uuid.is_none());
            }
            _ => panic!("expected Assistant message"),
        }
    }

    // -----------------------------------------------------------------------
    // System messages
    // -----------------------------------------------------------------------

    #[test]
    fn test_parse_valid_system_message() {
        let data = json!({"type": "system", "subtype": "start"});
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::System(s) => {
                assert_eq!(s.subtype, "start");
            }
            _ => panic!("expected System message"),
        }
    }

    #[test]
    fn test_parse_task_started_message() {
        let data = json!({
            "type": "system",
            "subtype": "task_started",
            "task_id": "task-abc",
            "tool_use_id": "toolu_01",
            "description": "Reticulating splines",
            "task_type": "background",
            "uuid": "uuid-1",
            "session_id": "session-1"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::TaskStarted(t) => {
                assert_eq!(t.task_id, "task-abc");
                assert_eq!(t.description, "Reticulating splines");
                assert_eq!(t.uuid, "uuid-1");
                assert_eq!(t.session_id, "session-1");
                assert_eq!(t.tool_use_id.as_deref(), Some("toolu_01"));
                assert_eq!(t.task_type.as_deref(), Some("background"));
            }
            _ => panic!("expected TaskStarted message"),
        }
    }

    #[test]
    fn test_parse_task_started_message_optional_fields_absent() {
        let data = json!({
            "type": "system",
            "subtype": "task_started",
            "task_id": "task-abc",
            "description": "Working",
            "uuid": "uuid-1",
            "session_id": "session-1"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::TaskStarted(t) => {
                assert!(t.tool_use_id.is_none());
                assert!(t.task_type.is_none());
            }
            _ => panic!("expected TaskStarted message"),
        }
    }

    #[test]
    fn test_parse_task_progress_message() {
        let data = json!({
            "type": "system",
            "subtype": "task_progress",
            "task_id": "task-abc",
            "tool_use_id": "toolu_01",
            "description": "Halfway there",
            "usage": {
                "total_tokens": 1234,
                "tool_uses": 5,
                "duration_ms": 9876
            },
            "last_tool_name": "Read",
            "uuid": "uuid-2",
            "session_id": "session-1"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::TaskProgress(t) => {
                assert_eq!(t.task_id, "task-abc");
                assert_eq!(t.description, "Halfway there");
                assert_eq!(
                    t.usage,
                    json!({
                        "total_tokens": 1234,
                        "tool_uses": 5,
                        "duration_ms": 9876
                    })
                );
                assert_eq!(t.last_tool_name.as_deref(), Some("Read"));
                assert_eq!(t.tool_use_id.as_deref(), Some("toolu_01"));
                assert_eq!(t.uuid, "uuid-2");
                assert_eq!(t.session_id, "session-1");
            }
            _ => panic!("expected TaskProgress message"),
        }
    }

    #[test]
    fn test_parse_task_notification_message() {
        let data = json!({
            "type": "system",
            "subtype": "task_notification",
            "task_id": "task-abc",
            "tool_use_id": "toolu_01",
            "status": "completed",
            "output_file": "/tmp/out.md",
            "summary": "All done",
            "usage": {
                "total_tokens": 2000,
                "tool_uses": 7,
                "duration_ms": 12345
            },
            "uuid": "uuid-3",
            "session_id": "session-1"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::TaskNotification(t) => {
                assert_eq!(t.task_id, "task-abc");
                assert_eq!(t.status, "completed");
                assert_eq!(t.output_file, "/tmp/out.md");
                assert_eq!(t.summary, "All done");
                assert_eq!(
                    t.usage,
                    Some(json!({
                        "total_tokens": 2000,
                        "tool_uses": 7,
                        "duration_ms": 12345
                    }))
                );
                assert_eq!(t.tool_use_id.as_deref(), Some("toolu_01"));
                assert_eq!(t.uuid, "uuid-3");
                assert_eq!(t.session_id, "session-1");
            }
            _ => panic!("expected TaskNotification message"),
        }
    }

    #[test]
    fn test_parse_task_notification_message_optional_fields_absent() {
        let data = json!({
            "type": "system",
            "subtype": "task_notification",
            "task_id": "task-abc",
            "status": "failed",
            "output_file": "/tmp/out.md",
            "summary": "Boom",
            "uuid": "uuid-3",
            "session_id": "session-1"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::TaskNotification(t) => {
                assert_eq!(t.status, "failed");
                assert!(t.usage.is_none());
                assert!(t.tool_use_id.is_none());
            }
            _ => panic!("expected TaskNotification message"),
        }
    }

    #[test]
    fn test_task_message_backward_compat_isinstance() {
        let started_data = json!({
            "type": "system",
            "subtype": "task_started",
            "task_id": "t1",
            "description": "desc",
            "uuid": "u1",
            "session_id": "s1"
        });
        let progress_data = json!({
            "type": "system",
            "subtype": "task_progress",
            "task_id": "t1",
            "description": "desc",
            "usage": {"total_tokens": 1, "tool_uses": 0, "duration_ms": 10},
            "uuid": "u2",
            "session_id": "s1"
        });
        let notif_data = json!({
            "type": "system",
            "subtype": "task_notification",
            "task_id": "t1",
            "status": "stopped",
            "output_file": "/o",
            "summary": "s",
            "uuid": "u3",
            "session_id": "s1"
        });
        let started = parse_message(&started_data).unwrap().unwrap();
        let progress = parse_message(&progress_data).unwrap().unwrap();
        let notif = parse_message(&notif_data).unwrap().unwrap();

        // In Rust, task messages are system-like — check via is_system()
        assert!(started.is_system());
        assert!(progress.is_system());
        assert!(notif.is_system());

        // Also verify they match the specific variant
        assert!(matches!(started, Message::TaskStarted(_)));
        assert!(matches!(progress, Message::TaskProgress(_)));
        assert!(matches!(notif, Message::TaskNotification(_)));
    }

    #[test]
    fn test_task_message_backward_compat_base_fields() {
        let data = json!({
            "type": "system",
            "subtype": "task_started",
            "task_id": "t1",
            "description": "desc",
            "uuid": "u1",
            "session_id": "s1"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::TaskStarted(t) => {
                assert_eq!(t.subtype, "task_started");
                assert_eq!(t.data, data);
                assert_eq!(t.data["task_id"], "t1");
            }
            _ => panic!("expected TaskStarted message"),
        }
    }

    #[test]
    fn test_unknown_system_subtype_yields_generic() {
        let data = json!({"type": "system", "subtype": "some_future_subtype", "foo": "bar"});
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::System(s) => {
                assert_eq!(s.subtype, "some_future_subtype");
                assert_eq!(s.data, data);
            }
            // Must NOT match any task variant
            Message::TaskStarted(_) | Message::TaskProgress(_) | Message::TaskNotification(_) => {
                panic!("unknown subtype should not match task variants");
            }
            _ => panic!("expected generic System message"),
        }
    }

    // -----------------------------------------------------------------------
    // Result messages
    // -----------------------------------------------------------------------

    #[test]
    fn test_parse_valid_result_message() {
        let data = json!({
            "type": "result",
            "subtype": "success",
            "duration_ms": 1000,
            "duration_api_ms": 500,
            "is_error": false,
            "num_turns": 2,
            "session_id": "session_123"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Result(r) => {
                assert_eq!(r.subtype, "success");
                assert!(r.stop_reason.is_none());
            }
            _ => panic!("expected Result message"),
        }
    }

    #[test]
    fn test_parse_result_message_with_stop_reason() {
        let data = json!({
            "type": "result",
            "subtype": "success",
            "duration_ms": 1000,
            "duration_api_ms": 500,
            "is_error": false,
            "num_turns": 2,
            "session_id": "session_123",
            "stop_reason": "end_turn",
            "result": "Done"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Result(r) => {
                assert_eq!(r.stop_reason.as_deref(), Some("end_turn"));
                assert_eq!(r.result.as_deref(), Some("Done"));
            }
            _ => panic!("expected Result message"),
        }
    }

    #[test]
    fn test_parse_result_message_with_null_stop_reason() {
        let data = json!({
            "type": "result",
            "subtype": "error_max_turns",
            "duration_ms": 1000,
            "duration_api_ms": 500,
            "is_error": true,
            "num_turns": 10,
            "session_id": "session_123",
            "stop_reason": null
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Result(r) => {
                assert!(r.stop_reason.is_none());
            }
            _ => panic!("expected Result message"),
        }
    }

    #[test]
    fn test_parse_result_message_with_model_usage() {
        let data = json!({
            "type": "result",
            "subtype": "success",
            "duration_ms": 3000,
            "duration_api_ms": 2000,
            "is_error": false,
            "num_turns": 1,
            "session_id": "fdf2d90a-fd9e-4736-ae35-806edd13643f",
            "stop_reason": "end_turn",
            "total_cost_usd": 0.0106,
            "usage": {"input_tokens": 3, "output_tokens": 24},
            "result": "Hello",
            "modelUsage": {
                "claude-sonnet-4-5-20250929": {
                    "inputTokens": 3,
                    "outputTokens": 24,
                    "cacheReadInputTokens": 20012,
                    "costUSD": 0.0106,
                    "contextWindow": 200000,
                    "maxOutputTokens": 64000
                }
            },
            "permission_denials": [],
            "uuid": "d379c496-f33a-4ea4-b920-3c5483baa6f7"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Result(r) => {
                let mu = r.model_usage.as_ref().unwrap();
                assert!(mu.get("claude-sonnet-4-5-20250929").is_some());
                assert_eq!(mu["claude-sonnet-4-5-20250929"]["costUSD"], 0.0106);
                assert_eq!(r.permission_denials.as_ref().unwrap().len(), 0);
                assert_eq!(
                    r.uuid.as_deref(),
                    Some("d379c496-f33a-4ea4-b920-3c5483baa6f7")
                );
            }
            _ => panic!("expected Result message"),
        }
    }

    #[test]
    fn test_parse_result_message_optional_fields_absent() {
        let data = json!({
            "type": "result",
            "subtype": "success",
            "duration_ms": 1000,
            "duration_api_ms": 500,
            "is_error": false,
            "num_turns": 1,
            "session_id": "session_123"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Result(r) => {
                assert!(r.model_usage.is_none());
                assert!(r.permission_denials.is_none());
                assert!(r.errors.is_none());
                assert!(r.uuid.is_none());
            }
            _ => panic!("expected Result message"),
        }
    }

    #[test]
    fn test_parse_result_message_with_errors() {
        let data = json!({
            "type": "result",
            "subtype": "error_during_execution",
            "duration_ms": 5000,
            "duration_api_ms": 3000,
            "is_error": true,
            "num_turns": 3,
            "session_id": "session_456",
            "errors": [
                "Tool execution failed: permission denied",
                "Unable to write to /etc/hosts"
            ],
            "uuid": "err-uuid-789"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Result(r) => {
                let errors = r.errors.as_ref().unwrap();
                assert_eq!(errors.len(), 2);
                assert_eq!(errors[0], "Tool execution failed: permission denied");
                assert_eq!(errors[1], "Unable to write to /etc/hosts");
                assert!(r.is_error);
                assert_eq!(r.subtype, "error_during_execution");
                assert_eq!(r.uuid.as_deref(), Some("err-uuid-789"));
            }
            _ => panic!("expected Result message"),
        }
    }

    #[test]
    fn test_parse_result_message_success_no_errors() {
        let data = json!({
            "type": "result",
            "subtype": "success",
            "duration_ms": 1000,
            "duration_api_ms": 500,
            "is_error": false,
            "num_turns": 1,
            "session_id": "session_789",
            "result": "Task completed successfully"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::Result(r) => {
                assert!(r.errors.is_none());
                assert_eq!(r.result.as_deref(), Some("Task completed successfully"));
            }
            _ => panic!("expected Result message"),
        }
    }

    // -----------------------------------------------------------------------
    // Rate limit event
    // -----------------------------------------------------------------------

    #[test]
    fn test_parse_rate_limit_event() {
        let data = json!({
            "type": "rate_limit_event",
            "rate_limit_info": {
                "status": "allowed_warning",
                "resetsAt": 1700000000_i64,
                "rateLimitType": "five_hour",
                "utilization": 0.91
            },
            "uuid": "abc-123",
            "session_id": "session_xyz"
        });
        let msg = parse_message(&data).unwrap().unwrap();
        match msg {
            Message::RateLimit(r) => {
                assert_eq!(r.uuid, "abc-123");
                assert_eq!(r.session_id, "session_xyz");
                assert_eq!(r.rate_limit_info.status, RateLimitStatus::AllowedWarning);
                assert_eq!(r.rate_limit_info.resets_at, Some(1700000000));
                assert_eq!(
                    r.rate_limit_info.rate_limit_type,
                    Some(RateLimitType::FiveHour)
                );
                assert_eq!(r.rate_limit_info.utilization, Some(0.91));
            }
            _ => panic!("expected RateLimit message"),
        }
    }

    // -----------------------------------------------------------------------
    // Error cases
    // -----------------------------------------------------------------------

    #[test]
    fn test_parse_invalid_data_type() {
        let data = json!("not a dict");
        let err = parse_message(&data).unwrap_err();
        match &err {
            ClaudeSDKError::MessageParse { message, .. } => {
                assert!(message.contains("Invalid message data type"));
                assert!(message.contains("expected dict") || message.contains("expected object"));
            }
            _ => panic!("expected MessageParse error, got: {err:?}"),
        }
    }

    #[test]
    fn test_parse_missing_type_field() {
        let data = json!({"message": {"content": []}});
        let err = parse_message(&data).unwrap_err();
        match &err {
            ClaudeSDKError::MessageParse { message, .. } => {
                assert!(message.contains("Message missing 'type' field"));
            }
            _ => panic!("expected MessageParse error, got: {err:?}"),
        }
    }

    #[test]
    fn test_parse_unknown_message_type() {
        let data = json!({"type": "unknown_type"});
        let result = parse_message(&data).unwrap();
        assert!(result.is_none());
    }

    #[test]
    fn test_parse_user_message_missing_fields() {
        let data = json!({"type": "user"});
        let err = parse_message(&data).unwrap_err();
        match &err {
            ClaudeSDKError::MessageParse { message, .. } => {
                assert!(message.contains("Missing required field in user message"));
            }
            _ => panic!("expected MessageParse error, got: {err:?}"),
        }
    }

    #[test]
    fn test_parse_assistant_message_missing_fields() {
        let data = json!({"type": "assistant"});
        let err = parse_message(&data).unwrap_err();
        match &err {
            ClaudeSDKError::MessageParse { message, .. } => {
                assert!(message.contains("Missing required field in assistant message"));
            }
            _ => panic!("expected MessageParse error, got: {err:?}"),
        }
    }

    #[test]
    fn test_parse_system_message_missing_fields() {
        let data = json!({"type": "system"});
        let err = parse_message(&data).unwrap_err();
        match &err {
            ClaudeSDKError::MessageParse { message, .. } => {
                assert!(message.contains("Missing required field in system message"));
            }
            _ => panic!("expected MessageParse error, got: {err:?}"),
        }
    }

    #[test]
    fn test_parse_result_message_missing_fields() {
        let data = json!({"type": "result", "subtype": "success"});
        let err = parse_message(&data).unwrap_err();
        match &err {
            ClaudeSDKError::MessageParse { message, .. } => {
                assert!(message.contains("Missing required field in result message"));
            }
            _ => panic!("expected MessageParse error, got: {err:?}"),
        }
    }

    #[test]
    fn test_message_parse_error_contains_data() {
        let data = json!({"type": "assistant"});
        let err = parse_message(&data).unwrap_err();
        match &err {
            ClaudeSDKError::MessageParse { data: err_data, .. } => {
                assert_eq!(err_data.as_ref().unwrap(), &data);
            }
            _ => panic!("expected MessageParse error, got: {err:?}"),
        }
    }
}
