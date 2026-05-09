// Original: src/utils/hooks/hooksConfigSnapshot.ts
function getHooksFromAllowedSources() {
  let policySettings = getSettingsForSource("policySettings");
  if (policySettings?.disableAllHooks === !0)
    return {};
  if (policySettings?.allowManagedHooksOnly === !0)
    return policySettings.hooks ?? {};
  if (isRestrictedToPluginOnly("hooks"))
    return policySettings?.hooks ?? {};
  let mergedSettings = getSettings_DEPRECATED();
  if (mergedSettings.disableAllHooks === !0)
    return policySettings?.hooks ?? {};
  return mergedSettings.hooks ?? {};
}
function shouldAllowManagedHooksOnly() {
  let policySettings = getSettingsForSource("policySettings");
  if (policySettings?.allowManagedHooksOnly === !0)
    return !0;
  if (getSettings_DEPRECATED().disableAllHooks === !0 && policySettings?.disableAllHooks !== !0)
    return !0;
  return !1;
}
function shouldDisableAllHooksIncludingManaged() {
  return getSettingsForSource("policySettings")?.disableAllHooks === !0;
}
function captureHooksConfigSnapshot() {
  initialHooksConfig = getHooksFromAllowedSources();
}
function updateHooksConfigSnapshot() {
  resetSettingsCache(), initialHooksConfig = getHooksFromAllowedSources();
}
function getHooksConfigFromSnapshot() {
  if (initialHooksConfig === null)
    captureHooksConfigSnapshot();
  return initialHooksConfig;
}
var initialHooksConfig = null;
var init_hooksConfigSnapshot = __esm(() => {
  init_state();
  init_pluginOnlyPolicy();
  init_settings2();
  init_settingsCache();
});
