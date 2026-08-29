// Original: src/components/agents/new-agent-creation/wizard-steps/ToolsStep.tsx
function ToolsStep(t0) {
  let $3 = import_compiler_runtime263.c(9), {
    tools
  } = t0, {
    goNext,
    goBack,
    updateWizardData,
    wizardData
  } = useWizard(), t1;
  if ($3[0] !== goNext || $3[1] !== updateWizardData)
    t1 = (selectedTools) => {
      updateWizardData({
        selectedTools
      }), goNext();
    }, $3[0] = goNext, $3[1] = updateWizardData, $3[2] = t1;
  else
    t1 = $3[2];
  let handleComplete = t1, initialTools = wizardData.selectedTools, t2;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime334.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime334.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "toggle selection"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime334.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime334.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== goBack || $3[5] !== handleComplete || $3[6] !== initialTools || $3[7] !== tools)
    t3 = /* @__PURE__ */ jsx_dev_runtime334.jsxDEV(WizardDialogLayout, {
      subtitle: "Select tools",
      footerText: t2,
      children: /* @__PURE__ */ jsx_dev_runtime334.jsxDEV(ToolSelector, {
        tools,
        initialTools,
        onComplete: handleComplete,
        onCancel: goBack
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = goBack, $3[5] = handleComplete, $3[6] = initialTools, $3[7] = tools, $3[8] = t3;
  else
    t3 = $3[8];
  return t3;
}
var import_compiler_runtime263, jsx_dev_runtime334;
var init_ToolsStep = __esm(() => {
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_wizard();
  init_WizardDialogLayout();
  init_ToolSelector();
  import_compiler_runtime263 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime334 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
