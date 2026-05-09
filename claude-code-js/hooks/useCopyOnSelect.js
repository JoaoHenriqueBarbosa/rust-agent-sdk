// Original: src/hooks/useCopyOnSelect.ts
function useCopyOnSelect(selection, isActive, onCopied) {
  let copiedRef = import_react300.useRef(!1), onCopiedRef = import_react300.useRef(onCopied);
  onCopiedRef.current = onCopied, import_react300.useEffect(() => {
    if (!isActive)
      return;
    return selection.subscribe(() => {
      let sel = selection.getState(), has2 = selection.hasSelection();
      if (sel?.isDragging) {
        copiedRef.current = !1;
        return;
      }
      if (!has2) {
        copiedRef.current = !1;
        return;
      }
      if (copiedRef.current)
        return;
      if (!(getGlobalConfig().copyOnSelect ?? !0))
        return;
      let text2 = selection.copySelectionNoClear();
      if (!text2 || !text2.trim()) {
        copiedRef.current = !0;
        return;
      }
      copiedRef.current = !0, onCopiedRef.current?.(text2);
    });
  }, [isActive, selection]);
}
function useSelectionBgColor(selection) {
  let [themeName] = useTheme();
  import_react300.useEffect(() => {
    selection.setSelectionBgColor(getTheme(themeName).selectionBg);
  }, [selection, themeName]);
}
var import_react300;
var init_useCopyOnSelect = __esm(() => {
  init_ThemeProvider();
  init_config4();
  init_theme();
  import_react300 = __toESM(require_react_development(), 1);
});
