//! Tests for subprocess transport buffering edge cases.
//! Ported from Python: tests/test_subprocess_buffering.py

use std::path::PathBuf;

use rust_agent_sdk::internal::transport::{SubprocessCLITransport, Transport, DEFAULT_MAX_BUFFER_SIZE};
#[allow(unused_imports)]
use rust_agent_sdk::types::ClaudeAgentOptions;

// -------------------------------------------------------------------------
// Helper
// -------------------------------------------------------------------------

/// Construct ClaudeAgentOptions with defaults suitable for transport tests.
fn make_options(max_buffer_size: Option<usize>) -> ClaudeAgentOptions {
    ClaudeAgentOptions {
        cli_path: Some(PathBuf::from("/usr/bin/claude")),
        max_buffer_size,
        ..Default::default()
    }
}

// -------------------------------------------------------------------------
// TestSubprocessBuffering
// -------------------------------------------------------------------------

/// Test parsing when multiple JSON objects are concatenated on a single line.
///
/// In some environments, stdout buffering can cause multiple distinct JSON
/// objects to be delivered as a single line with embedded newlines.
#[tokio::test]
async fn test_multiple_json_objects_on_single_line() {
    let json_obj1 = serde_json::json!({"type": "message", "id": "msg1", "content": "First message"});
    let json_obj2 = serde_json::json!({"type": "result", "id": "res1", "status": "completed"});

    let _buffered_line = format!("{}\n{}", json_obj1, json_obj2);

    let transport = SubprocessCLITransport::new("test", make_options(None));

    // SubprocessCLITransport::connect() is todo!(), so we can't call read_messages.
    // After implementation, we'd feed the buffered_line into the transport's stdout
    // stream and read parsed messages out.
    //
    // For now, verify the transport was constructed correctly then attempt connect.
    assert_eq!(transport.prompt, "test");
    assert!(!transport.is_ready());

    // This will fail with todo!() — desired behavior.
    let mut transport = transport;
    transport.connect().await.unwrap();

    // After implementation: read_messages() should yield 2 messages
    // messages[0]["type"] == "message", messages[0]["id"] == "msg1"
    // messages[1]["type"] == "result", messages[1]["id"] == "res1"
}

/// Test parsing JSON objects that contain newline characters in string values.
#[tokio::test]
async fn test_json_with_embedded_newlines() {
    let json_obj1 = serde_json::json!({"type": "message", "content": "Line 1\nLine 2\nLine 3"});
    let json_obj2 = serde_json::json!({"type": "result", "data": "Some\nMultiline\nContent"});

    let _buffered_line = format!("{}\n{}", json_obj1, json_obj2);

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    transport.connect().await.unwrap();

    // After implementation:
    // messages[0]["content"] == "Line 1\nLine 2\nLine 3"
    // messages[1]["data"] == "Some\nMultiline\nContent"
}

/// Test parsing with multiple newlines between JSON objects.
#[tokio::test]
async fn test_multiple_newlines_between_objects() {
    let json_obj1 = serde_json::json!({"type": "message", "id": "msg1"});
    let json_obj2 = serde_json::json!({"type": "result", "id": "res1"});

    let _buffered_line = format!("{}\n\n\n{}", json_obj1, json_obj2);

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    transport.connect().await.unwrap();

    // After implementation:
    // len(messages) == 2
    // messages[0]["id"] == "msg1"
    // messages[1]["id"] == "res1"
}

/// Test parsing when a single JSON object is split across multiple stream reads.
#[tokio::test]
async fn test_split_json_across_multiple_reads() {
    let json_obj = serde_json::json!({
        "type": "assistant",
        "message": {
            "content": [
                {"type": "text", "text": "x".repeat(1000)},
                {
                    "type": "tool_use",
                    "id": "tool_123",
                    "name": "Read",
                    "input": {"file_path": "/test.txt"}
                }
            ]
        }
    });

    let complete_json = serde_json::to_string(&json_obj).unwrap();
    let _part1 = &complete_json[..100];
    let _part2 = &complete_json[100..250];
    let _part3 = &complete_json[250..];

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    transport.connect().await.unwrap();

    // After implementation:
    // len(messages) == 1
    // messages[0]["type"] == "assistant"
    // len(messages[0]["message"]["content"]) == 2
}

