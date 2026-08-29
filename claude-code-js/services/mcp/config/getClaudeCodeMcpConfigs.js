// function: getClaudeCodeMcpConfigs
async function getClaudeCodeMcpConfigs(dynamicServers = {}, extraDedupTargets = Promise.resolve({})) {
  let { servers: enterpriseServers } = getMcpConfigsByScope("enterprise");
  if (doesEnterpriseMcpConfigExist()) {
    let filtered2 = {};
    for (let [name3, serverConfig] of Object.entries(enterpriseServers)) {
      if (!isMcpServerAllowedByPolicy(name3, serverConfig))
        continue;
      filtered2[name3] = serverConfig;
    }
    return { servers: filtered2, errors: [] };
  }
  let mcpLocked = isRestrictedToPluginOnly("mcp"), noServers = {
    servers: {}
  }, { servers: userServers } = mcpLocked ? noServers : getMcpConfigsByScope("user"), { servers: projectServers } = mcpLocked ? noServers : getMcpConfigsByScope("project"), { servers: localServers } = mcpLocked ? noServers : getMcpConfigsByScope("local"), pluginMcpServers = {}, pluginResult = await loadAllPluginsCacheOnly(), mcpErrors = [];
  if (pluginResult.errors.length > 0)
    for (let error44 of pluginResult.errors)
      if (error44.type === "mcp-config-invalid" || error44.type === "mcpb-download-failed" || error44.type === "mcpb-extract-failed" || error44.type === "mcpb-invalid-manifest") {
        let errorMessage2 = `Plugin MCP loading error - ${error44.type}: ${getPluginErrorMessage(error44)}`;
        logError2(Error(errorMessage2));
      } else {
        let errorType = error44.type;
        logForDebugging(`Plugin not available for MCP: ${error44.source} - error type: ${errorType}`);
      }
  let pluginServerResults = await Promise.all(pluginResult.enabled.map((plugin) => getPluginMcpServers(plugin, mcpErrors)));
  for (let servers of pluginServerResults)
    if (servers)
      Object.assign(pluginMcpServers, servers);
  if (mcpErrors.length > 0)
    for (let error44 of mcpErrors) {
      let errorMessage2 = `Plugin MCP server error - ${error44.type}: ${getPluginErrorMessage(error44)}`;
      logError2(Error(errorMessage2));
    }
  let approvedProjectServers = {};
  for (let [name3, config10] of Object.entries(projectServers))
    if (getProjectMcpServerStatus(name3) === "approved")
      approvedProjectServers[name3] = config10;
  let extraTargets = await extraDedupTargets, enabledManualServers = {};
  for (let [name3, config10] of Object.entries({
    ...userServers,
    ...approvedProjectServers,
    ...localServers,
    ...dynamicServers,
    ...extraTargets
  }))
    if (!isMcpServerDisabled(name3) && isMcpServerAllowedByPolicy(name3, config10))
      enabledManualServers[name3] = config10;
  let enabledPluginServers = {}, disabledPluginServers = {};
  for (let [name3, config10] of Object.entries(pluginMcpServers))
    if (isMcpServerDisabled(name3) || !isMcpServerAllowedByPolicy(name3, config10))
      disabledPluginServers[name3] = config10;
    else
      enabledPluginServers[name3] = config10;
  let { servers: dedupedPluginServers, suppressed } = dedupPluginMcpServers(enabledPluginServers, enabledManualServers);
  Object.assign(dedupedPluginServers, disabledPluginServers);
  for (let { name: name3, duplicateOf } of suppressed) {
    let parts = name3.split(":");
    if (parts[0] !== "plugin" || parts.length < 3)
      continue;
    mcpErrors.push({
      type: "mcp-server-suppressed-duplicate",
      source: name3,
      plugin: parts[1],
      serverName: parts.slice(2).join(":"),
      duplicateOf
    });
  }
  let configs = Object.assign({}, dedupedPluginServers, userServers, approvedProjectServers, localServers), filtered = {};
  for (let [name3, serverConfig] of Object.entries(configs)) {
    if (!isMcpServerAllowedByPolicy(name3, serverConfig))
      continue;
    filtered[name3] = serverConfig;
  }
  return { servers: filtered, errors: mcpErrors };
}
