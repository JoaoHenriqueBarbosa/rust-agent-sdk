// Original: src/utils/permissions/bypassPermissionsKillswitch.ts
async function checkAndDisableBypassPermissionsIfNeeded(toolPermissionContext, setAppState) {
  if (bypassPermissionsCheckRan)
    return;
  if (bypassPermissionsCheckRan = !0, !toolPermissionContext.isBypassPermissionsModeAvailable)
    return;
  if (!await shouldDisableBypassPermissions())
    return;
  setAppState((prev) => {
    return {
      ...prev,
      toolPermissionContext: createDisabledBypassPermissionsContext(prev.toolPermissionContext)
    };
  });
}
function resetBypassPermissionsCheck() {
  bypassPermissionsCheckRan = !1;
}
function useKickOffCheckAndDisableBypassPermissionsIfNeeded() {
  let toolPermissionContext = useAppState((s2) => s2.toolPermissionContext), setAppState = useSetAppState();
  import_react60.useEffect(() => {
    if (getIsRemoteMode())
      return;
    checkAndDisableBypassPermissionsIfNeeded(toolPermissionContext, setAppState);
  }, []);
}
async function checkAndDisableAutoModeIfNeeded(toolPermissionContext, setAppState, fastMode) {}
function resetAutoModeGateCheck() {
  autoModeCheckRan = !1;
}
function useKickOffCheckAndDisableAutoModeIfNeeded() {
  let mainLoopModel = useAppState((s2) => s2.mainLoopModel), mainLoopModelForSession = useAppState((s2) => s2.mainLoopModelForSession), fastMode = useAppState((s2) => s2.fastMode), setAppState = useSetAppState(), store = useAppStateStore(), isFirstRunRef = import_react60.useRef(!0);
  import_react60.useEffect(() => {
    if (getIsRemoteMode())
      return;
    if (isFirstRunRef.current)
      isFirstRunRef.current = !1;
    else
      resetAutoModeGateCheck();
    checkAndDisableAutoModeIfNeeded(store.getState().toolPermissionContext, setAppState, fastMode);
  }, [mainLoopModel, mainLoopModelForSession, fastMode]);
}
var import_react60, bypassPermissionsCheckRan = !1, autoModeCheckRan = !1;
var init_bypassPermissionsKillswitch = __esm(() => {
  init_AppState();
  init_state();
  init_permissionSetup();
  import_react60 = __toESM(require_react_development(), 1);
});
