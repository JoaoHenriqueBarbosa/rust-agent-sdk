// function: getSettingsRootPathForSource
function getSettingsRootPathForSource(source) {
  switch (source) {
    case "userSettings":
      return resolve7(getClaudeConfigHomeDir());
    case "policySettings":
    case "projectSettings":
    case "localSettings":
      return resolve7(getOriginalCwd());
    case "flagSettings": {
      let path9 = getFlagSettingsPath();
      return path9 ? dirname10(resolve7(path9)) : resolve7(getOriginalCwd());
    }
  }
}
