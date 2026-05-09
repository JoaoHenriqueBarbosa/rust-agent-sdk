// Original: src/components/agents/new-agent-creation/wizard-steps/DescriptionStep.tsx
function DescriptionStep() {
  let $3 = import_compiler_runtime257.c(18), {
    goNext,
    goBack,
    updateWizardData,
    wizardData
  } = useWizard(), [whenToUse, setWhenToUse] = import_react181.useState(wizardData.whenToUse || ""), [cursorOffset, setCursorOffset] = import_react181.useState(whenToUse.length), [error44, setError] = import_react181.useState(null), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = {
      context: "Settings"
    }, $3[0] = t0;
  else
    t0 = $3[0];
  useKeybinding("confirm:no", goBack, t0);
  let t1;
  if ($3[1] !== whenToUse)
    t1 = async () => {
      let result = await editPromptInEditor(whenToUse);
      if (result.content !== null)
        setWhenToUse(result.content), setCursorOffset(result.content.length);
    }, $3[1] = whenToUse, $3[2] = t1;
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
  if ($3[4] !== goNext || $3[5] !== updateWizardData)
    t3 = (value) => {
      let trimmedValue = value.trim();
      if (!trimmedValue) {
        setError("Description is required");
        return;
      }
      setError(null), updateWizardData({
        whenToUse: trimmedValue
      }), goNext();
    }, $3[4] = goNext, $3[5] = updateWizardData, $3[6] = t3;
  else
    t3 = $3[6];
  let handleSubmit = t3, t4;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Type",
          action: "enter text"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "continue"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(ConfigurableShortcutHint, {
          action: "chat:externalEditor",
          context: "Chat",
          fallback: "ctrl+g",
          description: "open in editor"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Settings",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(ThemedText, {
      children: "When should Claude use this agent?"
    }, void 0, !1, void 0, this), $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== cursorOffset || $3[10] !== handleSubmit || $3[11] !== whenToUse)
    t6 = /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(TextInput, {
        value: whenToUse,
        onChange: setWhenToUse,
        onSubmit: handleSubmit,
        placeholder: "e.g., use this agent after you're done writing code...",
        columns: 80,
        cursorOffset,
        onChangeCursorOffset: setCursorOffset,
        focus: !0,
        showCursor: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = cursorOffset, $3[10] = handleSubmit, $3[11] = whenToUse, $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] !== error44)
    t7 = error44 && /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(ThemedText, {
        color: "error",
        children: error44
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = error44, $3[14] = t7;
  else
    t7 = $3[14];
  let t8;
  if ($3[15] !== t6 || $3[16] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(WizardDialogLayout, {
      subtitle: "Description (tell Claude when to use this agent)",
      footerText: t4,
      children: /* @__PURE__ */ jsx_dev_runtime327.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t5,
          t6,
          t7
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[15] = t6, $3[16] = t7, $3[17] = t8;
  else
    t8 = $3[17];
  return t8;
}
var import_compiler_runtime257, import_react181, jsx_dev_runtime327;
var init_DescriptionStep = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_promptEditor();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_TextInput();
  init_wizard();
  init_WizardDialogLayout();
  import_compiler_runtime257 = __toESM(require_react_compiler_runtime_development(), 1), import_react181 = __toESM(require_react_development(), 1), jsx_dev_runtime327 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
