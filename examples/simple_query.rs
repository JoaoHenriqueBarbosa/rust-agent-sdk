//! Smoke test: sends a simple prompt to the Anthropic API and prints the response.
//!
//! Usage:
//!   ANTHROPIC_API_KEY=sk-ant-... cargo run --example simple_query

use futures::StreamExt;
use rust_agent_sdk::agentic::{agentic_query, AgenticEvent, AgenticLoopOptions};
use rust_agent_sdk::api::client::AnthropicClient;
use rust_agent_sdk::tools::framework::{ToolContext, ToolExecutor, ToolRegistry};

#[tokio::main]
async fn main() {
    let api_key = std::env::var("ANTHROPIC_API_KEY").unwrap_or_default();

    let mut client = AnthropicClient::new(api_key);
    if let Ok(base_url) = std::env::var("ANTHROPIC_BASE_URL") {
        client = client.with_base_url(base_url);
    }

    let registry = ToolRegistry::new(); // no tools — pure text response
    let context = ToolContext::default();
    let executor = ToolExecutor::new(registry, context);

    let options = AgenticLoopOptions {
        model: "claude-sonnet-4-20250514".to_string(),
        max_tokens: 1024,
        ..Default::default()
    };

    let stream = agentic_query(client, "Say hello in one sentence.", executor, options);
    tokio::pin!(stream);

    while let Some(event) = stream.next().await {
        match event {
            Ok(AgenticEvent::Stream(
                rust_agent_sdk::api::streaming::StreamUpdate::TextDelta { text, .. },
            )) => {
                print!("{text}");
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
