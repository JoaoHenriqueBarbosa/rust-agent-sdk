// function: getRelativeSettingsFilePathForSource
function getRelativeSettingsFilePathForSource(source) {
  switch (source) {
    case "projectSettings":
      return join17(".claude", "settings.json");
    case "localSettings":
      return join17(".claude", "settings.local.json");
  }
}
