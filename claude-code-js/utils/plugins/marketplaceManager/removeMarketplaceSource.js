// function: removeMarketplaceSource
async function removeMarketplaceSource(name3) {
  let config10 = await loadKnownMarketplacesConfig();
  if (!config10[name3])
    throw Error(`Marketplace '${name3}' not found`);
  let entry = config10[name3], seedDir = seedDirFor(entry.installLocation);
  if (seedDir)
    throw Error(`Marketplace '${name3}' is registered from the read-only seed directory (${seedDir}) and will be re-registered on next startup. To stop using its plugins: claude plugin disable <plugin>@${name3}`);
  delete config10[name3], await saveKnownMarketplacesConfig(config10);
  let fs17 = getFsImplementation(), cacheDir = getMarketplacesCacheDir(), cachePath = join97(cacheDir, name3);
  await fs17.rm(cachePath, { recursive: !0, force: !0 });
  let jsonCachePath = join97(cacheDir, `${name3}.json`);
  await fs17.rm(jsonCachePath, { force: !0 });
  let editableSources = ["userSettings", "projectSettings", "localSettings"];
  for (let source of editableSources) {
    let settings = getSettingsForSource(source);
    if (!settings)
      continue;
    let needsUpdate = !1, updates = {};
    if (settings.extraKnownMarketplaces?.[name3]) {
      let updatedMarketplaces = { ...settings.extraKnownMarketplaces };
      updatedMarketplaces[name3] = void 0, updates.extraKnownMarketplaces = updatedMarketplaces, needsUpdate = !0;
    }
    if (settings.enabledPlugins) {
      let marketplaceSuffix = `@${name3}`, updatedPlugins = { ...settings.enabledPlugins }, removedPlugins = !1;
      for (let pluginId in updatedPlugins)
        if (pluginId.endsWith(marketplaceSuffix))
          updatedPlugins[pluginId] = void 0, removedPlugins = !0;
      if (removedPlugins)
        updates.enabledPlugins = updatedPlugins, needsUpdate = !0;
    }
    if (needsUpdate) {
      let result = updateSettingsForSource(source, updates);
      if (result.error)
        logError2(result.error), logForDebugging(`Failed to clean up marketplace '${name3}' from ${source} settings: ${result.error.message}`);
      else
        logForDebugging(`Cleaned up marketplace '${name3}' from ${source} settings`);
    }
  }
  let { orphanedPaths, removedPluginIds } = removeAllPluginsForMarketplace(name3);
  for (let installPath of orphanedPaths)
    await markPluginVersionOrphaned(installPath);
  for (let pluginId of removedPluginIds)
    deletePluginOptions(pluginId), await deletePluginDataDir(pluginId);
  logForDebugging(`Removed marketplace source: ${name3}`);
}
