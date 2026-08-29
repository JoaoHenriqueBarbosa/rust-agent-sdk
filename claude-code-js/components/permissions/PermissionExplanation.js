// Original: src/components/permissions/PermissionExplanation.tsx
function ShimmerLoadingText() {
  let $3 = import_compiler_runtime295.c(7), [ref, glimmerIndex] = useShimmerAnimation("responding", LOADING_MESSAGE, !1), t0;
  if ($3[0] !== glimmerIndex)
    t0 = LOADING_MESSAGE.split("").map((char, index2) => /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ShimmerChar, {
      char,
      index: index2,
      glimmerIndex,
      messageColor: "inactive",
      shimmerColor: "text"
    }, index2, !1, void 0, this)), $3[0] = glimmerIndex, $3[1] = t0;
  else
    t0 = $3[1];
  let t1;
  if ($3[2] !== t0)
    t1 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedText, {
      children: t0
    }, void 0, !1, void 0, this), $3[2] = t0, $3[3] = t1;
  else
    t1 = $3[3];
  let t2;
  if ($3[4] !== ref || $3[5] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedBox_default, {
      ref,
      children: t1
    }, void 0, !1, void 0, this), $3[4] = ref, $3[5] = t1, $3[6] = t2;
  else
    t2 = $3[6];
  return t2;
}
function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case "LOW":
      return "success";
    case "MEDIUM":
      return "warning";
    case "HIGH":
      return "error";
  }
}
function getRiskLabel(riskLevel) {
  switch (riskLevel) {
    case "LOW":
      return "Low risk";
    case "MEDIUM":
      return "Med risk";
    case "HIGH":
      return "High risk";
  }
}
function createExplanationPromise(props) {
  return generatePermissionExplanation({
    toolName: props.toolName,
    toolInput: props.toolInput,
    toolDescription: props.toolDescription,
    messages: props.messages,
    signal: new AbortController().signal
  }).catch(() => null);
}
function usePermissionExplainerUI(props) {
  let $3 = import_compiler_runtime295.c(9), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = isPermissionExplainerEnabled(), $3[0] = t0;
  else
    t0 = $3[0];
  let enabled2 = t0, [visible, setVisible] = import_react208.useState(!1), [promise3, setPromise] = import_react208.useState(null), t1;
  if ($3[1] !== promise3 || $3[2] !== props || $3[3] !== visible)
    t1 = () => {
      if (!visible) {
        if (logEvent("tengu_permission_explainer_shortcut_used", {}), !promise3)
          setPromise(createExplanationPromise(props));
      }
      setVisible(_temp179);
    }, $3[1] = promise3, $3[2] = props, $3[3] = visible, $3[4] = t1;
  else
    t1 = $3[4];
  let t2;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      context: "Confirmation",
      isActive: enabled2
    }, $3[5] = t2;
  else
    t2 = $3[5];
  useKeybinding("confirm:toggleExplanation", t1, t2);
  let t3;
  if ($3[6] !== promise3 || $3[7] !== visible)
    t3 = {
      visible,
      enabled: enabled2,
      promise: promise3
    }, $3[6] = promise3, $3[7] = visible, $3[8] = t3;
  else
    t3 = $3[8];
  return t3;
}
function _temp179(v2) {
  return !v2;
}
function ExplanationResult(t0) {
  let $3 = import_compiler_runtime295.c(21), {
    promise: promise3
  } = t0, explanation = import_react208.use(promise3);
  if (!explanation) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Explanation unavailable"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  let t1;
  if ($3[1] !== explanation.explanation)
    t1 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedText, {
      children: explanation.explanation
    }, void 0, !1, void 0, this), $3[1] = explanation.explanation, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== explanation.reasoning)
    t2 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedText, {
        children: explanation.reasoning
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = explanation.reasoning, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== explanation.riskLevel)
    t3 = getRiskColor(explanation.riskLevel), $3[5] = explanation.riskLevel, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== explanation.riskLevel)
    t4 = getRiskLabel(explanation.riskLevel), $3[7] = explanation.riskLevel, $3[8] = t4;
  else
    t4 = $3[8];
  let t5;
  if ($3[9] !== t3 || $3[10] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedText, {
      color: t3,
      children: [
        t4,
        ":"
      ]
    }, void 0, !0, void 0, this), $3[9] = t3, $3[10] = t4, $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] !== explanation.risk)
    t6 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedText, {
      children: [
        " ",
        explanation.risk
      ]
    }, void 0, !0, void 0, this), $3[12] = explanation.risk, $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== t5 || $3[15] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedText, {
        children: [
          t5,
          t6
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[14] = t5, $3[15] = t6, $3[16] = t7;
  else
    t7 = $3[16];
  let t8;
  if ($3[17] !== t1 || $3[18] !== t2 || $3[19] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t1,
        t2,
        t7
      ]
    }, void 0, !0, void 0, this), $3[17] = t1, $3[18] = t2, $3[19] = t7, $3[20] = t8;
  else
    t8 = $3[20];
  return t8;
}
function PermissionExplainerContent(t0) {
  let $3 = import_compiler_runtime295.c(3), {
    visible,
    promise: promise3
  } = t0;
  if (!visible || !promise3)
    return null;
  let t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ShimmerLoadingText, {}, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== promise3)
    t2 = /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(import_react208.Suspense, {
      fallback: t1,
      children: /* @__PURE__ */ jsx_dev_runtime379.jsxDEV(ExplanationResult, {
        promise: promise3
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[1] = promise3, $3[2] = t2;
  else
    t2 = $3[2];
  return t2;
}
var import_compiler_runtime295, import_react208, jsx_dev_runtime379, LOADING_MESSAGE = "Loading explanation\u2026";
var init_PermissionExplanation = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_permissionExplainer();
  init_ShimmerChar();
  init_useShimmerAnimation();
  import_compiler_runtime295 = __toESM(require_react_compiler_runtime_development(), 1), import_react208 = __toESM(require_react_development(), 1), jsx_dev_runtime379 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
