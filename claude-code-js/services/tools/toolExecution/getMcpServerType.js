// function: getMcpServerType
function getMcpServerType(toolName, mcpClients) {
  let serverConnection = findMcpServerConnection(toolName, mcpClients);
  if (serverConnection?.type === "connected")
    return serverConnection.config.type ?? "stdio";
  return;
}
