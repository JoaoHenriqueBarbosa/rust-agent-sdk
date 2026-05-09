// Original: src/components/design-system/ListItem.tsx
function ListItem(t0) {
  let $3 = import_compiler_runtime44.c(32), {
    isFocused,
    isSelected: t1,
    children,
    description,
    showScrollDown,
    showScrollUp,
    styled: t2,
    disabled: t3,
    declareCursor
  } = t0, isSelected = t1 === void 0 ? !1 : t1, styled = t2 === void 0 ? !0 : t2, disabled = t3 === void 0 ? !1 : t3, t4;
  if ($3[0] !== disabled || $3[1] !== isFocused || $3[2] !== showScrollDown || $3[3] !== showScrollUp)
    t4 = function() {
      if (disabled)
        return /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
          children: " "
        }, void 0, !1, void 0, this);
      if (isFocused)
        return /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
          color: "suggestion",
          children: figures_default.pointer
        }, void 0, !1, void 0, this);
      if (showScrollDown)
        return /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
          dimColor: !0,
          children: figures_default.arrowDown
        }, void 0, !1, void 0, this);
      if (showScrollUp)
        return /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
          dimColor: !0,
          children: figures_default.arrowUp
        }, void 0, !1, void 0, this);
      return /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
        children: " "
      }, void 0, !1, void 0, this);
    }, $3[0] = disabled, $3[1] = isFocused, $3[2] = showScrollDown, $3[3] = showScrollUp, $3[4] = t4;
  else
    t4 = $3[4];
  let renderIndicator = t4, t5;
  if ($3[5] !== disabled || $3[6] !== isFocused || $3[7] !== isSelected || $3[8] !== styled)
    t5 = function() {
      if (disabled)
        return "inactive";
      if (!styled)
        return;
      if (isSelected)
        return "success";
      if (isFocused)
        return "suggestion";
    }(), $3[5] = disabled, $3[6] = isFocused, $3[7] = isSelected, $3[8] = styled, $3[9] = t5;
  else
    t5 = $3[9];
  let textColor = t5, t6 = isFocused && !disabled && declareCursor !== !1, t7;
  if ($3[10] !== t6)
    t7 = {
      line: 0,
      column: 0,
      active: t6
    }, $3[10] = t6, $3[11] = t7;
  else
    t7 = $3[11];
  let cursorRef = useDeclaredCursor(t7), t8;
  if ($3[12] !== renderIndicator)
    t8 = renderIndicator(), $3[12] = renderIndicator, $3[13] = t8;
  else
    t8 = $3[13];
  let t9;
  if ($3[14] !== children || $3[15] !== disabled || $3[16] !== styled || $3[17] !== textColor)
    t9 = styled ? /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
      color: textColor,
      dimColor: disabled,
      children
    }, void 0, !1, void 0, this) : children, $3[14] = children, $3[15] = disabled, $3[16] = styled, $3[17] = textColor, $3[18] = t9;
  else
    t9 = $3[18];
  let t10;
  if ($3[19] !== disabled || $3[20] !== isSelected)
    t10 = isSelected && !disabled && /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
      color: "success",
      children: figures_default.tick
    }, void 0, !1, void 0, this), $3[19] = disabled, $3[20] = isSelected, $3[21] = t10;
  else
    t10 = $3[21];
  let t11;
  if ($3[22] !== t10 || $3[23] !== t8 || $3[24] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      children: [
        t8,
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[22] = t10, $3[23] = t8, $3[24] = t9, $3[25] = t11;
  else
    t11 = $3[25];
  let t12;
  if ($3[26] !== description)
    t12 = description && /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedText, {
        color: "inactive",
        children: description
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[26] = description, $3[27] = t12;
  else
    t12 = $3[27];
  let t13;
  if ($3[28] !== cursorRef || $3[29] !== t11 || $3[30] !== t12)
    t13 = /* @__PURE__ */ jsx_dev_runtime50.jsxDEV(ThemedBox_default, {
      ref: cursorRef,
      flexDirection: "column",
      children: [
        t11,
        t12
      ]
    }, void 0, !0, void 0, this), $3[28] = cursorRef, $3[29] = t11, $3[30] = t12, $3[31] = t13;
  else
    t13 = $3[31];
  return t13;
}
var import_compiler_runtime44, jsx_dev_runtime50;
var init_ListItem = __esm(() => {
  init_figures();
  init_use_declared_cursor();
  init_ink2();
  import_compiler_runtime44 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime50 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
