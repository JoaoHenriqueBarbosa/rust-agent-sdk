// Original: src/components/CostThresholdDialog.tsx
function CostThresholdDialog(t0) {
  let $3 = import_compiler_runtime283.c(7), {
    onDone
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime366.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime366.jsxDEV(ThemedText, {
          children: "Learn more about how to monitor your spending:"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime366.jsxDEV(Link, {
          url: "https://code.claude.com/docs/en/costs"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = [{
      value: "ok",
      label: "Got it, thanks!"
    }], $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== onDone)
    t3 = /* @__PURE__ */ jsx_dev_runtime366.jsxDEV(Select, {
      options: t2,
      onChange: onDone
    }, void 0, !1, void 0, this), $3[2] = onDone, $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] !== onDone || $3[5] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime366.jsxDEV(Dialog, {
      title: "You've spent $5 on the Anthropic API this session.",
      onCancel: onDone,
      children: [
        t1,
        t3
      ]
    }, void 0, !0, void 0, this), $3[4] = onDone, $3[5] = t3, $3[6] = t4;
  else
    t4 = $3[6];
  return t4;
}
var import_compiler_runtime283, jsx_dev_runtime366;
var init_CostThresholdDialog = __esm(() => {
  init_ink2();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime283 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime366 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
