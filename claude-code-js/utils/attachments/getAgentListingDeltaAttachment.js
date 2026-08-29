// function: getAgentListingDeltaAttachment
function getAgentListingDeltaAttachment(toolUseContext, messages) {
  if (!shouldInjectAgentListInMessages())
    return [];
  if (!toolUseContext.options.tools.some((t2) => toolMatchesName(t2, AGENT_TOOL_NAME)))
    return [];
  let { activeAgents, allowedAgentTypes } = toolUseContext.options.agentDefinitions, mcpServers = /* @__PURE__ */ new Set;
  for (let tool of toolUseContext.options.tools) {
    let info = mcpInfoFromString(tool.name);
    if (info)
      mcpServers.add(info.serverName);
  }
  let permissionContext = toolUseContext.getAppState().toolPermissionContext, filtered = filterDeniedAgents(filterAgentsByMcpRequirements(activeAgents, [...mcpServers]), permissionContext, AGENT_TOOL_NAME);
  if (allowedAgentTypes)
    filtered = filtered.filter((a2) => allowedAgentTypes.includes(a2.agentType));
  let announced = /* @__PURE__ */ new Set;
  for (let msg of messages ?? []) {
    if (msg.type !== "attachment")
      continue;
    if (msg.attachment.type !== "agent_listing_delta")
      continue;
    for (let t2 of msg.attachment.addedTypes)
      announced.add(t2);
    for (let t2 of msg.attachment.removedTypes)
      announced.delete(t2);
  }
  let currentTypes = new Set(filtered.map((a2) => a2.agentType)), added = filtered.filter((a2) => !announced.has(a2.agentType)), removed = [];
  for (let t2 of announced)
    if (!currentTypes.has(t2))
      removed.push(t2);
  if (added.length === 0 && removed.length === 0)
    return [];
  return added.sort((a2, b) => a2.agentType.localeCompare(b.agentType)), removed.sort(), [
    {
      type: "agent_listing_delta",
      addedTypes: added.map((a2) => a2.agentType),
      addedLines: added.map(formatAgentLine),
      removedTypes: removed,
      isInitial: announced.size === 0,
      showConcurrencyNote: getSubscriptionType() !== "pro"
    }
  ];
}
