// function: ruleSourceToOTelSource
function ruleSourceToOTelSource(ruleSource, behavior) {
  switch (ruleSource) {
    case "session":
      return behavior === "allow" ? "user_temporary" : "user_reject";
    case "localSettings":
    case "userSettings":
      return behavior === "allow" ? "user_permanent" : "user_reject";
    default:
      return "config";
  }
}
