// Original: src/components/agents/new-agent-creation/wizard-steps/ConfirmStep.tsx
function ConfirmStep(t0) {
  let $3 = import_compiler_runtime256.c(88), {
    tools,
    existingAgents,
    onSave,
    onSaveAndEdit,
    error: error44
  } = t0, {
    goBack,
    wizardData
  } = useWizard(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Confirmation"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:no", goBack, t1);
  let t2;
  if ($3[1] !== onSave || $3[2] !== onSaveAndEdit)
    t2 = (e) => {
      if (e.key === "s" || e.key === "return")
        e.preventDefault(), onSave();
      else if (e.key === "e")
        e.preventDefault(), onSaveAndEdit();
    }, $3[1] = onSave, $3[2] = onSaveAndEdit, $3[3] = t2;
  else
    t2 = $3[3];
  let handleKeyDown = t2, agent = wizardData.finalAgent, T0, T1, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t3, t4, t5, t6, t7, t8, t9;
  if ($3[4] !== agent || $3[5] !== existingAgents || $3[6] !== handleKeyDown || $3[7] !== tools || $3[8] !== wizardData.location) {
    let validation = validateAgent(agent, tools, existingAgents), t202;
    if ($3[28] !== agent)
      t202 = truncateToWidth(agent.getSystemPrompt(), 240), $3[28] = agent, $3[29] = t202;
    else
      t202 = $3[29];
    let systemPromptPreview = t202, t212;
    if ($3[30] !== agent.whenToUse)
      t212 = truncateToWidth(agent.whenToUse, 240), $3[30] = agent.whenToUse, $3[31] = t212;
    else
      t212 = $3[31];
    let whenToUsePreview = t212, getToolsDisplay = _temp159, t222;
    if ($3[32] !== agent.memory)
      t222 = isAutoMemoryEnabled() ? /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
            bold: !0,
            children: "Memory"
          }, void 0, !1, void 0, this),
          ": ",
          getMemoryScopeDisplay(agent.memory)
        ]
      }, void 0, !0, void 0, this) : null, $3[32] = agent.memory, $3[33] = t222;
    else
      t222 = $3[33];
    let memoryDisplayElement = t222;
    if (T1 = WizardDialogLayout, t18 = "Confirm and save", $3[34] === Symbol.for("react.memo_cache_sentinel"))
      t19 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(KeyboardShortcutHint, {
            shortcut: "s/Enter",
            action: "save"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(KeyboardShortcutHint, {
            shortcut: "e",
            action: "edit in your editor"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[34] = t19;
    else
      t19 = $3[34];
    T0 = ThemedBox_default, t3 = "column", t4 = 0, t5 = !0, t6 = handleKeyDown;
    let t232;
    if ($3[35] === Symbol.for("react.memo_cache_sentinel"))
      t232 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        bold: !0,
        children: "Name"
      }, void 0, !1, void 0, this), $3[35] = t232;
    else
      t232 = $3[35];
    if ($3[36] !== agent.agentType)
      t7 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        children: [
          t232,
          ": ",
          agent.agentType
        ]
      }, void 0, !0, void 0, this), $3[36] = agent.agentType, $3[37] = t7;
    else
      t7 = $3[37];
    let t242;
    if ($3[38] === Symbol.for("react.memo_cache_sentinel"))
      t242 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        bold: !0,
        children: "Location"
      }, void 0, !1, void 0, this), $3[38] = t242;
    else
      t242 = $3[38];
    let t252;
    if ($3[39] !== agent.agentType || $3[40] !== wizardData.location)
      t252 = getNewRelativeAgentFilePath({
        source: wizardData.location,
        agentType: agent.agentType
      }), $3[39] = agent.agentType, $3[40] = wizardData.location, $3[41] = t252;
    else
      t252 = $3[41];
    if ($3[42] !== t252)
      t8 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        children: [
          t242,
          ":",
          " ",
          t252
        ]
      }, void 0, !0, void 0, this), $3[42] = t252, $3[43] = t8;
    else
      t8 = $3[43];
    let t26;
    if ($3[44] === Symbol.for("react.memo_cache_sentinel"))
      t26 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        bold: !0,
        children: "Tools"
      }, void 0, !1, void 0, this), $3[44] = t26;
    else
      t26 = $3[44];
    let t27;
    if ($3[45] !== agent.tools)
      t27 = getToolsDisplay(agent.tools), $3[45] = agent.tools, $3[46] = t27;
    else
      t27 = $3[46];
    if ($3[47] !== t27)
      t9 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        children: [
          t26,
          ": ",
          t27
        ]
      }, void 0, !0, void 0, this), $3[47] = t27, $3[48] = t9;
    else
      t9 = $3[48];
    let t28;
    if ($3[49] === Symbol.for("react.memo_cache_sentinel"))
      t28 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        bold: !0,
        children: "Model"
      }, void 0, !1, void 0, this), $3[49] = t28;
    else
      t28 = $3[49];
    let t29;
    if ($3[50] !== agent.model)
      t29 = getAgentModelDisplay(agent.model), $3[50] = agent.model, $3[51] = t29;
    else
      t29 = $3[51];
    if ($3[52] !== t29)
      t10 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        children: [
          t28,
          ": ",
          t29
        ]
      }, void 0, !0, void 0, this), $3[52] = t29, $3[53] = t10;
    else
      t10 = $3[53];
    if (t11 = memoryDisplayElement, $3[54] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
              bold: !0,
              children: "Description"
            }, void 0, !1, void 0, this),
            " (tells Claude when to use this agent):"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[54] = t12;
    else
      t12 = $3[54];
    if ($3[55] !== whenToUsePreview)
      t13 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
        marginLeft: 2,
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
          children: whenToUsePreview
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[55] = whenToUsePreview, $3[56] = t13;
    else
      t13 = $3[56];
    if ($3[57] === Symbol.for("react.memo_cache_sentinel"))
      t14 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
              bold: !0,
              children: "System prompt"
            }, void 0, !1, void 0, this),
            ":"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[57] = t14;
    else
      t14 = $3[57];
    if ($3[58] !== systemPromptPreview)
      t15 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
        marginLeft: 2,
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
          children: systemPromptPreview
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[58] = systemPromptPreview, $3[59] = t15;
    else
      t15 = $3[59];
    t16 = validation.warnings.length > 0 && /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
          color: "warning",
          children: "Warnings:"
        }, void 0, !1, void 0, this),
        validation.warnings.map(_temp269)
      ]
    }, void 0, !0, void 0, this), t17 = validation.errors.length > 0 && /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
          color: "error",
          children: "Errors:"
        }, void 0, !1, void 0, this),
        validation.errors.map(_temp343)
      ]
    }, void 0, !0, void 0, this), $3[4] = agent, $3[5] = existingAgents, $3[6] = handleKeyDown, $3[7] = tools, $3[8] = wizardData.location, $3[9] = T0, $3[10] = T1, $3[11] = t10, $3[12] = t11, $3[13] = t12, $3[14] = t13, $3[15] = t14, $3[16] = t15, $3[17] = t16, $3[18] = t17, $3[19] = t18, $3[20] = t19, $3[21] = t3, $3[22] = t4, $3[23] = t5, $3[24] = t6, $3[25] = t7, $3[26] = t8, $3[27] = t9;
  } else
    T0 = $3[9], T1 = $3[10], t10 = $3[11], t11 = $3[12], t12 = $3[13], t13 = $3[14], t14 = $3[15], t15 = $3[16], t16 = $3[17], t17 = $3[18], t18 = $3[19], t19 = $3[20], t3 = $3[21], t4 = $3[22], t5 = $3[23], t6 = $3[24], t7 = $3[25], t8 = $3[26], t9 = $3[27];
  let t20;
  if ($3[60] !== error44)
    t20 = error44 && /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        color: "error",
        children: error44
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[60] = error44, $3[61] = t20;
  else
    t20 = $3[61];
  let t21;
  if ($3[62] === Symbol.for("react.memo_cache_sentinel"))
    t21 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
      bold: !0,
      children: "s"
    }, void 0, !1, void 0, this), $3[62] = t21;
  else
    t21 = $3[62];
  let t22;
  if ($3[63] === Symbol.for("react.memo_cache_sentinel"))
    t22 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
      bold: !0,
      children: "Enter"
    }, void 0, !1, void 0, this), $3[63] = t22;
  else
    t22 = $3[63];
  let t23;
  if ($3[64] === Symbol.for("react.memo_cache_sentinel"))
    t23 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedBox_default, {
      marginTop: 2,
      children: /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
        color: "success",
        children: [
          "Press ",
          t21,
          " or ",
          t22,
          " to save,",
          " ",
          /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
            bold: !0,
            children: "e"
          }, void 0, !1, void 0, this),
          " to save and edit"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[64] = t23;
  else
    t23 = $3[64];
  let t24;
  if ($3[65] !== T0 || $3[66] !== t10 || $3[67] !== t11 || $3[68] !== t12 || $3[69] !== t13 || $3[70] !== t14 || $3[71] !== t15 || $3[72] !== t16 || $3[73] !== t17 || $3[74] !== t20 || $3[75] !== t3 || $3[76] !== t4 || $3[77] !== t5 || $3[78] !== t6 || $3[79] !== t7 || $3[80] !== t8 || $3[81] !== t9)
    t24 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(T0, {
      flexDirection: t3,
      tabIndex: t4,
      autoFocus: t5,
      onKeyDown: t6,
      children: [
        t7,
        t8,
        t9,
        t10,
        t11,
        t12,
        t13,
        t14,
        t15,
        t16,
        t17,
        t20,
        t23
      ]
    }, void 0, !0, void 0, this), $3[65] = T0, $3[66] = t10, $3[67] = t11, $3[68] = t12, $3[69] = t13, $3[70] = t14, $3[71] = t15, $3[72] = t16, $3[73] = t17, $3[74] = t20, $3[75] = t3, $3[76] = t4, $3[77] = t5, $3[78] = t6, $3[79] = t7, $3[80] = t8, $3[81] = t9, $3[82] = t24;
  else
    t24 = $3[82];
  let t25;
  if ($3[83] !== T1 || $3[84] !== t18 || $3[85] !== t19 || $3[86] !== t24)
    t25 = /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(T1, {
      subtitle: t18,
      footerText: t19,
      children: t24
    }, void 0, !1, void 0, this), $3[83] = T1, $3[84] = t18, $3[85] = t19, $3[86] = t24, $3[87] = t25;
  else
    t25 = $3[87];
  return t25;
}
function _temp343(err2, i_0) {
  return /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
    color: "error",
    children: [
      " ",
      "\u2022 ",
      err2
    ]
  }, i_0, !0, void 0, this);
}
function _temp269(warning, i5) {
  return /* @__PURE__ */ jsx_dev_runtime325.jsxDEV(ThemedText, {
    dimColor: !0,
    children: [
      " ",
      "\u2022 ",
      warning
    ]
  }, i5, !0, void 0, this);
}
function _temp159(toolNames) {
  if (toolNames === void 0)
    return "All tools";
  if (toolNames.length === 0)
    return "None";
  if (toolNames.length === 1)
    return toolNames[0] || "None";
  if (toolNames.length === 2)
    return toolNames.join(" and ");
  return `${toolNames.slice(0, -1).join(", ")}, and ${toolNames[toolNames.length - 1]}`;
}
var import_compiler_runtime256, jsx_dev_runtime325;
var init_ConfirmStep = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_paths();
  init_agentMemory();
  init_format();
  init_agent();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_wizard();
  init_WizardDialogLayout();
  init_agentFileUtils();
  init_validateAgent();
  import_compiler_runtime256 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime325 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
