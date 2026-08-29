// Original: src/components/design-system/Pane.tsx
function Pane(t0) {
  let $3 = import_compiler_runtime31.c(9), {
    children,
    color: color2
  } = t0;
  if (useIsInsideModal()) {
    let t12;
    if ($3[0] !== children)
      t12 = /* @__PURE__ */ jsx_dev_runtime35.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 1,
        flexShrink: 0,
        children
      }, void 0, !1, void 0, this), $3[0] = children, $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  let t1;
  if ($3[2] !== color2)
    t1 = /* @__PURE__ */ jsx_dev_runtime35.jsxDEV(Divider, {
      color: color2
    }, void 0, !1, void 0, this), $3[2] = color2, $3[3] = t1;
  else
    t1 = $3[3];
  let t2;
  if ($3[4] !== children)
    t2 = /* @__PURE__ */ jsx_dev_runtime35.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      children
    }, void 0, !1, void 0, this), $3[4] = children, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== t1 || $3[7] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime35.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingTop: 1,
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[6] = t1, $3[7] = t2, $3[8] = t3;
  else
    t3 = $3[8];
  return t3;
}
var import_compiler_runtime31, jsx_dev_runtime35;
var init_Pane = __esm(() => {
  init_modalContext();
  init_ink2();
  init_Divider();
  import_compiler_runtime31 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime35 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
