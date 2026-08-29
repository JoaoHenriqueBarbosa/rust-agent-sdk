// Original: src/components/agents/new-agent-creation/wizard-steps/ModelStep.tsx
function ModelStep() {
  let $3 = import_compiler_runtime261.c(8), {
    goNext,
    goBack,
    updateWizardData,
    wizardData
  } = useWizard(), t0;
  if ($3[0] !== goNext || $3[1] !== updateWizardData)
    t0 = (model) => {
      updateWizardData({
        selectedModel: model
      }), goNext();
    }, $3[0] = goNext, $3[1] = updateWizardData, $3[2] = t0;
  else
    t0 = $3[2];
  let handleComplete = t0, t1;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime332.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime332.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime332.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "select"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime332.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[3] = t1;
  else
    t1 = $3[3];
  let t2;
  if ($3[4] !== goBack || $3[5] !== handleComplete || $3[6] !== wizardData.selectedModel)
    t2 = /* @__PURE__ */ jsx_dev_runtime332.jsxDEV(WizardDialogLayout, {
      subtitle: "Select model",
      footerText: t1,
      children: /* @__PURE__ */ jsx_dev_runtime332.jsxDEV(ModelSelector, {
        initialModel: wizardData.selectedModel,
        onComplete: handleComplete,
        onCancel: goBack
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = goBack, $3[5] = handleComplete, $3[6] = wizardData.selectedModel, $3[7] = t2;
  else
    t2 = $3[7];
  return t2;
}
var import_compiler_runtime261, jsx_dev_runtime332;
var init_ModelStep = __esm(() => {
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_wizard();
  init_WizardDialogLayout();
  init_ModelSelector();
  import_compiler_runtime261 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime332 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
