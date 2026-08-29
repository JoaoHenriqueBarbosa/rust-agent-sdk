// function: getMcpInstructionsDeltaAttachment
function getMcpInstructionsDeltaAttachment(mcpClients, tools, model, messages) {
  if (!isMcpInstructionsDeltaEnabled())
    return [];
  let clientSide = [];
  if (isToolSearchEnabledOptimistic() && modelSupportsToolReference(model) && isToolSearchToolAvailable(tools))
    clientSide.push({
      serverName: CLAUDE_IN_CHROME_MCP_SERVER_NAME,
      block: CHROME_TOOL_SEARCH_INSTRUCTIONS
    });
  let delta = getMcpInstructionsDelta(mcpClients, messages ?? [], clientSide);
  if (!delta)
    return [];
  return [{ type: "mcp_instructions_delta", ...delta }];
}
