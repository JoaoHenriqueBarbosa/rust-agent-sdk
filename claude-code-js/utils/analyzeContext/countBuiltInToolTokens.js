// function: countBuiltInToolTokens
async function countBuiltInToolTokens(tools, getToolPermissionContext, agentInfo, model, messages) {
  let builtInTools = tools.filter((tool) => !tool.isMcp);
  if (builtInTools.length < 1)
    return {
      builtInToolTokens: 0,
      deferredBuiltinDetails: [],
      deferredBuiltinTokens: 0,
      systemToolDetails: []
    };
  let { isToolSearchEnabled: isToolSearchEnabled2 } = await Promise.resolve().then(() => (init_toolSearch(), exports_toolSearch)), { isDeferredTool: isDeferredTool2 } = await Promise.resolve().then(() => (init_prompt8(), exports_prompt3)), isDeferred = await isToolSearchEnabled2(model ?? "", tools, getToolPermissionContext, agentInfo?.activeAgents ?? [], "analyzeBuiltIn"), alwaysLoadedTools = builtInTools.filter((t2) => !isDeferredTool2(t2)), deferredBuiltinTools = builtInTools.filter((t2) => isDeferredTool2(t2)), alwaysLoadedTokens = alwaysLoadedTools.length > 0 ? await countToolDefinitionTokens(alwaysLoadedTools, getToolPermissionContext, agentInfo, model) : 0, systemToolDetails = [], deferredBuiltinDetails = [], loadedDeferredTokens = 0, totalDeferredTokens = 0;
  if (deferredBuiltinTools.length > 0 && isDeferred) {
    let loadedToolNames = /* @__PURE__ */ new Set;
    if (messages) {
      let deferredToolNameSet = new Set(deferredBuiltinTools.map((t2) => t2.name));
      for (let msg of messages)
        if (msg.type === "assistant") {
          for (let block2 of msg.message.content)
            if ("type" in block2 && block2.type === "tool_use" && "name" in block2 && typeof block2.name === "string" && deferredToolNameSet.has(block2.name))
              loadedToolNames.add(block2.name);
        }
    }
    let tokensByTool = await Promise.all(deferredBuiltinTools.map((t2) => countToolDefinitionTokens([t2], getToolPermissionContext, agentInfo, model)));
    for (let [i5, tool] of deferredBuiltinTools.entries()) {
      let tokens = Math.max(0, (tokensByTool[i5] || 0) - TOOL_TOKEN_COUNT_OVERHEAD), isLoaded = loadedToolNames.has(tool.name);
      if (deferredBuiltinDetails.push({
        name: tool.name,
        tokens,
        isLoaded
      }), totalDeferredTokens += tokens, isLoaded)
        loadedDeferredTokens += tokens;
    }
  } else if (deferredBuiltinTools.length > 0) {
    let deferredTokens = await countToolDefinitionTokens(deferredBuiltinTools, getToolPermissionContext, agentInfo, model);
    return {
      builtInToolTokens: alwaysLoadedTokens + deferredTokens,
      deferredBuiltinDetails: [],
      deferredBuiltinTokens: 0,
      systemToolDetails
    };
  }
  return {
    builtInToolTokens: alwaysLoadedTokens + loadedDeferredTokens,
    deferredBuiltinDetails,
    deferredBuiltinTokens: totalDeferredTokens - loadedDeferredTokens,
    systemToolDetails
  };
}
