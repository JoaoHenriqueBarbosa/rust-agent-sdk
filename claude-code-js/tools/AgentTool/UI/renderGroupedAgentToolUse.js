// function: renderGroupedAgentToolUse
function renderGroupedAgentToolUse(toolUses, options2) {
  let {
    shouldAnimate,
    tools
  } = options2, agentStats = toolUses.map(({
    param,
    isResolved,
    isError: isError3,
    progressMessages,
    result
  }) => {
    let stats = calculateAgentStats(progressMessages), lastToolInfo = extractLastToolInfo(progressMessages, tools), parsedInput = inputSchema8().safeParse(param.input), isTeammateSpawn = result?.output?.status === "teammate_spawned", agentType, description, color2, descriptionColor, taskDescription;
    if (isTeammateSpawn && parsedInput.success && parsedInput.data.name) {
      agentType = `@${parsedInput.data.name}`;
      let subagentType = parsedInput.data.subagent_type;
      description = isCustomSubagentType(subagentType) ? subagentType : void 0, taskDescription = parsedInput.data.description, descriptionColor = isCustomSubagentType(subagentType) ? getAgentColor(subagentType) : void 0;
    } else
      agentType = parsedInput.success ? userFacingName2(parsedInput.data) : "Agent", description = parsedInput.success ? parsedInput.data.description : void 0, color2 = parsedInput.success ? userFacingNameBackgroundColor(parsedInput.data) : void 0, taskDescription = void 0;
    let launchedAsAsync = parsedInput.success && "run_in_background" in parsedInput.data && parsedInput.data.run_in_background === !0, outputStatus = result?.output?.status, isAsync2 = launchedAsAsync || (outputStatus === "async_launched" || outputStatus === "remote_launched") || isTeammateSpawn, name3 = parsedInput.success ? parsedInput.data.name : void 0;
    return {
      id: param.id,
      agentType,
      description,
      toolUseCount: stats.toolUseCount,
      tokens: stats.tokens,
      isResolved,
      isError: isError3,
      isAsync: isAsync2,
      color: color2,
      descriptionColor,
      lastToolInfo,
      taskDescription,
      name: name3
    };
  }), anyUnresolved = toolUses.some((t2) => !t2.isResolved), anyError = toolUses.some((t2) => t2.isError), allComplete = !anyUnresolved, allSameType = agentStats.length > 0 && agentStats.every((stat20) => stat20.agentType === agentStats[0]?.agentType), commonType = allSameType && agentStats[0]?.agentType !== "Agent" ? agentStats[0]?.agentType : null, allAsync = agentStats.every((stat20) => stat20.isAsync);
  return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ToolUseLoader, {
            shouldAnimate: shouldAnimate && anyUnresolved,
            isUnresolved: anyUnresolved,
            isError: anyError
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
            children: [
              allComplete ? allAsync ? /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(jsx_dev_runtime116.Fragment, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
                    bold: !0,
                    children: toolUses.length
                  }, void 0, !1, void 0, this),
                  " background agents launched",
                  " ",
                  /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(KeyboardShortcutHint, {
                      shortcut: "\u2193",
                      action: "manage",
                      parens: !0
                    }, void 0, !1, void 0, this)
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(jsx_dev_runtime116.Fragment, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
                    bold: !0,
                    children: toolUses.length
                  }, void 0, !1, void 0, this),
                  " ",
                  commonType ? `${commonType} agents` : "agents",
                  " finished"
                ]
              }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(jsx_dev_runtime116.Fragment, {
                children: [
                  "Running ",
                  /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
                    bold: !0,
                    children: toolUses.length
                  }, void 0, !1, void 0, this),
                  " ",
                  commonType ? `${commonType} agents` : "agents",
                  "\u2026"
                ]
              }, void 0, !0, void 0, this),
              " "
            ]
          }, void 0, !0, void 0, this),
          !allAsync && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      agentStats.map((stat20, index) => /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(AgentProgressLine, {
        agentType: stat20.agentType,
        description: stat20.description,
        descriptionColor: stat20.descriptionColor,
        taskDescription: stat20.taskDescription,
        toolUseCount: stat20.toolUseCount,
        tokens: stat20.tokens,
        color: stat20.color,
        isLast: index === agentStats.length - 1,
        isResolved: stat20.isResolved,
        isError: stat20.isError,
        isAsync: stat20.isAsync,
        shouldAnimate,
        lastToolInfo: stat20.lastToolInfo,
        hideType: allSameType,
        name: stat20.name
      }, stat20.id, !1, void 0, this))
    ]
  }, void 0, !0, void 0, this);
}
