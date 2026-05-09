// function: loadSessionOnlyPlugins
async function loadSessionOnlyPlugins(sessionPluginPaths) {
  if (sessionPluginPaths.length === 0)
    return { plugins: [], errors: [] };
  let plugins = [], errors8 = [];
  for (let [index, pluginPath] of sessionPluginPaths.entries())
    try {
      let resolvedPath5 = resolve39(pluginPath);
      if (!await pathExists(resolvedPath5)) {
        logForDebugging(`Plugin path does not exist: ${resolvedPath5}, skipping`, { level: "warn" }), errors8.push({
          type: "path-not-found",
          source: `inline[${index}]`,
          path: resolvedPath5,
          component: "commands"
        });
        continue;
      }
      let dirName = basename30(resolvedPath5), { plugin, errors: pluginErrors } = await createPluginFromPath(resolvedPath5, `${dirName}@inline`, !0, dirName);
      plugin.source = `${plugin.name}@inline`, plugin.repository = `${plugin.name}@inline`, plugins.push(plugin), errors8.push(...pluginErrors), logForDebugging(`Loaded inline plugin from path: ${plugin.name}`);
    } catch (error44) {
      let errorMsg = errorMessage(error44);
      logForDebugging(`Failed to load session plugin from ${pluginPath}: ${errorMsg}`, { level: "warn" }), errors8.push({
        type: "generic-error",
        source: `inline[${index}]`,
        error: `Failed to load plugin: ${errorMsg}`
      });
    }
  if (plugins.length > 0)
    logForDebugging(`Loaded ${plugins.length} session-only plugins from --plugin-dir`);
  return { plugins, errors: errors8 };
}
