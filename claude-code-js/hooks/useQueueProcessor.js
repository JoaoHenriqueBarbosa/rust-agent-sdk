// Original: src/hooks/useQueueProcessor.ts
function useQueueProcessor({
  executeQueuedInput,
  hasActiveLocalJsxUI,
  queryGuard
}) {
  let isQueryActive = import_react269.useSyncExternalStore(queryGuard.subscribe, queryGuard.getSnapshot), queueSnapshot = import_react269.useSyncExternalStore(subscribeToCommandQueue, getCommandQueueSnapshot);
  import_react269.useEffect(() => {
    if (isQueryActive)
      return;
    if (hasActiveLocalJsxUI)
      return;
    if (queueSnapshot.length === 0)
      return;
    processQueueIfReady({ executeInput: executeQueuedInput });
  }, [
    queueSnapshot,
    isQueryActive,
    executeQueuedInput,
    hasActiveLocalJsxUI,
    queryGuard
  ]);
}
var import_react269;
var init_useQueueProcessor = __esm(() => {
  init_messageQueueManager();
  init_queueProcessor();
  import_react269 = __toESM(require_react_development(), 1);
});
