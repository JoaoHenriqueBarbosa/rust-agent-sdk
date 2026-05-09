// Original: src/commands/logout/logout.tsx
var exports_logout = {};
__export(exports_logout, {
  performLogout: () => performLogout,
  clearAuthRelatedCaches: () => clearAuthRelatedCaches,
  call: () => call
});
async function performLogout({
  clearOnboarding = !1
}) {
  let {
    flushTelemetry: flushTelemetry2
  } = await Promise.resolve().then(() => (init_instrumentation(), exports_instrumentation));
  await flushTelemetry2(), await removeApiKey(), getSecureStorage().delete(), await clearAuthRelatedCaches(), saveGlobalConfig((current) => {
    let updated = {
      ...current
    };
    if (clearOnboarding) {
      if (updated.hasCompletedOnboarding = !1, updated.subscriptionNoticeCount = 0, updated.hasAvailableSubscription = !1, updated.customApiKeyResponses?.approved)
        updated.customApiKeyResponses = {
          ...updated.customApiKeyResponses,
          approved: []
        };
    }
    return updated.oauthAccount = void 0, updated;
  });
}
async function clearAuthRelatedCaches() {
  getClaudeAIOAuthTokens.cache?.clear?.(), clearBetasCaches(), clearToolSchemaCache(), resetUserCache(), getGroveNoticeConfig.cache?.clear?.(), getGroveSettings.cache?.clear?.(), await clearRemoteManagedSettingsCache(), await clearPolicyLimitsCache();
}
async function call() {
  await performLogout({
    clearOnboarding: !0
  });
  let message = /* @__PURE__ */ jsx_dev_runtime60.jsxDEV(ThemedText, {
    children: "Successfully logged out from your Anthropic account."
  }, void 0, !1, void 0, this);
  return setTimeout(() => {
    gracefulShutdownSync(0, "logout");
  }, 200), message;
}
var jsx_dev_runtime60;
var init_logout = __esm(() => {
  init_ink2();
  init_grove();
  init_policyLimits();
  init_remoteManagedSettings();
  init_auth14();
  init_betas2();
  init_config4();
  init_gracefulShutdown();
  init_secureStorage();
  init_toolSchemaCache();
  init_user();
  jsx_dev_runtime60 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
