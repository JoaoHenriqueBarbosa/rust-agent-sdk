// Original: src/components/agents/AgentsList.tsx
function AgentsList(t0) {
  let $3 = import_compiler_runtime252.c(96), {
    source,
    agents,
    onBack,
    onSelect,
    onCreateNew,
    changes
  } = t0, [selectedAgent, setSelectedAgent] = React97.useState(null), [isCreateNewSelected, setIsCreateNewSelected] = React97.useState(!0), t1;
  if ($3[0] !== agents)
    t1 = [...agents].sort(compareAgentsByName), $3[0] = agents, $3[1] = t1;
  else
    t1 = $3[1];
  let sortedAgents = t1, getOverrideInfo = _temp157, t2;
  if ($3[2] !== isCreateNewSelected)
    t2 = () => /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
          color: isCreateNewSelected ? "suggestion" : void 0,
          children: isCreateNewSelected ? `${figures_default.pointer} ` : "  "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
          color: isCreateNewSelected ? "suggestion" : void 0,
          children: "Create new agent"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[2] = isCreateNewSelected, $3[3] = t2;
  else
    t2 = $3[3];
  let renderCreateNewOption = t2, t3;
  if ($3[4] !== isCreateNewSelected || $3[5] !== selectedAgent?.agentType || $3[6] !== selectedAgent?.source)
    t3 = (agent_0) => {
      let isBuiltIn = agent_0.source === "built-in", isSelected = !isBuiltIn && !isCreateNewSelected && selectedAgent?.agentType === agent_0.agentType && selectedAgent?.source === agent_0.source, {
        isOverridden,
        overriddenBy
      } = getOverrideInfo(agent_0), dimmed = isBuiltIn || isOverridden, textColor = !isBuiltIn && isSelected ? "suggestion" : void 0, resolvedModel = resolveAgentModelDisplay(agent_0);
      return /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: dimmed && !isSelected,
            color: textColor,
            children: isBuiltIn ? "" : isSelected ? `${figures_default.pointer} ` : "  "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: dimmed && !isSelected,
            color: textColor,
            children: agent_0.agentType
          }, void 0, !1, void 0, this),
          resolvedModel && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !0,
            color: textColor,
            children: [
              " \xB7 ",
              resolvedModel
            ]
          }, void 0, !0, void 0, this),
          agent_0.memory && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !0,
            color: textColor,
            children: [
              " \xB7 ",
              agent_0.memory,
              " memory"
            ]
          }, void 0, !0, void 0, this),
          overriddenBy && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !isSelected,
            color: isSelected ? "warning" : void 0,
            children: [
              " ",
              figures_default.warning,
              " shadowed by ",
              getOverrideSourceLabel(overriddenBy)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, `${agent_0.agentType}-${agent_0.source}`, !0, void 0, this);
    }, $3[4] = isCreateNewSelected, $3[5] = selectedAgent?.agentType, $3[6] = selectedAgent?.source, $3[7] = t3;
  else
    t3 = $3[7];
  let renderAgent = t3, t4;
  if ($3[8] !== sortedAgents || $3[9] !== source) {
    bb0: {
      let nonBuiltIn = sortedAgents.filter(_temp267);
      if (source === "all") {
        t4 = AGENT_SOURCE_GROUPS.filter(_temp341).flatMap((t52) => {
          let {
            source: groupSource
          } = t52;
          return nonBuiltIn.filter((a_0) => a_0.source === groupSource);
        });
        break bb0;
      }
      t4 = nonBuiltIn;
    }
    $3[8] = sortedAgents, $3[9] = source, $3[10] = t4;
  } else
    t4 = $3[10];
  let selectableAgentsInOrder = t4, t5, t6;
  if ($3[11] !== isCreateNewSelected || $3[12] !== onCreateNew || $3[13] !== selectableAgentsInOrder || $3[14] !== selectedAgent)
    t5 = () => {
      if (!selectedAgent && !isCreateNewSelected && selectableAgentsInOrder.length > 0)
        if (onCreateNew)
          setIsCreateNewSelected(!0);
        else
          setSelectedAgent(selectableAgentsInOrder[0] || null);
    }, t6 = [selectableAgentsInOrder, selectedAgent, isCreateNewSelected, onCreateNew], $3[11] = isCreateNewSelected, $3[12] = onCreateNew, $3[13] = selectableAgentsInOrder, $3[14] = selectedAgent, $3[15] = t5, $3[16] = t6;
  else
    t5 = $3[15], t6 = $3[16];
  React97.useEffect(t5, t6);
  let t7;
  if ($3[17] !== isCreateNewSelected || $3[18] !== onCreateNew || $3[19] !== onSelect || $3[20] !== selectableAgentsInOrder || $3[21] !== selectedAgent)
    t7 = (e) => {
      if (e.key === "return") {
        if (e.preventDefault(), isCreateNewSelected && onCreateNew)
          onCreateNew();
        else if (selectedAgent)
          onSelect(selectedAgent);
        return;
      }
      if (e.key !== "up" && e.key !== "down")
        return;
      e.preventDefault();
      let hasCreateOption = !!onCreateNew, totalItems = selectableAgentsInOrder.length + (hasCreateOption ? 1 : 0);
      if (totalItems === 0)
        return;
      let currentPosition = 0;
      if (!isCreateNewSelected && selectedAgent) {
        let agentIndex = selectableAgentsInOrder.findIndex((a_1) => a_1.agentType === selectedAgent.agentType && a_1.source === selectedAgent.source);
        if (agentIndex >= 0)
          currentPosition = hasCreateOption ? agentIndex + 1 : agentIndex;
      }
      let newPosition = e.key === "up" ? currentPosition === 0 ? totalItems - 1 : currentPosition - 1 : currentPosition === totalItems - 1 ? 0 : currentPosition + 1;
      if (hasCreateOption && newPosition === 0)
        setIsCreateNewSelected(!0), setSelectedAgent(null);
      else {
        let agentIndex_0 = hasCreateOption ? newPosition - 1 : newPosition, newAgent = selectableAgentsInOrder[agentIndex_0];
        if (newAgent)
          setIsCreateNewSelected(!1), setSelectedAgent(newAgent);
      }
    }, $3[17] = isCreateNewSelected, $3[18] = onCreateNew, $3[19] = onSelect, $3[20] = selectableAgentsInOrder, $3[21] = selectedAgent, $3[22] = t7;
  else
    t7 = $3[22];
  let handleKeyDown = t7, t8;
  if ($3[23] !== renderAgent || $3[24] !== sortedAgents)
    t8 = (t92) => {
      let title = t92 === void 0 ? "Built-in (always available):" : t92, builtInAgents = sortedAgents.filter(_temp432);
      return /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginBottom: 1,
        paddingLeft: 2,
        children: [
          /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            bold: !0,
            dimColor: !0,
            children: title
          }, void 0, !1, void 0, this),
          builtInAgents.map(renderAgent)
        ]
      }, void 0, !0, void 0, this);
    }, $3[23] = renderAgent, $3[24] = sortedAgents, $3[25] = t8;
  else
    t8 = $3[25];
  let renderBuiltInAgentsSection = t8, t9;
  if ($3[26] !== renderAgent)
    t9 = (title_0, groupAgents) => {
      if (!groupAgents.length)
        return null;
      let folderPath = groupAgents[0]?.baseDir;
      return /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
            paddingLeft: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
                bold: !0,
                dimColor: !0,
                children: title_0
              }, void 0, !1, void 0, this),
              folderPath && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " (",
                  folderPath,
                  ")"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          groupAgents.map((agent_1) => renderAgent(agent_1))
        ]
      }, void 0, !0, void 0, this);
    }, $3[26] = renderAgent, $3[27] = t9;
  else
    t9 = $3[27];
  let renderAgentGroup = t9, t10;
  if ($3[28] !== source)
    t10 = getAgentSourceDisplayName(source), $3[28] = source, $3[29] = t10;
  else
    t10 = $3[29];
  let sourceTitle = t10, T0, T1, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22;
  if ($3[30] !== changes || $3[31] !== handleKeyDown || $3[32] !== onBack || $3[33] !== onCreateNew || $3[34] !== renderAgent || $3[35] !== renderAgentGroup || $3[36] !== renderBuiltInAgentsSection || $3[37] !== renderCreateNewOption || $3[38] !== sortedAgents || $3[39] !== source || $3[40] !== sourceTitle) {
    t22 = Symbol.for("react.early_return_sentinel");
    bb1: {
      let builtInAgents_0 = sortedAgents.filter(_temp522);
      if (!sortedAgents.length || source !== "built-in" && !sortedAgents.some(_temp619)) {
        let t233;
        if ($3[55] !== onCreateNew || $3[56] !== renderCreateNewOption)
          t233 = onCreateNew && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
            children: renderCreateNewOption()
          }, void 0, !1, void 0, this), $3[55] = onCreateNew, $3[56] = renderCreateNewOption, $3[57] = t233;
        else
          t233 = $3[57];
        let t242, t25, t26;
        if ($3[58] === Symbol.for("react.memo_cache_sentinel"))
          t242 = /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "No agents found. Create specialized subagents that Claude can delegate to."
          }, void 0, !1, void 0, this), t25 = /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Each subagent has its own context window, custom system prompt, and specific tools."
          }, void 0, !1, void 0, this), t26 = /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Try creating: Code Reviewer, Code Simplifier, Security Reviewer, Tech Lead, or UX Reviewer."
          }, void 0, !1, void 0, this), $3[58] = t242, $3[59] = t25, $3[60] = t26;
        else
          t242 = $3[58], t25 = $3[59], t26 = $3[60];
        let t27;
        if ($3[61] !== renderBuiltInAgentsSection || $3[62] !== sortedAgents || $3[63] !== source)
          t27 = source !== "built-in" && sortedAgents.some(_temp716) && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(jsx_dev_runtime320.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(Divider, {}, void 0, !1, void 0, this),
              renderBuiltInAgentsSection()
            ]
          }, void 0, !0, void 0, this), $3[61] = renderBuiltInAgentsSection, $3[62] = sortedAgents, $3[63] = source, $3[64] = t27;
        else
          t27 = $3[64];
        let t28;
        if ($3[65] !== handleKeyDown || $3[66] !== t233 || $3[67] !== t27)
          t28 = /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            gap: 1,
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: handleKeyDown,
            children: [
              t233,
              t242,
              t25,
              t26,
              t27
            ]
          }, void 0, !0, void 0, this), $3[65] = handleKeyDown, $3[66] = t233, $3[67] = t27, $3[68] = t28;
        else
          t28 = $3[68];
        let t29;
        if ($3[69] !== onBack || $3[70] !== sourceTitle || $3[71] !== t28)
          t29 = /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(Dialog, {
            title: sourceTitle,
            subtitle: "No agents found",
            onCancel: onBack,
            hideInputGuide: !0,
            children: t28
          }, void 0, !1, void 0, this), $3[69] = onBack, $3[70] = sourceTitle, $3[71] = t28, $3[72] = t29;
        else
          t29 = $3[72];
        t22 = t29;
        break bb1;
      }
      T1 = Dialog, t17 = sourceTitle;
      let t232;
      if ($3[73] !== sortedAgents)
        t232 = count2(sortedAgents, _temp813), $3[73] = sortedAgents, $3[74] = t232;
      else
        t232 = $3[74];
      if (t18 = `${t232} agents`, t19 = onBack, t20 = !0, $3[75] !== changes)
        t21 = changes && changes.length > 0 && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !0,
            children: changes[changes.length - 1]
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[75] = changes, $3[76] = t21;
      else
        t21 = $3[76];
      if (T0 = ThemedBox_default, t11 = "column", t12 = 0, t13 = !0, t14 = handleKeyDown, $3[77] !== onCreateNew || $3[78] !== renderCreateNewOption)
        t15 = onCreateNew && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: renderCreateNewOption()
        }, void 0, !1, void 0, this), $3[77] = onCreateNew, $3[78] = renderCreateNewOption, $3[79] = t15;
      else
        t15 = $3[79];
      t16 = source === "all" ? /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(jsx_dev_runtime320.Fragment, {
        children: [
          AGENT_SOURCE_GROUPS.filter(_temp910).map((t242) => {
            let {
              label,
              source: groupSource_0
            } = t242;
            return /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(React97.Fragment, {
              children: renderAgentGroup(label, sortedAgents.filter((a_7) => a_7.source === groupSource_0))
            }, groupSource_0, !1, void 0, this);
          }),
          builtInAgents_0.length > 0 && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginBottom: 1,
            paddingLeft: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Built-in agents"
                  }, void 0, !1, void 0, this),
                  " (always available)"
                ]
              }, void 0, !0, void 0, this),
              builtInAgents_0.map(renderAgent)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this) : source === "built-in" ? /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(jsx_dev_runtime320.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: "Built-in agents are provided by default and cannot be modified."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            flexDirection: "column",
            children: sortedAgents.map((agent_2) => renderAgent(agent_2))
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(jsx_dev_runtime320.Fragment, {
        children: [
          sortedAgents.filter(_temp04).map((agent_3) => renderAgent(agent_3)),
          sortedAgents.some(_temp115) && /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(jsx_dev_runtime320.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(Divider, {}, void 0, !1, void 0, this),
              renderBuiltInAgentsSection()
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
    $3[30] = changes, $3[31] = handleKeyDown, $3[32] = onBack, $3[33] = onCreateNew, $3[34] = renderAgent, $3[35] = renderAgentGroup, $3[36] = renderBuiltInAgentsSection, $3[37] = renderCreateNewOption, $3[38] = sortedAgents, $3[39] = source, $3[40] = sourceTitle, $3[41] = T0, $3[42] = T1, $3[43] = t11, $3[44] = t12, $3[45] = t13, $3[46] = t14, $3[47] = t15, $3[48] = t16, $3[49] = t17, $3[50] = t18, $3[51] = t19, $3[52] = t20, $3[53] = t21, $3[54] = t22;
  } else
    T0 = $3[41], T1 = $3[42], t11 = $3[43], t12 = $3[44], t13 = $3[45], t14 = $3[46], t15 = $3[47], t16 = $3[48], t17 = $3[49], t18 = $3[50], t19 = $3[51], t20 = $3[52], t21 = $3[53], t22 = $3[54];
  if (t22 !== Symbol.for("react.early_return_sentinel"))
    return t22;
  let t23;
  if ($3[80] !== T0 || $3[81] !== t11 || $3[82] !== t12 || $3[83] !== t13 || $3[84] !== t14 || $3[85] !== t15 || $3[86] !== t16)
    t23 = /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(T0, {
      flexDirection: t11,
      tabIndex: t12,
      autoFocus: t13,
      onKeyDown: t14,
      children: [
        t15,
        t16
      ]
    }, void 0, !0, void 0, this), $3[80] = T0, $3[81] = t11, $3[82] = t12, $3[83] = t13, $3[84] = t14, $3[85] = t15, $3[86] = t16, $3[87] = t23;
  else
    t23 = $3[87];
  let t24;
  if ($3[88] !== T1 || $3[89] !== t17 || $3[90] !== t18 || $3[91] !== t19 || $3[92] !== t20 || $3[93] !== t21 || $3[94] !== t23)
    t24 = /* @__PURE__ */ jsx_dev_runtime320.jsxDEV(T1, {
      title: t17,
      subtitle: t18,
      onCancel: t19,
      hideInputGuide: t20,
      children: [
        t21,
        t23
      ]
    }, void 0, !0, void 0, this), $3[88] = T1, $3[89] = t17, $3[90] = t18, $3[91] = t19, $3[92] = t20, $3[93] = t21, $3[94] = t23, $3[95] = t24;
  else
    t24 = $3[95];
  return t24;
}
function _temp115(a_9) {
  return a_9.source === "built-in";
}
function _temp04(a_8) {
  return a_8.source !== "built-in";
}
function _temp910(g_0) {
  return g_0.source !== "built-in";
}
function _temp813(a_6) {
  return !a_6.overriddenBy;
}
function _temp716(a_5) {
  return a_5.source === "built-in";
}
function _temp619(a_4) {
  return a_4.source !== "built-in";
}
function _temp522(a_3) {
  return a_3.source === "built-in";
}
function _temp432(a_2) {
  return a_2.source === "built-in";
}
function _temp341(g) {
  return g.source !== "built-in";
}
function _temp267(a2) {
  return a2.source !== "built-in";
}
function _temp157(agent) {
  return {
    isOverridden: !!agent.overriddenBy,
    overriddenBy: agent.overriddenBy || null
  };
}
var import_compiler_runtime252, React97, jsx_dev_runtime320;
var init_AgentsList = __esm(() => {
  init_figures();
  init_ink2();
  init_agentDisplay();
  init_Dialog();
  init_Divider();
  init_utils17();
  import_compiler_runtime252 = __toESM(require_react_compiler_runtime_development(), 1), React97 = __toESM(require_react_development(), 1), jsx_dev_runtime320 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
