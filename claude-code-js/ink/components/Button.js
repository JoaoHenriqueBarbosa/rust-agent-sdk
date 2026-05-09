// Original: src/ink/components/Button.tsx
function Button(t0) {
  let $3 = import_compiler_runtime10.c(30), autoFocus, children, onAction, ref, style, t1;
  if ($3[0] !== t0)
    ({
      onAction,
      tabIndex: t1,
      autoFocus,
      children,
      ref,
      ...style
    } = t0), $3[0] = t0, $3[1] = autoFocus, $3[2] = children, $3[3] = onAction, $3[4] = ref, $3[5] = style, $3[6] = t1;
  else
    autoFocus = $3[1], children = $3[2], onAction = $3[3], ref = $3[4], style = $3[5], t1 = $3[6];
  let tabIndex = t1 === void 0 ? 0 : t1, [isFocused, setIsFocused] = import_react14.useState(!1), [isHovered, setIsHovered] = import_react14.useState(!1), [isActive, setIsActive] = import_react14.useState(!1), activeTimer = import_react14.useRef(null), t2, t3;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => () => {
      if (activeTimer.current)
        clearTimeout(activeTimer.current);
    }, t3 = [], $3[7] = t2, $3[8] = t3;
  else
    t2 = $3[7], t3 = $3[8];
  import_react14.useEffect(t2, t3);
  let t4;
  if ($3[9] !== onAction)
    t4 = (e) => {
      if (e.key === "return" || e.key === " ") {
        if (e.preventDefault(), setIsActive(!0), onAction(), activeTimer.current)
          clearTimeout(activeTimer.current);
        activeTimer.current = setTimeout(_temp2, 100, setIsActive);
      }
    }, $3[9] = onAction, $3[10] = t4;
  else
    t4 = $3[10];
  let handleKeyDown = t4, t5;
  if ($3[11] !== onAction)
    t5 = (_e) => {
      onAction();
    }, $3[11] = onAction, $3[12] = t5;
  else
    t5 = $3[12];
  let handleClick = t5, t6;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t6 = (_e_0) => setIsFocused(!0), $3[13] = t6;
  else
    t6 = $3[13];
  let handleFocus = t6, t7;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t7 = (_e_1) => setIsFocused(!1), $3[14] = t7;
  else
    t7 = $3[14];
  let handleBlur = t7, t8;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t8 = () => setIsHovered(!0), $3[15] = t8;
  else
    t8 = $3[15];
  let handleMouseEnter = t8, t9;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t9 = () => setIsHovered(!1), $3[16] = t9;
  else
    t9 = $3[16];
  let handleMouseLeave = t9, t10;
  if ($3[17] !== children || $3[18] !== isActive || $3[19] !== isFocused || $3[20] !== isHovered)
    t10 = typeof children === "function" ? children({
      focused: isFocused,
      hovered: isHovered,
      active: isActive
    }) : children, $3[17] = children, $3[18] = isActive, $3[19] = isFocused, $3[20] = isHovered, $3[21] = t10;
  else
    t10 = $3[21];
  let content = t10, t11;
  if ($3[22] !== autoFocus || $3[23] !== content || $3[24] !== handleClick || $3[25] !== handleKeyDown || $3[26] !== ref || $3[27] !== style || $3[28] !== tabIndex)
    t11 = /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(Box_default, {
      ref,
      tabIndex,
      autoFocus,
      onKeyDown: handleKeyDown,
      onClick: handleClick,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...style,
      children: content
    }, void 0, !1, void 0, this), $3[22] = autoFocus, $3[23] = content, $3[24] = handleClick, $3[25] = handleKeyDown, $3[26] = ref, $3[27] = style, $3[28] = tabIndex, $3[29] = t11;
  else
    t11 = $3[29];
  return t11;
}
function _temp2(setter) {
  return setter(!1);
}
var import_compiler_runtime10, import_react14, jsx_dev_runtime13, Button_default;
var init_Button = __esm(() => {
  init_Box();
  import_compiler_runtime10 = __toESM(require_react_compiler_runtime_development(), 1), import_react14 = __toESM(require_react_development(), 1), jsx_dev_runtime13 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  Button_default = Button;
});
