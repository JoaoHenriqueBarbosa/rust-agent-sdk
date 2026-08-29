// Original: src/utils/model/check1mAccess.ts
function isExtraUsageEnabled() {
  let reason = getGlobalConfig().cachedExtraUsageDisabledReason;
  if (reason === void 0)
    return !1;
  if (reason === null)
    return !0;
  switch (reason) {
    case "out_of_credits":
      return !0;
    case "overage_not_provisioned":
    case "org_level_disabled":
    case "org_level_disabled_until":
    case "seat_tier_level_disabled":
    case "member_level_disabled":
    case "seat_tier_zero_credit_limit":
    case "group_zero_credit_limit":
    case "member_zero_credit_limit":
    case "org_service_level_disabled":
    case "org_service_zero_credit_limit":
    case "no_limits_configured":
    case "unknown":
      return !1;
    default:
      return !1;
  }
}
function checkOpus1mAccess() {
  if (is1mContextDisabled())
    return !1;
  if (isClaudeAISubscriber())
    return isExtraUsageEnabled();
  return !0;
}
function checkSonnet1mAccess() {
  if (is1mContextDisabled())
    return !1;
  if (isClaudeAISubscriber())
    return isExtraUsageEnabled();
  return !0;
}
var init_check1mAccess = __esm(() => {
  init_auth14();
  init_config4();
  init_context();
});
