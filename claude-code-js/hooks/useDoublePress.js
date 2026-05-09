// Original: src/hooks/useDoublePress.ts
function useDoublePress(setPending, onDoublePress, onFirstPress) {
  let lastPressRef = import_react37.useRef(0), timeoutRef = import_react37.useRef(void 0), clearTimeoutSafe = import_react37.useCallback(() => {
    if (timeoutRef.current)
      clearTimeout(timeoutRef.current), timeoutRef.current = void 0;
  }, []);
  return import_react37.useEffect(() => {
    return () => {
      clearTimeoutSafe();
    };
  }, [clearTimeoutSafe]), import_react37.useCallback(() => {
    let now2 = Date.now();
    if (now2 - lastPressRef.current <= DOUBLE_PRESS_TIMEOUT_MS && timeoutRef.current !== void 0)
      clearTimeoutSafe(), setPending(!1), onDoublePress();
    else
      onFirstPress?.(), setPending(!0), clearTimeoutSafe(), timeoutRef.current = setTimeout((setPending2, timeoutRef2) => {
        setPending2(!1), timeoutRef2.current = void 0;
      }, DOUBLE_PRESS_TIMEOUT_MS, setPending, timeoutRef);
    lastPressRef.current = now2;
  }, [setPending, onDoublePress, onFirstPress, clearTimeoutSafe]);
}
var import_react37, DOUBLE_PRESS_TIMEOUT_MS = 800;
var init_useDoublePress = __esm(() => {
  import_react37 = __toESM(require_react_development(), 1);
});
