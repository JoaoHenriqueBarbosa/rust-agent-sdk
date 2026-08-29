// Original: src/components/PromptInput/useShowFastIconHint.ts
function useShowFastIconHint(showFastIcon) {
  let [showHint, setShowHint] = import_react256.useState(!1);
  return import_react256.useEffect(() => {
    if (hasShownThisSession || !showFastIcon)
      return;
    hasShownThisSession = !0, setShowHint(!0);
    let timer = setTimeout(setShowHint, HINT_DISPLAY_DURATION_MS, !1);
    return () => {
      clearTimeout(timer), setShowHint(!1);
    };
  }, [showFastIcon]), showHint;
}
var import_react256, HINT_DISPLAY_DURATION_MS = 5000, hasShownThisSession = !1;
var init_useShowFastIconHint = __esm(() => {
  import_react256 = __toESM(require_react_development(), 1);
});
