// function: AgentsMenu
function AgentsMenu(t0) {
  let $3 = import_compiler_runtime266.c(157), {
    tools,
    onExit: onExit2
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      mode: "list-agents",
      source: "all"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  let [modeState, setModeState] = import_react185.useState(t1), agentDefinitions = useAppState(_temp161), mcpTools = useAppState(_temp270), toolPermissionContext = useAppState(_temp344), setAppState = useSetAppState(), {
    allAgents,
    activeAgents: agents
  } = agentDefinitions, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = [], $3[1] = t2;
  else
    t2 = $3[1];
  let [changes, setChanges] = import_react185.useState(t2), mergedTools = useMergedTools(tools, mcpTools, toolPermissionContext);
  useExitOnCtrlCDWithKeybindings();
  let t3;
  if ($3[2] !== allAgents)
    t3 = allAgents.filter(_temp433), $3[2] = allAgents, $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] !== allAgents)
    t4 = allAgents.filter(_temp523), $3[4] = allAgents, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== allAgents)
    t5 = allAgents.filter(_temp620), $3[6] = allAgents, $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== allAgents)
    t6 = allAgents.filter(_temp717), $3[8] = allAgents, $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] !== allAgents)
    t7 = allAgents.filter(_temp814), $3[10] = allAgents, $3[11] = t7;
  else
    t7 = $3[11];
  let t8;
  if ($3[12] !== allAgents)
    t8 = allAgents.filter(_temp912), $3[12] = allAgents, $3[13] = t8;
  else
    t8 = $3[13];
  let t9;
  if ($3[14] !== allAgents)
    t9 = allAgents.filter(_temp05), $3[14] = allAgents, $3[15] = t9;
  else
    t9 = $3[15];
  let t10;
  if ($3[16] !== allAgents || $3[17] !== t3 || $3[18] !== t4 || $3[19] !== t5 || $3[20] !== t6 || $3[21] !== t7 || $3[22] !== t8 || $3[23] !== t9)
    t10 = {
      "built-in": t3,
      userSettings: t4,
      projectSettings: t5,
      policySettings: t6,
      localSettings: t7,
      flagSettings: t8,
      plugin: t9,
      all: allAgents
    }, $3[16] = allAgents, $3[17] = t3, $3[18] = t4, $3[19] = t5, $3[20] = t6, $3[21] = t7, $3[22] = t8, $3[23] = t9, $3[24] = t10;
  else
    t10 = $3[24];
  let agentsBySource = t10, t11;
  if ($3[25] === Symbol.for("react.memo_cache_sentinel"))
    t11 = (message) => {
      setChanges((prev) => [...prev, message]), setModeState({
        mode: "list-agents",
        source: "all"
      });
    }, $3[25] = t11;
  else
    t11 = $3[25];
  let handleAgentCreated = t11, t12;
  if ($3[26] !== setAppState)
    t12 = async (agent) => {
      try {
        await deleteAgentFromFile(agent), setAppState((state3) => {
          let allAgents_0 = state3.agentDefinitions.allAgents.filter((a_6) => !(a_6.agentType === agent.agentType && a_6.source === agent.source));
          return {
            ...state3,
            agentDefinitions: {
              ...state3.agentDefinitions,
              allAgents: allAgents_0,
              activeAgents: getActiveAgentsFromList(allAgents_0)
            }
          };
        }), setChanges((prev_0) => [...prev_0, `Deleted agent: ${source_default.bold(agent.agentType)}`]), setModeState({
          mode: "list-agents",
          source: "all"
        });
      } catch (t13) {
        logError2(toError(t13));
      }
    }, $3[26] = setAppState, $3[27] = t12;
  else
    t12 = $3[27];
  let handleAgentDeleted = t12;
  switch (modeState.mode) {
    case "list-agents": {
      let t13;
      if ($3[28] !== agentsBySource || $3[29] !== modeState.source)
        t13 = modeState.source === "all" ? [...agentsBySource["built-in"], ...agentsBySource.userSettings, ...agentsBySource.projectSettings, ...agentsBySource.localSettings, ...agentsBySource.policySettings, ...agentsBySource.flagSettings, ...agentsBySource.plugin] : agentsBySource[modeState.source], $3[28] = agentsBySource, $3[29] = modeState.source, $3[30] = t13;
      else
        t13 = $3[30];
      let agentsToShow = t13, t14;
      if ($3[31] !== agents || $3[32] !== agentsToShow)
        t14 = resolveAgentOverrides(agentsToShow, agents), $3[31] = agents, $3[32] = agentsToShow, $3[33] = t14;
      else
        t14 = $3[33];
      let resolvedAgents = t14, t15;
      if ($3[34] !== changes || $3[35] !== onExit2)
        t15 = () => {
          let exitMessage = changes.length > 0 ? `Agent changes:
${changes.join(`
`)}` : void 0;
          onExit2(exitMessage ?? "Agents dialog dismissed", {
            display: changes.length === 0 ? "system" : void 0
          });
        }, $3[34] = changes, $3[35] = onExit2, $3[36] = t15;
      else
        t15 = $3[36];
      let t16;
      if ($3[37] !== modeState)
        t16 = (agent_0) => setModeState({
          mode: "agent-menu",
          agent: agent_0,
          previousMode: modeState
        }), $3[37] = modeState, $3[38] = t16;
      else
        t16 = $3[38];
      let t17;
      if ($3[39] === Symbol.for("react.memo_cache_sentinel"))
        t17 = () => setModeState({
          mode: "create-agent"
        }), $3[39] = t17;
      else
        t17 = $3[39];
      let t18;
      if ($3[40] !== changes || $3[41] !== modeState.source || $3[42] !== resolvedAgents || $3[43] !== t15 || $3[44] !== t16)
        t18 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentsList, {
          source: modeState.source,
          agents: resolvedAgents,
          onBack: t15,
          onSelect: t16,
          onCreateNew: t17,
          changes
        }, void 0, !1, void 0, this), $3[40] = changes, $3[41] = modeState.source, $3[42] = resolvedAgents, $3[43] = t15, $3[44] = t16, $3[45] = t18;
      else
        t18 = $3[45];
      let t19;
      if ($3[46] === Symbol.for("react.memo_cache_sentinel"))
        t19 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentNavigationFooter, {}, void 0, !1, void 0, this), $3[46] = t19;
      else
        t19 = $3[46];
      let t20;
      if ($3[47] !== t18)
        t20 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(jsx_dev_runtime337.Fragment, {
          children: [
            t18,
            t19
          ]
        }, void 0, !0, void 0, this), $3[47] = t18, $3[48] = t20;
      else
        t20 = $3[48];
      return t20;
    }
    case "create-agent": {
      let t13;
      if ($3[49] === Symbol.for("react.memo_cache_sentinel"))
        t13 = () => setModeState({
          mode: "list-agents",
          source: "all"
        }), $3[49] = t13;
      else
        t13 = $3[49];
      let t14;
      if ($3[50] !== agents || $3[51] !== mergedTools)
        t14 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(CreateAgentWizard, {
          tools: mergedTools,
          existingAgents: agents,
          onComplete: handleAgentCreated,
          onCancel: t13
        }, void 0, !1, void 0, this), $3[50] = agents, $3[51] = mergedTools, $3[52] = t14;
      else
        t14 = $3[52];
      return t14;
    }
    case "agent-menu": {
      let t13;
      if ($3[53] !== allAgents || $3[54] !== modeState.agent.agentType || $3[55] !== modeState.agent.source) {
        let t142;
        if ($3[57] !== modeState.agent.agentType || $3[58] !== modeState.agent.source)
          t142 = (a_9) => a_9.agentType === modeState.agent.agentType && a_9.source === modeState.agent.source, $3[57] = modeState.agent.agentType, $3[58] = modeState.agent.source, $3[59] = t142;
        else
          t142 = $3[59];
        t13 = allAgents.find(t142), $3[53] = allAgents, $3[54] = modeState.agent.agentType, $3[55] = modeState.agent.source, $3[56] = t13;
      } else
        t13 = $3[56];
      let agentToUse = t13 || modeState.agent, isEditable = agentToUse.source !== "built-in" && agentToUse.source !== "plugin" && agentToUse.source !== "flagSettings", t14;
      if ($3[60] === Symbol.for("react.memo_cache_sentinel"))
        t14 = {
          label: "View agent",
          value: "view"
        }, $3[60] = t14;
      else
        t14 = $3[60];
      let t15;
      if ($3[61] !== isEditable)
        t15 = isEditable ? [{
          label: "Edit agent",
          value: "edit"
        }, {
          label: "Delete agent",
          value: "delete"
        }] : [], $3[61] = isEditable, $3[62] = t15;
      else
        t15 = $3[62];
      let t16;
      if ($3[63] === Symbol.for("react.memo_cache_sentinel"))
        t16 = {
          label: "Back",
          value: "back"
        }, $3[63] = t16;
      else
        t16 = $3[63];
      let t17;
      if ($3[64] !== t15)
        t17 = [t14, ...t15, t16], $3[64] = t15, $3[65] = t17;
      else
        t17 = $3[65];
      let menuItems = t17, t18;
      if ($3[66] !== agentToUse || $3[67] !== modeState)
        t18 = (value_0) => {
          bb129:
            switch (value_0) {
              case "view": {
                setModeState({
                  mode: "view-agent",
                  agent: agentToUse,
                  previousMode: modeState.previousMode
                });
                break bb129;
              }
              case "edit": {
                setModeState({
                  mode: "edit-agent",
                  agent: agentToUse,
                  previousMode: modeState
                });
                break bb129;
              }
              case "delete": {
                setModeState({
                  mode: "delete-confirm",
                  agent: agentToUse,
                  previousMode: modeState
                });
                break bb129;
              }
              case "back":
                setModeState(modeState.previousMode);
            }
        }, $3[66] = agentToUse, $3[67] = modeState, $3[68] = t18;
      else
        t18 = $3[68];
      let handleMenuSelect = t18, t19;
      if ($3[69] !== modeState.previousMode)
        t19 = () => setModeState(modeState.previousMode), $3[69] = modeState.previousMode, $3[70] = t19;
      else
        t19 = $3[70];
      let t20;
      if ($3[71] !== modeState.previousMode)
        t20 = () => setModeState(modeState.previousMode), $3[71] = modeState.previousMode, $3[72] = t20;
      else
        t20 = $3[72];
      let t21;
      if ($3[73] !== handleMenuSelect || $3[74] !== menuItems || $3[75] !== t20)
        t21 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(Select, {
          options: menuItems,
          onChange: handleMenuSelect,
          onCancel: t20
        }, void 0, !1, void 0, this), $3[73] = handleMenuSelect, $3[74] = menuItems, $3[75] = t20, $3[76] = t21;
      else
        t21 = $3[76];
      let t22;
      if ($3[77] !== changes)
        t22 = changes.length > 0 && /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedText, {
            dimColor: !0,
            children: changes[changes.length - 1]
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[77] = changes, $3[78] = t22;
      else
        t22 = $3[78];
      let t23;
      if ($3[79] !== t21 || $3[80] !== t22)
        t23 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            t21,
            t22
          ]
        }, void 0, !0, void 0, this), $3[79] = t21, $3[80] = t22, $3[81] = t23;
      else
        t23 = $3[81];
      let t24;
      if ($3[82] !== modeState.agent.agentType || $3[83] !== t19 || $3[84] !== t23)
        t24 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(Dialog, {
          title: modeState.agent.agentType,
          onCancel: t19,
          hideInputGuide: !0,
          children: t23
        }, void 0, !1, void 0, this), $3[82] = modeState.agent.agentType, $3[83] = t19, $3[84] = t23, $3[85] = t24;
      else
        t24 = $3[85];
      let t25;
      if ($3[86] === Symbol.for("react.memo_cache_sentinel"))
        t25 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentNavigationFooter, {}, void 0, !1, void 0, this), $3[86] = t25;
      else
        t25 = $3[86];
      let t26;
      if ($3[87] !== t24)
        t26 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(jsx_dev_runtime337.Fragment, {
          children: [
            t24,
            t25
          ]
        }, void 0, !0, void 0, this), $3[87] = t24, $3[88] = t26;
      else
        t26 = $3[88];
      return t26;
    }
    case "view-agent": {
      let t13;
      if ($3[89] !== allAgents || $3[90] !== modeState.agent) {
        let t142;
        if ($3[92] !== modeState.agent)
          t142 = (a_8) => a_8.agentType === modeState.agent.agentType && a_8.source === modeState.agent.source, $3[92] = modeState.agent, $3[93] = t142;
        else
          t142 = $3[93];
        t13 = allAgents.find(t142), $3[89] = allAgents, $3[90] = modeState.agent, $3[91] = t13;
      } else
        t13 = $3[91];
      let agentToDisplay = t13 || modeState.agent, t14;
      if ($3[94] !== agentToDisplay || $3[95] !== modeState.previousMode)
        t14 = () => setModeState({
          mode: "agent-menu",
          agent: agentToDisplay,
          previousMode: modeState.previousMode
        }), $3[94] = agentToDisplay, $3[95] = modeState.previousMode, $3[96] = t14;
      else
        t14 = $3[96];
      let t15;
      if ($3[97] !== agentToDisplay || $3[98] !== modeState.previousMode)
        t15 = () => setModeState({
          mode: "agent-menu",
          agent: agentToDisplay,
          previousMode: modeState.previousMode
        }), $3[97] = agentToDisplay, $3[98] = modeState.previousMode, $3[99] = t15;
      else
        t15 = $3[99];
      let t16;
      if ($3[100] !== agentToDisplay || $3[101] !== allAgents || $3[102] !== mergedTools || $3[103] !== t15)
        t16 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentDetail, {
          agent: agentToDisplay,
          tools: mergedTools,
          allAgents,
          onBack: t15
        }, void 0, !1, void 0, this), $3[100] = agentToDisplay, $3[101] = allAgents, $3[102] = mergedTools, $3[103] = t15, $3[104] = t16;
      else
        t16 = $3[104];
      let t17;
      if ($3[105] !== agentToDisplay.agentType || $3[106] !== t14 || $3[107] !== t16)
        t17 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(Dialog, {
          title: agentToDisplay.agentType,
          onCancel: t14,
          hideInputGuide: !0,
          children: t16
        }, void 0, !1, void 0, this), $3[105] = agentToDisplay.agentType, $3[106] = t14, $3[107] = t16, $3[108] = t17;
      else
        t17 = $3[108];
      let t18;
      if ($3[109] === Symbol.for("react.memo_cache_sentinel"))
        t18 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentNavigationFooter, {
          instructions: "Press Enter or Esc to go back"
        }, void 0, !1, void 0, this), $3[109] = t18;
      else
        t18 = $3[109];
      let t19;
      if ($3[110] !== t17)
        t19 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(jsx_dev_runtime337.Fragment, {
          children: [
            t17,
            t18
          ]
        }, void 0, !0, void 0, this), $3[110] = t17, $3[111] = t19;
      else
        t19 = $3[111];
      return t19;
    }
    case "delete-confirm": {
      let t13;
      if ($3[112] === Symbol.for("react.memo_cache_sentinel"))
        t13 = [{
          label: "Yes, delete",
          value: "yes"
        }, {
          label: "No, cancel",
          value: "no"
        }], $3[112] = t13;
      else
        t13 = $3[112];
      let deleteOptions = t13, t14;
      if ($3[113] !== modeState)
        t14 = () => {
          if ("previousMode" in modeState)
            setModeState(modeState.previousMode);
        }, $3[113] = modeState, $3[114] = t14;
      else
        t14 = $3[114];
      let t15;
      if ($3[115] !== modeState.agent.agentType)
        t15 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedText, {
          children: [
            "Are you sure you want to delete the agent",
            " ",
            /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedText, {
              bold: !0,
              children: modeState.agent.agentType
            }, void 0, !1, void 0, this),
            "?"
          ]
        }, void 0, !0, void 0, this), $3[115] = modeState.agent.agentType, $3[116] = t15;
      else
        t15 = $3[116];
      let t16;
      if ($3[117] !== modeState.agent.source)
        t16 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Source: ",
              modeState.agent.source
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[117] = modeState.agent.source, $3[118] = t16;
      else
        t16 = $3[118];
      let t17;
      if ($3[119] !== handleAgentDeleted || $3[120] !== modeState)
        t17 = (value) => {
          if (value === "yes")
            handleAgentDeleted(modeState.agent);
          else if ("previousMode" in modeState)
            setModeState(modeState.previousMode);
        }, $3[119] = handleAgentDeleted, $3[120] = modeState, $3[121] = t17;
      else
        t17 = $3[121];
      let t18;
      if ($3[122] !== modeState)
        t18 = () => {
          if ("previousMode" in modeState)
            setModeState(modeState.previousMode);
        }, $3[122] = modeState, $3[123] = t18;
      else
        t18 = $3[123];
      let t19;
      if ($3[124] !== t17 || $3[125] !== t18)
        t19 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(Select, {
            options: deleteOptions,
            onChange: t17,
            onCancel: t18
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[124] = t17, $3[125] = t18, $3[126] = t19;
      else
        t19 = $3[126];
      let t20;
      if ($3[127] !== t14 || $3[128] !== t15 || $3[129] !== t16 || $3[130] !== t19)
        t20 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(Dialog, {
          title: "Delete agent",
          onCancel: t14,
          color: "error",
          children: [
            t15,
            t16,
            t19
          ]
        }, void 0, !0, void 0, this), $3[127] = t14, $3[128] = t15, $3[129] = t16, $3[130] = t19, $3[131] = t20;
      else
        t20 = $3[131];
      let t21;
      if ($3[132] === Symbol.for("react.memo_cache_sentinel"))
        t21 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentNavigationFooter, {
          instructions: "Press \u2191\u2193 to navigate, Enter to select, Esc to cancel"
        }, void 0, !1, void 0, this), $3[132] = t21;
      else
        t21 = $3[132];
      let t22;
      if ($3[133] !== t20)
        t22 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(jsx_dev_runtime337.Fragment, {
          children: [
            t20,
            t21
          ]
        }, void 0, !0, void 0, this), $3[133] = t20, $3[134] = t22;
      else
        t22 = $3[134];
      return t22;
    }
    case "edit-agent": {
      let t13;
      if ($3[135] !== allAgents || $3[136] !== modeState.agent) {
        let t142;
        if ($3[138] !== modeState.agent)
          t142 = (a_7) => a_7.agentType === modeState.agent.agentType && a_7.source === modeState.agent.source, $3[138] = modeState.agent, $3[139] = t142;
        else
          t142 = $3[139];
        t13 = allAgents.find(t142), $3[135] = allAgents, $3[136] = modeState.agent, $3[137] = t13;
      } else
        t13 = $3[137];
      let agentToEdit = t13 || modeState.agent, t14 = `Edit agent: ${agentToEdit.agentType}`, t15;
      if ($3[140] !== modeState.previousMode)
        t15 = () => setModeState(modeState.previousMode), $3[140] = modeState.previousMode, $3[141] = t15;
      else
        t15 = $3[141];
      let t16, t17;
      if ($3[142] !== modeState.previousMode)
        t16 = (message_0) => {
          handleAgentCreated(message_0), setModeState(modeState.previousMode);
        }, t17 = () => setModeState(modeState.previousMode), $3[142] = modeState.previousMode, $3[143] = t16, $3[144] = t17;
      else
        t16 = $3[143], t17 = $3[144];
      let t18;
      if ($3[145] !== agentToEdit || $3[146] !== mergedTools || $3[147] !== t16 || $3[148] !== t17)
        t18 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentEditor, {
          agent: agentToEdit,
          tools: mergedTools,
          onSaved: t16,
          onBack: t17
        }, void 0, !1, void 0, this), $3[145] = agentToEdit, $3[146] = mergedTools, $3[147] = t16, $3[148] = t17, $3[149] = t18;
      else
        t18 = $3[149];
      let t19;
      if ($3[150] !== t14 || $3[151] !== t15 || $3[152] !== t18)
        t19 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(Dialog, {
          title: t14,
          onCancel: t15,
          hideInputGuide: !0,
          children: t18
        }, void 0, !1, void 0, this), $3[150] = t14, $3[151] = t15, $3[152] = t18, $3[153] = t19;
      else
        t19 = $3[153];
      let t20;
      if ($3[154] === Symbol.for("react.memo_cache_sentinel"))
        t20 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(AgentNavigationFooter, {}, void 0, !1, void 0, this), $3[154] = t20;
      else
        t20 = $3[154];
      let t21;
      if ($3[155] !== t19)
        t21 = /* @__PURE__ */ jsx_dev_runtime337.jsxDEV(jsx_dev_runtime337.Fragment, {
          children: [
            t19,
            t20
          ]
        }, void 0, !0, void 0, this), $3[155] = t19, $3[156] = t21;
      else
        t21 = $3[156];
      return t21;
    }
    default:
      return null;
  }
}
