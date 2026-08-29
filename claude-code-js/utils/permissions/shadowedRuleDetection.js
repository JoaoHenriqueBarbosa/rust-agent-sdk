// Original: src/utils/permissions/shadowedRuleDetection.ts
function isSharedSettingSource(source) {
  return source === "projectSettings" || source === "policySettings" || source === "command";
}
function formatSource(source) {
  return permissionRuleSourceDisplayString(source);
}
function generateFixSuggestion(shadowType, shadowingRule, shadowedRule) {
  let shadowingSource = formatSource(shadowingRule.source), shadowedSource = formatSource(shadowedRule.source), toolName = shadowingRule.ruleValue.toolName;
  if (shadowType === "deny")
    return `Remove the "${toolName}" deny rule from ${shadowingSource}, or remove the specific allow rule from ${shadowedSource}`;
  return `Remove the "${toolName}" ask rule from ${shadowingSource}, or remove the specific allow rule from ${shadowedSource}`;
}
function isAllowRuleShadowedByAskRule(allowRule, askRules, options2) {
  let { toolName, ruleContent } = allowRule.ruleValue;
  if (ruleContent === void 0)
    return { shadowed: !1 };
  let shadowingAskRule = askRules.find((askRule) => askRule.ruleValue.toolName === toolName && askRule.ruleValue.ruleContent === void 0);
  if (!shadowingAskRule)
    return { shadowed: !1 };
  if (toolName === BASH_TOOL_NAME && options2.sandboxAutoAllowEnabled) {
    if (!isSharedSettingSource(shadowingAskRule.source))
      return { shadowed: !1 };
  }
  return { shadowed: !0, shadowedBy: shadowingAskRule, shadowType: "ask" };
}
function isAllowRuleShadowedByDenyRule(allowRule, denyRules) {
  let { toolName, ruleContent } = allowRule.ruleValue;
  if (ruleContent === void 0)
    return { shadowed: !1 };
  let shadowingDenyRule = denyRules.find((denyRule) => denyRule.ruleValue.toolName === toolName && denyRule.ruleValue.ruleContent === void 0);
  if (!shadowingDenyRule)
    return { shadowed: !1 };
  return { shadowed: !0, shadowedBy: shadowingDenyRule, shadowType: "deny" };
}
function detectUnreachableRules(context7, options2) {
  let unreachable = [], allowRules = getAllowRules(context7), askRules = getAskRules(context7), denyRules = getDenyRules(context7);
  for (let allowRule of allowRules) {
    let denyResult = isAllowRuleShadowedByDenyRule(allowRule, denyRules);
    if (denyResult.shadowed) {
      let shadowSource = formatSource(denyResult.shadowedBy.source);
      unreachable.push({
        rule: allowRule,
        reason: `Blocked by "${denyResult.shadowedBy.ruleValue.toolName}" deny rule (from ${shadowSource})`,
        shadowedBy: denyResult.shadowedBy,
        shadowType: "deny",
        fix: generateFixSuggestion("deny", denyResult.shadowedBy, allowRule)
      });
      continue;
    }
    let askResult = isAllowRuleShadowedByAskRule(allowRule, askRules, options2);
    if (askResult.shadowed) {
      let shadowSource = formatSource(askResult.shadowedBy.source);
      unreachable.push({
        rule: allowRule,
        reason: `Shadowed by "${askResult.shadowedBy.ruleValue.toolName}" ask rule (from ${shadowSource})`,
        shadowedBy: askResult.shadowedBy,
        shadowType: "ask",
        fix: generateFixSuggestion("ask", askResult.shadowedBy, allowRule)
      });
    }
  }
  return unreachable;
}
var init_shadowedRuleDetection = __esm(() => {
  init_permissions2();
});
