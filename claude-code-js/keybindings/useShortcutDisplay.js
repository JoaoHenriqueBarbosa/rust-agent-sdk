// Original: src/keybindings/useShortcutDisplay.ts
function useShortcutDisplay(action, context3, fallback) {
  let keybindingContext = useOptionalKeybindingContext(), resolved = keybindingContext?.getDisplayText(action, context3), isFallback = resolved === void 0, reason = keybindingContext ? "action_not_found" : "no_context", hasLoggedRef = import_react32.useRef(!1);
  return import_react32.useEffect(() => {
    if (isFallback && !hasLoggedRef.current)
      hasLoggedRef.current = !0, logEvent("tengu_keybinding_fallback_used", {
        action,
        context: context3,
        fallback,
        reason
      });
  }, [isFallback, action, context3, fallback, reason]), isFallback ? fallback : resolved;
}
var import_react32;
var init_useShortcutDisplay = __esm(() => {
  init_KeybindingContext();
  import_react32 = __toESM(require_react_development(), 1);
});
