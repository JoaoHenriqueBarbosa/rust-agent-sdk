// function: findMcpServerConnection
function findMcpServerConnection(toolName, mcpClients) {
  if (!toolName.startsWith("mcp__"))
    return;
  let mcpInfo = mcpInfoFromString(toolName);
  if (!mcpInfo)
    return;
  return mcpClients.find((client15) => normalizeNameForMCP(client15.name) === mcpInfo.serverName);
}
