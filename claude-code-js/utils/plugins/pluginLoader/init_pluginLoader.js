// var: init_pluginLoader
var init_pluginLoader = __esm(() => {
  init_memoize();
  init_state();
  init_builtinPlugins();
  init_debug();
  init_envUtils();
  init_errors();
  init_execFileNoThrow();
  init_file();
  init_fsOperations();
  init_git();
  init_log3();
  init_settings2();
  init_settingsCache();
  init_types3();
  init_slowOperations();
  init_addDirPluginSettings();
  init_dependencyResolver();
  init_fetchTelemetry();
  init_gitAvailability();
  init_installedPluginsManager();
  init_managedPlugins();
  init_marketplaceHelpers();
  init_marketplaceManager();
  init_pluginDirectories();
  init_pluginIdentifier();
  init_pluginInstallationHelpers();
  init_pluginVersioning();
  init_schemas3();
  init_zipCache();
  PluginSettingsSchema = lazySchema(() => SettingsSchema().pick({
    agent: !0
  }).strip());
  loadAllPlugins = memoize_default(async () => {
    let result = await assemblePluginLoadResult(() => loadPluginsFromMarketplaces({ cacheOnly: !1 }));
    return loadAllPluginsCacheOnly.cache?.set(void 0, Promise.resolve(result)), result;
  }), loadAllPluginsCacheOnly = memoize_default(async () => {
    if (isEnvTruthy(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL))
      return loadAllPlugins();
    return assemblePluginLoadResult(() => loadPluginsFromMarketplaces({ cacheOnly: !0 }));
  });
});
