// function: powershellToolCheckExactMatchPermission
function powershellToolCheckExactMatchPermission(input, toolPermissionContext) {
  let trimmedCommand = input.command.trim(), { matchingDenyRules, matchingAskRules, matchingAllowRules } = matchingRulesForInput(input, toolPermissionContext, "exact");
  if (matchingDenyRules[0] !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${POWERSHELL_TOOL_NAME} with command ${trimmedCommand} has been denied.`,
      decisionReason: { type: "rule", rule: matchingDenyRules[0] }
    };
  if (matchingAskRules[0] !== void 0)
    return {
      behavior: "ask",
      message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME),
      decisionReason: { type: "rule", rule: matchingAskRules[0] }
    };
  if (matchingAllowRules[0] !== void 0)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: { type: "rule", rule: matchingAllowRules[0] }
    };
  let decisionReason = {
    type: "other",
    reason: "This command requires approval"
  };
  return {
    behavior: "passthrough",
    message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME, decisionReason),
    decisionReason,
    suggestions: suggestionForExactCommand2(trimmedCommand)
  };
}
