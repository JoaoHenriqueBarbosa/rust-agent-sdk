// function: decisionReasonToOTelSource
function decisionReasonToOTelSource(reason, behavior) {
  if (!reason)
    return "config";
  switch (reason.type) {
    case "permissionPromptTool": {
      let classified = reason.toolResult?.decisionClassification;
      if (classified === "user_temporary" || classified === "user_permanent" || classified === "user_reject")
        return classified;
      return behavior === "allow" ? "user_temporary" : "user_reject";
    }
    case "rule":
      return ruleSourceToOTelSource(reason.rule.source, behavior);
    case "hook":
      return "hook";
    case "mode":
    case "classifier":
    case "subcommandResults":
    case "asyncAgent":
    case "sandboxOverride":
    case "workingDir":
    case "safetyCheck":
    case "other":
      return "config";
    default: {
      let _exhaustive = reason;
      return "config";
    }
  }
}
