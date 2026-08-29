// Original: src/components/messages/UserPlanMessage.tsx
function UserPlanMessage(t0) {
  let $3 = import_compiler_runtime77.c(6), {
    addMargin,
    planContent
  } = t0, t1 = addMargin ? 1 : 0, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime87.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime87.jsxDEV(ThemedText, {
        bold: !0,
        color: "planMode",
        children: "Plan to implement"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t2;
  else
    t2 = $3[0];
  let t3;
  if ($3[1] !== planContent)
    t3 = /* @__PURE__ */ jsx_dev_runtime87.jsxDEV(Markdown, {
      children: planContent
    }, void 0, !1, void 0, this), $3[1] = planContent, $3[2] = t3;
  else
    t3 = $3[2];
  let t4;
  if ($3[3] !== t1 || $3[4] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime87.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: "planMode",
      marginTop: t1,
      paddingX: 1,
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[3] = t1, $3[4] = t3, $3[5] = t4;
  else
    t4 = $3[5];
  return t4;
}
var import_compiler_runtime77, jsx_dev_runtime87;
var init_UserPlanMessage = __esm(() => {
  init_ink2();
  init_Markdown();
  import_compiler_runtime77 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime87 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
