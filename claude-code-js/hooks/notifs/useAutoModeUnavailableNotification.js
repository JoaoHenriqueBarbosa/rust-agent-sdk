// Original: src/hooks/notifs/useAutoModeUnavailableNotification.ts
function useAutoModeUnavailableNotification() {
  let { addNotification } = useNotifications(), mode = useAppState((s2) => s2.toolPermissionContext.mode), isAutoModeAvailable = useAppState((s2) => s2.toolPermissionContext.isAutoModeAvailable), shownRef = import_react287.useRef(!1), prevModeRef = import_react287.useRef(mode);
  import_react287.useEffect(() => {
    let prevMode = prevModeRef.current;
    prevModeRef.current = mode;
    return;
  }, [mode, isAutoModeAvailable, addNotification]);
}
var import_react287;
var init_useAutoModeUnavailableNotification = __esm(() => {
  init_notifications();
  init_state();
  init_AppState();
  init_permissionSetup();
  init_settings2();
  import_react287 = __toESM(require_react_development(), 1);
});
