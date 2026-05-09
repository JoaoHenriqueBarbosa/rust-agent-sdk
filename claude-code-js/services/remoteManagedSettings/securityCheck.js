// Original: src/services/remoteManagedSettings/securityCheck.tsx
async function checkManagedSettingsSecurity(cachedSettings, newSettings) {
  if (!newSettings || !hasDangerousSettings(extractDangerousSettings(newSettings)))
    return "no_check_needed";
  if (!hasDangerousSettingsChanged(cachedSettings, newSettings))
    return "no_check_needed";
  if (!getIsInteractive())
    return "no_check_needed";
  return logEvent("tengu_managed_settings_security_dialog_shown", {}), new Promise((resolve26) => {
    (async () => {
      let {
        unmount
      } = await render(/* @__PURE__ */ jsx_dev_runtime59.jsxDEV(AppStateProvider, {
        children: /* @__PURE__ */ jsx_dev_runtime59.jsxDEV(KeybindingSetup, {
          children: /* @__PURE__ */ jsx_dev_runtime59.jsxDEV(ManagedSettingsSecurityDialog, {
            settings: newSettings,
            onAccept: () => {
              logEvent("tengu_managed_settings_security_dialog_accepted", {}), unmount(), resolve26("approved");
            },
            onReject: () => {
              logEvent("tengu_managed_settings_security_dialog_rejected", {}), unmount(), resolve26("rejected");
            }
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), getBaseRenderOptions(!1));
    })();
  });
}
function handleSecurityCheckResult(result) {
  if (result === "rejected")
    return gracefulShutdownSync(1), !1;
  return !0;
}
var jsx_dev_runtime59;
var init_securityCheck = __esm(() => {
  init_state();
  init_ManagedSettingsSecurityDialog();
  init_utils8();
  init_ink2();
  init_KeybindingProviderSetup();
  init_AppState();
  init_gracefulShutdown();
  init_renderOptions();
  jsx_dev_runtime59 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
