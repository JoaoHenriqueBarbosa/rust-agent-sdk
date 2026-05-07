//! Example: inspect all streaming events from the agentic loop.
//!
//! Shows every event type — useful for debugging and understanding the flow.
//!
//! Usage:
//!   ANTHROPIC_API_KEY=sk-ant-... cargo run --example streaming_events

use futures::StreamExt;
use rust_agent_sdk::agentic::{agentic_query, AgenticEvent, AgenticLoopOptions};
use rust_agent_sdk::api::client::AnthropicClient;
use rust_agent_sdk::api::streaming::StreamUpdate;
use rust_agent_sdk::tools::bash::BashTool;
use rust_agent_sdk::tools::file_read::FileReadTool;
use rust_agent_sdk::tools::framework::{ToolContext, ToolExecutor, ToolRegistry};
use rust_agent_sdk::tools::permission::PermissionRules;

#[tokio::main]
async fn main() {
    let api_key = std::env::var("ANTHROPIC_API_KEY").unwrap_or_default();
    let mut client = AnthropicClient::new(api_key);
    if let Ok(base_url) = std::env::var("ANTHROPIC_BASE_URL") {
        client = client.with_base_url(base_url);
    }

    let mut registry = ToolRegistry::new();
    registry.register(Box::new(BashTool::default()));
    registry.register(Box::new(FileReadTool));

    let context = ToolContext {
        working_directory: std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")),
        permission_mode: rust_agent_sdk::types::PermissionMode::BypassPermissions,
        permission_callback: None,
    };
    let executor = ToolExecutor::new(registry, context)
        .with_permission_rules(PermissionRules::allow_all());

    let options = AgenticLoopOptions {
        model: "claude-sonnet-4-20250514".to_string(),
        max_tokens: 2048,
        max_turns: Some(3),
        ..Default::default()
    };

    let prompt = "Read the first 5 lines of Cargo.toml, then run 'echo done'.";

    let stream = agentic_query(client, prompt, executor, options);
    tokio::pin!(stream);

    println!("=== Streaming events ===\n");

    while let Some(event) = stream.next().await {
        match event {
            Ok(AgenticEvent::Stream(update)) => match update {
                StreamUpdate::TextDelta { index, text } => {
                    println!("  [text_delta idx={index}] {text:?}");
                }
                StreamUpdate::ThinkingDelta { index, thinking } => {
                    let preview = if thinking.len() > 60 {
                        format!("{}...", &thinking[..60])
                    } else {
                        thinking
                    };
                    println!("  [thinking idx={index}] {preview:?}");
                }
                StreamUpdate::ToolUseStart { index, id, name } => {
                    println!("  [tool_start idx={index}] {name} (id={id})");
                }
                StreamUpdate::ToolUseInputDelta { index, partial_json } => {
                    let preview = if partial_json.len() > 60 {
                        format!("{}...", &partial_json[..60])
                    } else {
                        partial_json
                    };
                    println!("  [tool_input idx={index}] {preview}");
                }
                StreamUpdate::ContentBlockComplete { index, .. } => {
                    println!("  [block_complete idx={index}]");
                }
                StreamUpdate::MessageComplete { message } => {
                    println!(
                        "  [msg_complete] id={} stop={:?} tokens_in={} tokens_out={}",
                        message.id, message.stop_reason, message.usage.input_tokens, message.usage.output_tokens
                    );
                }
            },
            Ok(AgenticEvent::AssistantMessage(msg)) => {
                println!("\n--- Assistant message ({} blocks, stop={:?}) ---", msg.content.len(), msg.stop_reason);
            }
            Ok(AgenticEvent::ToolExecutionStart { tool_name, tool_use_id }) => {
                println!("\n>>> Executing: {tool_name} (id={tool_use_id})");
            }
            Ok(AgenticEvent::ToolExecutionComplete { tool_use_id, result, .. }) => {
                let status = if result.is_error { "ERROR" } else { "OK" };
                println!("<<< Result ({status}) for {tool_use_id}");
            }
            Ok(AgenticEvent::Done { reason, turns }) => {
                println!("\n=== Done: {reason:?}, {turns} turn(s) ===");
            }
            Ok(AgenticEvent::Error(msg)) => {
                println!("\n!!! Error event: {msg}");
            }
            Err(e) => {
                eprintln!("\nFatal error: {e}");
                std::process::exit(1);
            }
        }
    }
}
