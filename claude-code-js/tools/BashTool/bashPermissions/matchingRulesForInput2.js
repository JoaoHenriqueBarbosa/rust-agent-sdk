// function: matchingRulesForInput2
function matchingRulesForInput2(input, toolPermissionContext, matchMode, { skipCompoundCheck = !1 } = {}) {
  let denyRuleByContents = getRuleByContentsForTool(toolPermissionContext, BashTool, "deny"), matchingDenyRules = filterRulesByContentsMatchingInput2(input, denyRuleByContents, matchMode, { stripAllEnvVars: !0, skipCompoundCheck: !0 }), askRuleByContents = getRuleByContentsForTool(toolPermissionContext, BashTool, "ask"), matchingAskRules = filterRulesByContentsMatchingInput2(input, askRuleByContents, matchMode, { stripAllEnvVars: !0, skipCompoundCheck: !0 }), allowRuleByContents = getRuleByContentsForTool(toolPermissionContext, BashTool, "allow"), matchingAllowRules = filterRulesByContentsMatchingInput2(input, allowRuleByContents, matchMode, { skipCompoundCheck });
  return {
    matchingDenyRules,
    matchingAskRules,
    matchingAllowRules
  };
}
