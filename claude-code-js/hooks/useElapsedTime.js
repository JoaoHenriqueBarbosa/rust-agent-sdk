// Original: src/hooks/useElapsedTime.ts
function useElapsedTime(startTime, isRunning, ms = 1000, pausedMs = 0, endTime) {
  let get2 = () => formatDuration(Math.max(0, (endTime ?? Date.now()) - startTime - pausedMs)), subscribe2 = import_react56.useCallback((notify) => {
    if (!isRunning)
      return () => {};
    let interval = setInterval(notify, ms);
    return () => clearInterval(interval);
  }, [isRunning, ms]);
  return import_react56.useSyncExternalStore(subscribe2, get2, get2);
}
var import_react56;
var init_useElapsedTime = __esm(() => {
  init_format();
  import_react56 = __toESM(require_react_development(), 1);
});
