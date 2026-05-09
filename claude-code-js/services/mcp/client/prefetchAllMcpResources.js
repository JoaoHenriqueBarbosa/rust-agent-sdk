// function: prefetchAllMcpResources
function prefetchAllMcpResources(mcpConfigs) {
  return new Promise((resolve25) => {
    let pendingCount = 0, completedCount = 0;
    if (pendingCount = Object.keys(mcpConfigs).length, pendingCount === 0) {
      resolve25({
        clients: [],
        tools: [],
        commands: []
      });
      return;
    }
    let clients = [], tools = [], commands7 = [];
    getMcpToolsCommandsAndResources((result) => {
      if (clients.push(result.client), tools.push(...result.tools), commands7.push(...result.commands), completedCount++, completedCount >= pendingCount) {
        let commandsMetadataLength = commands7.reduce((sum, command12) => {
          let commandMetadataLength = command12.name.length + (command12.description ?? "").length + (command12.argumentHint ?? "").length;
          return sum + commandMetadataLength;
        }, 0);
        logEvent("tengu_mcp_tools_commands_loaded", {
          tools_count: tools.length,
          commands_count: commands7.length,
          commands_metadata_length: commandsMetadataLength
        }), resolve25({
          clients,
          tools,
          commands: commands7
        });
      }
    }, mcpConfigs).catch((error44) => {
      logMCPError("prefetchAllMcpResources", `Failed to get MCP resources: ${errorMessage(error44)}`), resolve25({
        clients: [],
        tools: [],
        commands: []
      });
    });
  });
}
