// Original: src/hooks/useCommandQueue.ts
function useCommandQueue() {
  return import_react221.useSyncExternalStore(subscribeToCommandQueue, getCommandQueueSnapshot);
}
var import_react221;
var init_useCommandQueue = __esm(() => {
  init_messageQueueManager();
  import_react221 = __toESM(require_react_development(), 1);
});
