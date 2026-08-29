// Original: src/hooks/useNotifyAfterTimeout.ts
function getTimeSinceLastInteraction() {
  return Date.now() - getLastInteractionTime();
}
function hasRecentInteraction(threshold) {
  return getTimeSinceLastInteraction() < threshold;
}
function shouldNotify(threshold) {
  return !hasRecentInteraction(threshold);
}
function useNotifyAfterTimeout(message, notificationType) {
  let terminal = useTerminalNotification();
  import_react201.useEffect(() => {
    updateLastInteractionTime(!0);
  }, []), import_react201.useEffect(() => {
    let hasNotified = !1, timer = setInterval(() => {
      if (shouldNotify(DEFAULT_INTERACTION_THRESHOLD_MS) && !hasNotified)
        hasNotified = !0, clearInterval(timer), sendNotification({ message, notificationType }, terminal);
    }, DEFAULT_INTERACTION_THRESHOLD_MS);
    return () => clearInterval(timer);
  }, [message, notificationType, terminal]);
}
var import_react201, DEFAULT_INTERACTION_THRESHOLD_MS = 6000;
var init_useNotifyAfterTimeout = __esm(() => {
  init_state();
  init_useTerminalNotification();
  init_notifier();
  import_react201 = __toESM(require_react_development(), 1);
});
