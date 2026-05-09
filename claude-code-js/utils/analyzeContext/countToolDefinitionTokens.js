// function: countToolDefinitionTokens
async function countToolDefinitionTokens(tools, getToolPermissionContext, agentInfo, model) {
  let toolSchemas = await Promise.all(tools.map((tool) => toolToAPISchema(tool, {
    getToolPermissionContext,
    tools,
    agents: agentInfo?.activeAgents ?? [],
    model
  }))), result = await countTokensWithFallback([], toolSchemas);
  if (result === null || result === 0) {
    let toolNames = tools.map((t2) => t2.name).join(", ");
    logForDebugging(`countToolDefinitionTokens returned ${result} for ${tools.length} tools: ${toolNames.slice(0, 100)}${toolNames.length > 100 ? "..." : ""}`);
  }
  return result ?? 0;
}
