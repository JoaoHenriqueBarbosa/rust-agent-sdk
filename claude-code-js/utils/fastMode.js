// Original: src/utils/fastMode.ts
function isFastModeEnabled() {
  return !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}
function isFastModeAvailable() {
  if (!isFastModeEnabled())
    return !1;
  return getFastModeUnavailableReason() === null;
}
function getDisabledReasonMessage(disabledReason, authType) {
  switch (disabledReason) {
    case "free":
      return authType === "oauth" ? "Fast mode requires a paid subscription" : "Fast mode unavailable during evaluation. Please purchase credits.";
    case "preference":
      return "Fast mode has been disabled by your organization";
    case "extra_usage_disabled":
      return "Fast mode requires extra usage billing \xB7 /extra-usage to enable";
    case "network_error":
      return "Fast mode unavailable due to network connectivity issues";
    case "unknown":
      return "Fast mode is currently unavailable";
  }
}
function getFastModeUnavailableReason() {
  if (!isFastModeEnabled())
    return "Fast mode is not available";
  if (getIsNonInteractiveSession() && preferThirdPartyAuthentication() && !getKairosActive()) {
    if (!getSettingsForSource("flagSettings")?.fastMode)
      return logForDebugging("Fast mode unavailable: Fast mode is not available in the Agent SDK"), "Fast mode is not available in the Agent SDK";
  }
  if (getAPIProvider() !== "firstParty")
    return logForDebugging("Fast mode unavailable: Fast mode is not available on Bedrock, Vertex, or Foundry"), "Fast mode is not available on Bedrock, Vertex, or Foundry";
  if (orgStatus.status === "disabled") {
    if (orgStatus.reason === "network_error" || orgStatus.reason === "unknown") {
      if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS))
        return null;
    }
    let authType = getClaudeAIOAuthTokens() !== null ? "oauth" : "api-key", reason = getDisabledReasonMessage(orgStatus.reason, authType);
    return logForDebugging(`Fast mode unavailable: ${reason}`), reason;
  }
  return null;
}
function getFastModeModel() {
  return "opus" + (isOpus1mMergeEnabled() ? "[1m]" : "");
}
function getInitialFastModeSetting(model) {
  if (!isFastModeEnabled())
    return !1;
  if (!isFastModeAvailable())
    return !1;
  if (!isFastModeSupportedByModel(model))
    return !1;
  let settings = getInitialSettings();
  if (settings.fastModePerSessionOptIn)
    return !1;
  return settings.fastMode === !0;
}
function isFastModeSupportedByModel(modelSetting) {
  if (!isFastModeEnabled())
    return !1;
  let model = modelSetting ?? getDefaultMainLoopModelSetting();
  return parseUserSpecifiedModel(model).toLowerCase().includes("opus-4-6");
}
function getFastModeRuntimeState() {
  if (runtimeState.status === "cooldown" && Date.now() >= runtimeState.resetAt) {
    if (isFastModeEnabled() && !hasLoggedCooldownExpiry)
      logForDebugging("Fast mode cooldown expired, re-enabling fast mode"), hasLoggedCooldownExpiry = !0, cooldownExpired.emit();
    runtimeState = { status: "active" };
  }
  return runtimeState;
}
function triggerFastModeCooldown(resetTimestamp, reason) {
  if (!isFastModeEnabled())
    return;
  runtimeState = { status: "cooldown", resetAt: resetTimestamp, reason }, hasLoggedCooldownExpiry = !1;
  let cooldownDurationMs = resetTimestamp - Date.now();
  logForDebugging(`Fast mode cooldown triggered (${reason}), duration ${Math.round(cooldownDurationMs / 1000)}s`), logEvent("tengu_fast_mode_fallback_triggered", {
    cooldown_duration_ms: cooldownDurationMs,
    cooldown_reason: reason
  }), cooldownTriggered.emit(resetTimestamp, reason);
}
function clearFastModeCooldown() {
  runtimeState = { status: "active" };
}
function handleFastModeRejectedByAPI() {
  if (orgStatus.status === "disabled")
    return;
  orgStatus = { status: "disabled", reason: "preference" }, updateSettingsForSource("userSettings", { fastMode: void 0 }), saveGlobalConfig((current) => ({
    ...current,
    penguinModeOrgEnabled: !1
  })), orgFastModeChange.emit(!1);
}
function getOverageDisabledMessage(reason) {
  switch (reason) {
    case "out_of_credits":
      return "Fast mode disabled \xB7 extra usage credits exhausted";
    case "org_level_disabled":
    case "org_service_level_disabled":
      return "Fast mode disabled \xB7 extra usage disabled by your organization";
    case "org_level_disabled_until":
      return "Fast mode disabled \xB7 extra usage spending cap reached";
    case "member_level_disabled":
      return "Fast mode disabled \xB7 extra usage disabled for your account";
    case "seat_tier_level_disabled":
    case "seat_tier_zero_credit_limit":
    case "member_zero_credit_limit":
      return "Fast mode disabled \xB7 extra usage not available for your plan";
    case "overage_not_provisioned":
    case "no_limits_configured":
      return "Fast mode requires extra usage billing \xB7 /extra-usage to enable";
    default:
      return "Fast mode disabled \xB7 extra usage not available";
  }
}
function isOutOfCreditsReason(reason) {
  return reason === "org_level_disabled_until" || reason === "out_of_credits";
}
function handleFastModeOverageRejection(reason) {
  let message = getOverageDisabledMessage(reason);
  if (logForDebugging(`Fast mode overage rejection: ${reason ?? "unknown"} \u2014 ${message}`), logEvent("tengu_fast_mode_overage_rejected", {
    overage_disabled_reason: reason ?? "unknown"
  }), !isOutOfCreditsReason(reason))
    updateSettingsForSource("userSettings", { fastMode: void 0 }), saveGlobalConfig((current) => ({
      ...current,
      penguinModeOrgEnabled: !1
    }));
  overageRejection.emit(message);
}
function isFastModeCooldown() {
  return getFastModeRuntimeState().status === "cooldown";
}
function getFastModeState(model, fastModeUserEnabled) {
  let enabled = isFastModeEnabled() && isFastModeAvailable() && !!fastModeUserEnabled && isFastModeSupportedByModel(model);
  if (enabled && isFastModeCooldown())
    return "cooldown";
  if (enabled)
    return "on";
  return "off";
}
async function fetchFastModeStatus(auth9) {
  let endpoint5 = `${getOauthConfig().BASE_API_URL}/api/claude_code_penguin_mode`, headers = "accessToken" in auth9 ? {
    Authorization: `Bearer ${auth9.accessToken}`,
    "anthropic-beta": OAUTH_BETA_HEADER
  } : { "x-api-key": auth9.apiKey };
  return (await axios_default.get(endpoint5, { headers })).data;
}
function resolveFastModeStatusFromCache() {
  if (!isFastModeEnabled())
    return;
  if (orgStatus.status !== "pending")
    return;
  let isAnt = !1, cachedEnabled = getGlobalConfig().penguinModeOrgEnabled === !0;
  orgStatus = isAnt || cachedEnabled ? { status: "enabled" } : { status: "disabled", reason: "unknown" };
}
async function prefetchFastModeStatus() {
  if (isEssentialTrafficOnly())
    return;
  if (!isFastModeEnabled())
    return;
  if (inflightPrefetch)
    return logForDebugging("Fast mode prefetch in progress, returning in-flight promise"), inflightPrefetch;
  let apiKey = getAnthropicApiKey();
  if (!(getClaudeAIOAuthTokens()?.accessToken && hasProfileScope()) && !apiKey) {
    orgStatus = getGlobalConfig().penguinModeOrgEnabled === !0 ? { status: "enabled" } : { status: "disabled", reason: "preference" };
    return;
  }
  let now = Date.now();
  if (now - lastPrefetchAt < PREFETCH_MIN_INTERVAL_MS) {
    logForDebugging("Skipping fast mode prefetch, fetched recently");
    return;
  }
  lastPrefetchAt = now;
  let fetchWithCurrentAuth = async () => {
    let currentTokens = getClaudeAIOAuthTokens(), auth9 = currentTokens?.accessToken && hasProfileScope() ? { accessToken: currentTokens.accessToken } : apiKey ? { apiKey } : null;
    if (!auth9)
      throw Error("No auth available");
    return fetchFastModeStatus(auth9);
  };
  async function doFetch() {
    try {
      let status;
      try {
        status = await fetchWithCurrentAuth();
      } catch (err) {
        if (axios_default.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403 && typeof err.response?.data === "string" && err.response.data.includes("OAuth token has been revoked"))) {
          let failedAccessToken = getClaudeAIOAuthTokens()?.accessToken;
          if (failedAccessToken)
            await handleOAuth401Error(failedAccessToken), status = await fetchWithCurrentAuth();
          else
            throw err;
        } else
          throw err;
      }
      let previousEnabled = orgStatus.status !== "pending" ? orgStatus.status === "enabled" : getGlobalConfig().penguinModeOrgEnabled;
      if (orgStatus = status.enabled ? { status: "enabled" } : {
        status: "disabled",
        reason: status.disabled_reason ?? "preference"
      }, previousEnabled !== status.enabled) {
        if (!status.enabled)
          updateSettingsForSource("userSettings", { fastMode: void 0 });
        saveGlobalConfig((current) => ({
          ...current,
          penguinModeOrgEnabled: status.enabled
        })), orgFastModeChange.emit(status.enabled);
      }
      logForDebugging(`Org fast mode: ${status.enabled ? "enabled" : `disabled (${status.disabled_reason ?? "preference"})`}`);
    } catch (err) {
      orgStatus = getGlobalConfig().penguinModeOrgEnabled === !0 ? { status: "enabled" } : { status: "disabled", reason: "network_error" }, logForDebugging(`Failed to fetch org fast mode status, defaulting to ${orgStatus.status === "enabled" ? "enabled (cached)" : "disabled (network_error)"}: ${err}`, { level: "error" }), logEvent("tengu_org_penguin_mode_fetch_failed", {});
    } finally {
      inflightPrefetch = null;
    }
  }
  return inflightPrefetch = doFetch(), inflightPrefetch;
}
var FAST_MODE_MODEL_DISPLAY = "Opus 4.6", runtimeState, hasLoggedCooldownExpiry = !1, cooldownTriggered, cooldownExpired, onCooldownTriggered, onCooldownExpired, overageRejection, onFastModeOverageRejection, orgStatus, orgFastModeChange, onOrgFastModeChanged, PREFETCH_MIN_INTERVAL_MS = 30000, lastPrefetchAt = 0, inflightPrefetch = null;
var init_fastMode = __esm(() => {
  init_axios2();
  init_oauth();
  init_state();
  init_auth14();
  init_config4();
  init_debug();
  init_envUtils();
  init_model();
  init_providers();
  init_settings2();
  runtimeState = { status: "active" }, cooldownTriggered = createSignal(), cooldownExpired = createSignal(), onCooldownTriggered = cooldownTriggered.subscribe, onCooldownExpired = cooldownExpired.subscribe;
  overageRejection = createSignal(), onFastModeOverageRejection = overageRejection.subscribe;
  orgStatus = { status: "pending" }, orgFastModeChange = createSignal(), onOrgFastModeChanged = orgFastModeChange.subscribe;
});
