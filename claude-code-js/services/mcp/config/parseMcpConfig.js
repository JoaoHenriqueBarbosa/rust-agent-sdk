// function: parseMcpConfig
function parseMcpConfig(params) {
  let { configObject, expandVars, scope, filePath } = params, schemaResult = McpJsonConfigSchema().safeParse(configObject);
  if (!schemaResult.success)
    return {
      config: null,
      errors: schemaResult.error.issues.map((issue2) => ({
        ...filePath && { file: filePath },
        path: issue2.path.join("."),
        message: "Does not adhere to MCP server configuration schema",
        mcpErrorMetadata: {
          scope,
          severity: "fatal"
        }
      }))
    };
  let errors8 = [], validatedServers = {};
  for (let [name3, config10] of Object.entries(schemaResult.data.mcpServers)) {
    let configToCheck = config10;
    if (expandVars) {
      let { expanded, missingVars } = expandEnvVars(config10);
      if (missingVars.length > 0)
        errors8.push({
          ...filePath && { file: filePath },
          path: `mcpServers.${name3}`,
          message: `Missing environment variables: ${missingVars.join(", ")}`,
          suggestion: `Set the following environment variables: ${missingVars.join(", ")}`,
          mcpErrorMetadata: {
            scope,
            serverName: name3,
            severity: "warning"
          }
        });
      configToCheck = expanded;
    }
    if (getPlatform() === "windows" && (!configToCheck.type || configToCheck.type === "stdio") && (configToCheck.command === "npx" || configToCheck.command.endsWith("\\npx") || configToCheck.command.endsWith("/npx")))
      errors8.push({
        ...filePath && { file: filePath },
        path: `mcpServers.${name3}`,
        message: "Windows requires 'cmd /c' wrapper to execute npx",
        suggestion: 'Change command to "cmd" with args ["/c", "npx", ...]. See: https://code.claude.com/docs/en/mcp#configure-mcp-servers',
        mcpErrorMetadata: {
          scope,
          serverName: name3,
          severity: "warning"
        }
      });
    validatedServers[name3] = configToCheck;
  }
  return {
    config: { mcpServers: validatedServers },
    errors: errors8
  };
}
