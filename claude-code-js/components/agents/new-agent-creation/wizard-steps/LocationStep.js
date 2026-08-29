// Original: src/components/agents/new-agent-creation/wizard-steps/LocationStep.tsx
function LocationStep() {
  let $3 = import_compiler_runtime258.c(11), {
    goNext,
    updateWizardData,
    cancel
  } = useWizard(), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = {
      label: "Project (.claude/agents/)",
      value: "projectSettings"
    }, $3[0] = t0;
  else
    t0 = $3[0];
  let t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [t0, {
      label: "Personal (~/.claude/agents/)",
      value: "userSettings"
    }], $3[1] = t1;
  else
    t1 = $3[1];
  let locationOptions = t1, t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime329.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime329.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime329.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "select"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime329.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "cancel"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== goNext || $3[4] !== updateWizardData)
    t3 = (value) => {
      updateWizardData({
        location: value
      }), goNext();
    }, $3[3] = goNext, $3[4] = updateWizardData, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== cancel)
    t4 = () => cancel(), $3[6] = cancel, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== t3 || $3[9] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime329.jsxDEV(WizardDialogLayout, {
      subtitle: "Choose location",
      footerText: t2,
      children: /* @__PURE__ */ jsx_dev_runtime329.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime329.jsxDEV(Select, {
          options: locationOptions,
          onChange: t3,
          onCancel: t4
        }, "location-select", !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = t3, $3[9] = t4, $3[10] = t5;
  else
    t5 = $3[10];
  return t5;
}
var import_compiler_runtime258, jsx_dev_runtime329;
var init_LocationStep = __esm(() => {
  init_ink2();
  init_ConfigurableShortcutHint();
  init_select();
  init_Byline();
  init_KeyboardShortcutHint();
  init_wizard();
  init_WizardDialogLayout();
  import_compiler_runtime258 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime329 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
