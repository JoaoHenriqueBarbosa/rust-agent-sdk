// Port of MCP tool wrapper — wraps an MCP server tool as a native SDK Tool.
// When the model calls `mcp__server__toolName`, this routes to
// tools/call on the MCP server via JSON-RPC.

use std::sync::Arc;

use async_trait::async_trait;
use serde_json::Value;

use crate::mcp::client::McpClient;
use crate::tools::framework::{Tool, ToolContext, ToolResult, ToolResultContent};

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
                // Extract content from the MCP response (text, images, resources)
                let mut tool_result = extract_mcp_result(&result);

                // Append any __table_event__ lines captured from stderr
                let stderr_events = self.client.take_stderr_events().await;
                if !stderr_events.is_empty() {
                    tool_result.content.push(
                        ToolResultContent::Text(stderr_events.join("\n"))
                    );
                }

                tool_result
            }
            Err(e) => ToolResult::error(format!("{e}")),
        }
    }
}

/// Extract content from an MCP tools/call response, handling text, image,
/// and resource content types.
///
/// Port of transformMCPResult / transformResultContent from
/// client/transformMCPResult.js:
/// - `type: "text"` → ToolResultContent::Text
/// - `type: "image"` → ToolResultContent::Image with base64 data and media_type
/// - `type: "resource"` → text (from resource.text) or blob (from resource.blob)
/// - If result has "toolResult" string: use directly as text
/// - Otherwise: serialize the whole result as text
fn extract_mcp_result(result: &Value) -> ToolResult {
    // Check for content array (most common path)
    if let Some(content) = result.get("content").and_then(|c| c.as_array()) {
        let mut parts: Vec<ToolResultContent> = Vec::new();
        for item in content {
            let item_type = item.get("type").and_then(|t| t.as_str()).unwrap_or("");
            match item_type {
                "text" => {
                    if let Some(text) = item.get("text").and_then(|t| t.as_str()) {
                        parts.push(ToolResultContent::Text(text.to_string()));
                    }
                }
                "image" => {
                    let data = item.get("data").and_then(|d| d.as_str()).unwrap_or("");
                    let media_type = item.get("mimeType").and_then(|m| m.as_str()).unwrap_or("image/png");
                    if !data.is_empty() {
                        parts.push(ToolResultContent::Image {
                            data: data.to_string(),
                            media_type: media_type.to_string(),
                        });
                    }
                }
                "resource" => {
                    if let Some(resource) = item.get("resource") {
                        if let Some(text) = resource.get("text").and_then(|t| t.as_str()) {
                            parts.push(ToolResultContent::Text(text.to_string()));
                        } else if let Some(blob) = resource.get("blob").and_then(|b| b.as_str()) {
                            let media_type = resource.get("mimeType")
                                .and_then(|m| m.as_str())
                                .unwrap_or("application/octet-stream");
                            if media_type.starts_with("image/") {
                                parts.push(ToolResultContent::Image {
                                    data: blob.to_string(),
                                    media_type: media_type.to_string(),
                                });
                            } else {
                                parts.push(ToolResultContent::Text(blob.to_string()));
                            }
                        }
                    }
                }
                _ => {
                    // Unknown content type — serialize as text fallback
                    if let Ok(s) = serde_json::to_string_pretty(item) {
                        parts.push(ToolResultContent::Text(s));
                    }
                }
            }
        }
        if !parts.is_empty() {
            return ToolResult::mixed(parts);
        }
    }

    // Check for toolResult string
    if let Some(tool_result) = result.get("toolResult").and_then(|t| t.as_str()) {
        return ToolResult::text(tool_result.to_string());
    }

    // Fallback: serialize the whole result
    let fallback = serde_json::to_string_pretty(result).unwrap_or_else(|_| result.to_string());
    ToolResult::text(fallback)
}

/// Legacy text-only extraction — kept for backward compatibility in tests.
#[allow(dead_code)]
fn extract_mcp_result_text(result: &Value) -> String {
    let tool_result = extract_mcp_result(result);
    tool_result.content.iter().filter_map(|c| {
        match c {
            ToolResultContent::Text(t) => Some(t.as_str()),
            _ => None,
        }
    }).collect::<Vec<_>>().join("\n")
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
