use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Fetch content from a URL.
pub struct WebFetchTool;

#[derive(Deserialize)]
struct WebFetchInput {
    url: String,
    #[serde(default)]
    prompt: Option<String>,
}

const MAX_CONTENT_SIZE: usize = 200 * 1024;

#[async_trait]
impl Tool for WebFetchTool {
    fn name(&self) -> &str { "WebFetch" }

    fn description(&self) -> &str {
        "Fetches content from a URL. Returns the page content as text."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "url": { "type": "string", "description": "The URL to fetch" },
                "prompt": { "type": "string", "description": "What to extract from the page" }
            },
            "required": ["url"]
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let input: WebFetchInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build();

        let client = match client {
            Ok(c) => c,
            Err(e) => return ToolResult::error(format!("Failed to create HTTP client: {e}")),
        };

        let response = match client.get(&input.url).send().await {
            Ok(r) => r,
            Err(e) => return ToolResult::error(format!("Request failed: {e}")),
        };

        let status = response.status();
        if !status.is_success() {
            return ToolResult::error(format!("HTTP {status} for {}", input.url));
        }

        let body = match response.text().await {
            Ok(t) => t,
            Err(e) => return ToolResult::error(format!("Failed to read response: {e}")),
        };

        let mut content = body;
        if content.len() > MAX_CONTENT_SIZE {
            content.truncate(MAX_CONTENT_SIZE);
            content.push_str("\n\n[Content truncated]");
        }

        ToolResult::text(content)
    }
}
