// function: hasAccessToIDEExtensionDiffFeature
function hasAccessToIDEExtensionDiffFeature(mcpClients) {
  return mcpClients.some((client15) => client15.type === "connected" && client15.name === "ide");
}
