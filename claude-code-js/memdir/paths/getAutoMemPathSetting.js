// function: getAutoMemPathSetting
function getAutoMemPathSetting() {
  let dir = getSettingsForSource("policySettings")?.autoMemoryDirectory ?? getSettingsForSource("flagSettings")?.autoMemoryDirectory ?? getSettingsForSource("localSettings")?.autoMemoryDirectory ?? getSettingsForSource("userSettings")?.autoMemoryDirectory;
  return validateMemoryPath(dir, !0);
}
