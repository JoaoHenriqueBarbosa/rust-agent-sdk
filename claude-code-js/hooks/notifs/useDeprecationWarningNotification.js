// Original: src/hooks/notifs/useDeprecationWarningNotification.tsx
function useDeprecationWarningNotification(model) {
  let $3 = import_compiler_runtime354.c(4), {
    addNotification
  } = useNotifications(), lastWarningRef = import_react292.useRef(null), t0, t1;
  if ($3[0] !== addNotification || $3[1] !== model)
    t0 = () => {
      if (getIsRemoteMode())
        return;
      let deprecationWarning = getModelDeprecationWarning(model);
      if (deprecationWarning && deprecationWarning !== lastWarningRef.current)
        lastWarningRef.current = deprecationWarning, addNotification({
          key: "model-deprecation-warning",
          text: deprecationWarning,
          color: "warning",
          priority: "high"
        });
      if (!deprecationWarning)
        lastWarningRef.current = null;
    }, t1 = [model, addNotification], $3[0] = addNotification, $3[1] = model, $3[2] = t0, $3[3] = t1;
  else
    t0 = $3[2], t1 = $3[3];
  import_react292.useEffect(t0, t1);
}
var import_compiler_runtime354, import_react292;
var init_useDeprecationWarningNotification = __esm(() => {
  init_notifications();
  init_deprecation();
  init_state();
  import_compiler_runtime354 = __toESM(require_react_compiler_runtime_development(), 1), import_react292 = __toESM(require_react_development(), 1);
});
