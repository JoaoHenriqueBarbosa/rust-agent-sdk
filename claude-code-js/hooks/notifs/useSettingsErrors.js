// Original: src/hooks/notifs/useSettingsErrors.tsx
function useSettingsErrors() {
  let $3 = import_compiler_runtime158.c(6), {
    addNotification,
    removeNotification
  } = useNotifications(), [errors_0, setErrors] = import_react112.useState(_temp87), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = () => {
      let {
        errors: errors_1
      } = getSettingsWithAllErrors();
      setErrors(errors_1);
    }, $3[0] = t0;
  else
    t0 = $3[0];
  useSettingsChange(t0);
  let t1, t2;
  if ($3[1] !== addNotification || $3[2] !== errors_0 || $3[3] !== removeNotification)
    t1 = () => {
      if (getIsRemoteMode())
        return;
      if (errors_0.length > 0) {
        let message = `Found ${errors_0.length} settings ${errors_0.length === 1 ? "issue" : "issues"} \xB7 /doctor for details`;
        addNotification({
          key: SETTINGS_ERRORS_NOTIFICATION_KEY,
          text: message,
          color: "warning",
          priority: "high",
          timeoutMs: 60000
        });
      } else
        removeNotification(SETTINGS_ERRORS_NOTIFICATION_KEY);
    }, t2 = [errors_0, addNotification, removeNotification], $3[1] = addNotification, $3[2] = errors_0, $3[3] = removeNotification, $3[4] = t1, $3[5] = t2;
  else
    t1 = $3[4], t2 = $3[5];
  return import_react112.useEffect(t1, t2), errors_0;
}
function _temp87() {
  let {
    errors: errors8
  } = getSettingsWithAllErrors();
  return errors8;
}
var import_compiler_runtime158, import_react112, SETTINGS_ERRORS_NOTIFICATION_KEY = "settings-errors";
var init_useSettingsErrors = __esm(() => {
  init_notifications();
  init_state();
  init_allErrors();
  init_useSettingsChange();
  import_compiler_runtime158 = __toESM(require_react_compiler_runtime_development(), 1), import_react112 = __toESM(require_react_development(), 1);
});
