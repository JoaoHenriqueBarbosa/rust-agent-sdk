// Original: src/components/design-system/ThemedBox.tsx
function resolveColor(color2, theme) {
  if (!color2)
    return;
  if (color2.startsWith("rgb(") || color2.startsWith("#") || color2.startsWith("ansi256(") || color2.startsWith("ansi:"))
    return color2;
  return theme[color2];
}
function ThemedBox(t0) {
  let $3 = import_compiler_runtime6.c(33), backgroundColor, borderBottomColor, borderColor, borderLeftColor, borderRightColor, borderTopColor, children, ref, rest;
  if ($3[0] !== t0)
    ({
      borderColor,
      borderTopColor,
      borderBottomColor,
      borderLeftColor,
      borderRightColor,
      backgroundColor,
      children,
      ref,
      ...rest
    } = t0), $3[0] = t0, $3[1] = backgroundColor, $3[2] = borderBottomColor, $3[3] = borderColor, $3[4] = borderLeftColor, $3[5] = borderRightColor, $3[6] = borderTopColor, $3[7] = children, $3[8] = ref, $3[9] = rest;
  else
    backgroundColor = $3[1], borderBottomColor = $3[2], borderColor = $3[3], borderLeftColor = $3[4], borderRightColor = $3[5], borderTopColor = $3[6], children = $3[7], ref = $3[8], rest = $3[9];
  let [themeName] = useTheme(), resolvedBorderBottomColor, resolvedBorderColor, resolvedBorderLeftColor, resolvedBorderRightColor, resolvedBorderTopColor, t1;
  if ($3[10] !== backgroundColor || $3[11] !== borderBottomColor || $3[12] !== borderColor || $3[13] !== borderLeftColor || $3[14] !== borderRightColor || $3[15] !== borderTopColor || $3[16] !== themeName) {
    let theme = getTheme(themeName);
    resolvedBorderColor = resolveColor(borderColor, theme), resolvedBorderTopColor = resolveColor(borderTopColor, theme), resolvedBorderBottomColor = resolveColor(borderBottomColor, theme), resolvedBorderLeftColor = resolveColor(borderLeftColor, theme), resolvedBorderRightColor = resolveColor(borderRightColor, theme), t1 = resolveColor(backgroundColor, theme), $3[10] = backgroundColor, $3[11] = borderBottomColor, $3[12] = borderColor, $3[13] = borderLeftColor, $3[14] = borderRightColor, $3[15] = borderTopColor, $3[16] = themeName, $3[17] = resolvedBorderBottomColor, $3[18] = resolvedBorderColor, $3[19] = resolvedBorderLeftColor, $3[20] = resolvedBorderRightColor, $3[21] = resolvedBorderTopColor, $3[22] = t1;
  } else
    resolvedBorderBottomColor = $3[17], resolvedBorderColor = $3[18], resolvedBorderLeftColor = $3[19], resolvedBorderRightColor = $3[20], resolvedBorderTopColor = $3[21], t1 = $3[22];
  let resolvedBackgroundColor = t1, t2;
  if ($3[23] !== children || $3[24] !== ref || $3[25] !== resolvedBackgroundColor || $3[26] !== resolvedBorderBottomColor || $3[27] !== resolvedBorderColor || $3[28] !== resolvedBorderLeftColor || $3[29] !== resolvedBorderRightColor || $3[30] !== resolvedBorderTopColor || $3[31] !== rest)
    t2 = /* @__PURE__ */ jsx_dev_runtime9.jsxDEV(Box_default, {
      ref,
      borderColor: resolvedBorderColor,
      borderTopColor: resolvedBorderTopColor,
      borderBottomColor: resolvedBorderBottomColor,
      borderLeftColor: resolvedBorderLeftColor,
      borderRightColor: resolvedBorderRightColor,
      backgroundColor: resolvedBackgroundColor,
      ...rest,
      children
    }, void 0, !1, void 0, this), $3[23] = children, $3[24] = ref, $3[25] = resolvedBackgroundColor, $3[26] = resolvedBorderBottomColor, $3[27] = resolvedBorderColor, $3[28] = resolvedBorderLeftColor, $3[29] = resolvedBorderRightColor, $3[30] = resolvedBorderTopColor, $3[31] = rest, $3[32] = t2;
  else
    t2 = $3[32];
  return t2;
}
var import_compiler_runtime6, jsx_dev_runtime9, ThemedBox_default;
var init_ThemedBox = __esm(() => {
  init_Box();
  init_theme();
  init_ThemeProvider();
  import_compiler_runtime6 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime9 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  ThemedBox_default = ThemedBox;
});
