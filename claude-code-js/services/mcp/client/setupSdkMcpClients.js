// function: setupSdkMcpClients
async function setupSdkMcpClients(sdkMcpConfigs, sendMcpMessage) {
  let clients = [], tools = [], results = await Promise.allSettled(Object.entries(sdkMcpConfigs).map(async ([name3, config10]) => {
    let transport = new SdkControlClientTransport(name3, sendMcpMessage), client15 = new Client5({
      name: "claude-code",
      title: "Claude Code",
      version: "2.1.90",
      description: "Anthropic's agentic coding tool",
      websiteUrl: PRODUCT_URL
    }, {
      capabilities: {}
    });
    try {
      await client15.connect(transport);
      let capabilities = client15.getServerCapabilities(), connectedClient = {
        type: "connected",
        name: name3,
        capabilities: capabilities || {},
        client: client15,
        config: { ...config10, scope: "dynamic" },
        cleanup: async () => {
          await client15.close();
        }
      }, serverTools = [];
      if (capabilities?.tools) {
        let sdkTools = await fetchToolsForClient(connectedClient);
        serverTools.push(...sdkTools);
      }
      return {
        client: connectedClient,
        tools: serverTools
      };
    } catch (error44) {
      return logMCPError(name3, `Failed to connect SDK MCP server: ${error44}`), {
        client: {
          type: "failed",
          name: name3,
          config: { ...config10, scope: "user" }
        },
        tools: []
      };
    }
  }));
  for (let result of results)
    if (result.status === "fulfilled")
      clients.push(result.value.client), tools.push(...result.value.tools);
  return { clients, tools };
}
