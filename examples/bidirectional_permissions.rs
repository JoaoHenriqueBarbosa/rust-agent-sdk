//! Example: bidirectional conversation with interactive tool permission prompts.
//!
//! Demonstrates the permission callback flow:
//! - Tools without explicit allow/deny rules trigger a permission prompt
//! - The user can approve (y) or reject (n) each tool invocation
//! - Rejected tools return an error to the model, which adapts its approach
//!
//! Usage:
//!   ANTHROPIC_API_KEY=sk-ant-... cargo run --example bidirectional_permissions

use std::io::Write;
use std::sync::Arc;

use futures::StreamExt;
use rust_agent_sdk::agentic::AgenticEvent;
use rust_agent_sdk::api::streaming::StreamUpdate;
use rust_agent_sdk::client::{ClaudeSDKClient, ClaudeSDKClientOptions, PermissionCallbackFn};
use rust_agent_sdk::tools::framework::ToolPermissionRequest;
use rust_agent_sdk::tools::permission::PermissionRules;
use rust_agent_sdk::types::PermissionMode;

/// Interactive permission callback that asks the user via stdin.
fn make_interactive_callback() -> PermissionCallbackFn {
    Arc::new(|request: ToolPermissionRequest| {
        Box::pin(async move {
            // Format the input for display
            let input_preview = serde_json::to_string_pretty(&request.input)
                .unwrap_or_else(|_| request.input.to_string());
            let input_display = if input_preview.len() > 200 {
                format!("{}...", &input_preview[..200])
            } else {
                input_preview
            };

            println!();
            println!("╔══════════════════════════════════════════════════╗");
            println!("║  PERMISSION REQUEST                              ║");
            println!("╠══════════════════════════════════════════════════╣");
            println!("║  Tool: {:<42}║", request.tool_name);
            println!("╟──────────────────────────────────────────────────╢");
            println!("║  Input:                                          ║");
            for line in input_display.lines() {
                println!("║  {:<48}║", line);
            }
            println!("╚══════════════════════════════════════════════════╝");
            print!("\nAllow? [y/n]: ");
            std::io::stdout().flush().unwrap();

            let mut answer = String::new();
            std::io::stdin().read_line(&mut answer).unwrap();
            let allowed = answer.trim().eq_ignore_ascii_case("y");

            if allowed {
                println!("  → Approved ✓\n");
            } else {
                println!("  → Denied ✗\n");
            }

            allowed
        })
    })
}

#[tokio::main]
async fn main() {
    // No explicit allow/deny rules — everything goes through the callback
    let permission_rules = PermissionRules::new();

    let client = ClaudeSDKClient::new(ClaudeSDKClientOptions {
        max_turns: Some(5),
        permission_mode: Some(PermissionMode::Default),
        permission_rules: Some(permission_rules),
        permission_callback: Some(make_interactive_callback()),
        ..Default::default()
    });

    println!("=== Bidirectional Permission Demo ===");
    println!("The model will try to use tools. You approve or deny each one.\n");

    // Multi-turn interactive loop
    loop {
        print!("You: ");
        std::io::stdout().flush().unwrap();

        let mut input = String::new();
        std::io::stdin().read_line(&mut input).unwrap();
        let input = input.trim();

        if input.is_empty() || input == "quit" || input == "exit" {
            println!("Bye!");
            break;
        }

        let stream = client.send_message_stream(input);
        tokio::pin!(stream);

        print!("Claude: ");
        std::io::stdout().flush().unwrap();

        while let Some(event) = stream.next().await {
            match event {
                Ok(AgenticEvent::Stream(StreamUpdate::TextDelta { text, .. })) => {
                    print!("{text}");
                    std::io::stdout().flush().unwrap();
                }
                Ok(AgenticEvent::ToolExecutionStart { tool_name, .. }) => {
                    // Permission prompt happens inside the executor callback
                    print!("\n[requesting: {tool_name}]");
                    std::io::stdout().flush().unwrap();
                }
                Ok(AgenticEvent::ToolExecutionComplete { result, .. }) => {
                    let status = if result.is_error { "DENIED/ERROR" } else { "OK" };
                    println!(" → {status}");
                    std::io::stdout().flush().unwrap();
                }
                Ok(AgenticEvent::Done { turns, .. }) => {
                    println!("\n[done — {turns} turn(s)]");
                    break;
                }
                Err(e) => {
                    eprintln!("\nError: {e}");
                    break;
                }
                _ => {}
            }
        }
        println!();
    }
}
