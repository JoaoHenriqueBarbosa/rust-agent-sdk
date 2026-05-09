// function: checkCommandAndSuggestRules
async function checkCommandAndSuggestRules(input, toolPermissionContext, commandPrefixResult, compoundCommandHasCd, astParseSucceeded) {
  let exactMatchResult = bashToolCheckExactMatchPermission(input, toolPermissionContext);
  if (exactMatchResult.behavior !== "passthrough")
    return exactMatchResult;
  let permissionResult = bashToolCheckPermission(input, toolPermissionContext, compoundCommandHasCd);
  if (permissionResult.behavior === "deny" || permissionResult.behavior === "ask")
    return permissionResult;
  if (!astParseSucceeded && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
    let safetyResult = await bashCommandIsSafeAsync(input.command);
    if (safetyResult.behavior !== "passthrough") {
      let decisionReason = {
        type: "other",
        reason: safetyResult.behavior === "ask" && safetyResult.message ? safetyResult.message : "This command contains patterns that could pose security risks and requires approval"
      };
      return {
        behavior: "ask",
        message: createPermissionRequestMessage2(BashTool.name, decisionReason),
        decisionReason,
        suggestions: []
      };
    }
  }
  if (permissionResult.behavior === "allow")
    return permissionResult;
  let suggestedUpdates = commandPrefixResult?.commandPrefix ? suggestionForPrefix2(commandPrefixResult.commandPrefix) : suggestionForExactCommand3(input.command);
  return {
    ...permissionResult,
    suggestions: suggestedUpdates
  };
}
