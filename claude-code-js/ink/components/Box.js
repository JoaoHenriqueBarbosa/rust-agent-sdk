// Original: src/ink/components/Box.tsx
function Box(t0) {
  let $3 = import_compiler_runtime4.c(42), autoFocus, children, flexDirection, flexGrow, flexShrink, flexWrap, onBlur, onBlurCapture, onClick, onFocus, onFocusCapture, onKeyDown, onKeyDownCapture, onMouseEnter, onMouseLeave, ref, style, tabIndex;
  if ($3[0] !== t0) {
    let {
      children: t12,
      flexWrap: t22,
      flexDirection: t32,
      flexGrow: t42,
      flexShrink: t5,
      ref: t6,
      tabIndex: t7,
      autoFocus: t8,
      onClick: t9,
      onFocus: t10,
      onFocusCapture: t11,
      onBlur: t122,
      onBlurCapture: t13,
      onMouseEnter: t14,
      onMouseLeave: t15,
      onKeyDown: t16,
      onKeyDownCapture: t17,
      ...t18
    } = t0;
    children = t12, ref = t6, tabIndex = t7, autoFocus = t8, onClick = t9, onFocus = t10, onFocusCapture = t11, onBlur = t122, onBlurCapture = t13, onMouseEnter = t14, onMouseLeave = t15, onKeyDown = t16, onKeyDownCapture = t17, style = t18, flexWrap = t22 === void 0 ? "nowrap" : t22, flexDirection = t32 === void 0 ? "row" : t32, flexGrow = t42 === void 0 ? 0 : t42, flexShrink = t5 === void 0 ? 1 : t5, ifNotInteger(style.margin, "margin"), ifNotInteger(style.marginX, "marginX"), ifNotInteger(style.marginY, "marginY"), ifNotInteger(style.marginTop, "marginTop"), ifNotInteger(style.marginBottom, "marginBottom"), ifNotInteger(style.marginLeft, "marginLeft"), ifNotInteger(style.marginRight, "marginRight"), ifNotInteger(style.padding, "padding"), ifNotInteger(style.paddingX, "paddingX"), ifNotInteger(style.paddingY, "paddingY"), ifNotInteger(style.paddingTop, "paddingTop"), ifNotInteger(style.paddingBottom, "paddingBottom"), ifNotInteger(style.paddingLeft, "paddingLeft"), ifNotInteger(style.paddingRight, "paddingRight"), ifNotInteger(style.gap, "gap"), ifNotInteger(style.columnGap, "columnGap"), ifNotInteger(style.rowGap, "rowGap"), $3[0] = t0, $3[1] = autoFocus, $3[2] = children, $3[3] = flexDirection, $3[4] = flexGrow, $3[5] = flexShrink, $3[6] = flexWrap, $3[7] = onBlur, $3[8] = onBlurCapture, $3[9] = onClick, $3[10] = onFocus, $3[11] = onFocusCapture, $3[12] = onKeyDown, $3[13] = onKeyDownCapture, $3[14] = onMouseEnter, $3[15] = onMouseLeave, $3[16] = ref, $3[17] = style, $3[18] = tabIndex;
  } else
    autoFocus = $3[1], children = $3[2], flexDirection = $3[3], flexGrow = $3[4], flexShrink = $3[5], flexWrap = $3[6], onBlur = $3[7], onBlurCapture = $3[8], onClick = $3[9], onFocus = $3[10], onFocusCapture = $3[11], onKeyDown = $3[12], onKeyDownCapture = $3[13], onMouseEnter = $3[14], onMouseLeave = $3[15], ref = $3[16], style = $3[17], tabIndex = $3[18];
  let t1 = style.overflowX ?? style.overflow ?? "visible", t2 = style.overflowY ?? style.overflow ?? "visible", t3;
  if ($3[19] !== flexDirection || $3[20] !== flexGrow || $3[21] !== flexShrink || $3[22] !== flexWrap || $3[23] !== style || $3[24] !== t1 || $3[25] !== t2)
    t3 = {
      flexWrap,
      flexDirection,
      flexGrow,
      flexShrink,
      ...style,
      overflowX: t1,
      overflowY: t2
    }, $3[19] = flexDirection, $3[20] = flexGrow, $3[21] = flexShrink, $3[22] = flexWrap, $3[23] = style, $3[24] = t1, $3[25] = t2, $3[26] = t3;
  else
    t3 = $3[26];
  let t4;
  if ($3[27] !== autoFocus || $3[28] !== children || $3[29] !== onBlur || $3[30] !== onBlurCapture || $3[31] !== onClick || $3[32] !== onFocus || $3[33] !== onFocusCapture || $3[34] !== onKeyDown || $3[35] !== onKeyDownCapture || $3[36] !== onMouseEnter || $3[37] !== onMouseLeave || $3[38] !== ref || $3[39] !== t3 || $3[40] !== tabIndex)
    t4 = /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("ink-box", {
      ref,
      tabIndex,
      autoFocus,
      onClick,
      onFocus,
      onFocusCapture,
      onBlur,
      onBlurCapture,
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      onKeyDownCapture,
      style: t3,
      children
    }, void 0, !1, void 0, this), $3[27] = autoFocus, $3[28] = children, $3[29] = onBlur, $3[30] = onBlurCapture, $3[31] = onClick, $3[32] = onFocus, $3[33] = onFocusCapture, $3[34] = onKeyDown, $3[35] = onKeyDownCapture, $3[36] = onMouseEnter, $3[37] = onMouseLeave, $3[38] = ref, $3[39] = t3, $3[40] = tabIndex, $3[41] = t4;
  else
    t4 = $3[41];
  return t4;
}
var import_compiler_runtime4, jsx_dev_runtime4, Box_default;
var init_Box = __esm(() => {
  init_warn();
  import_compiler_runtime4 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime4 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  Box_default = Box;
});
