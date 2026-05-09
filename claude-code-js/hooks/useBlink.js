// Original: src/hooks/useBlink.ts
function useBlink(enabled2, intervalMs = BLINK_INTERVAL_MS) {
  let focused = useTerminalFocus(), [ref, time3] = useAnimationFrame(enabled2 && focused ? intervalMs : null);
  if (!enabled2 || !focused)
    return [ref, !0];
  let isVisible = Math.floor(time3 / intervalMs) % 2 === 0;
  return [ref, isVisible];
}
var BLINK_INTERVAL_MS = 600;
var init_useBlink = __esm(() => {
  init_ink2();
});
