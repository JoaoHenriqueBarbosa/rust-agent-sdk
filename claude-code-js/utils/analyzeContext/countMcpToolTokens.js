// function: countMcpToolTokens
async function countMcpToolTokens(tools, getToolPermissionContext, agentInfo, model, messages) {
  let mcpTools = tools.filter((tool) => tool.isMcp), mcpToolDetails = [], totalTokensRaw = await countToolDefinitionTokens(mcpTools, getToolPermissionContext, agentInfo, model), totalTokens = Math.max(0, (totalTokensRaw || 0) - TOOL_TOKEN_COUNT_OVERHEAD), estimates = await Promise.all(mcpTools.map(async (t2) => roughTokenCountEstimation(jsonStringify({
    name: t2.name,
    description: await t2.prompt({
      getToolPermissionContext,
      tools,
      agents: agentInfo?.activeAgents ?? []
    }),
    input_schema: t2.inputJSONSchema ?? {}
  })))), estimateTotal = estimates.reduce((s2, e) => s2 + e, 0) || 1, mcpToolTokensByTool = estimates.map((e) => Math.round(e / estimateTotal * totalTokens)), { isToolSearchEnabled: isToolSearchEnabled2 } = await Promise.resolve().then(() => (init_toolSearch(), exports_toolSearch)), { isDeferredTool: isDeferredTool2 } = await Promise.resolve().then(() => (init_prompt8(), exports_prompt3)), isDeferred = await isToolSearchEnabled2(model, tools, getToolPermissionContext, agentInfo?.activeAgents ?? [], "analyzeMcp"), loadedMcpToolNames = /* @__PURE__ */ new Set;
  if (isDeferred && messages) {
    let mcpToolNameSet = new Set(mcpTools.map((t2) => t2.name));
    for (let msg of messages)
      if (msg.type === "assistant") {
        for (let block2 of msg.message.content)
          if ("type" in block2 && block2.type === "tool_use" && "name" in block2 && typeof block2.name === "string" && mcpToolNameSet.has(block2.name))
            loadedMcpToolNames.add(block2.name);
      }
  }
  for (let [i5, tool] of mcpTools.entries())
    mcpToolDetails.push({
      name: tool.name,
      serverName: tool.name.split("__")[1] || "unknown",
      tokens: mcpToolTokensByTool[i5],
      isLoaded: loadedMcpToolNames.has(tool.name) || !isDeferredTool2(tool)
    });
  let loadedTokens = 0, deferredTokens = 0;
  for (let detail of mcpToolDetails)
    if (detail.isLoaded)
      loadedTokens += detail.tokens;
    else if (isDeferred)
      deferredTokens += detail.tokens;
  return {
    mcpToolTokens: isDeferred ? loadedTokens : totalTokens,
    mcpToolDetails,
    deferredToolTokens: deferredTokens,
    loadedMcpToolNames
  };
}
