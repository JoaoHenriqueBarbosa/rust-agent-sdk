// Original: src/hooks/useTimeout.ts
function useTimeout(delay4, resetTrigger) {
  let [isElapsed, setIsElapsed] = import_react304.useState(!1);
  return import_react304.useEffect(() => {
    setIsElapsed(!1);
    let timer = setTimeout(setIsElapsed, delay4, !0);
    return () => clearTimeout(timer);
  }, [delay4, resetTrigger]), isElapsed;
}
var import_react304;
var init_useTimeout = __esm(() => {
  import_react304 = __toESM(require_react_development(), 1);
});
