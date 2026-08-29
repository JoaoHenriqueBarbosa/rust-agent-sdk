// function: powershellToolCheckPermission
function powershellToolCheckPermission(input, toolPermissionContext) {
  let command12 = input.command.trim(), exactMatchResult = powershellToolCheckExactMatchPermission(input, toolPermissionContext);
  if (exactMatchResult.behavior === "deny" || exactMatchResult.behavior === "ask")
    return exactMatchResult;
  let { matchingDenyRules, matchingAskRules, matchingAllowRules } = matchingRulesForInput(input, toolPermissionContext, "prefix");
  if (matchingDenyRules[0] !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${POWERSHELL_TOOL_NAME} with command ${command12} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: matchingDenyRules[0]
      }
    };
  if (matchingAskRules[0] !== void 0)
    return {
      behavior: "ask",
      message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME),
      decisionReason: {
        type: "rule",
        rule: matchingAskRules[0]
      }
    };
  if (exactMatchResult.behavior === "allow")
    return exactMatchResult;
  if (matchingAllowRules[0] !== void 0)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "rule",
        rule: matchingAllowRules[0]
      }
    };
  let decisionReason = {
    type: "other",
    reason: "This command requires approval"
  };
  return {
    behavior: "passthrough",
    message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME, decisionReason),
    decisionReason,
    suggestions: suggestionForExactCommand2(command12)
  };
}
