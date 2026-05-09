// function: getAllLspServers
async function getAllLspServers() {
  let allServers = {};
  try {
    let { enabled: plugins } = await loadAllPluginsCacheOnly(), results = await Promise.all(plugins.map(async (plugin) => {
      let errors8 = [];
      try {
        let scopedServers = await getPluginLspServers(plugin, errors8);
        return { plugin, scopedServers, errors: errors8 };
      } catch (e) {
        return logForDebugging(`Failed to load LSP servers for plugin ${plugin.name}: ${e}`, { level: "error" }), { plugin, scopedServers: void 0, errors: errors8 };
      }
    }));
    for (let { plugin, scopedServers, errors: errors8 } of results) {
      let serverCount = scopedServers ? Object.keys(scopedServers).length : 0;
      if (serverCount > 0)
        Object.assign(allServers, scopedServers), logForDebugging(`Loaded ${serverCount} LSP server(s) from plugin: ${plugin.name}`);
      if (errors8.length > 0)
        logForDebugging(`${errors8.length} error(s) loading LSP servers from plugin: ${plugin.name}`);
    }
    logForDebugging(`Total LSP servers loaded: ${Object.keys(allServers).length}`);
  } catch (error44) {
    logError2(toError(error44)), logForDebugging(`Error loading LSP servers: ${errorMessage(error44)}`);
  }
  return {
    servers: allServers
  };
}
