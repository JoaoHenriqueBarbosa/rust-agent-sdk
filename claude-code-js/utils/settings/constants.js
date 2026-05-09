// Original: src/utils/settings/constants.ts
function getSettingSourceName(source) {
  switch (source) {
    case "userSettings":
      return "user";
    case "projectSettings":
      return "project";
    case "localSettings":
      return "project, gitignored";
    case "flagSettings":
      return "cli flag";
    case "policySettings":
      return "managed";
  }
}
function getSourceDisplayName(source) {
  switch (source) {
    case "userSettings":
      return "User";
    case "projectSettings":
      return "Project";
    case "localSettings":
      return "Local";
    case "flagSettings":
      return "Flag";
    case "policySettings":
      return "Managed";
    case "plugin":
      return "Plugin";
    case "built-in":
      return "Built-in";
  }
}
function getSettingSourceDisplayNameLowercase(source) {
  switch (source) {
    case "userSettings":
      return "user settings";
    case "projectSettings":
      return "shared project settings";
    case "localSettings":
      return "project local settings";
    case "flagSettings":
      return "command line arguments";
    case "policySettings":
      return "enterprise managed settings";
    case "cliArg":
      return "CLI argument";
    case "command":
      return "command configuration";
    case "session":
      return "current session";
  }
}
function getSettingSourceDisplayNameCapitalized(source) {
  switch (source) {
    case "userSettings":
      return "User settings";
    case "projectSettings":
      return "Shared project settings";
    case "localSettings":
      return "Project local settings";
    case "flagSettings":
      return "Command line arguments";
    case "policySettings":
      return "Enterprise managed settings";
    case "cliArg":
      return "CLI argument";
    case "command":
      return "Command configuration";
    case "session":
      return "Current session";
  }
}
function parseSettingSourcesFlag(flag) {
  if (flag === "")
    return [];
  let names = flag.split(",").map((s) => s.trim()), result = [];
  for (let name of names)
    switch (name) {
      case "user":
        result.push("userSettings");
        break;
      case "project":
        result.push("projectSettings");
        break;
      case "local":
        result.push("localSettings");
        break;
      default:
        throw Error(`Invalid setting source: ${name}. Valid options are: user, project, local`);
    }
  return result;
}
function getEnabledSettingSources() {
  let allowed = getAllowedSettingSources(), result = new Set(allowed);
  return result.add("policySettings"), result.add("flagSettings"), Array.from(result);
}
function isSettingSourceEnabled(source) {
  return getEnabledSettingSources().includes(source);
}
var SETTING_SOURCES, SOURCES, CLAUDE_CODE_SETTINGS_SCHEMA_URL = "https://json.schemastore.org/claude-code-settings.json";
var init_constants2 = __esm(() => {
  init_state();
  SETTING_SOURCES = [
    "userSettings",
    "projectSettings",
    "localSettings",
    "flagSettings",
    "policySettings"
  ];
  SOURCES = [
    "localSettings",
    "projectSettings",
    "userSettings"
  ];
});
