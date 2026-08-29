// function: Line
function Line(t0) {
  let $3 = import_compiler_runtime90.c(7), {
    dimColor: t1,
    children,
    color: color2
  } = t0, dimColor = t1 === void 0 ? !0 : t1, bg = useSelectedMessageBg(), t2;
  if ($3[0] !== children || $3[1] !== color2 || $3[2] !== dimColor)
    t2 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
        color: color2,
        dimColor,
        wrap: "wrap",
        children
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = color2, $3[2] = dimColor, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== bg || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
      backgroundColor: bg,
      children: t2
    }, void 0, !1, void 0, this), $3[4] = bg, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
