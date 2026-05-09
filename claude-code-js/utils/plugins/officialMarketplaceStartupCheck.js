// Original: src/utils/plugins/officialMarketplaceStartupCheck.ts
import { join as join145 } from "path";
function isOfficialMarketplaceAutoInstallDisabled() {
  return isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL);
}
function calculateNextRetryDelay(retryCount) {
  let delay4 = RETRY_CONFIG.INITIAL_DELAY_MS * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, retryCount);
  return Math.min(delay4, RETRY_CONFIG.MAX_DELAY_MS);
}
function shouldRetryInstallation(config11) {
  if (!config11.officialMarketplaceAutoInstallAttempted)
    return !0;
  if (config11.officialMarketplaceAutoInstalled)
    return !1;
  let failReason = config11.officialMarketplaceAutoInstallFailReason, retryCount = config11.officialMarketplaceAutoInstallRetryCount || 0, nextRetryTime = config11.officialMarketplaceAutoInstallNextRetryTime, now2 = Date.now();
  if (retryCount >= RETRY_CONFIG.MAX_ATTEMPTS)
    return !1;
  if (failReason === "policy_blocked")
    return !1;
  if (nextRetryTime && now2 < nextRetryTime)
    return !1;
  return failReason === "unknown" || failReason === "git_unavailable" || failReason === "gcs_unavailable" || failReason === void 0;
}
async function checkAndInstallOfficialMarketplace() {
  let config11 = getGlobalConfig();
  if (!shouldRetryInstallation(config11)) {
    let reason = config11.officialMarketplaceAutoInstallFailReason ?? "already_attempted";
    return logForDebugging(`Official marketplace auto-install skipped: ${reason}`), {
      installed: !1,
      skipped: !0,
      reason
    };
  }
  try {
    if (isOfficialMarketplaceAutoInstallDisabled())
      return logForDebugging("Official marketplace auto-install disabled via env var, skipping"), saveGlobalConfig((current) => ({
        ...current,
        officialMarketplaceAutoInstallAttempted: !0,
        officialMarketplaceAutoInstalled: !1,
        officialMarketplaceAutoInstallFailReason: "policy_blocked"
      })), logEvent("tengu_official_marketplace_auto_install", {
        installed: !1,
        skipped: !0,
        policy_blocked: !0
      }), { installed: !1, skipped: !0, reason: "policy_blocked" };
    if ((await loadKnownMarketplacesConfig())[OFFICIAL_MARKETPLACE_NAME])
      return logForDebugging(`Official marketplace '${OFFICIAL_MARKETPLACE_NAME}' already installed, skipping`), saveGlobalConfig((current) => ({
        ...current,
        officialMarketplaceAutoInstallAttempted: !0,
        officialMarketplaceAutoInstalled: !0
      })), { installed: !1, skipped: !0, reason: "already_installed" };
    if (!isSourceAllowedByPolicy(OFFICIAL_MARKETPLACE_SOURCE))
      return logForDebugging("Official marketplace blocked by enterprise policy, skipping"), saveGlobalConfig((current) => ({
        ...current,
        officialMarketplaceAutoInstallAttempted: !0,
        officialMarketplaceAutoInstalled: !1,
        officialMarketplaceAutoInstallFailReason: "policy_blocked"
      })), logEvent("tengu_official_marketplace_auto_install", {
        installed: !1,
        skipped: !0,
        policy_blocked: !0
      }), { installed: !1, skipped: !0, reason: "policy_blocked" };
    let cacheDir = getMarketplacesCacheDir(), installLocation = join145(cacheDir, OFFICIAL_MARKETPLACE_NAME);
    if (await fetchOfficialMarketplaceFromGcs(installLocation, cacheDir) !== null) {
      let known = await loadKnownMarketplacesConfig();
      return known[OFFICIAL_MARKETPLACE_NAME] = {
        source: OFFICIAL_MARKETPLACE_SOURCE,
        installLocation,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      }, await saveKnownMarketplacesConfig(known), saveGlobalConfig((current) => ({
        ...current,
        officialMarketplaceAutoInstallAttempted: !0,
        officialMarketplaceAutoInstalled: !0,
        officialMarketplaceAutoInstallFailReason: void 0,
        officialMarketplaceAutoInstallRetryCount: void 0,
        officialMarketplaceAutoInstallLastAttemptTime: void 0,
        officialMarketplaceAutoInstallNextRetryTime: void 0
      })), logEvent("tengu_official_marketplace_auto_install", {
        installed: !0,
        skipped: !1,
        via_gcs: !0
      }), { installed: !0, skipped: !1 };
    }
    if (!await checkGitAvailable()) {
      logForDebugging("Git not available, skipping official marketplace auto-install");
      let retryCount = (config11.officialMarketplaceAutoInstallRetryCount || 0) + 1, now2 = Date.now(), nextRetryDelay = calculateNextRetryDelay(retryCount), nextRetryTime = now2 + nextRetryDelay, configSaveFailed = !1;
      try {
        saveGlobalConfig((current) => ({
          ...current,
          officialMarketplaceAutoInstallAttempted: !0,
          officialMarketplaceAutoInstalled: !1,
          officialMarketplaceAutoInstallFailReason: "git_unavailable",
          officialMarketplaceAutoInstallRetryCount: retryCount,
          officialMarketplaceAutoInstallLastAttemptTime: now2,
          officialMarketplaceAutoInstallNextRetryTime: nextRetryTime
        }));
      } catch (saveError) {
        configSaveFailed = !0;
        let configError = toError(saveError);
        logError2(configError), logForDebugging(`Failed to save marketplace auto-install git_unavailable state: ${saveError}`, { level: "error" });
      }
      return logEvent("tengu_official_marketplace_auto_install", {
        installed: !1,
        skipped: !0,
        git_unavailable: !0,
        retry_count: retryCount
      }), {
        installed: !1,
        skipped: !0,
        reason: "git_unavailable",
        configSaveFailed
      };
    }
    logForDebugging("Attempting to auto-install official marketplace"), await addMarketplaceSource(OFFICIAL_MARKETPLACE_SOURCE), logForDebugging("Successfully auto-installed official marketplace");
    let previousRetryCount = config11.officialMarketplaceAutoInstallRetryCount || 0;
    return saveGlobalConfig((current) => ({
      ...current,
      officialMarketplaceAutoInstallAttempted: !0,
      officialMarketplaceAutoInstalled: !0,
      officialMarketplaceAutoInstallFailReason: void 0,
      officialMarketplaceAutoInstallRetryCount: void 0,
      officialMarketplaceAutoInstallLastAttemptTime: void 0,
      officialMarketplaceAutoInstallNextRetryTime: void 0
    })), logEvent("tengu_official_marketplace_auto_install", {
      installed: !0,
      skipped: !1,
      retry_count: previousRetryCount
    }), { installed: !0, skipped: !1 };
  } catch (error44) {
    let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
    if (errorMessage4.includes("xcrun: error:"))
      return markGitUnavailable(), logForDebugging("Official marketplace auto-install: git is a non-functional macOS xcrun shim, treating as git_unavailable"), logEvent("tengu_official_marketplace_auto_install", {
        installed: !1,
        skipped: !0,
        git_unavailable: !0,
        macos_xcrun_shim: !0
      }), {
        installed: !1,
        skipped: !0,
        reason: "git_unavailable"
      };
    logForDebugging(`Failed to auto-install official marketplace: ${errorMessage4}`, { level: "error" }), logError2(toError(error44));
    let retryCount = (config11.officialMarketplaceAutoInstallRetryCount || 0) + 1, now2 = Date.now(), nextRetryDelay = calculateNextRetryDelay(retryCount), nextRetryTime = now2 + nextRetryDelay, configSaveFailed = !1;
    try {
      saveGlobalConfig((current) => ({
        ...current,
        officialMarketplaceAutoInstallAttempted: !0,
        officialMarketplaceAutoInstalled: !1,
        officialMarketplaceAutoInstallFailReason: "unknown",
        officialMarketplaceAutoInstallRetryCount: retryCount,
        officialMarketplaceAutoInstallLastAttemptTime: now2,
        officialMarketplaceAutoInstallNextRetryTime: nextRetryTime
      }));
    } catch (saveError) {
      configSaveFailed = !0;
      let configError = toError(saveError);
      logError2(configError), logForDebugging(`Failed to save marketplace auto-install failure state: ${saveError}`, { level: "error" });
    }
    return logEvent("tengu_official_marketplace_auto_install", {
      installed: !1,
      skipped: !0,
      failed: !0,
      retry_count: retryCount
    }), {
      installed: !1,
      skipped: !0,
      reason: "unknown",
      configSaveFailed
    };
  }
}
var RETRY_CONFIG;
var init_officialMarketplaceStartupCheck = __esm(() => {
  init_config4();
  init_debug();
  init_envUtils();
  init_errors();
  init_log3();
  init_gitAvailability();
  init_marketplaceHelpers();
  init_marketplaceManager();
  init_officialMarketplace();
  init_officialMarketplaceGcs();
  RETRY_CONFIG = {
    MAX_ATTEMPTS: 10,
    INITIAL_DELAY_MS: 3600000,
    BACKOFF_MULTIPLIER: 2,
    MAX_DELAY_MS: 604800000
  };
});
