// Original: src/hooks/useMinDisplayTime.ts
function useMinDisplayTime(value, minMs) {
  let [displayed, setDisplayed] = import_react69.useState(value), lastShownAtRef = import_react69.useRef(0);
  return import_react69.useEffect(() => {
    let elapsed = Date.now() - lastShownAtRef.current;
    if (elapsed >= minMs) {
      lastShownAtRef.current = Date.now(), setDisplayed(value);
      return;
    }
    let timer = setTimeout((shownAtRef, setFn, v2) => {
      shownAtRef.current = Date.now(), setFn(v2);
    }, minMs - elapsed, lastShownAtRef, setDisplayed, value);
    return () => clearTimeout(timer);
  }, [value, minMs]), displayed;
}
var import_react69;
var init_useMinDisplayTime = __esm(() => {
  import_react69 = __toESM(require_react_development(), 1);
});
