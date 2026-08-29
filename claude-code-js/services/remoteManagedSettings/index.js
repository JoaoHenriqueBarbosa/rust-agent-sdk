// Original: src/services/remoteManagedSettings/index.ts
import { createHash as createHash11 } from "crypto";
import { open as open7, unlink as unlink5 } from "fs/promises";
function initializeRemoteManagedSettingsLoadingPromise() {
  if (loadingCompletePromise2)
    return;
  if (isRemoteManagedSettingsEligible())
    loadingCompletePromise2 = new Promise((resolve26) => {
      loadingCompleteResolve2 = resolve26, setTimeout(() => {
        if (loadingCompleteResolve2)
          logForDebugging("Remote settings: Loading promise timed out, resolving anyway"), loadingCompleteResolve2(), loadingCompleteResolve2 = null;
      }, LOADING_PROMISE_TIMEOUT_MS2);
    });
}
function getRemoteManagedSettingsEndpoint() {
  return `${getOauthConfig().BASE_API_URL}/api/claude_code/settings`;
}
function sortKeysDeep2(obj) {
  if (Array.isArray(obj))
    return obj.map(sortKeysDeep2);
  if (obj !== null && typeof obj === "object") {
    let sorted = {};
    for (let key2 of Object.keys(obj).sort())
      sorted[key2] = sortKeysDeep2(obj[key2]);
    return sorted;
  }
  return obj;
}
function computeChecksumFromSettings(settings) {
  let sorted = sortKeysDeep2(settings), normalized = jsonStringify(sorted);
  return `sha256:${createHash11("sha256").update(normalized).digest("hex")}`;
}
function isEligibleForRemoteManagedSettings() {
  return isRemoteManagedSettingsEligible();
}
async function waitForRemoteManagedSettingsToLoad() {
  if (loadingCompletePromise2)
    await loadingCompletePromise2;
}
function getRemoteSettingsAuthHeaders() {
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
async function fetchWithRetry2(cachedChecksum) {
  let lastResult2 = null;
  for (let attempt = 1;attempt <= DEFAULT_MAX_RETRIES4 + 1; attempt++) {
    if (lastResult2 = await fetchRemoteManagedSettings(cachedChecksum), lastResult2.success)
      return lastResult2;
    if (lastResult2.skipRetry)
      return lastResult2;
    if (attempt > DEFAULT_MAX_RETRIES4)
      return lastResult2;
    let delayMs = getRetryDelay(attempt);
    logForDebugging(`Remote settings: Retry ${attempt}/${DEFAULT_MAX_RETRIES4} after ${delayMs}ms`), await sleep3(delayMs);
  }
  return lastResult2;
}
async function fetchRemoteManagedSettings(cachedChecksum) {
  try {
    await checkAndRefreshOAuthTokenIfNeeded();
    let authHeaders = getRemoteSettingsAuthHeaders();
    if (authHeaders.error)
      return {
        success: !1,
        error: "Authentication required for remote settings",
        skipRetry: !0
      };
    let endpoint7 = getRemoteManagedSettingsEndpoint(), headers = {
      ...authHeaders.headers,
      "User-Agent": getClaudeCodeUserAgent()
    };
    if (cachedChecksum)
      headers["If-None-Match"] = `"${cachedChecksum}"`;
    let response7 = await axios_default.get(endpoint7, {
      headers,
      timeout: SETTINGS_TIMEOUT_MS,
      validateStatus: (status) => status === 200 || status === 204 || status === 304 || status === 404
    });
    if (response7.status === 304)
      return logForDebugging("Remote settings: Using cached settings (304)"), {
        success: !0,
        settings: null,
        checksum: cachedChecksum
      };
    if (response7.status === 204 || response7.status === 404)
      return logForDebugging(`Remote settings: No settings found (${response7.status})`), {
        success: !0,
        settings: {},
        checksum: void 0
      };
    let parsed = RemoteManagedSettingsResponseSchema().safeParse(response7.data);
    if (!parsed.success)
      return logForDebugging(`Remote settings: Invalid response format - ${parsed.error.message}`), {
        success: !1,
        error: "Invalid remote settings format"
      };
    let settingsValidation = SettingsSchema().safeParse(parsed.data.settings);
    if (!settingsValidation.success)
      return logForDebugging(`Remote settings: Settings validation failed - ${settingsValidation.error.message}`), {
        success: !1,
        error: "Invalid settings structure"
      };
    return logForDebugging("Remote settings: Fetched successfully"), {
      success: !0,
      settings: settingsValidation.data,
      checksum: parsed.data.checksum
    };
  } catch (error44) {
    let { kind, status, message } = classifyAxiosError(error44);
    if (status === 404)
      return { success: !0, settings: {}, checksum: "" };
    switch (kind) {
      case "auth":
        return {
          success: !1,
          error: "Not authorized for remote settings",
          skipRetry: !0
        };
      case "timeout":
        return { success: !1, error: "Remote settings request timeout" };
      case "network":
        return { success: !1, error: "Cannot connect to server" };
      default:
        return { success: !1, error: message };
    }
  }
}
async function saveSettings(settings) {
  try {
    let path16 = getSettingsPath(), handle = await open7(path16, "w", 384);
    try {
      await handle.writeFile(jsonStringify(settings, null, 2), {
        encoding: "utf-8"
      }), await handle.datasync();
    } finally {
      await handle.close();
    }
    logForDebugging(`Remote settings: Saved to ${path16}`);
  } catch (error44) {
    logForDebugging(`Remote settings: Failed to save - ${error44 instanceof Error ? error44.message : "unknown error"}`);
  }
}
async function clearRemoteManagedSettingsCache() {
  stopBackgroundPolling2(), resetSyncCache2(), loadingCompletePromise2 = null, loadingCompleteResolve2 = null;
  try {
    let path16 = getSettingsPath();
    await unlink5(path16);
  } catch {}
}
async function fetchAndLoadRemoteManagedSettings() {
  if (!isRemoteManagedSettingsEligible())
    return null;
  let cachedSettings = getRemoteManagedSettingsSyncFromCache(), cachedChecksum = cachedSettings ? computeChecksumFromSettings(cachedSettings) : void 0;
  try {
    let result = await fetchWithRetry2(cachedChecksum);
    if (!result.success) {
      if (cachedSettings)
        return logForDebugging("Remote settings: Using stale cache after fetch failure"), setSessionCache(cachedSettings), cachedSettings;
      return null;
    }
    if (result.settings === null && cachedSettings)
      return logForDebugging("Remote settings: Cache still valid (304 Not Modified)"), setSessionCache(cachedSettings), cachedSettings;
    let newSettings = result.settings || {};
    if (Object.keys(newSettings).length > 0) {
      let securityResult = await checkManagedSettingsSecurity(cachedSettings, newSettings);
      if (!handleSecurityCheckResult(securityResult))
        return logForDebugging("Remote settings: User rejected new settings, using cached settings"), cachedSettings;
      return setSessionCache(newSettings), await saveSettings(newSettings), logForDebugging("Remote settings: Applied new settings successfully"), newSettings;
    }
    setSessionCache(newSettings);
    try {
      let path16 = getSettingsPath();
      await unlink5(path16), logForDebugging("Remote settings: Deleted cached file (404 response)");
    } catch (e) {
      if (getErrnoCode(e) !== "ENOENT")
        logForDebugging(`Remote settings: Failed to delete cached file - ${e instanceof Error ? e.message : "unknown error"}`);
    }
    return newSettings;
  } catch {
    if (cachedSettings)
      return logForDebugging("Remote settings: Using stale cache after error"), setSessionCache(cachedSettings), cachedSettings;
    return null;
  }
}
async function loadRemoteManagedSettings() {
  if (isRemoteManagedSettingsEligible() && !loadingCompletePromise2)
    loadingCompletePromise2 = new Promise((resolve26) => {
      loadingCompleteResolve2 = resolve26;
    });
  if (getRemoteManagedSettingsSyncFromCache() && loadingCompleteResolve2)
    loadingCompleteResolve2(), loadingCompleteResolve2 = null;
  try {
    let settings = await fetchAndLoadRemoteManagedSettings();
    if (isRemoteManagedSettingsEligible())
      startBackgroundPolling2();
    if (settings !== null)
      settingsChangeDetector.notifyChange("policySettings");
  } finally {
    if (loadingCompleteResolve2)
      loadingCompleteResolve2(), loadingCompleteResolve2 = null;
  }
}
async function refreshRemoteManagedSettings() {
  if (await clearRemoteManagedSettingsCache(), !isRemoteManagedSettingsEligible()) {
    settingsChangeDetector.notifyChange("policySettings");
    return;
  }
  await fetchAndLoadRemoteManagedSettings(), logForDebugging("Remote settings: Refreshed after auth change"), settingsChangeDetector.notifyChange("policySettings");
}
async function pollRemoteSettings() {
  if (!isRemoteManagedSettingsEligible())
    return;
  let prevCache = getRemoteManagedSettingsSyncFromCache(), previousSettings = prevCache ? jsonStringify(prevCache) : null;
  try {
    await fetchAndLoadRemoteManagedSettings();
    let newCache = getRemoteManagedSettingsSyncFromCache();
    if ((newCache ? jsonStringify(newCache) : null) !== previousSettings)
      logForDebugging("Remote settings: Changed during background poll"), settingsChangeDetector.notifyChange("policySettings");
  } catch {}
}
function startBackgroundPolling2() {
  if (pollingIntervalId2 !== null)
    return;
  if (!isRemoteManagedSettingsEligible())
    return;
  pollingIntervalId2 = setInterval(() => {
    pollRemoteSettings();
  }, POLLING_INTERVAL_MS2), pollingIntervalId2.unref(), registerCleanup(async () => stopBackgroundPolling2());
}
function stopBackgroundPolling2() {
  if (pollingIntervalId2 !== null)
    clearInterval(pollingIntervalId2), pollingIntervalId2 = null;
}
var SETTINGS_TIMEOUT_MS = 1e4, DEFAULT_MAX_RETRIES4 = 5, POLLING_INTERVAL_MS2 = 3600000, pollingIntervalId2 = null, loadingCompletePromise2 = null, loadingCompleteResolve2 = null, LOADING_PROMISE_TIMEOUT_MS2 = 30000;
var init_remoteManagedSettings = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_cleanupRegistry();
  init_debug();
  init_errors();
  init_changeDetector();
  init_types3();
  init_slowOperations();
  init_withRetry();
  init_securityCheck();
  init_syncCache();
  init_syncCacheState();
  init_types18();
});
