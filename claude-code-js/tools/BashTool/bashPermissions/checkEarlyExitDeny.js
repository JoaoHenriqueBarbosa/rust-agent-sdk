// function: checkEarlyExitDeny
function checkEarlyExitDeny(input, toolPermissionContext) {
  let exactMatchResult = bashToolCheckExactMatchPermission(input, toolPermissionContext);
  if (exactMatchResult.behavior !== "passthrough")
    return exactMatchResult;
  let denyMatch = matchingRulesForInput2(input, toolPermissionContext, "prefix").matchingDenyRules[0];
  if (denyMatch !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${BashTool.name} with command ${input.command} has been denied.`,
      decisionReason: { type: "rule", rule: denyMatch }
    };
  return null;
}
