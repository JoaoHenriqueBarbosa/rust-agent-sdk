// Original: src/components/agents/new-agent-creation/wizard-steps/ColorStep.tsx
function ColorStep() {
  let $3 = import_compiler_runtime255.c(14), {
    goNext,
    goBack,
    updateWizardData,
    wizardData
  } = useWizard(), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = {
      context: "Confirmation"
    }, $3[0] = t0;
  else
    t0 = $3[0];
  useKeybinding("confirm:no", goBack, t0);
  let t1;
  if ($3[1] !== goNext || $3[2] !== updateWizardData || $3[3] !== wizardData.agentType || $3[4] !== wizardData.location || $3[5] !== wizardData.selectedModel || $3[6] !== wizardData.selectedTools || $3[7] !== wizardData.systemPrompt || $3[8] !== wizardData.whenToUse)
    t1 = (color3) => {
      updateWizardData({
        selectedColor: color3,
        finalAgent: {
          agentType: wizardData.agentType,
          whenToUse: wizardData.whenToUse,
          getSystemPrompt: () => wizardData.systemPrompt,
          tools: wizardData.selectedTools,
          ...wizardData.selectedModel ? {
            model: wizardData.selectedModel
          } : {},
          ...color3 ? {
            color: color3
          } : {},
          source: wizardData.location
        }
      }), goNext();
    }, $3[1] = goNext, $3[2] = updateWizardData, $3[3] = wizardData.agentType, $3[4] = wizardData.location, $3[5] = wizardData.selectedModel, $3[6] = wizardData.selectedTools, $3[7] = wizardData.systemPrompt, $3[8] = wizardData.whenToUse, $3[9] = t1;
  else
    t1 = $3[9];
  let handleConfirm = t1, t2;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime324.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime324.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime324.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "select"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime324.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[10] = t2;
  else
    t2 = $3[10];
  let t3 = wizardData.agentType || "agent", t4;
  if ($3[11] !== handleConfirm || $3[12] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime324.jsxDEV(WizardDialogLayout, {
      subtitle: "Choose background color",
      footerText: t2,
      children: /* @__PURE__ */ jsx_dev_runtime324.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime324.jsxDEV(ColorPicker, {
          agentName: t3,
          currentColor: "automatic",
          onConfirm: handleConfirm
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[11] = handleConfirm, $3[12] = t3, $3[13] = t4;
  else
    t4 = $3[13];
  return t4;
}
var import_compiler_runtime255, jsx_dev_runtime324;
var init_ColorStep = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_wizard();
  init_WizardDialogLayout();
  init_ColorPicker();
  import_compiler_runtime255 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime324 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
