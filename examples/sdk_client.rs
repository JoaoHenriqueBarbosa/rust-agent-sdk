//! Example: using the high-level ClaudeSDKClient API.
//!
//! This is the simplest way to use the SDK — just create a client and send messages.
//! The client handles tool execution, streaming, and the agentic loop internally.
//!
//! Usage:
//!   ANTHROPIC_API_KEY=sk-ant-... cargo run --example sdk_client

use rust_agent_sdk::client::{ClaudeSDKClient, ClaudeSDKClientOptions};

#[tokio::main]
async fn main() {
    let client = ClaudeSDKClient::new(ClaudeSDKClientOptions {
        max_turns: Some(3),
        ..Default::default()
    });

    // Simple text response
    println!("--- send_message (text) ---\n");
    match client.send_message("What is 2 + 2? Answer in one word.").await {
        Ok(text) => println!("{text}"),
        Err(e) => {
            eprintln!("Error: {e}");
            std::process::exit(1);
        }
    }

    // Streaming text deltas
    println!("\n--- send_message_text_stream ---\n");
    use futures::StreamExt;
    let stream = client.send_message_text_stream("Count from 1 to 5, one number per line.");
    tokio::pin!(stream);
    while let Some(result) = stream.next().await {
        match result {
            Ok(text) => print!("{text}"),
            Err(e) => {
                eprintln!("\nError: {e}");
                break;
            }
        }
    }
    println!();
}
