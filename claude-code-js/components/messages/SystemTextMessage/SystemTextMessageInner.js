// function: SystemTextMessageInner
function SystemTextMessageInner(t0) {
  let $3 = import_compiler_runtime95.c(18), {
    content,
    addMargin,
    dot,
    color: color2,
    dimColor
  } = t0, {
    columns
  } = useTerminalSize(), bg = useSelectedMessageBg(), t1 = addMargin ? 1 : 0, t2;
  if ($3[0] !== color2 || $3[1] !== dimColor || $3[2] !== dot)
    t2 = dot && /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      minWidth: 2,
      children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        color: color2,
        dimColor,
        children: BLACK_CIRCLE
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = color2, $3[1] = dimColor, $3[2] = dot, $3[3] = t2;
  else
    t2 = $3[3];
  let t3 = columns - 10, t4;
  if ($3[4] !== content)
    t4 = content.trim(), $3[4] = content, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== color2 || $3[7] !== dimColor || $3[8] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      color: color2,
      dimColor,
      wrap: "wrap",
      children: t4
    }, void 0, !1, void 0, this), $3[6] = color2, $3[7] = dimColor, $3[8] = t4, $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] !== t3 || $3[11] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: t3,
      children: t5
    }, void 0, !1, void 0, this), $3[10] = t3, $3[11] = t5, $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] !== bg || $3[14] !== t1 || $3[15] !== t2 || $3[16] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginTop: t1,
      backgroundColor: bg,
      width: "100%",
      children: [
        t2,
        t6
      ]
    }, void 0, !0, void 0, this), $3[13] = bg, $3[14] = t1, $3[15] = t2, $3[16] = t6, $3[17] = t7;
  else
    t7 = $3[17];
  return t7;
}
