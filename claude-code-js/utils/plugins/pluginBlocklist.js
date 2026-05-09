// Original: src/utils/plugins/pluginBlocklist.ts
function detectDelistedPlugins(installedPlugins, marketplace, marketplaceName) {
  let marketplacePluginNames = new Set(marketplace.plugins.map((p4) => p4.name)), suffix = `@${marketplaceName}`, delisted = [];
  for (let pluginId of Object.keys(installedPlugins.plugins)) {
    if (!pluginId.endsWith(suffix))
      continue;
    let pluginName = pluginId.slice(0, -suffix.length);
    if (!marketplacePluginNames.has(pluginName))
      delisted.push(pluginId);
  }
  return delisted;
}
async function detectAndUninstallDelistedPlugins() {
  await loadFlaggedPlugins();
  let installedPlugins = loadInstalledPluginsV2(), alreadyFlagged = getFlaggedPlugins(), knownMarketplaces = await loadKnownMarketplacesConfigSafe(), newlyFlagged = [];
  for (let marketplaceName of Object.keys(knownMarketplaces))
    try {
      let marketplace = await getMarketplace(marketplaceName);
      if (!marketplace.forceRemoveDeletedPlugins)
        continue;
      let delisted = detectDelistedPlugins(installedPlugins, marketplace, marketplaceName);
      for (let pluginId of delisted) {
        if (pluginId in alreadyFlagged)
          continue;
        let installations = installedPlugins.plugins[pluginId] ?? [];
        if (!installations.some((i5) => i5.scope === "user" || i5.scope === "project" || i5.scope === "local"))
          continue;
        for (let installation of installations) {
          let { scope } = installation;
          if (scope !== "user" && scope !== "project" && scope !== "local")
            continue;
          try {
            await uninstallPluginOp(pluginId, scope);
          } catch (error44) {
            logForDebugging(`Failed to auto-uninstall delisted plugin ${pluginId} from ${scope}: ${errorMessage(error44)}`, { level: "error" });
          }
        }
        await addFlaggedPlugin(pluginId), newlyFlagged.push(pluginId);
      }
    } catch (error44) {
      logForDebugging(`Failed to check for delisted plugins in "${marketplaceName}": ${errorMessage(error44)}`, { level: "warn" });
    }
  return newlyFlagged;
}
var init_pluginBlocklist = __esm(() => {
  init_pluginOperations();
  init_debug();
  init_errors();
  init_installedPluginsManager();
  init_marketplaceManager();
  init_pluginFlagging();
});
