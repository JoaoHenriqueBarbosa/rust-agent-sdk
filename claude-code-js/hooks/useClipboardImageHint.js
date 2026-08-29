// Original: src/hooks/useClipboardImageHint.ts
function useClipboardImageHint(isFocused, enabled2) {
  let { addNotification } = useNotifications(), lastFocusedRef = import_react85.useRef(isFocused), lastHintTimeRef = import_react85.useRef(0), checkTimeoutRef = import_react85.useRef(null);
  import_react85.useEffect(() => {
    let wasFocused = lastFocusedRef.current;
    if (lastFocusedRef.current = isFocused, !enabled2 || !isFocused || wasFocused)
      return;
    if (checkTimeoutRef.current)
      clearTimeout(checkTimeoutRef.current);
    return checkTimeoutRef.current = setTimeout(async (checkTimeoutRef2, lastHintTimeRef2, addNotification2) => {
      checkTimeoutRef2.current = null;
      let now2 = Date.now();
      if (now2 - lastHintTimeRef2.current < HINT_COOLDOWN_MS)
        return;
      if (await hasImageInClipboard())
        lastHintTimeRef2.current = now2, addNotification2({
          key: NOTIFICATION_KEY,
          text: `Image in clipboard \xB7 ${getShortcutDisplay("chat:imagePaste", "Chat", "ctrl+v")} to paste`,
          priority: "immediate",
          timeoutMs: 8000
        });
    }, FOCUS_CHECK_DEBOUNCE_MS, checkTimeoutRef, lastHintTimeRef, addNotification), () => {
      if (checkTimeoutRef.current)
        clearTimeout(checkTimeoutRef.current), checkTimeoutRef.current = null;
    };
  }, [isFocused, enabled2, addNotification]);
}
var import_react85, NOTIFICATION_KEY = "clipboard-image-hint", FOCUS_CHECK_DEBOUNCE_MS = 1000, HINT_COOLDOWN_MS = 30000;
var init_useClipboardImageHint = __esm(() => {
  init_notifications();
  init_shortcutFormat();
  init_imagePaste();
  import_react85 = __toESM(require_react_development(), 1);
});
