// function: getPluginById
async function getPluginById(pluginId) {
  let cached3 = await getPluginByIdCacheOnly(pluginId);
  if (cached3)
    return cached3;
  let { name: pluginName, marketplace: marketplaceName } = parsePluginIdentifier(pluginId);
  if (!pluginName || !marketplaceName)
    return null;
  try {
    let marketplaceConfig = (await loadKnownMarketplacesConfig())[marketplaceName];
    if (!marketplaceConfig)
      return null;
    let plugin = (await getMarketplace(marketplaceName)).plugins.find((p4) => p4.name === pluginName);
    if (!plugin)
      return null;
    return {
      entry: plugin,
      marketplaceInstallLocation: marketplaceConfig.installLocation
    };
  } catch (error44) {
    return logForDebugging(`Could not find plugin ${pluginId}: ${errorMessage(error44)}`, { level: "debug" }), null;
  }
}
