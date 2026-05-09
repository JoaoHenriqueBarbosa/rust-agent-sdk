// Original: src/services/rateLimitMessages.ts
function isRateLimitErrorMessage(text2) {
  return RATE_LIMIT_ERROR_PREFIXES.some((prefix) => text2.startsWith(prefix));
}
function getRateLimitMessage(limits, model) {
  if (limits.isUsingOverage) {
    if (limits.overageStatus === "allowed_warning")
      return {
        message: "You're close to your extra usage spending limit",
        severity: "warning"
      };
    return null;
  }
  if (limits.status === "rejected")
    return { message: getLimitReachedText(limits, model), severity: "error" };
  if (limits.status === "allowed_warning") {
    if (limits.utilization !== void 0 && limits.utilization < 0.7)
      return null;
    let subscriptionType = getSubscriptionType(), isTeamOrEnterprise = subscriptionType === "team" || subscriptionType === "enterprise", hasExtraUsageEnabled = getOauthAccountInfo()?.hasExtraUsageEnabled === !0;
    if (isTeamOrEnterprise && hasExtraUsageEnabled && !hasClaudeAiBillingAccess())
      return null;
    let text2 = getEarlyWarningText(limits);
    if (text2)
      return { message: text2, severity: "warning" };
  }
  return null;
}
function getRateLimitErrorMessage(limits, model) {
  let message = getRateLimitMessage(limits, model);
  if (message && message.severity === "error")
    return message.message;
  return null;
}
function getRateLimitWarning(limits, model) {
  let message = getRateLimitMessage(limits, model);
  if (message && message.severity === "warning")
    return message.message;
  return null;
}
function getLimitReachedText(limits, model) {
  let resetsAt = limits.resetsAt, resetTime = resetsAt ? formatResetTime(resetsAt, !0) : void 0, overageResetTime = limits.overageResetsAt ? formatResetTime(limits.overageResetsAt, !0) : void 0, resetMessage = resetTime ? ` \xB7 resets ${resetTime}` : "";
  if (limits.overageStatus === "rejected") {
    let overageResetMessage = "";
    if (resetsAt && limits.overageResetsAt)
      if (resetsAt < limits.overageResetsAt)
        overageResetMessage = ` \xB7 resets ${resetTime}`;
      else
        overageResetMessage = ` \xB7 resets ${overageResetTime}`;
    else if (resetTime)
      overageResetMessage = ` \xB7 resets ${resetTime}`;
    else if (overageResetTime)
      overageResetMessage = ` \xB7 resets ${overageResetTime}`;
    if (limits.overageDisabledReason === "out_of_credits")
      return `You're out of extra usage${overageResetMessage}`;
    return formatLimitReachedText("limit", overageResetMessage, model);
  }
  if (limits.rateLimitType === "seven_day_sonnet") {
    let subscriptionType = getSubscriptionType();
    return formatLimitReachedText(subscriptionType === "pro" || subscriptionType === "enterprise" ? "weekly limit" : "Sonnet limit", resetMessage, model);
  }
  if (limits.rateLimitType === "seven_day_opus")
    return formatLimitReachedText("Opus limit", resetMessage, model);
  if (limits.rateLimitType === "seven_day")
    return formatLimitReachedText("weekly limit", resetMessage, model);
  if (limits.rateLimitType === "five_hour")
    return formatLimitReachedText("session limit", resetMessage, model);
  return formatLimitReachedText("usage limit", resetMessage, model);
}
function getEarlyWarningText(limits) {
  let limitName = null;
  switch (limits.rateLimitType) {
    case "seven_day":
      limitName = "weekly limit";
      break;
    case "five_hour":
      limitName = "session limit";
      break;
    case "seven_day_opus":
      limitName = "Opus limit";
      break;
    case "seven_day_sonnet":
      limitName = "Sonnet limit";
      break;
    case "overage":
      limitName = "extra usage";
      break;
    case void 0:
      return null;
  }
  let used = limits.utilization ? Math.floor(limits.utilization * 100) : void 0, resetTime = limits.resetsAt ? formatResetTime(limits.resetsAt, !0) : void 0, upsell = getWarningUpsellText(limits.rateLimitType);
  if (used && resetTime) {
    let base3 = `You've used ${used}% of your ${limitName} \xB7 resets ${resetTime}`;
    return upsell ? `${base3} \xB7 ${upsell}` : base3;
  }
  if (used) {
    let base3 = `You've used ${used}% of your ${limitName}`;
    return upsell ? `${base3} \xB7 ${upsell}` : base3;
  }
  if (limits.rateLimitType === "overage")
    limitName += " limit";
  if (resetTime) {
    let base3 = `Approaching ${limitName} \xB7 resets ${resetTime}`;
    return upsell ? `${base3} \xB7 ${upsell}` : base3;
  }
  let base2 = `Approaching ${limitName}`;
  return upsell ? `${base2} \xB7 ${upsell}` : base2;
}
function getWarningUpsellText(rateLimitType) {
  let subscriptionType = getSubscriptionType(), hasExtraUsageEnabled = getOauthAccountInfo()?.hasExtraUsageEnabled === !0;
  if (rateLimitType === "five_hour") {
    if (subscriptionType === "team" || subscriptionType === "enterprise") {
      if (!hasExtraUsageEnabled && isOverageProvisioningAllowed())
        return "/extra-usage to request more";
      return null;
    }
    if (subscriptionType === "pro" || subscriptionType === "max")
      return "/upgrade to keep using Claude Code";
  }
  if (rateLimitType === "overage") {
    if (subscriptionType === "team" || subscriptionType === "enterprise") {
      if (!hasExtraUsageEnabled && isOverageProvisioningAllowed())
        return "/extra-usage to request more";
    }
  }
  return null;
}
function getUsingOverageText(limits) {
  let resetTime = limits.resetsAt ? formatResetTime(limits.resetsAt, !0) : "", limitName = "";
  if (limits.rateLimitType === "five_hour")
    limitName = "session limit";
  else if (limits.rateLimitType === "seven_day")
    limitName = "weekly limit";
  else if (limits.rateLimitType === "seven_day_opus")
    limitName = "Opus limit";
  else if (limits.rateLimitType === "seven_day_sonnet") {
    let subscriptionType = getSubscriptionType();
    limitName = subscriptionType === "pro" || subscriptionType === "enterprise" ? "weekly limit" : "Sonnet limit";
  }
  if (!limitName)
    return "Now using extra usage";
  return `You're now using extra usage${resetTime ? ` \xB7 Your ${limitName} resets ${resetTime}` : ""}`;
}
function formatLimitReachedText(limit, resetMessage, _model) {
  return `You've hit your ${limit}${resetMessage}`;
}
var RATE_LIMIT_ERROR_PREFIXES;
var init_rateLimitMessages = __esm(() => {
  init_auth14();
  init_billing();
  init_format();
  RATE_LIMIT_ERROR_PREFIXES = [
    "You've hit your",
    "You've used",
    "You're now using extra usage",
    "You're close to",
    "You're out of extra usage"
  ];
});
