// Original: src/utils/classifierApprovalsHook.ts
function useIsClassifierChecking(toolUseID) {
  return import_react64.useSyncExternalStore(subscribeClassifierChecking, () => isClassifierChecking(toolUseID));
}
var import_react64;
var init_classifierApprovalsHook = __esm(() => {
  init_classifierApprovals();
  import_react64 = __toESM(require_react_development(), 1);
});
