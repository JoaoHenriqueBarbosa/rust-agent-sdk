// function: processMcpResourceAttachments
async function processMcpResourceAttachments(input, toolUseContext) {
  let resourceMentions = extractMcpResourceMentions(input);
  if (resourceMentions.length === 0)
    return [];
  let mcpClients = toolUseContext.options.mcpClients || [];
  return (await Promise.all(resourceMentions.map(async (mention) => {
    try {
      let [serverName, ...uriParts] = mention.split(":"), uri7 = uriParts.join(":");
      if (!serverName || !uri7)
        return logEvent("tengu_at_mention_mcp_resource_error", {}), null;
      let client15 = mcpClients.find((c3) => c3.name === serverName);
      if (!client15 || client15.type !== "connected")
        return logEvent("tengu_at_mention_mcp_resource_error", {}), null;
      let resourceInfo = (toolUseContext.options.mcpResources?.[serverName] || []).find((r4) => r4.uri === uri7);
      if (!resourceInfo)
        return logEvent("tengu_at_mention_mcp_resource_error", {}), null;
      try {
        let result = await client15.client.readResource({
          uri: uri7
        });
        return logEvent("tengu_at_mention_mcp_resource_success", {}), {
          type: "mcp_resource",
          server: serverName,
          uri: uri7,
          name: resourceInfo.name || uri7,
          description: resourceInfo.description,
          content: result
        };
      } catch (error44) {
        return logEvent("tengu_at_mention_mcp_resource_error", {}), logError2(error44), null;
      }
    } catch {
      return logEvent("tengu_at_mention_mcp_resource_error", {}), null;
    }
  }))).filter((result) => result !== null);
}
