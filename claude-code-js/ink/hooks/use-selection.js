// Original: src/ink/hooks/use-selection.ts
function useSelection() {
  import_react21.useContext(StdinContext_default);
  let ink = instances_default.get(process.stdout);
  return import_react21.useMemo(() => {
    if (!ink)
      return {
        copySelection: () => "",
        copySelectionNoClear: () => "",
        clearSelection: () => {},
        hasSelection: () => !1,
        getState: () => null,
        subscribe: () => () => {},
        shiftAnchor: () => {},
        shiftSelection: () => {},
        moveFocus: () => {},
        captureScrolledRows: () => {},
        setSelectionBgColor: () => {}
      };
    return {
      copySelection: () => ink.copySelection(),
      copySelectionNoClear: () => ink.copySelectionNoClear(),
      clearSelection: () => ink.clearTextSelection(),
      hasSelection: () => ink.hasTextSelection(),
      getState: () => ink.selection,
      subscribe: (cb) => ink.subscribeToSelectionChange(cb),
      shiftAnchor: (dRow, minRow, maxRow) => shiftAnchor(ink.selection, dRow, minRow, maxRow),
      shiftSelection: (dRow, minRow, maxRow) => ink.shiftSelectionForScroll(dRow, minRow, maxRow),
      moveFocus: (move) => ink.moveSelectionFocus(move),
      captureScrolledRows: (firstRow, lastRow, side) => ink.captureScrolledRows(firstRow, lastRow, side),
      setSelectionBgColor: (color2) => ink.setSelectionBgColor(color2)
    };
  }, [ink]);
}
function useHasSelection() {
  import_react21.useContext(StdinContext_default);
  let ink = instances_default.get(process.stdout);
  return import_react21.useSyncExternalStore(ink ? ink.subscribeToSelectionChange : NO_SUBSCRIBE, ink ? ink.hasTextSelection : ALWAYS_FALSE);
}
var import_react21, NO_SUBSCRIBE = () => () => {}, ALWAYS_FALSE = () => !1;
var init_use_selection = __esm(() => {
  init_StdinContext();
  init_instances();
  init_selection();
  import_react21 = __toESM(require_react_development(), 1);
});
