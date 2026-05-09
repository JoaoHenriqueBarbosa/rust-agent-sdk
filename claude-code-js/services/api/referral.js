// Original: src/services/api/referral.ts
async function fetchReferralEligibility(campaign = "claude_code_guest_pass") {
  let { accessToken, orgUUID } = await prepareApiRequest(), headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  }, url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/referral/eligibility`;
  return (await axios_default.get(url3, {
    headers,
    params: { campaign },
    timeout: 5000
  })).data;
}
async function fetchReferralRedemptions(campaign = "claude_code_guest_pass") {
  let { accessToken, orgUUID } = await prepareApiRequest(), headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  }, url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/referral/redemptions`;
  return (await axios_default.get(url3, {
    headers,
    params: { campaign },
    timeout: 1e4
  })).data;
}
function shouldCheckForPasses() {
  return !!(getOauthAccountInfo()?.organizationUuid && isClaudeAISubscriber() && getSubscriptionType() === "max");
}
function checkCachedPassesEligibility() {
  if (!shouldCheckForPasses())
    return {
      eligible: !1,
      needsRefresh: !1,
      hasCache: !1
    };
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return {
      eligible: !1,
      needsRefresh: !1,
      hasCache: !1
    };
  let cachedEntry = getGlobalConfig().passesEligibilityCache?.[orgId];
  if (!cachedEntry)
    return {
      eligible: !1,
      needsRefresh: !0,
      hasCache: !1
    };
  let { eligible: eligible2, timestamp } = cachedEntry, needsRefresh = Date.now() - timestamp > CACHE_EXPIRATION_MS;
  return {
    eligible: eligible2,
    needsRefresh,
    hasCache: !0
  };
}
function formatCreditAmount(reward) {
  let symbol2 = CURRENCY_SYMBOLS[reward.currency] ?? `${reward.currency} `, amount = reward.amount_minor_units / 100, formatted = amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
  return `${symbol2}${formatted}`;
}
function getCachedReferrerReward() {
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return null;
  return getGlobalConfig().passesEligibilityCache?.[orgId]?.referrer_reward ?? null;
}
function getCachedRemainingPasses() {
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return null;
  return getGlobalConfig().passesEligibilityCache?.[orgId]?.remaining_passes ?? null;
}
async function fetchAndStorePassesEligibility() {
  if (fetchInProgress)
    return logForDebugging("Passes: Reusing in-flight eligibility fetch"), fetchInProgress;
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return null;
  return fetchInProgress = (async () => {
    try {
      let response7 = await fetchReferralEligibility(), cacheEntry = {
        ...response7,
        timestamp: Date.now()
      };
      return saveGlobalConfig((current) => ({
        ...current,
        passesEligibilityCache: {
          ...current.passesEligibilityCache,
          [orgId]: cacheEntry
        }
      })), logForDebugging(`Passes eligibility cached for org ${orgId}: ${response7.eligible}`), response7;
    } catch (error44) {
      return logForDebugging("Failed to fetch and cache passes eligibility"), logError2(error44), null;
    } finally {
      fetchInProgress = null;
    }
  })(), fetchInProgress;
}
async function getCachedOrFetchPassesEligibility() {
  if (!shouldCheckForPasses())
    return null;
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return null;
  let cachedEntry = getGlobalConfig().passesEligibilityCache?.[orgId], now2 = Date.now();
  if (!cachedEntry)
    return logForDebugging("Passes: No cache, fetching eligibility in background (command unavailable this session)"), fetchAndStorePassesEligibility(), null;
  if (now2 - cachedEntry.timestamp > CACHE_EXPIRATION_MS) {
    logForDebugging("Passes: Cache stale, returning cached data and refreshing in background"), fetchAndStorePassesEligibility();
    let { timestamp: timestamp2, ...response8 } = cachedEntry;
    return response8;
  }
  logForDebugging("Passes: Using fresh cached eligibility data");
  let { timestamp, ...response7 } = cachedEntry;
  return response7;
}
async function prefetchPassesEligibility() {
  if (isEssentialTrafficOnly())
    return;
  getCachedOrFetchPassesEligibility();
}
var CACHE_EXPIRATION_MS = 86400000, fetchInProgress = null, CURRENCY_SYMBOLS;
var init_referral = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_config4();
  init_debug();
  init_log3();
  init_api2();
  CURRENCY_SYMBOLS = {
    USD: "$",
    EUR: "\u20AC",
    GBP: "\xA3",
    BRL: "R$",
    CAD: "CA$",
    AUD: "A$",
    NZD: "NZ$",
    SGD: "S$"
  };
});
