// function: loadPluginsFromMarketplaces
async function loadPluginsFromMarketplaces({
  cacheOnly
}) {
  let settings = getSettings_DEPRECATED(), enabledPlugins = {
    ...getAddDirEnabledPlugins(),
    ...settings.enabledPlugins || {}
  }, plugins = [], errors8 = [], marketplacePluginEntries = Object.entries(enabledPlugins).filter(([key3, value]) => {
    if (!PluginIdSchema().safeParse(key3).success || value === void 0)
      return !1;
    let { marketplace } = parsePluginIdentifier(key3);
    return marketplace !== BUILTIN_MARKETPLACE_NAME;
  }), knownMarketplaces = await loadKnownMarketplacesConfigSafe(), strictAllowlist = getStrictKnownMarketplaces(), blocklist = getBlockedMarketplaces(), hasEnterprisePolicy = strictAllowlist !== null || blocklist !== null && blocklist.length > 0, uniqueMarketplaces = new Set(marketplacePluginEntries.map(([pluginId]) => parsePluginIdentifier(pluginId).marketplace).filter((m4) => !!m4)), marketplaceCatalogs = /* @__PURE__ */ new Map;
  await Promise.all([...uniqueMarketplaces].map(async (name3) => {
    marketplaceCatalogs.set(name3, await getMarketplaceCacheOnly(name3));
  }));
  let installedPluginsData = getInMemoryInstalledPlugins(), results = await Promise.allSettled(marketplacePluginEntries.map(async ([pluginId, enabledValue]) => {
    let { name: pluginName, marketplace: marketplaceName } = parsePluginIdentifier(pluginId), marketplaceConfig = knownMarketplaces[marketplaceName];
    if (!marketplaceConfig && hasEnterprisePolicy)
      return errors8.push({
        type: "marketplace-blocked-by-policy",
        source: pluginId,
        plugin: pluginName,
        marketplace: marketplaceName,
        blockedByBlocklist: strictAllowlist === null,
        allowedSources: (strictAllowlist ?? []).map((s2) => formatSourceForDisplay(s2))
      }), null;
    if (marketplaceConfig && !isSourceAllowedByPolicy(marketplaceConfig.source)) {
      let isBlocked = isSourceInBlocklist(marketplaceConfig.source), allowlist = getStrictKnownMarketplaces() || [];
      return errors8.push({
        type: "marketplace-blocked-by-policy",
        source: pluginId,
        plugin: pluginName,
        marketplace: marketplaceName,
        blockedByBlocklist: isBlocked,
        allowedSources: isBlocked ? [] : allowlist.map((s2) => formatSourceForDisplay(s2))
      }), null;
    }
    let result = null, marketplace = marketplaceCatalogs.get(marketplaceName);
    if (marketplace && marketplaceConfig) {
      let entry = marketplace.plugins.find((p4) => p4.name === pluginName);
      if (entry)
        result = {
          entry,
          marketplaceInstallLocation: marketplaceConfig.installLocation
        };
    } else
      result = await getPluginByIdCacheOnly(pluginId);
    if (!result)
      return errors8.push({
        type: "plugin-not-found",
        source: pluginId,
        pluginId: pluginName,
        marketplace: marketplaceName
      }), null;
    let installEntry = installedPluginsData.plugins[pluginId]?.[0];
    return cacheOnly ? loadPluginFromMarketplaceEntryCacheOnly(result.entry, result.marketplaceInstallLocation, pluginId, enabledValue === !0, errors8, installEntry?.installPath) : loadPluginFromMarketplaceEntry(result.entry, result.marketplaceInstallLocation, pluginId, enabledValue === !0, errors8, installEntry?.version);
  }));
  for (let [i5, result] of results.entries())
    if (result.status === "fulfilled" && result.value)
      plugins.push(result.value);
    else if (result.status === "rejected") {
      let err2 = toError(result.reason);
      logError2(err2);
      let pluginId = marketplacePluginEntries[i5][0];
      errors8.push({
        type: "generic-error",
        source: pluginId,
        plugin: pluginId.split("@")[0],
        error: err2.message
      });
    }
  return { plugins, errors: errors8 };
}
