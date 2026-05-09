// Original: src/hooks/notifs/useStartupNotification.ts
function useStartupNotification(compute) {
  let { addNotification } = useNotifications(), hasRunRef = import_react282.useRef(!1), computeRef = import_react282.useRef(compute);
  computeRef.current = compute, import_react282.useEffect(() => {
    if (getIsRemoteMode() || hasRunRef.current)
      return;
    hasRunRef.current = !0, Promise.resolve().then(() => computeRef.current()).then((result) => {
      if (!result)
        return;
      for (let n6 of Array.isArray(result) ? result : [result])
        addNotification(n6);
    }).catch(logError2);
  }, [addNotification]);
}
var import_react282;
var init_useStartupNotification = __esm(() => {
  init_state();
  init_notifications();
  init_log3();
  import_react282 = __toESM(require_react_development(), 1);
});
