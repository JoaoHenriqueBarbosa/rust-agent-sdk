// function: removeMcpConfig
async function removeMcpConfig(name3, scope) {
  switch (scope) {
    case "project": {
      let { servers: existingServers } = getProjectMcpConfigsFromCwd();
      if (!existingServers[name3])
        throw Error(`No MCP server found with name: ${name3} in .mcp.json`);
      let mcpServers = {};
      for (let [serverName, serverConfig] of Object.entries(existingServers))
        if (serverName !== name3) {
          let { scope: _, ...configWithoutScope } = serverConfig;
          mcpServers[serverName] = configWithoutScope;
        }
      let mcpConfig = { mcpServers };
      try {
        await writeMcpjsonFile(mcpConfig);
      } catch (error44) {
        throw Error(`Failed to remove from .mcp.json: ${error44}`);
      }
      break;
    }
    case "user": {
      if (!getGlobalConfig().mcpServers?.[name3])
        throw Error(`No user-scoped MCP server found with name: ${name3}`);
      saveGlobalConfig((current) => {
        let { [name3]: _, ...restMcpServers } = current.mcpServers ?? {};
        return {
          ...current,
          mcpServers: restMcpServers
        };
      });
      break;
    }
    case "local": {
      if (!getCurrentProjectConfig().mcpServers?.[name3])
        throw Error(`No project-local MCP server found with name: ${name3}`);
      saveCurrentProjectConfig((current) => {
        let { [name3]: _, ...restMcpServers } = current.mcpServers ?? {};
        return {
          ...current,
          mcpServers: restMcpServers
        };
      });
      break;
    }
    default:
      throw Error(`Cannot remove MCP server from scope: ${scope}`);
  }
}
