//! Example: agentic loop with file tools (Read, Write, Edit).
//!
//! Creates a temp file, asks Claude to read it, modify it, and report the changes.
//! Validates the full tool_use → tool_result cycle.
//!
//! Usage:
//!   ANTHROPIC_API_KEY=sk-ant-... cargo run --example tool_use_file_ops

use futures::StreamExt;
use rust_agent_sdk::agentic::{agentic_query, AgenticEvent, AgenticLoopOptions};
use rust_agent_sdk::api::client::AnthropicClient;
use rust_agent_sdk::api::streaming::StreamUpdate;
use rust_agent_sdk::tools::framework::{ToolContext, ToolExecutor, ToolRegistry};
use rust_agent_sdk::tools::permission::PermissionRules;

#[tokio::main]
async fn main() {
    let api_key = std::env::var("ANTHROPIC_API_KEY").unwrap_or_default();
    let mut client = AnthropicClient::new(api_key);
    if let Ok(base_url) = std::env::var("ANTHROPIC_BASE_URL") {
        client = client.with_base_url(base_url);
    }

    // Set up tools: Read, Write, Edit
    let mut registry = ToolRegistry::new();
    registry.register(Box::new(rust_agent_sdk::tools::file_read::FileReadTool));
    registry.register(Box::new(rust_agent_sdk::tools::file_write::FileWriteTool));
    registry.register(Box::new(rust_agent_sdk::tools::file_edit::FileEditTool));

    let context = ToolContext {
        working_directory: std::env::current_dir().unwrap(),
        permission_mode: rust_agent_sdk::types::PermissionMode::BypassPermissions,
        permission_callback: None,
    };
    let executor = ToolExecutor::new(registry, context)
        .with_permission_rules(PermissionRules::allow_all());

    // Create a temp file for the agent to work with
    let dir = tempfile::tempdir().unwrap();
    let file_path = dir.path().join("greeting.txt");
    std::fs::write(&file_path, "Hello World\n").unwrap();
    println!("Created temp file: {}", file_path.display());

    let prompt = format!(
        "Read the file at {}, then use the Edit tool to change 'World' to 'Rust SDK'. \
         After editing, read it again and confirm the change.",
        file_path.display()
    );

    let options = AgenticLoopOptions {
        model: "claude-sonnet-4-20250514".to_string(),
        max_tokens: 2048,
        max_turns: Some(10),
        ..Default::default()
    };

    let stream = agentic_query(client, &prompt, executor, options);
    tokio::pin!(stream);

    while let Some(event) = stream.next().await {
        match event {
            Ok(AgenticEvent::Stream(StreamUpdate::TextDelta { text, .. })) => {
                print!("{text}");
            }
            Ok(AgenticEvent::ToolExecutionStart { tool_name, .. }) => {
                print!("\n[tool: {tool_name}] ");
            }
            Ok(AgenticEvent::ToolExecutionComplete { tool_name, result, .. }) => {
                let preview = match result.content.first() {
                    Some(rust_agent_sdk::tools::framework::ToolResultContent::Text(t)) => {
                        if t.len() > 80 { format!("{}...", &t[..80]) } else { t.clone() }
                    }
                    _ => "(non-text)".to_string(),
                };
                println!("→ {preview}");
            }
            Ok(AgenticEvent::Done { turns, .. }) => {
                println!("\n\n[done — {turns} turn(s)]");
            }
            Err(e) => {
                eprintln!("\nerror: {e}");
                std::process::exit(1);
            }
            _ => {}
        }
    }

    // Verify the file was actually edited
    let final_content = std::fs::read_to_string(&file_path).unwrap();
    println!("Final file content: {final_content}");
    assert!(
        final_content.contains("Rust SDK"),
        "Expected 'Rust SDK' in file, got: {final_content}"
    );
    println!("✓ File edit verified!");
}
