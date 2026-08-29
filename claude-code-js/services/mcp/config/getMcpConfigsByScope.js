// function: getMcpConfigsByScope
function getMcpConfigsByScope(scope) {
  let sourceMap = {
    project: "projectSettings",
    user: "userSettings",
    local: "localSettings"
  };
  if (scope in sourceMap && !isSettingSourceEnabled(sourceMap[scope]))
    return { servers: {}, errors: [] };
  switch (scope) {
    case "project": {
      let allServers = {}, allErrors = [], dirs = [], currentDir = getCwd();
      while (currentDir !== parse12(currentDir).root)
        dirs.push(currentDir), currentDir = dirname28(currentDir);
      for (let dir of dirs.reverse()) {
        let mcpJsonPath = join51(dir, ".mcp.json"), { config: config10, errors: errors8 } = parseMcpConfigFromFilePath({
          filePath: mcpJsonPath,
          expandVars: !0,
          scope: "project"
        });
        if (!config10) {
          let nonMissingErrors = errors8.filter((e) => !e.message.startsWith("MCP config file not found"));
          if (nonMissingErrors.length > 0)
            logForDebugging(`MCP config errors for ${mcpJsonPath}: ${jsonStringify(nonMissingErrors.map((e) => e.message))}`, { level: "error" }), allErrors.push(...nonMissingErrors);
          continue;
        }
        if (config10.mcpServers)
          Object.assign(allServers, addScopeToServers(config10.mcpServers, scope));
        if (errors8.length > 0)
          allErrors.push(...errors8);
      }
      return {
        servers: allServers,
        errors: allErrors
      };
    }
    case "user": {
      let mcpServers = getGlobalConfig().mcpServers;
      if (!mcpServers)
        return { servers: {}, errors: [] };
      let { config: config10, errors: errors8 } = parseMcpConfig({
        configObject: { mcpServers },
        expandVars: !0,
        scope: "user"
      });
      return {
        servers: addScopeToServers(config10?.mcpServers, scope),
        errors: errors8
      };
    }
    case "local": {
      let mcpServers = getCurrentProjectConfig().mcpServers;
      if (!mcpServers)
        return { servers: {}, errors: [] };
      let { config: config10, errors: errors8 } = parseMcpConfig({
        configObject: { mcpServers },
        expandVars: !0,
        scope: "local"
      });
      return {
        servers: addScopeToServers(config10?.mcpServers, scope),
        errors: errors8
      };
    }
    case "enterprise": {
      let enterpriseMcpPath = getEnterpriseMcpFilePath(), { config: config10, errors: errors8 } = parseMcpConfigFromFilePath({
        filePath: enterpriseMcpPath,
        expandVars: !0,
        scope: "enterprise"
      });
      if (!config10) {
        let nonMissingErrors = errors8.filter((e) => !e.message.startsWith("MCP config file not found"));
        if (nonMissingErrors.length > 0)
          return logForDebugging(`Enterprise MCP config errors for ${enterpriseMcpPath}: ${jsonStringify(nonMissingErrors.map((e) => e.message))}`, { level: "error" }), { servers: {}, errors: nonMissingErrors };
        return { servers: {}, errors: [] };
      }
      return {
        servers: addScopeToServers(config10.mcpServers, scope),
        errors: errors8
      };
    }
  }
}
