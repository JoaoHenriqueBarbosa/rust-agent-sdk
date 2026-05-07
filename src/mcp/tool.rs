// Port of MCP tool wrapper — wraps an MCP server tool as a native SDK Tool.
// When the model calls `mcp__server__toolName`, this routes to
// tools/call on the MCP server via JSON-RPC.

use std::sync::Arc;

use async_trait::async_trait;
use serde_json::Value;

use crate::mcp::client::McpClient;
use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// A tool backed by an MCP server. Implements the `Tool` trait so it can be
/// registered in the SDK's ToolRegistry alongside built-in tools.
///
/// The tool name is `mcp__{server}__{original_name}`, matching the TS
/// convention from getMcpPrefix (services/mcp/mcpStringUtils.js).
pub struct McpTool {
    /// Full SDK name: mcp__{server}__{tool}
    sdk_name: String,
    /// Original tool name on the MCP server
    mcp_tool_name: String,
    description: String,
    input_schema: Value,
    client: Arc<McpClient>,
}

impl McpTool {
    pub fn new(
        server_name: String,
        tool_name: String,
        description: String,
        input_schema: Value,
        client: Arc<McpClient>,
    ) -> Self {
        // Port: getMcpPrefix from mcpStringUtils.js
        // normalizeNameForMCP replaces non-alphanumeric/underscore/dash with _
        let normalized_server = normalize_name_for_mcp(&server_name);
        let normalized_tool = normalize_name_for_mcp(&tool_name);
        let sdk_name = format!("mcp__{normalized_server}__{normalized_tool}");

        Self {
            sdk_name,
            mcp_tool_name: tool_name,
            description,
            input_schema,
            client,
        }
    }
}

/// Port of normalizeNameForMCP from services/mcp/normalization.ts
fn normalize_name_for_mcp(name: &str) -> String {
    name.chars()
        .map(|c| {
            if c.is_alphanumeric() || c == '_' || c == '-' {
                c
            } else {
                '_'
            }
        })
        .collect()
}

#[async_trait]
impl Tool for McpTool {
    fn name(&self) -> &str {
        &self.sdk_name
    }

    fn description(&self) -> &str {
        &self.description
    }

    fn input_schema(&self) -> Value {
        self.input_schema.clone()
    }

    fn is_concurrency_safe(&self) -> bool {
        // MCP tools are generally safe to run concurrently since each call
        // is an independent JSON-RPC request.
        true
    }

    async fn execute(&self, input: Value, _context: &ToolContext) -> ToolResult {
        match self.client.call_tool(&self.mcp_tool_name, input).await {
            Ok(result) => {
                // Port: processMCPResult / transformMCPResult
                // Extract text content from the MCP response
                let text = extract_mcp_result_text(&result);
                ToolResult::text(text)
            }
            Err(e) => ToolResult::error(format!("{e}")),
        }
    }
}

/// Extract text from an MCP tools/call response.
///
/// Port of transformMCPResult from client/transformMCPResult.js:
/// - If result has "content" array: join all text items
/// - If result has "toolResult" string: use directly
/// - Otherwise: serialize the whole result
fn extract_mcp_result_text(result: &Value) -> String {
    // Check for content array (most common path)
    if let Some(content) = result.get("content").and_then(|c| c.as_array()) {
        let mut parts = Vec::new();
        for item in content {
            if let Some(text) = item.get("text").and_then(|t| t.as_str()) {
                parts.push(text.to_string());
            }
        }
        if !parts.is_empty() {
            return parts.join("\n");
        }
    }

    // Check for toolResult string
    if let Some(tool_result) = result.get("toolResult").and_then(|t| t.as_str()) {
        return tool_result.to_string();
    }

    // Fallback: serialize the whole result
    serde_json::to_string_pretty(result).unwrap_or_else(|_| result.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_normalize_name_for_mcp() {
        assert_eq!(normalize_name_for_mcp("school"), "school");
        assert_eq!(normalize_name_for_mcp("my-server"), "my-server");
        assert_eq!(normalize_name_for_mcp("claude.ai Google Drive"), "claude_ai_Google_Drive");
        assert_eq!(normalize_name_for_mcp("server with spaces"), "server_with_spaces");
    }

    #[test]
    fn test_sdk_tool_name_format() {
        // Just test the naming convention without constructing a full McpTool
        let server = "school";
        let tool = "listStudents";
        let name = format!(
            "mcp__{}__{}",
            normalize_name_for_mcp(server),
            normalize_name_for_mcp(tool)
        );
        assert_eq!(name, "mcp__school__listStudents");
    }

    #[test]
    fn test_extract_mcp_result_text_content_array() {
        let result = serde_json::json!({
            "content": [
                {"type": "text", "text": "Hello"},
                {"type": "text", "text": "World"}
            ]
        });
        assert_eq!(extract_mcp_result_text(&result), "Hello\nWorld");
    }

    #[test]
    fn test_extract_mcp_result_text_tool_result() {
        let result = serde_json::json!({"toolResult": "some result"});
        assert_eq!(extract_mcp_result_text(&result), "some result");
    }

    #[test]
    fn test_extract_mcp_result_text_fallback() {
        let result = serde_json::json!({"data": [1, 2, 3]});
        let text = extract_mcp_result_text(&result);
        assert!(text.contains("data"));
        assert!(text.contains("[1,2,3]") || text.contains("1,\n"));
    }
}
