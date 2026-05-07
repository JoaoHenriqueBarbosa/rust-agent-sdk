// Port of MCP client — connects to MCP servers, discovers tools, calls them.
// Based on claude-code-js/services/mcp/client/ (setupSdkMcpClients, callMCPTool,
// getMcpToolsCommandsAndResources, ensureConnectedClient).

use std::collections::HashMap;
use std::sync::Arc;

use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::errors::{ClaudeSDKError, Result};
use crate::mcp::tool::McpTool;
use crate::mcp::transport::StdioTransport;
use crate::tools::framework::Tool;

// ---------------------------------------------------------------------------
// Config types — matches TS McpServerConfig for stdio
// ---------------------------------------------------------------------------

/// Configuration for an MCP server connection (stdio transport only for now).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpServerConfig {
    pub command: String,
    #[serde(default)]
    pub args: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub env: Option<HashMap<String, String>>,
}

// ---------------------------------------------------------------------------
// Tool definition from tools/list
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Deserialize)]
pub struct McpToolDefinition {
    pub name: String,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(rename = "inputSchema", default)]
    pub input_schema: Value,
}

// ---------------------------------------------------------------------------
// MCP Client
// ---------------------------------------------------------------------------

/// Client for a single MCP server connection.
/// Manages the stdio transport, initialization handshake, and tool discovery.
pub struct McpClient {
    pub server_name: String,
    transport: Arc<StdioTransport>,
    pub tools: Vec<McpToolDefinition>,
}

impl McpClient {
    /// Connect to an MCP server via stdio transport, perform the initialize
    /// handshake, and discover available tools.
    ///
    /// Port of: setupSdkMcpClients + getMcpToolsCommandsAndResources flow.
    pub async fn connect(
        server_name: impl Into<String>,
        config: &McpServerConfig,
    ) -> Result<Self> {
        let server_name = server_name.into();

        let transport = StdioTransport::spawn(
            &config.command,
            &config.args,
            config.env.as_ref(),
        )
        .await?;

        // Port: client.connect(transport) → initialize handshake
        let init_result = transport
            .request(
                "initialize",
                Some(serde_json::json!({
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "clientInfo": {
                        "name": "rust-agent-sdk",
                        "version": "0.1.0"
                    }
                })),
            )
            .await?;

        // Send initialized notification
        transport.notify("notifications/initialized", None).await?;

        // Check if server has tool capabilities
        let has_tools = init_result
            .get("capabilities")
            .and_then(|c| c.get("tools"))
            .is_some();

        let mut tools = Vec::new();

        if has_tools {
            // Port: fetchToolsForClient → tools/list
            let tools_result = transport.request("tools/list", None).await?;

            if let Some(tool_list) = tools_result.get("tools").and_then(|t| t.as_array()) {
                for tool_val in tool_list {
                    if let Ok(tool_def) = serde_json::from_value::<McpToolDefinition>(tool_val.clone()) {
                        tools.push(tool_def);
                    }
                }
            }
        }

        Ok(Self {
            server_name,
            transport: Arc::new(transport),
            tools,
        })
    }

    /// Call a tool on this MCP server.
    ///
    /// Port of: callMCPTool from client/callMCPTool.js
    pub async fn call_tool(&self, tool_name: &str, arguments: Value) -> Result<Value> {
        let result = self
            .transport
            .request(
                "tools/call",
                Some(serde_json::json!({
                    "name": tool_name,
                    "arguments": arguments,
                })),
            )
            .await?;

        // Port: check for isError in result
        if result.get("isError").and_then(|v| v.as_bool()).unwrap_or(false) {
            let error_text = result
                .get("content")
                .and_then(|c| c.as_array())
                .and_then(|arr| arr.first())
                .and_then(|item| item.get("text"))
                .and_then(|t| t.as_str())
                .unwrap_or("Unknown MCP tool error");

            return Err(ClaudeSDKError::sdk(format!(
                "MCP tool '{tool_name}' error: {error_text}"
            )));
        }

        Ok(result)
    }

    /// Convert discovered MCP tools into `Arc<dyn Tool>` instances that can be
    /// registered in the SDK's ToolRegistry.
    ///
    /// Tool names are prefixed as `mcp__{server}__{tool}` to match the TS
    /// naming convention (getMcpPrefix from services/mcp/mcpStringUtils.js).
    pub fn into_sdk_tools(self: Arc<Self>) -> Vec<Arc<dyn Tool>> {
        let mut sdk_tools: Vec<Arc<dyn Tool>> = Vec::new();

        for tool_def in &self.tools {
            let mcp_tool = McpTool::new(
                self.server_name.clone(),
                tool_def.name.clone(),
                tool_def.description.clone().unwrap_or_default(),
                tool_def.input_schema.clone(),
                self.clone(),
            );
            sdk_tools.push(Arc::new(mcp_tool));
        }

        sdk_tools
    }
}

// ---------------------------------------------------------------------------
// Multi-server connection helper
// ---------------------------------------------------------------------------

/// Connect to multiple MCP servers and return all tools as `Arc<dyn Tool>`.
///
/// Port of: getMcpToolsCommandsAndResources + setup flow.
pub async fn connect_mcp_servers(
    configs: &HashMap<String, McpServerConfig>,
) -> Result<(Vec<Arc<McpClient>>, Vec<Arc<dyn Tool>>)> {
    let mut clients = Vec::new();
    let mut all_tools: Vec<Arc<dyn Tool>> = Vec::new();

    for (name, config) in configs {
        match McpClient::connect(name.clone(), config).await {
            Ok(client) => {
                let client = Arc::new(client);
                let tools = client.clone().into_sdk_tools();
                all_tools.extend(tools);
                clients.push(client);
            }
            Err(e) => {
                eprintln!("Warning: Failed to connect MCP server '{name}': {e}");
            }
        }
    }

    Ok((clients, all_tools))
}
