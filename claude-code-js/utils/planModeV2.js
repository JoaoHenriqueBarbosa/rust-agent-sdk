// Original: src/utils/planModeV2.ts
function getPlanModeV2AgentCount() {
  if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
    let count3 = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
    if (!isNaN(count3) && count3 > 0 && count3 <= 10)
      return count3;
  }
  let subscriptionType = getSubscriptionType(), rateLimitTier = getRateLimitTier();
  if (subscriptionType === "max" && rateLimitTier === "default_claude_max_20x")
    return 3;
  if (subscriptionType === "enterprise" || subscriptionType === "team")
    return 3;
  return 1;
}
function getPlanModeV2ExploreAgentCount() {
  if (process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT) {
    let count3 = parseInt(process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT, 10);
    if (!isNaN(count3) && count3 > 0 && count3 <= 10)
      return count3;
  }
  return 3;
}
function isPlanModeInterviewPhaseEnabled() {
  let env5 = process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE;
  if (isEnvTruthy(env5))
    return !0;
  if (isEnvDefinedFalsy(env5))
    return !1;
  return !1;
}
function getPewterLedgerVariant() {
  return null;
}
var init_planModeV2 = __esm(() => {
  init_auth14();
  init_envUtils();
});
