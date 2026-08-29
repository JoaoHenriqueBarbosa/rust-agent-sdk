// Original: src/utils/settings/applySettingsChange.ts
function applySettingsChange(source, setAppState) {
  let newSettings = getInitialSettings();
  logForDebugging(`Settings changed from ${source}, updating app state`);
  let updatedRules = loadAllPermissionRulesFromDisk();
  updateHooksConfigSnapshot(), setAppState((prev) => {
    let newContext = syncPermissionRulesFromDisk(prev.toolPermissionContext, updatedRules);
    if (newContext.isBypassPermissionsModeAvailable && isBypassPermissionsModeDisabled())
      newContext = createDisabledBypassPermissionsContext(newContext);
    newContext = transitionPlanAutoMode(newContext);
    let prevEffort = prev.settings.effortLevel, newEffort = newSettings.effortLevel;
    return {
      ...prev,
      settings: newSettings,
      toolPermissionContext: newContext,
      ...prevEffort !== newEffort && newEffort !== void 0 ? { effortValue: newEffort } : {}
    };
  });
}
var init_applySettingsChange = __esm(() => {
  init_debug();
  init_hooksConfigSnapshot();
  init_permissionSetup();
  init_permissions2();
  init_permissionsLoader();
  init_settings2();
});
