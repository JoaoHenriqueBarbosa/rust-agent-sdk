// Original: src/state/onChangeAppState.ts
function externalMetadataToAppState(metadata) {
  return (prev) => ({
    ...prev,
    ...typeof metadata.permission_mode === "string" ? {
      toolPermissionContext: {
        ...prev.toolPermissionContext,
        mode: permissionModeFromString(metadata.permission_mode)
      }
    } : {},
    ...typeof metadata.is_ultraplan_mode === "boolean" ? { isUltraplanMode: metadata.is_ultraplan_mode } : {}
  });
}
function onChangeAppState({
  newState,
  oldState
}) {
  let prevMode = oldState.toolPermissionContext.mode, newMode = newState.toolPermissionContext.mode;
  if (prevMode !== newMode) {
    let prevExternal = toExternalPermissionMode(prevMode), newExternal = toExternalPermissionMode(newMode);
    if (prevExternal !== newExternal) {
      let isUltraplan = newExternal === "plan" && newState.isUltraplanMode && !oldState.isUltraplanMode ? !0 : null;
      notifySessionMetadataChanged({
        permission_mode: newExternal,
        is_ultraplan_mode: isUltraplan
      });
    }
    notifyPermissionModeChanged(newMode);
  }
  if (newState.mainLoopModel !== oldState.mainLoopModel && newState.mainLoopModel === null)
    updateSettingsForSource("userSettings", { model: void 0 }), setMainLoopModelOverride(null);
  if (newState.mainLoopModel !== oldState.mainLoopModel && newState.mainLoopModel !== null)
    updateSettingsForSource("userSettings", { model: newState.mainLoopModel }), setMainLoopModelOverride(newState.mainLoopModel);
  if (newState.expandedView !== oldState.expandedView) {
    let showExpandedTodos = newState.expandedView === "tasks", showSpinnerTree = newState.expandedView === "teammates";
    if (getGlobalConfig().showExpandedTodos !== showExpandedTodos || getGlobalConfig().showSpinnerTree !== showSpinnerTree)
      saveGlobalConfig((current) => ({
        ...current,
        showExpandedTodos,
        showSpinnerTree
      }));
  }
  if (newState.verbose !== oldState.verbose && getGlobalConfig().verbose !== newState.verbose) {
    let verbose = newState.verbose;
    saveGlobalConfig((current) => ({
      ...current,
      verbose
    }));
  }
  if (newState.settings !== oldState.settings)
    try {
      if (clearApiKeyHelperCache(), clearAwsCredentialsCache(), clearGcpCredentialsCache(), newState.settings.env !== oldState.settings.env)
        applyConfigEnvironmentVariables();
    } catch (error44) {
      logError2(toError(error44));
    }
}
var init_onChangeAppState = __esm(() => {
  init_state();
  init_auth14();
  init_config4();
  init_errors();
  init_log3();
  init_managedEnv();
  init_PermissionMode();
  init_sessionState();
  init_settings2();
});
