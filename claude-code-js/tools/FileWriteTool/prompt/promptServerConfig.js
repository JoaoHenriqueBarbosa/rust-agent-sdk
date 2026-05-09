// function: promptServerConfig
async function promptServerConfig(packageData) {
  let serverType = await esm_default5({
    message: "Server type:",
    choices: [
      { name: "Node.js", value: "node" },
      { name: "Python", value: "python" },
      { name: "Binary", value: "binary" }
    ],
    default: "node"
  }), entryPoint = await esm_default4({
    message: "Entry point:",
    default: getDefaultEntryPoint(serverType, packageData)
  }), mcp_config = createMcpConfig(serverType, entryPoint);
  return { serverType, entryPoint, mcp_config };
}
