//! Example: registering custom tools alongside the built-in ones.
//!
//! Demonstrates how to implement the Tool trait and register custom tools
//! that the model can discover and invoke during the agentic loop.
//!
//! Usage:
//!   ANTHROPIC_API_KEY=sk-ant-... cargo run --example custom_tools

use std::sync::Arc;

use async_trait::async_trait;
use futures::StreamExt;
use rust_agent_sdk::agentic::AgenticEvent;
use rust_agent_sdk::api::streaming::StreamUpdate;
use rust_agent_sdk::client::{ClaudeSDKClient, ClaudeSDKClientOptions};
use rust_agent_sdk::tools::framework::{Tool, ToolContext, ToolResult};

// ---------------------------------------------------------------------------
// Custom tool: simple key-value store
// ---------------------------------------------------------------------------

struct KvStoreTool {
    store: tokio::sync::Mutex<std::collections::HashMap<String, String>>,
}

impl KvStoreTool {
    fn new() -> Self {
        Self {
            store: tokio::sync::Mutex::new(std::collections::HashMap::new()),
        }
    }
}

#[derive(serde::Deserialize)]
struct KvInput {
    action: String, // "get", "set", "list"
    #[serde(default)]
    key: Option<String>,
    #[serde(default)]
    value: Option<String>,
}

#[async_trait]
impl Tool for KvStoreTool {
    fn name(&self) -> &str { "KvStore" }

    fn description(&self) -> &str {
        "A simple key-value store. Actions: 'set' (key + value), 'get' (key), 'list' (all keys)."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["get", "set", "list"],
                    "description": "The action to perform"
                },
                "key": {
                    "type": "string",
                    "description": "The key (required for get/set)"
                },
                "value": {
                    "type": "string",
                    "description": "The value to store (required for set)"
                }
            },
            "required": ["action"]
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let input: KvInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        match input.action.as_str() {
            "set" => {
                let key = match input.key {
                    Some(k) => k,
                    None => return ToolResult::error("'key' is required for set"),
                };
                let value = match input.value {
                    Some(v) => v,
                    None => return ToolResult::error("'value' is required for set"),
                };
                self.store.lock().await.insert(key.clone(), value.clone());
                ToolResult::text(format!("Stored: {key} = {value}"))
            }
            "get" => {
                let key = match input.key {
                    Some(k) => k,
                    None => return ToolResult::error("'key' is required for get"),
                };
                match self.store.lock().await.get(&key) {
                    Some(v) => ToolResult::text(format!("{key} = {v}")),
                    None => ToolResult::error(format!("Key '{key}' not found")),
                }
            }
            "list" => {
                let store = self.store.lock().await;
                if store.is_empty() {
                    ToolResult::text("(empty store)")
                } else {
                    let entries: Vec<String> = store
                        .iter()
                        .map(|(k, v)| format!("{k} = {v}"))
                        .collect();
                    ToolResult::text(entries.join("\n"))
                }
            }
            other => ToolResult::error(format!("Unknown action: {other}")),
        }
    }
}

// ---------------------------------------------------------------------------
// Custom tool: random number generator
// ---------------------------------------------------------------------------

struct RandomTool;

#[async_trait]
impl Tool for RandomTool {
    fn name(&self) -> &str { "Random" }

    fn description(&self) -> &str {
        "Generate a random number between min and max (inclusive)."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "min": { "type": "integer", "description": "Minimum value (default 1)" },
                "max": { "type": "integer", "description": "Maximum value (default 100)" }
            }
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let min = input.get("min").and_then(|v| v.as_i64()).unwrap_or(1);
        let max = input.get("max").and_then(|v| v.as_i64()).unwrap_or(100);
        if min > max {
            return ToolResult::error("min must be <= max");
        }
        let n = min + (rand::random::<u64>() % (max - min + 1) as u64) as i64;
        ToolResult::text(format!("{n}"))
    }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

#[tokio::main]
async fn main() {
    let client = ClaudeSDKClient::new(ClaudeSDKClientOptions {
        max_turns: Some(10),
        use_default_tools: false, // only our custom tools
        custom_tools: vec![
            Arc::new(KvStoreTool::new()),
            Arc::new(RandomTool),
        ],
        ..Default::default()
    });

    let prompt = "Generate 3 random numbers between 1 and 20, store each in the KvStore \
                  with keys 'a', 'b', 'c', then list all stored values.";

    println!("Prompt: {prompt}\n");

    let stream = client.send_message_stream(prompt);
    tokio::pin!(stream);

    while let Some(event) = stream.next().await {
        match event {
            Ok(AgenticEvent::Stream(StreamUpdate::TextDelta { text, .. })) => {
                print!("{text}");
            }
            Ok(AgenticEvent::ToolExecutionStart { tool_name, .. }) => {
                print!("\n  [{tool_name}] ");
            }
            Ok(AgenticEvent::ToolExecutionComplete { result, .. }) => {
                let text = result.content.first().map(|c| match c {
                    rust_agent_sdk::tools::framework::ToolResultContent::Text(t) => t.clone(),
                    _ => String::new(),
                }).unwrap_or_default();
                println!("→ {text}");
            }
            Ok(AgenticEvent::Done { turns, .. }) => {
                println!("\n[done — {turns} turn(s)]");
            }
            Err(e) => {
                eprintln!("\nError: {e}");
                std::process::exit(1);
            }
            _ => {}
        }
    }
}
