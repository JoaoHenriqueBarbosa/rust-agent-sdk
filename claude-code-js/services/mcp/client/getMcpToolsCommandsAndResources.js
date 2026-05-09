// function: getMcpToolsCommandsAndResources
async function getMcpToolsCommandsAndResources(onConnectionAttempt, mcpConfigs) {
  let resourceToolsAdded = !1, allConfigEntries = Object.entries(mcpConfigs ?? (await getAllMcpConfigs()).servers), configEntries = [];
  for (let entry of allConfigEntries)
    if (isMcpServerDisabled(entry[0]))
      onConnectionAttempt({
        client: { name: entry[0], type: "disabled", config: entry[1] },
        tools: [],
        commands: []
      });
    else
      configEntries.push(entry);
  let totalServers = configEntries.length, stdioCount = count2(configEntries, ([_, c3]) => c3.type === "stdio"), sseCount = count2(configEntries, ([_, c3]) => c3.type === "sse"), httpCount = count2(configEntries, ([_, c3]) => c3.type === "http"), sseIdeCount = count2(configEntries, ([_, c3]) => c3.type === "sse-ide"), wsIdeCount = count2(configEntries, ([_, c3]) => c3.type === "ws-ide"), localServers = configEntries.filter(([_, config10]) => isLocalMcpServer(config10)), remoteServers = configEntries.filter(([_, config10]) => !isLocalMcpServer(config10)), serverStats = {
    totalServers,
    stdioCount,
    sseCount,
    httpCount,
    sseIdeCount,
    wsIdeCount
  }, processServer = async ([name3, config10]) => {
    try {
      if (isMcpServerDisabled(name3)) {
        onConnectionAttempt({
          client: {
            name: name3,
            type: "disabled",
            config: config10
          },
          tools: [],
          commands: []
        });
        return;
      }
      if ((config10.type === "claudeai-proxy" || config10.type === "http" || config10.type === "sse") && (await isMcpAuthCached(name3) || (config10.type === "http" || config10.type === "sse") && hasMcpDiscoveryButNoToken(name3, config10))) {
        logMCPDebug(name3, "Skipping connection (cached needs-auth)"), onConnectionAttempt({
          client: { name: name3, type: "needs-auth", config: config10 },
          tools: [createMcpAuthTool(name3, config10)],
          commands: []
        });
        return;
      }
      let client15 = await connectToServer(name3, config10, serverStats);
      if (client15.type !== "connected") {
        onConnectionAttempt({
          client: client15,
          tools: client15.type === "needs-auth" ? [createMcpAuthTool(name3, config10)] : [],
          commands: []
        });
        return;
      }
      if (config10.type === "claudeai-proxy")
        markClaudeAiMcpConnected(name3);
      let supportsResources = !!client15.capabilities?.resources, [tools, mcpCommands, resources] = await Promise.all([
        fetchToolsForClient(client15),
        fetchCommandsForClient(client15),
        supportsResources ? fetchResourcesForClient(client15) : Promise.resolve([])
      ]), commands7 = [...mcpCommands], resourceTools = [];
      if (supportsResources && !resourceToolsAdded)
        resourceToolsAdded = !0, resourceTools.push(ListMcpResourcesTool, ReadMcpResourceTool);
      onConnectionAttempt({
        client: client15,
        tools: [...tools, ...resourceTools],
        commands: commands7,
        resources: resources.length > 0 ? resources : void 0
      });
    } catch (error44) {
      logMCPError(name3, `Error fetching tools/commands/resources: ${errorMessage(error44)}`), onConnectionAttempt({
        client: { name: name3, type: "failed", config: config10 },
        tools: [],
        commands: []
      });
    }
  };
  await Promise.all([
    processBatched(localServers, getMcpServerConnectionBatchSize(), processServer),
    processBatched(remoteServers, getRemoteMcpServerConnectionBatchSize(), processServer)
  ]);
}
