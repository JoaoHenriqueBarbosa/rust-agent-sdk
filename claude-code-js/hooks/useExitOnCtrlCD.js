// Original: src/hooks/useExitOnCtrlCD.ts
function useExitOnCtrlCD(useKeybindingsHook, onInterrupt, onExit2, isActive = !0) {
  let { exit } = use_app_default(), [exitState, setExitState] = import_react38.useState({
    pending: !1,
    keyName: null
  }), exitFn = import_react38.useMemo(() => onExit2 ?? exit, [onExit2, exit]), handleCtrlCDoublePress = useDoublePress((pending) => setExitState({ pending, keyName: "Ctrl-C" }), exitFn), handleCtrlDDoublePress = useDoublePress((pending) => setExitState({ pending, keyName: "Ctrl-D" }), exitFn), handleInterrupt = import_react38.useCallback(() => {
    if (onInterrupt?.())
      return;
    handleCtrlCDoublePress();
  }, [handleCtrlCDoublePress, onInterrupt]), handleExit = import_react38.useCallback(() => {
    handleCtrlDDoublePress();
  }, [handleCtrlDDoublePress]), handlers = import_react38.useMemo(() => ({
    "app:interrupt": handleInterrupt,
    "app:exit": handleExit
  }), [handleInterrupt, handleExit]);
  return useKeybindingsHook(handlers, { context: "Global", isActive }), exitState;
}
var import_react38;
var init_useExitOnCtrlCD = __esm(() => {
  init_use_app();
  init_useDoublePress();
  import_react38 = __toESM(require_react_development(), 1);
});