/// Test parsing a large minified JSON (simulating the reported issue).
#[tokio::test]
async fn test_large_minified_json() {
    let large_data: Vec<serde_json::Value> = (0..1000)
        .map(|i| serde_json::json!({"id": i, "value": "x".repeat(100)}))
        .collect();

    let json_obj = serde_json::json!({
        "type": "user",
        "message": {
            "role": "user",
            "content": [{
                "tool_use_id": "toolu_016fed1NhiaMLqnEvrj5NUaj",
                "type": "tool_result",
                "content": serde_json::to_string(&serde_json::json!({"data": large_data})).unwrap()
            }]
        }
    });

    let complete_json = serde_json::to_string(&json_obj).unwrap();
    let chunk_size = 64 * 1024;
    let _chunks: Vec<&str> = complete_json
        .as_bytes()
        .chunks(chunk_size)
        .map(|c| std::str::from_utf8(c).unwrap())
        .collect();

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    transport.connect().await.unwrap();

    // After implementation:
    // len(messages) == 1
    // messages[0]["type"] == "user"
    // messages[0]["message"]["content"][0]["tool_use_id"] == "toolu_016fed1NhiaMLqnEvrj5NUaj"
}

/// Test that exceeding buffer size raises an appropriate error.
#[tokio::test]
async fn test_buffer_size_exceeded() {
    let _huge_incomplete = format!("{{\"data\": \"{}", "x".repeat(DEFAULT_MAX_BUFFER_SIZE + 1000));

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    // After implementation, reading from the stream with oversized incomplete JSON
    // should produce a CLIJSONDecodeError with "exceeded maximum buffer size".
    transport.connect().await.unwrap();
}

/// Test that the configurable buffer size option is respected.
#[tokio::test]
async fn test_buffer_size_option() {
    let custom_limit: usize = 512;
    let _huge_incomplete = format!("{{\"data\": \"{}", "x".repeat(custom_limit + 10));

    let mut transport = SubprocessCLITransport::new("test", make_options(Some(custom_limit)));

    // connect() is todo!()
    // After implementation, reading should fail with:
    // "maximum buffer size of 512 bytes" in the error message
    transport.connect().await.unwrap();
}

/// Test handling a mix of complete and split JSON messages.
#[tokio::test]
async fn test_mixed_complete_and_split_json() {
    let msg1 = serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "start"}))
        .unwrap();

    let large_msg = serde_json::json!({
        "type": "assistant",
        "message": {"content": [{"type": "text", "text": "y".repeat(5000)}]}
    });
    let large_json = serde_json::to_string(&large_msg).unwrap();

    let msg3 = serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "end"}))
        .unwrap();

    let _lines = vec![
        format!("{}\n", msg1),
        large_json[..1000].to_string(),
        large_json[1000..3000].to_string(),
        format!("{}\n{}", &large_json[3000..], msg3),
    ];

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    transport.connect().await.unwrap();

    // After implementation:
    // len(messages) == 3
    // messages[0]["type"] == "system", messages[0]["subtype"] == "start"
    // messages[1]["type"] == "assistant"
    // messages[1]["message"]["content"][0]["text"].len() == 5000
    // messages[2]["type"] == "system", messages[2]["subtype"] == "end"
}

/// Non-JSON lines (e.g. [SandboxDebug]) on stdout must not corrupt
/// the JSON parser buffer. Regression test for #347.
#[tokio::test]
async fn test_non_json_debug_lines_skipped() {
    let debug = "[SandboxDebug] Seccomp filtering not available";
    let msg1 = serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "init"}))
        .unwrap();
    let msg2 =
        serde_json::to_string(&serde_json::json!({"type": "result", "subtype": "success"}))
            .unwrap();

    let _stream_data = format!("{}\n{}\n{}\n{}\n", debug, msg1, debug, msg2);

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    transport.connect().await.unwrap();

    // After implementation:
    // len(messages) == 2
    // messages[0]["type"] == "system"
    // messages[1]["type"] == "result"
}

/// Debug/warning lines interleaved between valid JSON messages
/// must be silently skipped.
#[tokio::test]
async fn test_interleaved_non_json_lines_skipped() {
    let _lines = vec![
        "[SandboxDebug] line 1\n".to_string(),
        "[SandboxDebug] line 2\n".to_string(),
        format!(
            "{}\n",
            serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "init"}))
                .unwrap()
        ),
        "WARNING: something\n".to_string(),
        format!(
            "{}\n",
            serde_json::to_string(
                &serde_json::json!({"type": "result", "subtype": "success"})
            )
            .unwrap()
        ),
    ];

    let mut transport = SubprocessCLITransport::new("test", make_options(None));

    // connect() is todo!()
    transport.connect().await.unwrap();

    // After implementation:
    // len(messages) == 2
    // messages[0]["type"] == "system"
    // messages[1]["type"] == "result"
}
