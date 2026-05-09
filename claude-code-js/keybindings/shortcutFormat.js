// Original: src/keybindings/shortcutFormat.ts
function getShortcutDisplay(action, context3, fallback) {
  let bindings = loadKeybindingsSync(), resolved = getBindingDisplayText(action, context3, bindings);
  if (resolved === void 0) {
    let key2 = `${action}:${context3}`;
    if (!LOGGED_FALLBACKS.has(key2))
      LOGGED_FALLBACKS.add(key2), logEvent("tengu_keybinding_fallback_used", {
        action,
        context: context3,
        fallback,
        reason: "action_not_found"
      });
    return fallback;
  }
  return resolved;
}
var LOGGED_FALLBACKS;
var init_shortcutFormat = __esm(() => {
  init_loadUserBindings();
  init_resolver();
  LOGGED_FALLBACKS = /* @__PURE__ */ new Set;
});
