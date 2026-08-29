// Original: src/services/compact/compactWarningHook.ts
function useCompactWarningSuppression() {
  return import_react230.useSyncExternalStore(compactWarningStore.subscribe, compactWarningStore.getState);
}
var import_react230;
var init_compactWarningHook = __esm(() => {
  init_compactWarningState();
  import_react230 = __toESM(require_react_development(), 1);
});
