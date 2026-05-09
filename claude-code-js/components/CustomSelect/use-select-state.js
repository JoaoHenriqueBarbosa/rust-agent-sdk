// Original: src/components/CustomSelect/use-select-state.ts
function useSelectState({
  visibleOptionCount = 5,
  options: options2,
  defaultValue,
  onChange,
  onCancel,
  onFocus,
  focusValue
}) {
  let [value, setValue] = import_react48.useState(defaultValue), navigation = useSelectNavigation({
    visibleOptionCount,
    options: options2,
    initialFocusValue: void 0,
    onFocus,
    focusValue
  }), selectFocusedOption = import_react48.useCallback(() => {
    setValue(navigation.focusedValue);
  }, [navigation.focusedValue]);
  return {
    ...navigation,
    value,
    selectFocusedOption,
    onChange,
    onCancel
  };
}
var import_react48;
var init_use_select_state = __esm(() => {
  init_use_select_navigation();
  import_react48 = __toESM(require_react_development(), 1);
});
