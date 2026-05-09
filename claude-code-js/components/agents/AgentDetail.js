// Original: src/components/agents/AgentDetail.tsx
function AgentDetail(t0) {
  let $3 = import_compiler_runtime247.c(48), {
    agent,
    tools,
    onBack
  } = t0, resolvedTools = resolveAgentTools(agent, tools, !1), t1;
  if ($3[0] !== agent)
    t1 = getActualRelativeAgentFilePath(agent), $3[0] = agent, $3[1] = t1;
  else
    t1 = $3[1];
  let filePath = t1, t2;
  if ($3[2] !== agent.agentType)
    t2 = getAgentColor(agent.agentType), $3[2] = agent.agentType, $3[3] = t2;
  else
    t2 = $3[3];
  let backgroundColor = t2, t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {
      context: "Confirmation"
    }, $3[4] = t3;
  else
    t3 = $3[4];
  useKeybinding("confirm:no", onBack, t3);
  let t4;
  if ($3[5] !== onBack)
    t4 = (e) => {
      if (e.key === "return")
        e.preventDefault(), onBack();
    }, $3[5] = onBack, $3[6] = t4;
  else
    t4 = $3[6];
  let handleKeyDown = t4, renderToolsList = function() {
    if (resolvedTools.hasWildcard)
      return /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
        children: "All tools"
      }, void 0, !1, void 0, this);
    if (!agent.tools || agent.tools.length === 0)
      return /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
        children: "None"
      }, void 0, !1, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(jsx_dev_runtime314.Fragment, {
      children: [
        resolvedTools.validTools.length > 0 && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          children: resolvedTools.validTools.join(", ")
        }, void 0, !1, void 0, this),
        resolvedTools.invalidTools.length > 0 && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          color: "warning",
          children: [
            figures_default.warning,
            " Unrecognized:",
            " ",
            resolvedTools.invalidTools.join(", ")
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }, T0 = ThemedBox_default, t5 = "column", t6 = 1, t7 = 0, t8 = !0, t9;
  if ($3[7] !== filePath)
    t9 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      dimColor: !0,
      children: filePath
    }, void 0, !1, void 0, this), $3[7] = filePath, $3[8] = t9;
  else
    t9 = $3[8];
  let t10;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          bold: !0,
          children: "Description"
        }, void 0, !1, void 0, this),
        " (tells Claude when to use this agent):"
      ]
    }, void 0, !0, void 0, this), $3[9] = t10;
  else
    t10 = $3[9];
  let t11;
  if ($3[10] !== agent.whenToUse)
    t11 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t10,
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
            children: agent.whenToUse
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[10] = agent.whenToUse, $3[11] = t11;
  else
    t11 = $3[11];
  let T1 = ThemedBox_default, t12;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          bold: !0,
          children: "Tools"
        }, void 0, !1, void 0, this),
        ":",
        " "
      ]
    }, void 0, !0, void 0, this), $3[12] = t12;
  else
    t12 = $3[12];
  let t13 = renderToolsList(), t14;
  if ($3[13] !== T1 || $3[14] !== t12 || $3[15] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(T1, {
      children: [
        t12,
        t13
      ]
    }, void 0, !0, void 0, this), $3[13] = T1, $3[14] = t12, $3[15] = t13, $3[16] = t14;
  else
    t14 = $3[16];
  let t15;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t15 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      bold: !0,
      children: "Model"
    }, void 0, !1, void 0, this), $3[17] = t15;
  else
    t15 = $3[17];
  let t16;
  if ($3[18] !== agent.model)
    t16 = getAgentModelDisplay(agent.model), $3[18] = agent.model, $3[19] = t16;
  else
    t16 = $3[19];
  let t17;
  if ($3[20] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      children: [
        t15,
        ": ",
        t16
      ]
    }, void 0, !0, void 0, this), $3[20] = t16, $3[21] = t17;
  else
    t17 = $3[21];
  let t18;
  if ($3[22] !== agent.permissionMode)
    t18 = agent.permissionMode && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          bold: !0,
          children: "Permission mode"
        }, void 0, !1, void 0, this),
        ": ",
        agent.permissionMode
      ]
    }, void 0, !0, void 0, this), $3[22] = agent.permissionMode, $3[23] = t18;
  else
    t18 = $3[23];
  let t19;
  if ($3[24] !== agent.memory)
    t19 = agent.memory && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          bold: !0,
          children: "Memory"
        }, void 0, !1, void 0, this),
        ": ",
        getMemoryScopeDisplay(agent.memory)
      ]
    }, void 0, !0, void 0, this), $3[24] = agent.memory, $3[25] = t19;
  else
    t19 = $3[25];
  let t20;
  if ($3[26] !== agent.hooks)
    t20 = agent.hooks && Object.keys(agent.hooks).length > 0 && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          bold: !0,
          children: "Hooks"
        }, void 0, !1, void 0, this),
        ": ",
        Object.keys(agent.hooks).join(", ")
      ]
    }, void 0, !0, void 0, this), $3[26] = agent.hooks, $3[27] = t20;
  else
    t20 = $3[27];
  let t21;
  if ($3[28] !== agent.skills)
    t21 = agent.skills && agent.skills.length > 0 && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
          bold: !0,
          children: "Skills"
        }, void 0, !1, void 0, this),
        ":",
        " ",
        agent.skills.length > 10 ? `${agent.skills.length} skills` : agent.skills.join(", ")
      ]
    }, void 0, !0, void 0, this), $3[28] = agent.skills, $3[29] = t21;
  else
    t21 = $3[29];
  let t22;
  if ($3[30] !== agent.agentType || $3[31] !== backgroundColor)
    t22 = backgroundColor && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
            bold: !0,
            children: "Color"
          }, void 0, !1, void 0, this),
          ":",
          " ",
          /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
            backgroundColor,
            color: "inverseText",
            children: [
              " ",
              agent.agentType,
              " "
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[30] = agent.agentType, $3[31] = backgroundColor, $3[32] = t22;
  else
    t22 = $3[32];
  let t23;
  if ($3[33] !== agent)
    t23 = !isBuiltInAgent(agent) && /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(jsx_dev_runtime314.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedText, {
                bold: !0,
                children: "System prompt"
              }, void 0, !1, void 0, this),
              ":"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          marginRight: 2,
          children: /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(Markdown, {
            children: agent.getSystemPrompt()
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[33] = agent, $3[34] = t23;
  else
    t23 = $3[34];
  let t24;
  if ($3[35] !== T0 || $3[36] !== handleKeyDown || $3[37] !== t11 || $3[38] !== t14 || $3[39] !== t17 || $3[40] !== t18 || $3[41] !== t19 || $3[42] !== t20 || $3[43] !== t21 || $3[44] !== t22 || $3[45] !== t23 || $3[46] !== t9)
    t24 = /* @__PURE__ */ jsx_dev_runtime314.jsxDEV(T0, {
      flexDirection: t5,
      gap: t6,
      tabIndex: t7,
      autoFocus: t8,
      onKeyDown: handleKeyDown,
      children: [
        t9,
        t11,
        t14,
        t17,
        t18,
        t19,
        t20,
        t21,
        t22,
        t23
      ]
    }, void 0, !0, void 0, this), $3[35] = T0, $3[36] = handleKeyDown, $3[37] = t11, $3[38] = t14, $3[39] = t17, $3[40] = t18, $3[41] = t19, $3[42] = t20, $3[43] = t21, $3[44] = t22, $3[45] = t23, $3[46] = t9, $3[47] = t24;
  else
    t24 = $3[47];
  return t24;
}
var import_compiler_runtime247, jsx_dev_runtime314;
var init_AgentDetail = __esm(() => {
  init_figures();
  init_ink2();
  init_useKeybinding();
  init_agentColorManager();
  init_agentMemory();
  init_agentToolUtils();
  init_loadAgentsDir();
  init_agent();
  init_Markdown();
  init_agentFileUtils();
  import_compiler_runtime247 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime314 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
