// Original: src/utils/plugins/addDirPluginSettings.ts
import { join as join29 } from "path";
function getAddDirEnabledPlugins() {
  let result = {};
  for (let dir of getAdditionalDirectoriesForClaudeMd())
    for (let file2 of SETTINGS_FILES) {
      let { settings } = parseSettingsFile(join29(dir, ".claude", file2));
      if (!settings?.enabledPlugins)
        continue;
      Object.assign(result, settings.enabledPlugins);
    }
  return result;
}
function getAddDirExtraMarketplaces() {
  let result = {};
  for (let dir of getAdditionalDirectoriesForClaudeMd())
    for (let file2 of SETTINGS_FILES) {
      let { settings } = parseSettingsFile(join29(dir, ".claude", file2));
      if (!settings?.extraKnownMarketplaces)
        continue;
      Object.assign(result, settings.extraKnownMarketplaces);
    }
  return result;
}
var SETTINGS_FILES;
var init_addDirPluginSettings = __esm(() => {
  init_state();
  init_settings2();
  SETTINGS_FILES = ["settings.json", "settings.local.json"];
});
