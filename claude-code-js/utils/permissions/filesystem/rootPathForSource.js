// function: rootPathForSource
function rootPathForSource(source) {
  switch (source) {
    case "cliArg":
    case "command":
    case "session":
      return expandPath(getOriginalCwd());
    case "userSettings":
    case "policySettings":
    case "projectSettings":
    case "localSettings":
    case "flagSettings":
      return getSettingsRootPathForSource(source);
  }
}
