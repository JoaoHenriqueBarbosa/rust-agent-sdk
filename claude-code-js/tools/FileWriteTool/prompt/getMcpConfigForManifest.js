// function: getMcpConfigForManifest
async function getMcpConfigForManifest(options) {
  let { manifest, extensionPath, systemDirs, userConfig, pathSeparator, logger: logger34 } = options, baseConfig = manifest.server?.mcp_config;
  if (!baseConfig)
    return;
  let result = {
    ...baseConfig
  };
  if (baseConfig.platform_overrides) {
    if (process.platform in baseConfig.platform_overrides) {
      let platformConfig = baseConfig.platform_overrides[process.platform];
      result.command = platformConfig.command || result.command, result.args = platformConfig.args || result.args, result.env = platformConfig.env || result.env;
    }
  }
  if (hasRequiredConfigMissing({ manifest, userConfig })) {
    logger34?.warn(`Extension ${manifest.name} has missing required configuration, skipping MCP config`);
    return;
  }
  let variables = {
    __dirname: extensionPath,
    pathSeparator,
    "/": pathSeparator,
    ...systemDirs
  }, mergedConfig = {};
  if (manifest.user_config) {
    for (let [key2, configOption] of Object.entries(manifest.user_config))
      if (configOption.default !== void 0)
        mergedConfig[key2] = configOption.default;
  }
  if (userConfig)
    Object.assign(mergedConfig, userConfig);
  for (let [key2, value] of Object.entries(mergedConfig)) {
    let userConfigKey = `user_config.${key2}`;
    if (Array.isArray(value))
      variables[userConfigKey] = value.map(String);
    else if (typeof value === "boolean")
      variables[userConfigKey] = value ? "true" : "false";
    else
      variables[userConfigKey] = String(value);
  }
  return result = replaceVariables(result, variables), result;
}
