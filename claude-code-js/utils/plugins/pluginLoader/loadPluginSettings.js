// function: loadPluginSettings
async function loadPluginSettings(pluginPath, manifest) {
  let settingsJsonPath = join100(pluginPath, "settings.json");
  try {
    let content = await readFile35(settingsJsonPath, { encoding: "utf-8" }), parsed = jsonParse(content);
    if (isRecord(parsed)) {
      let filtered = parsePluginSettings(parsed);
      if (filtered)
        return logForDebugging(`Loaded settings from settings.json for plugin ${manifest.name}`), filtered;
    }
  } catch (e) {
    if (!isFsInaccessible(e))
      logForDebugging(`Failed to parse settings.json for plugin ${manifest.name}: ${e}`, { level: "warn" });
  }
  if (manifest.settings) {
    let filtered = parsePluginSettings(manifest.settings);
    if (filtered)
      return logForDebugging(`Loaded settings from manifest for plugin ${manifest.name}`), filtered;
  }
  return;
}
