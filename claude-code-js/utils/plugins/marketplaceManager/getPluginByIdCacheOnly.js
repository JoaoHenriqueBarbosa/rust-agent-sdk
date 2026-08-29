// function: getPluginByIdCacheOnly
async function getPluginByIdCacheOnly(pluginId) {
  let { name: pluginName, marketplace: marketplaceName } = parsePluginIdentifier(pluginId);
  if (!pluginName || !marketplaceName)
    return null;
  let fs17 = getFsImplementation(), configFile = getKnownMarketplacesFile();
  try {
    let content = await fs17.readFile(configFile, { encoding: "utf-8" }), marketplaceConfig = jsonParse(content)[marketplaceName];
    if (!marketplaceConfig)
      return null;
    let marketplace = await getMarketplaceCacheOnly(marketplaceName);
    if (!marketplace)
      return null;
    let plugin = marketplace.plugins.find((p4) => p4.name === pluginName);
    if (!plugin)
      return null;
    return {
      entry: plugin,
      marketplaceInstallLocation: marketplaceConfig.installLocation
    };
  } catch {
    return null;
  }
}
