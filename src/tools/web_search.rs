use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Web search tool. Requires external search API configuration.
pub struct WebSearchTool;

#[derive(Deserialize)]
struct WebSearchInput {
    query: String,
}

#[async_trait]
impl Tool for WebSearchTool {
    fn name(&self) -> &str { "WebSearch" }

    fn description(&self) -> &str {
        "Search the web for information."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "query": { "type": "string", "description": "The search query" }
            },
            "required": ["query"]
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let _input: WebSearchInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        // Web search requires an external API (e.g. Brave Search, Google Custom Search).
        // This is a stub that returns an error directing the user to configure one.
        ToolResult::error(
            "WebSearch requires an external search API to be configured. \
             Set SEARCH_API_KEY and SEARCH_API_URL environment variables."
        )
    }
}
