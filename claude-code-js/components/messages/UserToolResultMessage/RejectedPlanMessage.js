// Original: src/components/messages/UserToolResultMessage/RejectedPlanMessage.tsx
function RejectedPlanMessage(t0) {
  let $3 = import_compiler_runtime97.c(3), {
    plan
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime108.jsxDEV(ThemedText, {
      color: "subtle",
      children: "User rejected Claude's plan:"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== plan)
    t2 = /* @__PURE__ */ jsx_dev_runtime108.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime108.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t1,
          /* @__PURE__ */ jsx_dev_runtime108.jsxDEV(ThemedBox_default, {
            borderStyle: "round",
            borderColor: "planMode",
            paddingX: 1,
            overflow: "hidden",
            children: /* @__PURE__ */ jsx_dev_runtime108.jsxDEV(Markdown, {
              children: plan
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[1] = plan, $3[2] = t2;
  else
    t2 = $3[2];
  return t2;
}
var import_compiler_runtime97, jsx_dev_runtime108;
var init_RejectedPlanMessage = __esm(() => {
  init_Markdown();
  init_MessageResponse();
  init_ink2();
  import_compiler_runtime97 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime108 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
