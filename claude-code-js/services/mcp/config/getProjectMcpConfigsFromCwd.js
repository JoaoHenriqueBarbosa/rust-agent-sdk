// function: getProjectMcpConfigsFromCwd
function getProjectMcpConfigsFromCwd() {
  if (!isSettingSourceEnabled("projectSettings"))
    return { servers: {}, errors: [] };
  let mcpJsonPath = join51(getCwd(), ".mcp.json"), { config: config10, errors: errors8 } = parseMcpConfigFromFilePath({
    filePath: mcpJsonPath,
    expandVars: !0,
    scope: "project"
  });
  if (!config10) {
    let nonMissingErrors = errors8.filter((e) => !e.message.startsWith("MCP config file not found"));
    if (nonMissingErrors.length > 0)
      return logForDebugging(`MCP config errors for ${mcpJsonPath}: ${jsonStringify(nonMissingErrors.map((e) => e.message))}`, { level: "error" }), { servers: {}, errors: nonMissingErrors };
    return { servers: {}, errors: [] };
  }
  return {
    servers: config10.mcpServers ? addScopeToServers(config10.mcpServers, "project") : {},
    errors: errors8 || []
  };
}
