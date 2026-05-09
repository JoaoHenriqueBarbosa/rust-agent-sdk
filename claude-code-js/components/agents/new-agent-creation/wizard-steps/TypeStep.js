// Original: src/components/agents/new-agent-creation/wizard-steps/TypeStep.tsx
function TypeStep(_props) {
  let $3 = import_compiler_runtime264.c(15), {
    goNext,
    goBack,
    updateWizardData,
    wizardData
  } = useWizard(), [agentType, setAgentType] = import_react184.useState(wizardData.agentType || ""), [error44, setError] = import_react184.useState(null), [cursorOffset, setCursorOffset] = import_react184.useState(agentType.length), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = {
      context: "Settings"
    }, $3[0] = t0;
  else
    t0 = $3[0];
  useKeybinding("confirm:no", goBack, t0);
  let t1;
  if ($3[1] !== goNext || $3[2] !== updateWizardData)
    t1 = (value) => {
      let trimmedValue = value.trim(), validationError = validateAgentType(trimmedValue);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null), updateWizardData({
        agentType: trimmedValue
      }), goNext();
    }, $3[1] = goNext, $3[2] = updateWizardData, $3[3] = t1;
  else
    t1 = $3[3];
  let handleSubmit = t1, t2;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Type",
          action: "enter text"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "continue"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Settings",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(ThemedText, {
      children: "Enter a unique identifier for your agent:"
    }, void 0, !1, void 0, this), $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== agentType || $3[7] !== cursorOffset || $3[8] !== handleSubmit)
    t4 = /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(TextInput, {
        value: agentType,
        onChange: setAgentType,
        onSubmit: handleSubmit,
        placeholder: "e.g., test-runner, tech-lead, etc",
        columns: 60,
        cursorOffset,
        onChangeCursorOffset: setCursorOffset,
        focus: !0,
        showCursor: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = agentType, $3[7] = cursorOffset, $3[8] = handleSubmit, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== error44)
    t5 = error44 && /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(ThemedText, {
        color: "error",
        children: error44
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = error44, $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] !== t4 || $3[13] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(WizardDialogLayout, {
      subtitle: "Agent type (identifier)",
      footerText: t2,
      children: /* @__PURE__ */ jsx_dev_runtime335.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t3,
          t4,
          t5
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = t4, $3[13] = t5, $3[14] = t6;
  else
    t6 = $3[14];
  return t6;
}
var import_compiler_runtime264, import_react184, jsx_dev_runtime335;
var init_TypeStep = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_TextInput();
  init_wizard();
  init_WizardDialogLayout();
  init_validateAgent();
  import_compiler_runtime264 = __toESM(require_react_compiler_runtime_development(), 1), import_react184 = __toESM(require_react_development(), 1), jsx_dev_runtime335 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
