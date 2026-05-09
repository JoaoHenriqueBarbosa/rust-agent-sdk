// Original: src/utils/plugins/headlessPluginInstall.ts
async function installPluginsForHeadless() {
  let zipCacheMode = isPluginZipCacheEnabled();
  logForDebugging(`installPluginsForHeadless: starting${zipCacheMode ? " (zip cache mode)" : ""}`);
  let seedChanged = await registerSeedMarketplaces();
  if (seedChanged)
    clearMarketplacesCache(), clearPluginCache("headlessPluginInstall: seed marketplaces registered");
  if (zipCacheMode)
    await getFsImplementation().mkdir(getZipCacheMarketplacesDir()), await getFsImplementation().mkdir(getZipCachePluginsDir());
  let declaredCount = Object.keys(getDeclaredMarketplaces()).length, metrics = {
    marketplaces_installed: 0,
    delisted_count: 0
  }, pluginsChanged = seedChanged;
  try {
    if (declaredCount === 0)
      logForDebugging("installPluginsForHeadless: no marketplaces declared");
    else {
      let reconcileResult = await withDiagnosticsTiming("headless_marketplace_reconcile", () => reconcileMarketplaces({
        skip: zipCacheMode ? (_name, source) => !isMarketplaceSourceSupportedByZipCache(source) : void 0,
        onProgress: (event) => {
          if (event.type === "installed")
            logForDebugging(`installPluginsForHeadless: installed marketplace ${event.name}`);
          else if (event.type === "failed")
            logForDebugging(`installPluginsForHeadless: failed to install marketplace ${event.name}: ${event.error}`);
        }
      }), (r4) => ({
        installed_count: r4.installed.length,
        updated_count: r4.updated.length,
        failed_count: r4.failed.length,
        skipped_count: r4.skipped.length
      }));
      if (reconcileResult.skipped.length > 0)
        logForDebugging(`installPluginsForHeadless: skipped ${reconcileResult.skipped.length} marketplace(s) unsupported by zip cache: ${reconcileResult.skipped.join(", ")}`);
      let marketplacesChanged = reconcileResult.installed.length + reconcileResult.updated.length;
      if (marketplacesChanged > 0)
        clearMarketplacesCache(), clearPluginCache("headlessPluginInstall: marketplaces reconciled"), pluginsChanged = !0;
      metrics.marketplaces_installed = marketplacesChanged;
    }
    if (zipCacheMode)
      await syncMarketplacesToZipCache();
    let newlyDelisted = await detectAndUninstallDelistedPlugins();
    if (metrics.delisted_count = newlyDelisted.length, newlyDelisted.length > 0)
      pluginsChanged = !0;
    if (pluginsChanged)
      clearPluginCache("headlessPluginInstall: plugins changed");
    if (zipCacheMode)
      registerCleanup(cleanupSessionPluginCache);
    return pluginsChanged;
  } catch (error44) {
    return logError2(error44), !1;
  } finally {
    logEvent("tengu_headless_plugin_install", metrics);
  }
}
var init_headlessPluginInstall = __esm(() => {
  init_cleanupRegistry();
  init_debug();
  init_diagLogs();
  init_fsOperations();
  init_log3();
  init_marketplaceManager();
  init_pluginBlocklist();
  init_pluginLoader();
  init_reconciler2();
  init_zipCache();
  init_zipCacheAdapters();
});
