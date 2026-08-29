// Original: src/components/agents/new-agent-creation/wizard-steps/MemoryStep.tsx
function MemoryStep() {
  let $3 = import_compiler_runtime259.c(13), {
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
  let isUserScope = wizardData.location === "userSettings", t1;
  if ($3[1] !== isUserScope)
    t1 = isUserScope ? [{
      label: "User scope (~/.claude/agent-memory/) (Recommended)",
      value: "user"
    }, {
      label: "None (no persistent memory)",
      value: "none"
    }, {
      label: "Project scope (.claude/agent-memory/)",
      value: "project"
    }, {
      label: "Local scope (.claude/agent-memory-local/)",
      value: "local"
    }] : [{
      label: "Project scope (.claude/agent-memory/) (Recommended)",
      value: "project"
    }, {
      label: "None (no persistent memory)",
      value: "none"
    }, {
      label: "User scope (~/.claude/agent-memory/)",
      value: "user"
    }, {
      label: "Local scope (.claude/agent-memory-local/)",
      value: "local"
    }], $3[1] = isUserScope, $3[2] = t1;
  else
    t1 = $3[2];
  let memoryOptions = t1, t2;
  if ($3[3] !== goNext || $3[4] !== updateWizardData || $3[5] !== wizardData.finalAgent || $3[6] !== wizardData.systemPrompt)
    t2 = (value) => {
      let memory2 = value === "none" ? void 0 : value, agentType = wizardData.finalAgent?.agentType;
      updateWizardData({
        selectedMemory: memory2,
        finalAgent: wizardData.finalAgent ? {
          ...wizardData.finalAgent,
          memory: memory2,
          getSystemPrompt: isAutoMemoryEnabled() && memory2 && agentType ? () => wizardData.systemPrompt + `

` + loadAgentMemoryPrompt(agentType, memory2) : () => wizardData.systemPrompt
        } : void 0
      }), goNext();
    }, $3[3] = goNext, $3[4] = updateWizardData, $3[5] = wizardData.finalAgent, $3[6] = wizardData.systemPrompt, $3[7] = t2;
  else
    t2 = $3[7];
  let handleSelect = t2, t3;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime330.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime330.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime330.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "select"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime330.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[8] = t3;
  else
    t3 = $3[8];
  let t4;
  if ($3[9] !== goBack || $3[10] !== handleSelect || $3[11] !== memoryOptions)
    t4 = /* @__PURE__ */ jsx_dev_runtime330.jsxDEV(WizardDialogLayout, {
      subtitle: "Configure agent memory",
      footerText: t3,
      children: /* @__PURE__ */ jsx_dev_runtime330.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime330.jsxDEV(Select, {
          options: memoryOptions,
          onChange: handleSelect,
          onCancel: goBack
        }, "memory-select", !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = goBack, $3[10] = handleSelect, $3[11] = memoryOptions, $3[12] = t4;
  else
    t4 = $3[12];
  return t4;
}
var import_compiler_runtime259, jsx_dev_runtime330;
var init_MemoryStep = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_paths();
  init_agentMemory();
  init_ConfigurableShortcutHint();
  init_select();
  init_Byline();
  init_KeyboardShortcutHint();
  init_wizard();
  init_WizardDialogLayout();
  import_compiler_runtime259 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime330 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
