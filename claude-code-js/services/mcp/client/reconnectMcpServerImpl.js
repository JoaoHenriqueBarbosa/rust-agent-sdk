// function: reconnectMcpServerImpl
async function reconnectMcpServerImpl(name3, config10) {
  try {
    clearKeychainCache(), await clearServerCache(name3, config10);
    let client15 = await connectToServer(name3, config10);
    if (client15.type !== "connected")
      return {
        client: client15,
        tools: [],
        commands: []
      };
    if (config10.type === "claudeai-proxy")
      markClaudeAiMcpConnected(name3);
    let supportsResources = !!client15.capabilities?.resources, [tools, mcpCommands, resources] = await Promise.all([
      fetchToolsForClient(client15),
      fetchCommandsForClient(client15),
      supportsResources ? fetchResourcesForClient(client15) : Promise.resolve([])
    ]), commands7 = [...mcpCommands], resourceTools = [];
    if (supportsResources) {
      if (![ListMcpResourcesTool, ReadMcpResourceTool].some((tool) => tools.some((t2) => toolMatchesName(t2, tool.name))))
        resourceTools.push(ListMcpResourcesTool, ReadMcpResourceTool);
    }
    return {
      client: client15,
      tools: [...tools, ...resourceTools],
      commands: commands7,
      resources: resources.length > 0 ? resources : void 0
    };
  } catch (error44) {
    return logMCPError(name3, `Error during reconnection: ${errorMessage(error44)}`), {
      client: { name: name3, type: "failed", config: config10 },
      tools: [],
      commands: []
    };
  }
}
