// Original: src/utils/plugins/mcpPluginIntegration.ts
import { join as join50 } from "path";
async function loadMcpServersFromMcpb(plugin, mcpbPath, errors8) {
  try {
    logForDebugging(`Loading MCP servers from MCPB: ${mcpbPath}`);
    let pluginId = plugin.repository, result = await loadMcpbFile(mcpbPath, plugin.path, pluginId, (status) => {
      logForDebugging(`MCPB [${plugin.name}]: ${status}`);
    });
    if ("status" in result && result.status === "needs-config")
      return logForDebugging(`MCPB ${mcpbPath} requires user configuration. ` + `User can configure via: /plugin \u2192 Manage plugins \u2192 ${plugin.name} \u2192 Configure`), null;
    let successResult = result, serverName = successResult.manifest.name;
    return logForDebugging(`Loaded MCP server "${serverName}" from MCPB (extracted to ${successResult.extractedPath})`), { [serverName]: successResult.mcpConfig };
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    logForDebugging(`Failed to load MCPB ${mcpbPath}: ${errorMsg}`, {
      level: "error"
    });
    let source = `${plugin.name}@${plugin.repository}`;
    if (mcpbPath.startsWith("http") && (errorMsg.includes("download") || errorMsg.includes("network")))
      errors8.push({
        type: "mcpb-download-failed",
        source,
        plugin: plugin.name,
        url: mcpbPath,
        reason: errorMsg
      });
    else if (errorMsg.includes("manifest") || errorMsg.includes("user configuration"))
      errors8.push({
        type: "mcpb-invalid-manifest",
        source,
        plugin: plugin.name,
        mcpbPath,
        validationError: errorMsg
      });
    else
      errors8.push({
        type: "mcpb-extract-failed",
        source,
        plugin: plugin.name,
        mcpbPath,
        reason: errorMsg
      });
    return null;
  }
}
async function loadPluginMcpServers(plugin, errors8 = []) {
  let servers = {}, defaultMcpServers = await loadMcpServersFromFile(plugin.path, ".mcp.json");
  if (defaultMcpServers)
    servers = { ...servers, ...defaultMcpServers };
  if (plugin.manifest.mcpServers) {
    let mcpServersSpec = plugin.manifest.mcpServers;
    if (typeof mcpServersSpec === "string")
      if (isMcpbSource(mcpServersSpec)) {
        let mcpbServers = await loadMcpServersFromMcpb(plugin, mcpServersSpec, errors8);
        if (mcpbServers)
          servers = { ...servers, ...mcpbServers };
      } else {
        let mcpServers = await loadMcpServersFromFile(plugin.path, mcpServersSpec);
        if (mcpServers)
          servers = { ...servers, ...mcpServers };
      }
    else if (Array.isArray(mcpServersSpec)) {
      let results = await Promise.all(mcpServersSpec.map(async (spec) => {
        try {
          if (typeof spec === "string") {
            if (isMcpbSource(spec))
              return await loadMcpServersFromMcpb(plugin, spec, errors8);
            return await loadMcpServersFromFile(plugin.path, spec);
          }
          return spec;
        } catch (e) {
          return logForDebugging(`Failed to load MCP servers from spec for plugin ${plugin.name}: ${e}`, { level: "error" }), null;
        }
      }));
      for (let result of results)
        if (result)
          servers = { ...servers, ...result };
    } else
      servers = { ...servers, ...mcpServersSpec };
  }
  return Object.keys(servers).length > 0 ? servers : void 0;
}
async function loadMcpServersFromFile(pluginPath, relativePath) {
  let fs16 = getFsImplementation(), filePath = join50(pluginPath, relativePath), content;
  try {
    content = await fs16.readFile(filePath, { encoding: "utf-8" });
  } catch (e) {
    if (isENOENT(e))
      return null;
    return logForDebugging(`Failed to load MCP servers from ${filePath}: ${e}`, {
      level: "error"
    }), null;
  }
  try {
    let parsed = jsonParse(content), mcpServers = parsed.mcpServers || parsed, validatedServers = {};
    for (let [name3, config10] of Object.entries(mcpServers)) {
      let result = McpServerConfigSchema().safeParse(config10);
      if (result.success)
        validatedServers[name3] = result.data;
      else
        logForDebugging(`Invalid MCP server config for ${name3} in ${filePath}: ${result.error.message}`, { level: "error" });
    }
    return validatedServers;
  } catch (error44) {
    return logForDebugging(`Failed to load MCP servers from ${filePath}: ${error44}`, {
      level: "error"
    }), null;
  }
}
function getUnconfiguredChannels(plugin) {
  let channels = plugin.manifest.channels;
  if (!channels || channels.length === 0)
    return [];
  let pluginId = plugin.repository, unconfigured = [];
  for (let channel of channels) {
    if (!channel.userConfig || Object.keys(channel.userConfig).length === 0)
      continue;
    let saved = loadMcpServerUserConfig(pluginId, channel.server) ?? {};
    if (!validateUserConfig(saved, channel.userConfig).valid)
      unconfigured.push({
        server: channel.server,
        displayName: channel.displayName ?? channel.server,
        configSchema: channel.userConfig
      });
  }
  return unconfigured;
}
function loadChannelUserConfig(plugin, serverName) {
  if (!plugin.manifest.channels?.find((c3) => c3.server === serverName)?.userConfig)
    return;
  return loadMcpServerUserConfig(plugin.repository, serverName) ?? void 0;
}
function addPluginScopeToServers(servers, pluginName, pluginSource) {
  let scopedServers = {};
  for (let [name3, config10] of Object.entries(servers)) {
    let scopedName = `plugin:${pluginName}:${name3}`, scoped = {
      ...config10,
      scope: "dynamic",
      pluginSource
    };
    scopedServers[scopedName] = scoped;
  }
  return scopedServers;
}
function buildMcpUserConfig(plugin, serverName) {
  let topLevel = plugin.manifest.userConfig ? loadPluginOptions(getPluginStorageId(plugin)) : void 0, channelSpecific = loadChannelUserConfig(plugin, serverName);
  if (!topLevel && !channelSpecific)
    return;
  return { ...topLevel, ...channelSpecific };
}
function resolvePluginMcpEnvironment(config10, plugin, userConfig, errors8, pluginName, serverName) {
  let allMissingVars = [], resolveValue2 = (value) => {
    let resolved2 = substitutePluginVariables(value, plugin);
    if (userConfig)
      resolved2 = substituteUserConfigVariables(resolved2, userConfig);
    let { expanded, missingVars } = expandEnvVarsInString(resolved2);
    return allMissingVars.push(...missingVars), expanded;
  }, resolved;
  switch (config10.type) {
    case void 0:
    case "stdio": {
      let stdioConfig = { ...config10 };
      if (stdioConfig.command)
        stdioConfig.command = resolveValue2(stdioConfig.command);
      if (stdioConfig.args)
        stdioConfig.args = stdioConfig.args.map((arg) => resolveValue2(arg));
      let resolvedEnv = {
        CLAUDE_PLUGIN_ROOT: plugin.path,
        CLAUDE_PLUGIN_DATA: getPluginDataDir(plugin.source),
        ...stdioConfig.env || {}
      };
      for (let [key2, value] of Object.entries(resolvedEnv))
        if (key2 !== "CLAUDE_PLUGIN_ROOT" && key2 !== "CLAUDE_PLUGIN_DATA")
          resolvedEnv[key2] = resolveValue2(value);
      stdioConfig.env = resolvedEnv, resolved = stdioConfig;
      break;
    }
    case "sse":
    case "http":
    case "ws": {
      let remoteConfig = { ...config10 };
      if (remoteConfig.url)
        remoteConfig.url = resolveValue2(remoteConfig.url);
      if (remoteConfig.headers) {
        let resolvedHeaders = {};
        for (let [key2, value] of Object.entries(remoteConfig.headers))
          resolvedHeaders[key2] = resolveValue2(value);
        remoteConfig.headers = resolvedHeaders;
      }
      resolved = remoteConfig;
      break;
    }
    case "sse-ide":
    case "ws-ide":
    case "sdk":
    case "claudeai-proxy":
      resolved = config10;
      break;
  }
  if (errors8 && allMissingVars.length > 0) {
    let varList = [...new Set(allMissingVars)].join(", ");
    if (logForDebugging(`Missing environment variables in plugin MCP config: ${varList}`, { level: "warn" }), pluginName && serverName)
      errors8.push({
        type: "mcp-config-invalid",
        source: `plugin:${pluginName}`,
        plugin: pluginName,
        serverName,
        validationError: `Missing environment variables: ${varList}`
      });
  }
  return resolved;
}
async function getPluginMcpServers(plugin, errors8 = []) {
  if (!plugin.enabled)
    return;
  let servers = plugin.mcpServers || await loadPluginMcpServers(plugin, errors8);
  if (!servers)
    return;
  let resolvedServers = {};
  for (let [name3, config10] of Object.entries(servers)) {
    let userConfig = buildMcpUserConfig(plugin, name3);
    try {
      resolvedServers[name3] = resolvePluginMcpEnvironment(config10, plugin, userConfig, errors8, plugin.name, name3);
    } catch (err2) {
      errors8?.push({
        type: "generic-error",
        source: name3,
        plugin: plugin.name,
        error: errorMessage(err2)
      });
    }
  }
  return addPluginScopeToServers(resolvedServers, plugin.name, plugin.source);
}
var init_mcpPluginIntegration = __esm(() => {
  init_types2();
  init_debug();
  init_errors();
  init_fsOperations();
  init_slowOperations();
  init_mcpbHandler();
  init_pluginDirectories();
  init_pluginOptionsStorage();
});
