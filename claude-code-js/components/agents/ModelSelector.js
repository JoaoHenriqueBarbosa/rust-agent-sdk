// Original: src/components/agents/ModelSelector.tsx
function ModelSelector(t0) {
  let $3 = import_compiler_runtime249.c(11), {
    initialModel,
    onComplete,
    onCancel
  } = t0, t1;
  if ($3[0] !== initialModel) {
    bb0: {
      let base2 = getAgentModelOptions();
      if (initialModel && !base2.some((o5) => o5.value === initialModel)) {
        t1 = [{
          value: initialModel,
          label: initialModel,
          description: "Current model (custom ID)"
        }, ...base2];
        break bb0;
      }
      t1 = base2;
    }
    $3[0] = initialModel, $3[1] = t1;
  } else
    t1 = $3[1];
  let modelOptions = t1, defaultModel = initialModel ?? "sonnet", t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime316.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime316.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Model determines the agent's reasoning capabilities and speed."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== onCancel || $3[4] !== onComplete)
    t3 = () => onCancel ? onCancel() : onComplete(void 0), $3[3] = onCancel, $3[4] = onComplete, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== defaultModel || $3[7] !== modelOptions || $3[8] !== onComplete || $3[9] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime316.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t2,
        /* @__PURE__ */ jsx_dev_runtime316.jsxDEV(Select, {
          options: modelOptions,
          defaultValue: defaultModel,
          onChange: onComplete,
          onCancel: t3
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = defaultModel, $3[7] = modelOptions, $3[8] = onComplete, $3[9] = t3, $3[10] = t4;
  else
    t4 = $3[10];
  return t4;
}
var import_compiler_runtime249, jsx_dev_runtime316;
var init_ModelSelector = __esm(() => {
  init_ink2();
  init_agent();
  init_select();
  import_compiler_runtime249 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime316 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
