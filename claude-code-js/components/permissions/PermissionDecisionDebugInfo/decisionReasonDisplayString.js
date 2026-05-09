// function: decisionReasonDisplayString
function decisionReasonDisplayString(decisionReason) {
  if (decisionReason.type === "classifier")
    return `${source_default.bold(decisionReason.classifier)} classifier: ${decisionReason.reason}`;
  switch (decisionReason.type) {
    case "rule":
      return `${source_default.bold(permissionRuleValueToString(decisionReason.rule.ruleValue))} rule from ${getSettingSourceDisplayNameLowercase(decisionReason.rule.source)}`;
    case "mode":
      return `${permissionModeTitle(decisionReason.mode)} mode`;
    case "sandboxOverride":
      return "Requires permission to bypass sandbox";
    case "workingDir":
      return decisionReason.reason;
    case "safetyCheck":
    case "other":
      return decisionReason.reason;
    case "permissionPromptTool":
      return `${source_default.bold(decisionReason.permissionPromptToolName)} permission prompt tool`;
    case "hook":
      return decisionReason.reason ? `${source_default.bold(decisionReason.hookName)} hook: ${decisionReason.reason}` : `${source_default.bold(decisionReason.hookName)} hook`;
    case "asyncAgent":
      return decisionReason.reason;
    default:
      return "";
  }
}
