// Original: src/utils/plugins/lspPluginIntegration.ts
import { readFile as readFile25 } from "fs/promises";
import { join as join79, relative as relative12, resolve as resolve27 } from "path";
function validatePathWithinPlugin(pluginPath, relativePath) {
  let resolvedPluginPath = resolve27(pluginPath), resolvedFilePath = resolve27(pluginPath, relativePath), rel = relative12(resolvedPluginPath, resolvedFilePath);
  if (rel.startsWith("..") || resolve27(rel) === rel)
    return null;
  return resolvedFilePath;
}
async function loadPluginLspServers(plugin, errors8 = []) {
  let servers = {}, lspJsonPath = join79(plugin.path, ".lsp.json");
  try {
    let content = await readFile25(lspJsonPath, "utf-8"), parsed = jsonParse(content), result = exports_external.record(exports_external.string(), LspServerConfigSchema()).safeParse(parsed);
    if (result.success)
      Object.assign(servers, result.data);
    else {
      let errorMsg = `LSP config validation failed for .lsp.json in plugin ${plugin.name}: ${result.error.message}`;
      logError2(Error(errorMsg)), errors8.push({
        type: "lsp-config-invalid",
        plugin: plugin.name,
        serverName: ".lsp.json",
        validationError: result.error.message,
        source: "plugin"
      });
    }
  } catch (error44) {
    if (!isENOENT(error44)) {
      let _errorMsg = error44 instanceof Error ? `Failed to read/parse .lsp.json in plugin ${plugin.name}: ${error44.message}` : `Failed to read/parse .lsp.json file in plugin ${plugin.name}`;
      logError2(toError(error44)), errors8.push({
        type: "lsp-config-invalid",
        plugin: plugin.name,
        serverName: ".lsp.json",
        validationError: error44 instanceof Error ? `Failed to parse JSON: ${error44.message}` : "Failed to parse JSON file",
        source: "plugin"
      });
    }
  }
  if (plugin.manifest.lspServers) {
    let manifestServers = await loadLspServersFromManifest(plugin.manifest.lspServers, plugin.path, plugin.name, errors8);
    if (manifestServers)
      Object.assign(servers, manifestServers);
  }
  return Object.keys(servers).length > 0 ? servers : void 0;
}
async function loadLspServersFromManifest(declaration, pluginPath, pluginName, errors8) {
  let servers = {}, declarations = Array.isArray(declaration) ? declaration : [declaration];
  for (let decl of declarations)
    if (typeof decl === "string") {
      let validatedPath = validatePathWithinPlugin(pluginPath, decl);
      if (!validatedPath) {
        let securityMsg = `Security: Path traversal attempt blocked in plugin ${pluginName}: ${decl}`;
        logError2(Error(securityMsg)), logForDebugging(securityMsg, { level: "warn" }), errors8.push({
          type: "lsp-config-invalid",
          plugin: pluginName,
          serverName: decl,
          validationError: "Invalid path: must be relative and within plugin directory",
          source: "plugin"
        });
        continue;
      }
      try {
        let content = await readFile25(validatedPath, "utf-8"), parsed = jsonParse(content), result = exports_external.record(exports_external.string(), LspServerConfigSchema()).safeParse(parsed);
        if (result.success)
          Object.assign(servers, result.data);
        else {
          let errorMsg = `LSP config validation failed for ${decl} in plugin ${pluginName}: ${result.error.message}`;
          logError2(Error(errorMsg)), errors8.push({
            type: "lsp-config-invalid",
            plugin: pluginName,
            serverName: decl,
            validationError: result.error.message,
            source: "plugin"
          });
        }
      } catch (error44) {
        let _errorMsg = error44 instanceof Error ? `Failed to read/parse LSP config from ${decl} in plugin ${pluginName}: ${error44.message}` : `Failed to read/parse LSP config file ${decl} in plugin ${pluginName}`;
        logError2(toError(error44)), errors8.push({
          type: "lsp-config-invalid",
          plugin: pluginName,
          serverName: decl,
          validationError: error44 instanceof Error ? `Failed to parse JSON: ${error44.message}` : "Failed to parse JSON file",
          source: "plugin"
        });
      }
    } else
      for (let [serverName, config10] of Object.entries(decl)) {
        let result = LspServerConfigSchema().safeParse(config10);
        if (result.success)
          servers[serverName] = result.data;
        else {
          let errorMsg = `LSP config validation failed for inline server "${serverName}" in plugin ${pluginName}: ${result.error.message}`;
          logError2(Error(errorMsg)), errors8.push({
            type: "lsp-config-invalid",
            plugin: pluginName,
            serverName,
            validationError: result.error.message,
            source: "plugin"
          });
        }
      }
  return Object.keys(servers).length > 0 ? servers : void 0;
}
function resolvePluginLspEnvironment(config10, plugin, userConfig, _errors) {
  let allMissingVars = [], resolveValue2 = (value) => {
    let resolved2 = substitutePluginVariables(value, plugin);
    if (userConfig)
      resolved2 = substituteUserConfigVariables(resolved2, userConfig);
    let { expanded, missingVars } = expandEnvVarsInString(resolved2);
    return allMissingVars.push(...missingVars), expanded;
  }, resolved = { ...config10 };
  if (resolved.command)
    resolved.command = resolveValue2(resolved.command);
  if (resolved.args)
    resolved.args = resolved.args.map((arg) => resolveValue2(arg));
  let resolvedEnv = {
    CLAUDE_PLUGIN_ROOT: plugin.path,
    CLAUDE_PLUGIN_DATA: getPluginDataDir(plugin.source),
    ...resolved.env || {}
  };
  for (let [key2, value] of Object.entries(resolvedEnv))
    if (key2 !== "CLAUDE_PLUGIN_ROOT" && key2 !== "CLAUDE_PLUGIN_DATA")
      resolvedEnv[key2] = resolveValue2(value);
  if (resolved.env = resolvedEnv, resolved.workspaceFolder)
    resolved.workspaceFolder = resolveValue2(resolved.workspaceFolder);
  if (allMissingVars.length > 0) {
    let warnMsg = `Missing environment variables in plugin LSP config: ${[...new Set(allMissingVars)].join(", ")}`;
    logError2(Error(warnMsg)), logForDebugging(warnMsg, { level: "warn" });
  }
  return resolved;
}
function addPluginScopeToLspServers(servers, pluginName) {
  let scopedServers = {};
  for (let [name3, config10] of Object.entries(servers)) {
    let scopedName = `plugin:${pluginName}:${name3}`;
    scopedServers[scopedName] = {
      ...config10,
      scope: "dynamic",
      source: pluginName
    };
  }
  return scopedServers;
}
async function getPluginLspServers(plugin, errors8 = []) {
  if (!plugin.enabled)
    return;
  let servers = plugin.lspServers || await loadPluginLspServers(plugin, errors8);
  if (!servers)
    return;
  let userConfig = plugin.manifest.userConfig ? loadPluginOptions(getPluginStorageId(plugin)) : void 0, resolvedServers = {};
  for (let [name3, config10] of Object.entries(servers))
    resolvedServers[name3] = resolvePluginLspEnvironment(config10, plugin, userConfig, errors8);
  return addPluginScopeToLspServers(resolvedServers, plugin.name);
}
var init_lspPluginIntegration = __esm(() => {
  init_v4();
  init_debug();
  init_errors();
  init_log3();
  init_slowOperations();
  init_pluginDirectories();
  init_pluginOptionsStorage();
  init_schemas3();
});
