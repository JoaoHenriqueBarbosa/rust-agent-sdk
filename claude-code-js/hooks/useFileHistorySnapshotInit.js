// Original: src/hooks/useFileHistorySnapshotInit.ts
function useFileHistorySnapshotInit(initialFileHistorySnapshots, fileHistoryState, onUpdateState) {
  let initialized6 = import_react284.useRef(!1);
  import_react284.useEffect(() => {
    if (!fileHistoryEnabled() || initialized6.current)
      return;
    if (initialized6.current = !0, initialFileHistorySnapshots)
      fileHistoryRestoreStateFromLog(initialFileHistorySnapshots, onUpdateState);
  }, [fileHistoryState, initialFileHistorySnapshots, onUpdateState]);
}
var import_react284;
var init_useFileHistorySnapshotInit = __esm(() => {
  init_fileHistory();
  import_react284 = __toESM(require_react_development(), 1);
});
