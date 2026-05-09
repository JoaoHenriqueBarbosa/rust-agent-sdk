// function: clearPluginCache
function clearPluginCache(reason) {
  if (reason)
    logForDebugging(`clearPluginCache: invalidating loadAllPlugins cache (${reason})`);
  if (loadAllPlugins.cache?.clear?.(), loadAllPluginsCacheOnly.cache?.clear?.(), getPluginSettingsBase() !== void 0)
    resetSettingsCache();
  clearPluginSettingsBase();
}
