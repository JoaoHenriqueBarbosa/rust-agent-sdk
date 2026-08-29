// function: getDefaultServerConfig
function getDefaultServerConfig(packageData) {
  let entryPoint = getDefaultEntryPoint("node", packageData), mcp_config = createMcpConfig("node", entryPoint);
  return { serverType: "node", entryPoint, mcp_config };
}
