// Original: src/components/agents/new-agent-creation/wizard-steps/PromptStep.tsx
function PromptStep() {
  let $3 = import_compiler_runtime262.c(20), {
    goNext,
    goBack,
    updateWizardData,
    wizardData
  } = useWizard(), [systemPrompt, setSystemPrompt] = import_react183.useState(wizardData.systemPrompt || ""), [cursorOffset, setCursorOffset] = import_react183.useState(systemPrompt.length), [error44, setError] = import_react183.useState(null), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = {
      context: "Settings"
    }, $3[0] = t0;
  else
    t0 = $3[0];
  useKeybinding("confirm:no", goBack, t0);
  let t1;
  if ($3[1] !== systemPrompt)
    t1 = async () => {
      let result = await editPromptInEditor(systemPrompt);
      if (result.content !== null)
        setSystemPrompt(result.content), setCursorOffset(result.content.length);
    }, $3[1] = systemPrompt, $3[2] = t1;
  else
    t1 = $3[2];
  let handleExternalEditor = t1, t2;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      context: "Chat"
    }, $3[3] = t2;
  else
    t2 = $3[3];
  useKeybinding("chat:externalEditor", handleExternalEditor, t2);
  let t3;
  if ($3[4] !== goNext || $3[5] !== systemPrompt || $3[6] !== updateWizardData)
    t3 = () => {
      let trimmedPrompt = systemPrompt.trim();
      if (!trimmedPrompt) {
        setError("System prompt is required");
        return;
      }
      setError(null), updateWizardData({
        systemPrompt: trimmedPrompt
      }), goNext();
    }, $3[4] = goNext, $3[5] = systemPrompt, $3[6] = updateWizardData, $3[7] = t3;
  else
    t3 = $3[7];
  let handleSubmit = t3, t4;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Type",
          action: "enter text"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "continue"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ConfigurableShortcutHint, {
          action: "chat:externalEditor",
          context: "Chat",
          fallback: "ctrl+g",
          description: "open in editor"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Settings",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[8] = t4;
  else
    t4 = $3[8];
  let t5, t6;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ThemedText, {
      children: "Enter the system prompt for your agent:"
    }, void 0, !1, void 0, this), t6 = /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Be comprehensive for best results"
    }, void 0, !1, void 0, this), $3[9] = t5, $3[10] = t6;
  else
    t5 = $3[9], t6 = $3[10];
  let t7;
  if ($3[11] !== cursorOffset || $3[12] !== handleSubmit || $3[13] !== systemPrompt)
    t7 = /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(TextInput, {
        value: systemPrompt,
        onChange: setSystemPrompt,
        onSubmit: handleSubmit,
        placeholder: "You are a helpful code reviewer who...",
        columns: 80,
        cursorOffset,
        onChangeCursorOffset: setCursorOffset,
        focus: !0,
        showCursor: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[11] = cursorOffset, $3[12] = handleSubmit, $3[13] = systemPrompt, $3[14] = t7;
  else
    t7 = $3[14];
  let t8;
  if ($3[15] !== error44)
    t8 = error44 && /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ThemedText, {
        color: "error",
        children: error44
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[15] = error44, $3[16] = t8;
  else
    t8 = $3[16];
  let t9;
  if ($3[17] !== t7 || $3[18] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(WizardDialogLayout, {
      subtitle: "System prompt",
      footerText: t4,
      children: /* @__PURE__ */ jsx_dev_runtime333.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t5,
          t6,
          t7,
          t8
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[17] = t7, $3[18] = t8, $3[19] = t9;
  else
    t9 = $3[19];
  return t9;
}
var import_compiler_runtime262, import_react183, jsx_dev_runtime333;
var init_PromptStep = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_promptEditor();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_TextInput();
  init_wizard();
  init_WizardDialogLayout();
  import_compiler_runtime262 = __toESM(require_react_compiler_runtime_development(), 1), import_react183 = __toESM(require_react_development(), 1), jsx_dev_runtime333 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
