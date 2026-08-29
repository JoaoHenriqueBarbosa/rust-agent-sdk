// Original: src/utils/plugins/pluginAutoupdate.ts
function onPluginsAutoUpdated(callback) {
  if (pluginUpdateCallback = callback, pendingNotification !== null && pendingNotification.length > 0)
    callback(pendingNotification), pendingNotification = null;
  return () => {
    pluginUpdateCallback = null;
  };
}
async function getAutoUpdateEnabledMarketplaces() {
  let config11 = await loadKnownMarketplacesConfig(), declared = getDeclaredMarketplaces(), enabled2 = /* @__PURE__ */ new Set;
  for (let [name3, entry] of Object.entries(config11)) {
    let declaredAutoUpdate = declared[name3]?.autoUpdate;
    if (declaredAutoUpdate !== void 0 ? declaredAutoUpdate : isMarketplaceAutoUpdate(name3, entry))
      enabled2.add(name3.toLowerCase());
  }
  return enabled2;
}
async function updatePlugin(pluginId, installations) {
  let wasUpdated = !1;
  for (let { scope } of installations)
    try {
      let result = await updatePluginOp(pluginId, scope);
      if (result.success && !result.alreadyUpToDate)
        wasUpdated = !0, logForDebugging(`Plugin autoupdate: updated ${pluginId} from ${result.oldVersion} to ${result.newVersion}`);
      else if (!result.alreadyUpToDate)
        logForDebugging(`Plugin autoupdate: failed to update ${pluginId}: ${result.message}`, { level: "warn" });
    } catch (error44) {
      logForDebugging(`Plugin autoupdate: error updating ${pluginId}: ${errorMessage(error44)}`, { level: "warn" });
    }
  return wasUpdated ? pluginId : null;
}
async function updatePluginsForMarketplaces(marketplaceNames) {
  let installedPlugins = loadInstalledPluginsFromDisk(), pluginIds = Object.keys(installedPlugins.plugins);
  if (pluginIds.length === 0)
    return [];
  return (await Promise.allSettled(pluginIds.map(async (pluginId) => {
    let { marketplace } = parsePluginIdentifier(pluginId);
    if (!marketplace || !marketplaceNames.has(marketplace.toLowerCase()))
      return null;
    let allInstallations = installedPlugins.plugins[pluginId];
    if (!allInstallations || allInstallations.length === 0)
      return null;
    let relevantInstallations = allInstallations.filter(isInstallationRelevantToCurrentProject);
    if (relevantInstallations.length === 0)
      return null;
    return updatePlugin(pluginId, relevantInstallations);
  }))).filter((r4) => r4.status === "fulfilled" && r4.value !== null).map((r4) => r4.value);
}
async function updatePlugins(autoUpdateEnabledMarketplaces) {
  return updatePluginsForMarketplaces(autoUpdateEnabledMarketplaces);
}
function autoUpdateMarketplacesAndPluginsInBackground() {
  (async () => {
    if (shouldSkipPluginAutoupdate()) {
      logForDebugging("Plugin autoupdate: skipped (auto-updater disabled)");
      return;
    }
    try {
      let autoUpdateEnabledMarketplaces = await getAutoUpdateEnabledMarketplaces();
      if (autoUpdateEnabledMarketplaces.size === 0)
        return;
      let failures = (await Promise.allSettled(Array.from(autoUpdateEnabledMarketplaces).map(async (name3) => {
        try {
          await refreshMarketplace(name3, void 0, {
            disableCredentialHelper: !0
          });
        } catch (error44) {
          logForDebugging(`Plugin autoupdate: failed to refresh marketplace ${name3}: ${errorMessage(error44)}`, { level: "warn" });
        }
      }))).filter((r4) => r4.status === "rejected");
      if (failures.length > 0)
        logForDebugging(`Plugin autoupdate: ${failures.length} marketplace refresh(es) failed`, { level: "warn" });
      logForDebugging("Plugin autoupdate: checking installed plugins");
      let updatedPlugins = await updatePlugins(autoUpdateEnabledMarketplaces);
      if (updatedPlugins.length > 0)
        if (pluginUpdateCallback)
          pluginUpdateCallback(updatedPlugins);
        else
          pendingNotification = updatedPlugins;
    } catch (error44) {
      logError2(error44);
    }
  })();
}
var pluginUpdateCallback = null, pendingNotification = null;
var init_pluginAutoupdate = __esm(() => {
  init_pluginOperations();
  init_config4();
  init_debug();
  init_errors();
  init_log3();
  init_installedPluginsManager();
  init_marketplaceManager();
  init_pluginIdentifier();
  init_schemas3();
});
