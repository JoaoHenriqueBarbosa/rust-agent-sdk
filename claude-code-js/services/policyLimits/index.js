// Original: src/services/policyLimits/index.ts
import { createHash as createHash10 } from "crypto";
import { readFileSync as fsReadFileSync } from "fs";
import { unlink as unlink4, writeFile as writeFile11 } from "fs/promises";
import { join as join59 } from "path";
function isNodeError(e) {
  return e instanceof Error;
}
function initializePolicyLimitsLoadingPromise() {
  if (loadingCompletePromise)
    return;
  if (isPolicyLimitsEligible())
    loadingCompletePromise = new Promise((resolve26) => {
      loadingCompleteResolve = resolve26, setTimeout(() => {
        if (loadingCompleteResolve)
          logForDebugging("Policy limits: Loading promise timed out, resolving anyway"), loadingCompleteResolve(), loadingCompleteResolve = null;
      }, LOADING_PROMISE_TIMEOUT_MS);
    });
}
function getCachePath2() {
  return join59(getClaudeConfigHomeDir(), CACHE_FILENAME);
}
function getPolicyLimitsEndpoint() {
  return `${getOauthConfig().BASE_API_URL}/api/claude_code/policy_limits`;
}
function sortKeysDeep(obj) {
  if (Array.isArray(obj))
    return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === "object") {
    let sorted = {};
    for (let [key2, value] of Object.entries(obj).sort(([a2], [b]) => a2.localeCompare(b)))
      sorted[key2] = sortKeysDeep(value);
    return sorted;
  }
  return obj;
}
function computeChecksum(restrictions) {
  let sorted = sortKeysDeep(restrictions), normalized = jsonStringify(sorted);
  return `sha256:${createHash10("sha256").update(normalized).digest("hex")}`;
}
function isPolicyLimitsEligible() {
  if (getAPIProvider() !== "firstParty")
    return !1;
  if (!isFirstPartyAnthropicBaseUrl())
    return !1;
  try {
    let { key: apiKey } = getAnthropicApiKeyWithSource({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
    if (apiKey)
      return !0;
  } catch {}
  let tokens = getClaudeAIOAuthTokens();
  if (!tokens?.accessToken)
    return !1;
  if (!tokens.scopes?.includes(CLAUDE_AI_INFERENCE_SCOPE))
    return !1;
  if (tokens.subscriptionType !== "enterprise" && tokens.subscriptionType !== "team")
    return !1;
  return !0;
}
async function waitForPolicyLimitsToLoad() {
  if (loadingCompletePromise)
    await loadingCompletePromise;
}
function getAuthHeaders3() {
  try {
    let { key: apiKey } = getAnthropicApiKeyWithSource({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
    if (apiKey)
      return {
        headers: {
          "x-api-key": apiKey
        }
      };
  } catch {}
  let oauthTokens = getClaudeAIOAuthTokens();
  if (oauthTokens?.accessToken)
    return {
      headers: {
        Authorization: `Bearer ${oauthTokens.accessToken}`,
        "anthropic-beta": OAUTH_BETA_HEADER
      }
    };
  return {
    headers: {},
    error: "No authentication available"
  };
}
async function fetchWithRetry(cachedChecksum) {
  let lastResult2 = null;
  for (let attempt = 1;attempt <= DEFAULT_MAX_RETRIES3 + 1; attempt++) {
    if (lastResult2 = await fetchPolicyLimits(cachedChecksum), lastResult2.success)
      return lastResult2;
    if (lastResult2.skipRetry)
      return lastResult2;
    if (attempt > DEFAULT_MAX_RETRIES3)
      return lastResult2;
    let delayMs = getRetryDelay(attempt);
    logForDebugging(`Policy limits: Retry ${attempt}/${DEFAULT_MAX_RETRIES3} after ${delayMs}ms`), await sleep3(delayMs);
  }
  return lastResult2;
}
async function fetchPolicyLimits(cachedChecksum) {
  try {
    await checkAndRefreshOAuthTokenIfNeeded();
    let authHeaders = getAuthHeaders3();
    if (authHeaders.error)
      return {
        success: !1,
        error: "Authentication required for policy limits",
        skipRetry: !0
      };
    let endpoint7 = getPolicyLimitsEndpoint(), headers = {
      ...authHeaders.headers,
      "User-Agent": getClaudeCodeUserAgent()
    };
    if (cachedChecksum)
      headers["If-None-Match"] = `"${cachedChecksum}"`;
    let response7 = await axios_default.get(endpoint7, {
      headers,
      timeout: FETCH_TIMEOUT_MS2,
      validateStatus: (status) => status === 200 || status === 304 || status === 404
    });
    if (response7.status === 304)
      return logForDebugging("Policy limits: Using cached restrictions (304)"), {
        success: !0,
        restrictions: null,
        etag: cachedChecksum
      };
    if (response7.status === 404)
      return logForDebugging("Policy limits: No restrictions found (404)"), {
        success: !0,
        restrictions: {},
        etag: void 0
      };
    let parsed = PolicyLimitsResponseSchema().safeParse(response7.data);
    if (!parsed.success)
      return logForDebugging(`Policy limits: Invalid response format - ${parsed.error.message}`), {
        success: !1,
        error: "Invalid policy limits format"
      };
    return logForDebugging("Policy limits: Fetched successfully"), {
      success: !0,
      restrictions: parsed.data.restrictions
    };
  } catch (error44) {
    let { kind, message } = classifyAxiosError(error44);
    switch (kind) {
      case "auth":
        return {
          success: !1,
          error: "Not authorized for policy limits",
          skipRetry: !0
        };
      case "timeout":
        return { success: !1, error: "Policy limits request timeout" };
      case "network":
        return { success: !1, error: "Cannot connect to server" };
      default:
        return { success: !1, error: message };
    }
  }
}
function loadCachedRestrictions() {
  try {
    let content = fsReadFileSync(getCachePath2(), "utf-8"), data = safeParseJSON(content, !1), parsed = PolicyLimitsResponseSchema().safeParse(data);
    if (!parsed.success)
      return null;
    return parsed.data.restrictions;
  } catch {
    return null;
  }
}
async function saveCachedRestrictions(restrictions) {
  try {
    let path16 = getCachePath2();
    await writeFile11(path16, jsonStringify({ restrictions }, null, 2), {
      encoding: "utf-8",
      mode: 384
    }), logForDebugging(`Policy limits: Saved to ${path16}`);
  } catch (error44) {
    logForDebugging(`Policy limits: Failed to save - ${error44 instanceof Error ? error44.message : "unknown error"}`);
  }
}
async function fetchAndLoadPolicyLimits() {
  if (!isPolicyLimitsEligible())
    return null;
  let cachedRestrictions = loadCachedRestrictions(), cachedChecksum = cachedRestrictions ? computeChecksum(cachedRestrictions) : void 0;
  try {
    let result = await fetchWithRetry(cachedChecksum);
    if (!result.success) {
      if (cachedRestrictions)
        return logForDebugging("Policy limits: Using stale cache after fetch failure"), sessionCache2 = cachedRestrictions, cachedRestrictions;
      return null;
    }
    if (result.restrictions === null && cachedRestrictions)
      return logForDebugging("Policy limits: Cache still valid (304 Not Modified)"), sessionCache2 = cachedRestrictions, cachedRestrictions;
    let newRestrictions = result.restrictions || {};
    if (Object.keys(newRestrictions).length > 0)
      return sessionCache2 = newRestrictions, await saveCachedRestrictions(newRestrictions), logForDebugging("Policy limits: Applied new restrictions successfully"), newRestrictions;
    sessionCache2 = newRestrictions;
    try {
      await unlink4(getCachePath2()), logForDebugging("Policy limits: Deleted cached file (404 response)");
    } catch (e) {
      if (isNodeError(e) && e.code !== "ENOENT")
        logForDebugging(`Policy limits: Failed to delete cached file - ${e.message}`);
    }
    return newRestrictions;
  } catch {
    if (cachedRestrictions)
      return logForDebugging("Policy limits: Using stale cache after error"), sessionCache2 = cachedRestrictions, cachedRestrictions;
    return null;
  }
}
function isPolicyAllowed(policy) {
  let restrictions = getRestrictionsFromCache();
  if (!restrictions) {
    if (isEssentialTrafficOnly() && ESSENTIAL_TRAFFIC_DENY_ON_MISS.has(policy))
      return !1;
    return !0;
  }
  let restriction = restrictions[policy];
  if (!restriction)
    return !0;
  return restriction.allowed;
}
function getRestrictionsFromCache() {
  if (!isPolicyLimitsEligible())
    return null;
  if (sessionCache2)
    return sessionCache2;
  let cachedRestrictions = loadCachedRestrictions();
  if (cachedRestrictions)
    return sessionCache2 = cachedRestrictions, cachedRestrictions;
  return null;
}
async function loadPolicyLimits() {
  if (isPolicyLimitsEligible() && !loadingCompletePromise)
    loadingCompletePromise = new Promise((resolve26) => {
      loadingCompleteResolve = resolve26;
    });
  try {
    if (await fetchAndLoadPolicyLimits(), isPolicyLimitsEligible())
      startBackgroundPolling();
  } finally {
    if (loadingCompleteResolve)
      loadingCompleteResolve(), loadingCompleteResolve = null;
  }
}
async function refreshPolicyLimits() {
  if (await clearPolicyLimitsCache(), !isPolicyLimitsEligible())
    return;
  await fetchAndLoadPolicyLimits(), logForDebugging("Policy limits: Refreshed after auth change");
}
async function clearPolicyLimitsCache() {
  stopBackgroundPolling(), sessionCache2 = null, loadingCompletePromise = null, loadingCompleteResolve = null;
  try {
    await unlink4(getCachePath2());
  } catch {}
}
async function pollPolicyLimits() {
  if (!isPolicyLimitsEligible())
    return;
  let previousCache = sessionCache2 ? jsonStringify(sessionCache2) : null;
  try {
    if (await fetchAndLoadPolicyLimits(), (sessionCache2 ? jsonStringify(sessionCache2) : null) !== previousCache)
      logForDebugging("Policy limits: Changed during background poll");
  } catch {}
}
function startBackgroundPolling() {
  if (pollingIntervalId !== null)
    return;
  if (!isPolicyLimitsEligible())
    return;
  if (pollingIntervalId = setInterval(() => {
    pollPolicyLimits();
  }, POLLING_INTERVAL_MS), pollingIntervalId.unref(), !cleanupRegistered2)
    cleanupRegistered2 = !0, registerCleanup(async () => stopBackgroundPolling());
}
function stopBackgroundPolling() {
  if (pollingIntervalId !== null)
    clearInterval(pollingIntervalId), pollingIntervalId = null;
}
var CACHE_FILENAME = "policy-limits.json", FETCH_TIMEOUT_MS2 = 1e4, DEFAULT_MAX_RETRIES3 = 5, POLLING_INTERVAL_MS = 3600000, pollingIntervalId = null, cleanupRegistered2 = !1, loadingCompletePromise = null, loadingCompleteResolve = null, LOADING_PROMISE_TIMEOUT_MS = 30000, sessionCache2 = null, ESSENTIAL_TRAFFIC_DENY_ON_MISS;
var init_policyLimits = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_errors();
  init_json();
  init_providers();
  init_slowOperations();
  init_withRetry();
  init_types17();
  ESSENTIAL_TRAFFIC_DENY_ON_MISS = /* @__PURE__ */ new Set(["allow_product_feedback"]);
});
