// function: getSettingsFilePathForSource
function getSettingsFilePathForSource(source) {
  switch (source) {
    case "userSettings":
      return join17(getSettingsRootPathForSource(source), getUserSettingsFilePath());
    case "projectSettings":
    case "localSettings":
      return join17(getSettingsRootPathForSource(source), getRelativeSettingsFilePathForSource(source));
    case "policySettings":
      return getManagedSettingsFilePath();
    case "flagSettings":
      return getFlagSettingsPath();
  }
}
