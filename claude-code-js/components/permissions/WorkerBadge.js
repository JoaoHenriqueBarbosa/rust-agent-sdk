// Original: src/components/permissions/WorkerBadge.tsx
function WorkerBadge(t0) {
  let $3 = import_compiler_runtime285.c(7), {
    name: name3,
    color: color3
  } = t0, t1;
  if ($3[0] !== color3)
    t1 = toInkColor(color3), $3[0] = color3, $3[1] = t1;
  else
    t1 = $3[1];
  let inkColor = t1, t2;
  if ($3[2] !== name3)
    t2 = /* @__PURE__ */ jsx_dev_runtime368.jsxDEV(ThemedText, {
      bold: !0,
      children: [
        "@",
        name3
      ]
    }, void 0, !0, void 0, this), $3[2] = name3, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== inkColor || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime368.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      children: /* @__PURE__ */ jsx_dev_runtime368.jsxDEV(ThemedText, {
        color: inkColor,
        children: [
          BLACK_CIRCLE,
          " ",
          t2
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = inkColor, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
var import_compiler_runtime285, jsx_dev_runtime368;
var init_WorkerBadge = __esm(() => {
  init_figures2();
  init_ink2();
  init_ink3();
  import_compiler_runtime285 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime368 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
