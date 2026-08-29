// function: getConnectedIdeName
function getConnectedIdeName(mcpClients) {
  let ideClient = mcpClients.find((client15) => client15.type === "connected" && client15.name === "ide");
  return getIdeClientName(ideClient);
}
