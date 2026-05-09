// function: matchingRulesForInput
function matchingRulesForInput(input, toolPermissionContext, matchMode) {
  let denyRuleByContents = getRuleByContentsForToolName(toolPermissionContext, POWERSHELL_TOOL_NAME, "deny"), matchingDenyRules = filterRulesByContentsMatchingInput(input, denyRuleByContents, matchMode, "deny"), askRuleByContents = getRuleByContentsForToolName(toolPermissionContext, POWERSHELL_TOOL_NAME, "ask"), matchingAskRules = filterRulesByContentsMatchingInput(input, askRuleByContents, matchMode, "ask"), allowRuleByContents = getRuleByContentsForToolName(toolPermissionContext, POWERSHELL_TOOL_NAME, "allow"), matchingAllowRules = filterRulesByContentsMatchingInput(input, allowRuleByContents, matchMode, "allow");
  return { matchingDenyRules, matchingAskRules, matchingAllowRules };
}
