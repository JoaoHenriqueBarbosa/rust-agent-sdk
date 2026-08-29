// function: ensureConnectedClient
async function ensureConnectedClient(client15) {
  if (client15.config.type === "sdk")
    return client15;
  let connectedClient = await connectToServer(client15.name, client15.config);
  if (connectedClient.type !== "connected")
    throw new TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(`MCP server "${client15.name}" is not connected`, "MCP server not connected");
  return connectedClient;
}
