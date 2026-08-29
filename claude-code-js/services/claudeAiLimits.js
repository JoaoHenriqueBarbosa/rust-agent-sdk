// Original: src/services/claudeAiLimits.ts
function computeTimeProgress(resetsAt, windowSeconds) {
  let nowSeconds2 = Date.now() / 1000, windowStart = resetsAt - windowSeconds, elapsed = nowSeconds2 - windowStart;
  return Math.max(0, Math.min(1, elapsed / windowSeconds));
}
function getRawUtilization() {
  return rawUtilization;
}
function extractRawUtilization(headers) {
  let result = {};
  for (let [key2, abbrev] of [
    ["five_hour", "5h"],
    ["seven_day", "7d"]
  ]) {
    let util12 = headers.get(`anthropic-ratelimit-unified-${abbrev}-utilization`), reset4 = headers.get(`anthropic-ratelimit-unified-${abbrev}-reset`);
    if (util12 !== null && reset4 !== null)
      result[key2] = { utilization: Number(util12), resets_at: Number(reset4) };
  }
  return result;
}
function emitStatusChange(limits) {
  currentLimits = limits, statusListeners.forEach((listener2) => listener2(limits));
  let hoursTillReset = Math.round((limits.resetsAt ? limits.resetsAt - Date.now() / 1000 : 0) / 3600);
  logEvent("tengu_claudeai_limits_status_changed", {
    status: limits.status,
    unifiedRateLimitFallbackAvailable: limits.unifiedRateLimitFallbackAvailable,
    hoursTillReset
  });
}
async function makeTestQuery() {
  let model = getSmallFastModel(), anthropic = await getAnthropicClient({
    maxRetries: 0,
    model,
    source: "quota_check"
  }), messages = [{ role: "user", content: "quota" }], betas = getModelBetas(model);
  return anthropic.beta.messages.create({
    model,
    max_tokens: 1,
    messages,
    metadata: getAPIMetadata(),
    ...betas.length > 0 ? { betas } : {}
  }).asResponse();
}
async function checkQuotaStatus() {
  if (isEssentialTrafficOnly())
    return;
  if (!shouldProcessRateLimits(isClaudeAISubscriber()))
    return;
  if (getIsNonInteractiveSession())
    return;
  try {
    let raw = await makeTestQuery();
    extractQuotaStatusFromHeaders(raw.headers);
  } catch (error44) {
    if (error44 instanceof APIError)
      extractQuotaStatusFromError(error44);
  }
}
function getHeaderBasedEarlyWarning(headers, unifiedRateLimitFallbackAvailable) {
  for (let [claimAbbrev, rateLimitType] of Object.entries(EARLY_WARNING_CLAIM_MAP)) {
    let surpassedThreshold = headers.get(`anthropic-ratelimit-unified-${claimAbbrev}-surpassed-threshold`);
    if (surpassedThreshold !== null) {
      let utilizationHeader = headers.get(`anthropic-ratelimit-unified-${claimAbbrev}-utilization`), resetHeader = headers.get(`anthropic-ratelimit-unified-${claimAbbrev}-reset`), utilization = utilizationHeader ? Number(utilizationHeader) : void 0;
      return {
        status: "allowed_warning",
        resetsAt: resetHeader ? Number(resetHeader) : void 0,
        rateLimitType,
        utilization,
        unifiedRateLimitFallbackAvailable,
        isUsingOverage: !1,
        surpassedThreshold: Number(surpassedThreshold)
      };
    }
  }
  return null;
}
function getTimeRelativeEarlyWarning(headers, config10, unifiedRateLimitFallbackAvailable) {
  let { rateLimitType, claimAbbrev, windowSeconds, thresholds } = config10, utilizationHeader = headers.get(`anthropic-ratelimit-unified-${claimAbbrev}-utilization`), resetHeader = headers.get(`anthropic-ratelimit-unified-${claimAbbrev}-reset`);
  if (utilizationHeader === null || resetHeader === null)
    return null;
  let utilization = Number(utilizationHeader), resetsAt = Number(resetHeader), timeProgress = computeTimeProgress(resetsAt, windowSeconds);
  if (!thresholds.some((t2) => utilization >= t2.utilization && timeProgress <= t2.timePct))
    return null;
  return {
    status: "allowed_warning",
    resetsAt,
    rateLimitType,
    utilization,
    unifiedRateLimitFallbackAvailable,
    isUsingOverage: !1
  };
}
function getEarlyWarningFromHeaders(headers, unifiedRateLimitFallbackAvailable) {
  let headerBasedWarning = getHeaderBasedEarlyWarning(headers, unifiedRateLimitFallbackAvailable);
  if (headerBasedWarning)
    return headerBasedWarning;
  for (let config10 of EARLY_WARNING_CONFIGS) {
    let timeRelativeWarning = getTimeRelativeEarlyWarning(headers, config10, unifiedRateLimitFallbackAvailable);
    if (timeRelativeWarning)
      return timeRelativeWarning;
  }
  return null;
}
function computeNewLimitsFromHeaders(headers) {
  let status = headers.get("anthropic-ratelimit-unified-status") || "allowed", resetsAtHeader = headers.get("anthropic-ratelimit-unified-reset"), resetsAt = resetsAtHeader ? Number(resetsAtHeader) : void 0, unifiedRateLimitFallbackAvailable = headers.get("anthropic-ratelimit-unified-fallback") === "available", rateLimitType = headers.get("anthropic-ratelimit-unified-representative-claim"), overageStatus = headers.get("anthropic-ratelimit-unified-overage-status"), overageResetsAtHeader = headers.get("anthropic-ratelimit-unified-overage-reset"), overageResetsAt = overageResetsAtHeader ? Number(overageResetsAtHeader) : void 0, overageDisabledReason = headers.get("anthropic-ratelimit-unified-overage-disabled-reason"), isUsingOverage = status === "rejected" && (overageStatus === "allowed" || overageStatus === "allowed_warning"), finalStatus = status;
  if (status === "allowed" || status === "allowed_warning") {
    let earlyWarning = getEarlyWarningFromHeaders(headers, unifiedRateLimitFallbackAvailable);
    if (earlyWarning)
      return earlyWarning;
    finalStatus = "allowed";
  }
  return {
    status: finalStatus,
    resetsAt,
    unifiedRateLimitFallbackAvailable,
    ...rateLimitType && { rateLimitType },
    ...overageStatus && { overageStatus },
    ...overageResetsAt && { overageResetsAt },
    ...overageDisabledReason && { overageDisabledReason },
    isUsingOverage
  };
}
function cacheExtraUsageDisabledReason(headers) {
  let reason = headers.get("anthropic-ratelimit-unified-overage-disabled-reason") ?? null;
  if (getGlobalConfig().cachedExtraUsageDisabledReason !== reason)
    saveGlobalConfig((current) => ({
      ...current,
      cachedExtraUsageDisabledReason: reason
    }));
}
function extractQuotaStatusFromHeaders(headers) {
  let isSubscriber = isClaudeAISubscriber();
  if (!shouldProcessRateLimits(isSubscriber)) {
    if (rawUtilization = {}, currentLimits.status !== "allowed" || currentLimits.resetsAt)
      emitStatusChange({
        status: "allowed",
        unifiedRateLimitFallbackAvailable: !1,
        isUsingOverage: !1
      });
    return;
  }
  let headersToUse = processRateLimitHeaders(headers);
  rawUtilization = extractRawUtilization(headersToUse);
  let newLimits = computeNewLimitsFromHeaders(headersToUse);
  if (cacheExtraUsageDisabledReason(headersToUse), !isEqual_default(currentLimits, newLimits))
    emitStatusChange(newLimits);
}
function extractQuotaStatusFromError(error44) {
  if (!shouldProcessRateLimits(isClaudeAISubscriber()) || error44.status !== 429)
    return;
  try {
    let newLimits = { ...currentLimits };
    if (error44.headers) {
      let headersToUse = processRateLimitHeaders(error44.headers);
      rawUtilization = extractRawUtilization(headersToUse), newLimits = computeNewLimitsFromHeaders(headersToUse), cacheExtraUsageDisabledReason(headersToUse);
    }
    if (newLimits.status = "rejected", !isEqual_default(currentLimits, newLimits))
      emitStatusChange(newLimits);
  } catch (e) {
    logError2(e);
  }
}
var EARLY_WARNING_CONFIGS, EARLY_WARNING_CLAIM_MAP, currentLimits, rawUtilization, statusListeners;
var init_claudeAiLimits = __esm(() => {
  init_sdk();
  init_isEqual();
  init_state();
  init_auth14();
  init_betas2();
  init_config4();
  init_log3();
  init_model();
  init_claude();
  init_client17();
  init_rateLimitMocking();
  init_rateLimitMessages();
  EARLY_WARNING_CONFIGS = [
    {
      rateLimitType: "five_hour",
      claimAbbrev: "5h",
      windowSeconds: 18000,
      thresholds: [{ utilization: 0.9, timePct: 0.72 }]
    },
    {
      rateLimitType: "seven_day",
      claimAbbrev: "7d",
      windowSeconds: 604800,
      thresholds: [
        { utilization: 0.75, timePct: 0.6 },
        { utilization: 0.5, timePct: 0.35 },
        { utilization: 0.25, timePct: 0.15 }
      ]
    }
  ], EARLY_WARNING_CLAIM_MAP = {
    "5h": "five_hour",
    "7d": "seven_day",
    overage: "overage"
  };
  currentLimits = {
    status: "allowed",
    unifiedRateLimitFallbackAvailable: !1,
    isUsingOverage: !1
  }, rawUtilization = {};
  statusListeners = /* @__PURE__ */ new Set;
});
