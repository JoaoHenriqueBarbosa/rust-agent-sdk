// function: getConnectedIdeClient
function getConnectedIdeClient(mcpClients) {
  if (!mcpClients)
    return;
  let ideClient = mcpClients.find((client15) => client15.type === "connected" && client15.name === "ide");
  return ideClient?.type === "connected" ? ideClient : void 0;
}
