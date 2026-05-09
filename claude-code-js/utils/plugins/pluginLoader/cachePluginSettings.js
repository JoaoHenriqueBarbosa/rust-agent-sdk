// function: cachePluginSettings
function cachePluginSettings(plugins) {
  let settings = mergePluginSettings(plugins);
  if (setPluginSettingsBase(settings), settings && Object.keys(settings).length > 0)
    resetSettingsCache(), logForDebugging(`Cached plugin settings with keys: ${Object.keys(settings).join(", ")}`);
}
