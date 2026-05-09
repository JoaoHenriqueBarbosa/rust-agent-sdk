// Original: src/commands/privacy-settings/privacy-settings.tsx
var exports_privacy_settings = {};
__export(exports_privacy_settings, {
  call: () => call44
});
async function call44(onDone) {
  if (!await isQualifiedForGrove())
    return onDone(FALLBACK_MESSAGE), null;
  let [settingsResult, configResult] = await Promise.all([getGroveSettings(), getGroveNoticeConfig()]);
  if (!settingsResult.success)
    return onDone(FALLBACK_MESSAGE), null;
  let settings = settingsResult.data, config11 = configResult.success ? configResult.data : null;
  async function onDoneWithDecision(decision) {
    if (decision === "escape" || decision === "defer") {
      onDone("Privacy settings dialog dismissed", {
        display: "system"
      });
      return;
    }
    await onDoneWithSettingsCheck();
  }
  async function onDoneWithSettingsCheck() {
    let updatedSettingsResult = await getGroveSettings();
    if (!updatedSettingsResult.success) {
      onDone("Unable to retrieve updated privacy settings", {
        display: "system"
      });
      return;
    }
    let updatedSettings = updatedSettingsResult.data, groveStatus = updatedSettings.grove_enabled ? "true" : "false";
    if (onDone(`"Help improve Claude" set to ${groveStatus}.`), settings.grove_enabled !== null && settings.grove_enabled !== updatedSettings.grove_enabled)
      logEvent("tengu_grove_policy_toggled", {
        state: updatedSettings.grove_enabled,
        location: "settings"
      });
  }
  if (settings.grove_enabled !== null)
    return /* @__PURE__ */ jsx_dev_runtime307.jsxDEV(PrivacySettingsDialog, {
      settings,
      domainExcluded: config11?.domain_excluded,
      onDone: onDoneWithSettingsCheck
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime307.jsxDEV(GroveDialog, {
    showIfAlreadyViewed: !0,
    onDone: onDoneWithDecision,
    location: "settings"
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime307, FALLBACK_MESSAGE = "Review and manage your privacy settings at https://claude.ai/settings/data-privacy-controls";
var init_privacy_settings = __esm(() => {
  init_Grove();
  init_grove();
  jsx_dev_runtime307 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
