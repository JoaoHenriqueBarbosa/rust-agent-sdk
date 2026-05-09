// Original: src/components/CustomSelect/select-option.tsx
function SelectOption(t0) {
  let $3 = import_compiler_runtime45.c(8), {
    isFocused,
    isSelected,
    children,
    description,
    shouldShowDownArrow,
    shouldShowUpArrow,
    declareCursor
  } = t0, t1;
  if ($3[0] !== children || $3[1] !== declareCursor || $3[2] !== description || $3[3] !== isFocused || $3[4] !== isSelected || $3[5] !== shouldShowDownArrow || $3[6] !== shouldShowUpArrow)
    t1 = /* @__PURE__ */ jsx_dev_runtime51.jsxDEV(ListItem, {
      isFocused,
      isSelected,
      description,
      showScrollDown: shouldShowDownArrow,
      showScrollUp: shouldShowUpArrow,
      styled: !1,
      declareCursor,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = declareCursor, $3[2] = description, $3[3] = isFocused, $3[4] = isSelected, $3[5] = shouldShowDownArrow, $3[6] = shouldShowUpArrow, $3[7] = t1;
  else
    t1 = $3[7];
  return t1;
}
var import_compiler_runtime45, jsx_dev_runtime51;
var init_select_option = __esm(() => {
  init_ListItem();
  import_compiler_runtime45 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime51 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
