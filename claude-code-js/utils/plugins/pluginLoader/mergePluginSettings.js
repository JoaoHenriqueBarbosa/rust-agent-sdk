// function: mergePluginSettings
function mergePluginSettings(plugins) {
  let merged;
  for (let plugin of plugins) {
    if (!plugin.settings)
      continue;
    if (!merged)
      merged = {};
    for (let [key3, value] of Object.entries(plugin.settings)) {
      if (key3 in merged)
        logForDebugging(`Plugin "${plugin.name}" overrides setting "${key3}" (previously set by another plugin)`);
      merged[key3] = value;
    }
  }
  return merged;
}
