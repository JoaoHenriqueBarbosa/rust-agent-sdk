//! Example: multi-turn conversation with BashTool.
//!
//! Asks Claude to explore the project directory using shell commands.
//! Validates multi-turn agentic loop with sequential tool calls.
//!
//! Usage:
//!   ANTHROPIC_API_KEY=sk-ant-... cargo run --example multi_turn_bash

use futures::StreamExt;
use rust_agent_sdk::agentic::{agentic_query, AgenticEvent, AgenticLoopOptions};
use rust_agent_sdk::api::client::AnthropicClient;
use rust_agent_sdk::api::streaming::StreamUpdate;
use rust_agent_sdk::tools::bash::BashTool;
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
        max_turns: Some(5),
        ..Default::default()
    };

    let prompt = "List the .rs files in the src/ directory, then count total lines of code. \
                  Be brief — just the numbers.";

    let stream = agentic_query(client, prompt, executor, options);
    tokio::pin!(stream);

    let mut turn = 0u32;
    while let Some(event) = stream.next().await {
        match event {
            Ok(AgenticEvent::Stream(StreamUpdate::TextDelta { text, .. })) => {
                print!("{text}");
            }
            Ok(AgenticEvent::ToolExecutionStart { tool_name, .. }) => {
                turn += 1;
                print!("\n[turn {turn} — {tool_name}] ");
            }
            Ok(AgenticEvent::ToolExecutionComplete { result, .. }) => {
                let ok = if result.is_error { "ERR" } else { "OK" };
                println!("→ {ok}");
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
}
