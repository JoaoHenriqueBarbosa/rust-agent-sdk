// function: getMcpServerBaseUrlFromToolName
function getMcpServerBaseUrlFromToolName(toolName, mcpClients) {
  let serverConnection = findMcpServerConnection(toolName, mcpClients);
  if (serverConnection?.type !== "connected")
    return;
  return getLoggingSafeMcpBaseUrl(serverConnection.config);
}
