// Original: src/components/design-system/Divider.tsx
function Divider(t0) {
  let $3 = import_compiler_runtime30.c(21), {
    width,
    color: color2,
    char: t1,
    padding: t2,
    title
  } = t0, char = t1 === void 0 ? "\u2500" : t1, padding = t2 === void 0 ? 0 : t2, {
    columns: terminalWidth
  } = useTerminalSize(), effectiveWidth = Math.max(0, (width ?? terminalWidth) - padding);
  if (title) {
    let titleWidth = stringWidth(title) + 2, sideWidth = Math.max(0, effectiveWidth - titleWidth), leftWidth = Math.floor(sideWidth / 2), rightWidth = sideWidth - leftWidth, t32 = !color2, t42;
    if ($3[0] !== char || $3[1] !== leftWidth)
      t42 = char.repeat(leftWidth), $3[0] = char, $3[1] = leftWidth, $3[2] = t42;
    else
      t42 = $3[2];
    let t52;
    if ($3[3] !== title)
      t52 = /* @__PURE__ */ jsx_dev_runtime34.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime34.jsxDEV(Ansi, {
          children: title
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[3] = title, $3[4] = t52;
    else
      t52 = $3[4];
    let t6;
    if ($3[5] !== char || $3[6] !== rightWidth)
      t6 = char.repeat(rightWidth), $3[5] = char, $3[6] = rightWidth, $3[7] = t6;
    else
      t6 = $3[7];
    let t7;
    if ($3[8] !== color2 || $3[9] !== t32 || $3[10] !== t42 || $3[11] !== t52 || $3[12] !== t6)
      t7 = /* @__PURE__ */ jsx_dev_runtime34.jsxDEV(ThemedText, {
        color: color2,
        dimColor: t32,
        children: [
          t42,
          " ",
          t52,
          " ",
          t6
        ]
      }, void 0, !0, void 0, this), $3[8] = color2, $3[9] = t32, $3[10] = t42, $3[11] = t52, $3[12] = t6, $3[13] = t7;
    else
      t7 = $3[13];
    return t7;
  }
  let t3 = !color2, t4;
  if ($3[14] !== char || $3[15] !== effectiveWidth)
    t4 = char.repeat(effectiveWidth), $3[14] = char, $3[15] = effectiveWidth, $3[16] = t4;
  else
    t4 = $3[16];
  let t5;
  if ($3[17] !== color2 || $3[18] !== t3 || $3[19] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime34.jsxDEV(ThemedText, {
      color: color2,
      dimColor: t3,
      children: t4
    }, void 0, !1, void 0, this), $3[17] = color2, $3[18] = t3, $3[19] = t4, $3[20] = t5;
  else
    t5 = $3[20];
  return t5;
}
var import_compiler_runtime30, jsx_dev_runtime34;
var init_Divider = __esm(() => {
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  import_compiler_runtime30 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime34 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
