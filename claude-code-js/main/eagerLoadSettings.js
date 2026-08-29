// function: eagerLoadSettings
function eagerLoadSettings() {
  profileCheckpoint("eagerLoadSettings_start");
  let settingsFile = eagerParseCliFlag("--settings");
  if (settingsFile)
    loadSettingsFromFlag(settingsFile);
  let settingSourcesArg = eagerParseCliFlag("--setting-sources");
  if (settingSourcesArg !== void 0)
    loadSettingSourcesFromFlag(settingSourcesArg);
  profileCheckpoint("eagerLoadSettings_end");
}
