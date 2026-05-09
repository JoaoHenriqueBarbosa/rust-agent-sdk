// function: getSettingsPaths
function getSettingsPaths() {
  return SETTING_SOURCES.map((source) => getSettingsFilePathForSource(source)).filter((path25) => path25 !== void 0);
}
