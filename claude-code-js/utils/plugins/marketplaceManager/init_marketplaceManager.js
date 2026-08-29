// var: init_marketplaceManager
var init_marketplaceManager = __esm(() => {
  init_axios2();
  init_isEqual();
  init_memoize();
  init_debug();
  init_envUtils();
  init_errors();
  init_execFileNoThrow();
  init_fsOperations();
  init_git();
  init_log3();
  init_settings2();
  init_slowOperations();
  init_addDirPluginSettings();
  init_cacheUtils();
  init_fetchTelemetry();
  init_installedPluginsManager();
  init_marketplaceHelpers();
  init_officialMarketplace();
  init_officialMarketplaceGcs();
  init_pluginDirectories();
  init_pluginIdentifier();
  init_pluginOptionsStorage();
  init_schemas3();
  GIT_NO_PROMPT_ENV = {
    GIT_TERMINAL_PROMPT: "0",
    GIT_ASKPASS: ""
  };
  getMarketplace = memoize_default(async (name3) => {
    let config10 = await loadKnownMarketplacesConfig(), entry = config10[name3];
    if (!entry)
      throw Error(`Marketplace '${name3}' not found in configuration. Available marketplaces: ${Object.keys(config10).join(", ")}`);
    if (isLocalMarketplaceSource(entry.source) && !isAbsolute24(entry.source.path))
      throw Error(`Marketplace "${name3}" has a relative source path (${entry.source.path}) ` + "in known_marketplaces.json \u2014 this is stale state from an older " + `Claude Code version. Run 'claude marketplace remove ${name3}' and re-add it from the original project directory.`);
    try {
      return await readCachedMarketplace(entry.installLocation);
    } catch (error44) {
      logForDebugging(`Cache corrupted or missing for marketplace ${name3}, re-fetching from source: ${errorMessage(error44)}`, {
        level: "warn"
      });
    }
    let marketplace;
    try {
      ({ marketplace } = await loadAndCacheMarketplace(entry.source));
    } catch (error44) {
      throw Error(`Failed to load marketplace "${name3}" from source (${entry.source.source}): ${errorMessage(error44)}`);
    }
    return config10[name3].lastUpdated = (/* @__PURE__ */ new Date()).toISOString(), await saveKnownMarketplacesConfig(config10), marketplace;
  });
});
