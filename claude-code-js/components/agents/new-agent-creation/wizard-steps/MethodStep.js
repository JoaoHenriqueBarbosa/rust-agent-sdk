// Original: src/components/agents/new-agent-creation/wizard-steps/MethodStep.tsx
function MethodStep() {
  let $3 = import_compiler_runtime260.c(11), {
    goNext,
    goBack,
    updateWizardData,
    goToStep
  } = useWizard(), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = [{
      label: "Generate with Claude (recommended)",
      value: "generate"
    }, {
      label: "Manual configuration",
      value: "manual"
    }], $3[0] = t0;
  else
    t0 = $3[0];
  let methodOptions = t0, t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime331.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime331.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime331.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "select"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime331.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== goNext || $3[3] !== goToStep || $3[4] !== updateWizardData)
    t2 = (value) => {
      let method = value;
      if (updateWizardData({
        method,
        wasGenerated: method === "generate"
      }), method === "generate")
        goNext();
      else
        goToStep(3);
    }, $3[2] = goNext, $3[3] = goToStep, $3[4] = updateWizardData, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== goBack)
    t3 = () => goBack(), $3[6] = goBack, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== t2 || $3[9] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime331.jsxDEV(WizardDialogLayout, {
      subtitle: "Creation method",
      footerText: t1,
      children: /* @__PURE__ */ jsx_dev_runtime331.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime331.jsxDEV(Select, {
          options: methodOptions,
          onChange: t2,
          onCancel: t3
        }, "method-select", !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = t2, $3[9] = t3, $3[10] = t4;
  else
    t4 = $3[10];
  return t4;
}
var import_compiler_runtime260, jsx_dev_runtime331;
var init_MethodStep = __esm(() => {
  init_ink2();
  init_ConfigurableShortcutHint();
  init_select();
  init_Byline();
  init_KeyboardShortcutHint();
  init_wizard();
  init_WizardDialogLayout();
  import_compiler_runtime260 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime331 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
