// function: addMcpConfig
async function addMcpConfig(name3, config10, scope) {
  if (name3.match(/[^a-zA-Z0-9_-]/))
    throw Error(`Invalid name ${name3}. Names can only contain letters, numbers, hyphens, and underscores.`);
  if (isClaudeInChromeMCPServer(name3))
    throw Error(`Cannot add MCP server "${name3}": this name is reserved.`);
  if (doesEnterpriseMcpConfigExist())
    throw Error("Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers");
  let result = McpServerConfigSchema().safeParse(config10);
  if (!result.success) {
    let formattedErrors = result.error.issues.map((err2) => `${err2.path.join(".")}: ${err2.message}`).join(", ");
    throw Error(`Invalid configuration: ${formattedErrors}`);
  }
  let validatedConfig = result.data;
  if (isMcpServerDenied(name3, validatedConfig))
    throw Error(`Cannot add MCP server "${name3}": server is explicitly blocked by enterprise policy`);
  if (!isMcpServerAllowedByPolicy(name3, validatedConfig))
    throw Error(`Cannot add MCP server "${name3}": not allowed by enterprise policy`);
  switch (scope) {
    case "project": {
      let { servers } = getProjectMcpConfigsFromCwd();
      if (servers[name3])
        throw Error(`MCP server ${name3} already exists in .mcp.json`);
      break;
    }
    case "user": {
      if (getGlobalConfig().mcpServers?.[name3])
        throw Error(`MCP server ${name3} already exists in user config`);
      break;
    }
    case "local": {
      if (getCurrentProjectConfig().mcpServers?.[name3])
        throw Error(`MCP server ${name3} already exists in local config`);
      break;
    }
    case "dynamic":
      throw Error("Cannot add MCP server to scope: dynamic");
    case "enterprise":
      throw Error("Cannot add MCP server to scope: enterprise");
    case "claudeai":
      throw Error("Cannot add MCP server to scope: claudeai");
  }
  switch (scope) {
    case "project": {
      let { servers: existingServers } = getProjectMcpConfigsFromCwd(), mcpServers = {};
      for (let [serverName, serverConfig] of Object.entries(existingServers)) {
        let { scope: _, ...configWithoutScope } = serverConfig;
        mcpServers[serverName] = configWithoutScope;
      }
      mcpServers[name3] = validatedConfig;
      let mcpConfig = { mcpServers };
      try {
        await writeMcpjsonFile(mcpConfig);
      } catch (error44) {
        throw Error(`Failed to write to .mcp.json: ${error44}`);
      }
      break;
    }
    case "user": {
      saveGlobalConfig((current) => ({
        ...current,
        mcpServers: {
          ...current.mcpServers,
          [name3]: validatedConfig
        }
      }));
      break;
    }
    case "local": {
      saveCurrentProjectConfig((current) => ({
        ...current,
        mcpServers: {
          ...current.mcpServers,
          [name3]: validatedConfig
        }
      }));
      break;
    }
    default:
      throw Error(`Cannot add MCP server to scope: ${scope}`);
  }
}
