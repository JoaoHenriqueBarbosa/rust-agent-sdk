// Original: src/components/agents/ToolSelector.tsx
function getToolBuckets() {
  return {
    READ_ONLY: {
      name: "Read-only tools",
      toolNames: /* @__PURE__ */ new Set([GlobTool.name, GrepTool.name, ExitPlanModeV2Tool.name, FileReadTool.name, WebFetchTool.name, TodoWriteTool.name, WebSearchTool.name, TaskStopTool.name, TaskOutputTool.name, ListMcpResourcesTool.name, ReadMcpResourceTool.name])
    },
    EDIT: {
      name: "Edit tools",
      toolNames: /* @__PURE__ */ new Set([FileEditTool.name, FileWriteTool.name, NotebookEditTool.name])
    },
    EXECUTION: {
      name: "Execution tools",
      toolNames: new Set([BashTool.name, void 0].filter((n5) => n5 !== void 0))
    },
    MCP: {
      name: "MCP tools",
      toolNames: /* @__PURE__ */ new Set,
      isMcp: !0
    },
    OTHER: {
      name: "Other tools",
      toolNames: /* @__PURE__ */ new Set
    }
  };
}
function getMcpServerBuckets(tools) {
  let serverMap = /* @__PURE__ */ new Map;
  return tools.forEach((tool) => {
    if (isMcpTool(tool)) {
      let mcpInfo = mcpInfoFromString(tool.name);
      if (mcpInfo?.serverName) {
        let existing = serverMap.get(mcpInfo.serverName) || [];
        existing.push(tool), serverMap.set(mcpInfo.serverName, existing);
      }
    }
  }), Array.from(serverMap.entries()).map(([serverName, tools2]) => ({
    serverName,
    tools: tools2
  })).sort((a2, b) => a2.serverName.localeCompare(b.serverName));
}
function ToolSelector(t0) {
  let $3 = import_compiler_runtime250.c(69), {
    tools,
    initialTools,
    onComplete,
    onCancel
  } = t0, t1;
  if ($3[0] !== tools)
    t1 = filterToolsForAgent({
      tools,
      isBuiltIn: !1,
      isAsync: !1
    }), $3[0] = tools, $3[1] = t1;
  else
    t1 = $3[1];
  let customAgentTools = t1, t2;
  if ($3[2] !== customAgentTools || $3[3] !== initialTools)
    t2 = !initialTools || initialTools.includes("*") ? customAgentTools.map(_temp156) : initialTools, $3[2] = customAgentTools, $3[3] = initialTools, $3[4] = t2;
  else
    t2 = $3[4];
  let expandedInitialTools = t2, [selectedTools, setSelectedTools] = import_react176.useState(expandedInitialTools), [focusIndex, setFocusIndex] = import_react176.useState(0), [showIndividualTools, setShowIndividualTools] = import_react176.useState(!1), t3;
  if ($3[5] !== customAgentTools)
    t3 = new Set(customAgentTools.map(_temp266)), $3[5] = customAgentTools, $3[6] = t3;
  else
    t3 = $3[6];
  let toolNames = t3, t4;
  if ($3[7] !== selectedTools || $3[8] !== toolNames) {
    let t52;
    if ($3[10] !== toolNames)
      t52 = (name3) => toolNames.has(name3), $3[10] = toolNames, $3[11] = t52;
    else
      t52 = $3[11];
    t4 = selectedTools.filter(t52), $3[7] = selectedTools, $3[8] = toolNames, $3[9] = t4;
  } else
    t4 = $3[9];
  let validSelectedTools = t4, t5;
  if ($3[12] !== validSelectedTools)
    t5 = new Set(validSelectedTools), $3[12] = validSelectedTools, $3[13] = t5;
  else
    t5 = $3[13];
  let selectedSet = t5, isAllSelected = validSelectedTools.length === customAgentTools.length && customAgentTools.length > 0, t6;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t6 = (toolName) => {
      if (!toolName)
        return;
      setSelectedTools((current) => current.includes(toolName) ? current.filter((t_1) => t_1 !== toolName) : [...current, toolName]);
    }, $3[14] = t6;
  else
    t6 = $3[14];
  let handleToggleTool = t6, t7;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t7 = (toolNames_0, select2) => {
      setSelectedTools((current_0) => {
        if (select2) {
          let toolsToAdd = toolNames_0.filter((t_2) => !current_0.includes(t_2));
          return [...current_0, ...toolsToAdd];
        } else
          return current_0.filter((t_3) => !toolNames_0.includes(t_3));
      });
    }, $3[15] = t7;
  else
    t7 = $3[15];
  let handleToggleTools = t7, t8;
  if ($3[16] !== customAgentTools || $3[17] !== onComplete || $3[18] !== validSelectedTools)
    t8 = () => {
      let allToolNames = customAgentTools.map(_temp340), finalTools = validSelectedTools.length === allToolNames.length && allToolNames.every((name_0) => validSelectedTools.includes(name_0)) ? void 0 : validSelectedTools;
      onComplete(finalTools);
    }, $3[16] = customAgentTools, $3[17] = onComplete, $3[18] = validSelectedTools, $3[19] = t8;
  else
    t8 = $3[19];
  let handleConfirm = t8, buckets;
  if ($3[20] !== customAgentTools) {
    let toolBuckets = getToolBuckets();
    buckets = {
      readOnly: [],
      edit: [],
      execution: [],
      mcp: [],
      other: []
    }, customAgentTools.forEach((tool) => {
      if (isMcpTool(tool))
        buckets.mcp.push(tool);
      else if (toolBuckets.READ_ONLY.toolNames.has(tool.name))
        buckets.readOnly.push(tool);
      else if (toolBuckets.EDIT.toolNames.has(tool.name))
        buckets.edit.push(tool);
      else if (toolBuckets.EXECUTION.toolNames.has(tool.name))
        buckets.execution.push(tool);
      else if (tool.name !== AGENT_TOOL_NAME)
        buckets.other.push(tool);
    }), $3[20] = customAgentTools, $3[21] = buckets;
  } else
    buckets = $3[21];
  let toolsByBucket = buckets, t9;
  if ($3[22] !== selectedSet)
    t9 = (bucketTools) => {
      let needsSelection = count2(bucketTools, (t_5) => selectedSet.has(t_5.name)) < bucketTools.length;
      return () => {
        let toolNames_1 = bucketTools.map(_temp431);
        handleToggleTools(toolNames_1, needsSelection);
      };
    }, $3[22] = selectedSet, $3[23] = t9;
  else
    t9 = $3[23];
  let createBucketToggleAction = t9, navigableItems;
  if ($3[24] !== createBucketToggleAction || $3[25] !== customAgentTools || $3[26] !== focusIndex || $3[27] !== handleConfirm || $3[28] !== isAllSelected || $3[29] !== selectedSet || $3[30] !== showIndividualTools || $3[31] !== toolsByBucket.edit || $3[32] !== toolsByBucket.execution || $3[33] !== toolsByBucket.mcp || $3[34] !== toolsByBucket.other || $3[35] !== toolsByBucket.readOnly) {
    navigableItems = [], navigableItems.push({
      id: "continue",
      label: "Continue",
      action: handleConfirm,
      isContinue: !0
    });
    let t102;
    if ($3[37] !== customAgentTools || $3[38] !== isAllSelected)
      t102 = () => {
        let allToolNames_0 = customAgentTools.map(_temp521);
        handleToggleTools(allToolNames_0, !isAllSelected);
      }, $3[37] = customAgentTools, $3[38] = isAllSelected, $3[39] = t102;
    else
      t102 = $3[39];
    navigableItems.push({
      id: "bucket-all",
      label: `${isAllSelected ? figures_default.checkboxOn : figures_default.checkboxOff} All tools`,
      action: t102
    });
    let toolBuckets_0 = getToolBuckets();
    [{
      id: "bucket-readonly",
      name: toolBuckets_0.READ_ONLY.name,
      tools: toolsByBucket.readOnly
    }, {
      id: "bucket-edit",
      name: toolBuckets_0.EDIT.name,
      tools: toolsByBucket.edit
    }, {
      id: "bucket-execution",
      name: toolBuckets_0.EXECUTION.name,
      tools: toolsByBucket.execution
    }, {
      id: "bucket-mcp",
      name: toolBuckets_0.MCP.name,
      tools: toolsByBucket.mcp
    }, {
      id: "bucket-other",
      name: toolBuckets_0.OTHER.name,
      tools: toolsByBucket.other
    }].forEach((t112) => {
      let {
        id,
        name: name_1,
        tools: bucketTools_0
      } = t112;
      if (bucketTools_0.length === 0)
        return;
      let isFullySelected = count2(bucketTools_0, (t_8) => selectedSet.has(t_8.name)) === bucketTools_0.length;
      navigableItems.push({
        id,
        label: `${isFullySelected ? figures_default.checkboxOn : figures_default.checkboxOff} ${name_1}`,
        action: createBucketToggleAction(bucketTools_0)
      });
    });
    let toggleButtonIndex = navigableItems.length, t122;
    if ($3[40] !== focusIndex || $3[41] !== showIndividualTools || $3[42] !== toggleButtonIndex)
      t122 = () => {
        if (setShowIndividualTools(!showIndividualTools), showIndividualTools && focusIndex > toggleButtonIndex)
          setFocusIndex(toggleButtonIndex);
      }, $3[40] = focusIndex, $3[41] = showIndividualTools, $3[42] = toggleButtonIndex, $3[43] = t122;
    else
      t122 = $3[43];
    navigableItems.push({
      id: "toggle-individual",
      label: showIndividualTools ? "Hide advanced options" : "Show advanced options",
      action: t122,
      isToggle: !0
    });
    let mcpServerBuckets = getMcpServerBuckets(customAgentTools);
    if (showIndividualTools) {
      if (mcpServerBuckets.length > 0)
        navigableItems.push({
          id: "mcp-servers-header",
          label: "MCP Servers:",
          action: _temp618,
          isHeader: !0
        }), mcpServerBuckets.forEach((t132) => {
          let {
            serverName,
            tools: serverTools
          } = t132, isFullySelected_0 = count2(serverTools, (t_9) => selectedSet.has(t_9.name)) === serverTools.length;
          navigableItems.push({
            id: `mcp-server-${serverName}`,
            label: `${isFullySelected_0 ? figures_default.checkboxOn : figures_default.checkboxOff} ${serverName} (${serverTools.length} ${plural(serverTools.length, "tool")})`,
            action: () => {
              let toolNames_2 = serverTools.map(_temp715);
              handleToggleTools(toolNames_2, !isFullySelected_0);
            }
          });
        }), navigableItems.push({
          id: "tools-header",
          label: "Individual Tools:",
          action: _temp812,
          isHeader: !0
        });
      customAgentTools.forEach((tool_0) => {
        let displayName = tool_0.name;
        if (tool_0.name.startsWith("mcp__")) {
          let mcpInfo = mcpInfoFromString(tool_0.name);
          displayName = mcpInfo ? `${mcpInfo.toolName} (${mcpInfo.serverName})` : tool_0.name;
        }
        navigableItems.push({
          id: `tool-${tool_0.name}`,
          label: `${selectedSet.has(tool_0.name) ? figures_default.checkboxOn : figures_default.checkboxOff} ${displayName}`,
          action: () => handleToggleTool(tool_0.name)
        });
      });
    }
    $3[24] = createBucketToggleAction, $3[25] = customAgentTools, $3[26] = focusIndex, $3[27] = handleConfirm, $3[28] = isAllSelected, $3[29] = selectedSet, $3[30] = showIndividualTools, $3[31] = toolsByBucket.edit, $3[32] = toolsByBucket.execution, $3[33] = toolsByBucket.mcp, $3[34] = toolsByBucket.other, $3[35] = toolsByBucket.readOnly, $3[36] = navigableItems;
  } else
    navigableItems = $3[36];
  let t10;
  if ($3[44] !== initialTools || $3[45] !== onCancel || $3[46] !== onComplete)
    t10 = () => {
      if (onCancel)
        onCancel();
      else
        onComplete(initialTools);
    }, $3[44] = initialTools, $3[45] = onCancel, $3[46] = onComplete, $3[47] = t10;
  else
    t10 = $3[47];
  let handleCancel = t10, t11;
  if ($3[48] === Symbol.for("react.memo_cache_sentinel"))
    t11 = {
      context: "Confirmation"
    }, $3[48] = t11;
  else
    t11 = $3[48];
  useKeybinding("confirm:no", handleCancel, t11);
  let t12;
  if ($3[49] !== focusIndex || $3[50] !== navigableItems)
    t12 = (e) => {
      if (e.key === "return") {
        e.preventDefault();
        let item = navigableItems[focusIndex];
        if (item && !item.isHeader)
          item.action();
      } else if (e.key === "up") {
        e.preventDefault();
        let newIndex = focusIndex - 1;
        while (newIndex > 0 && navigableItems[newIndex]?.isHeader)
          newIndex--;
        setFocusIndex(Math.max(0, newIndex));
      } else if (e.key === "down") {
        e.preventDefault();
        let newIndex_0 = focusIndex + 1;
        while (newIndex_0 < navigableItems.length - 1 && navigableItems[newIndex_0]?.isHeader)
          newIndex_0++;
        setFocusIndex(Math.min(navigableItems.length - 1, newIndex_0));
      }
    }, $3[49] = focusIndex, $3[50] = navigableItems, $3[51] = t12;
  else
    t12 = $3[51];
  let handleKeyDown = t12, t13 = focusIndex === 0 ? "suggestion" : void 0, t14 = focusIndex === 0, t15 = focusIndex === 0 ? `${figures_default.pointer} ` : "  ", t16;
  if ($3[52] !== t13 || $3[53] !== t14 || $3[54] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(ThemedText, {
      color: t13,
      bold: t14,
      children: [
        t15,
        "[ Continue ]"
      ]
    }, void 0, !0, void 0, this), $3[52] = t13, $3[53] = t14, $3[54] = t15, $3[55] = t16;
  else
    t16 = $3[55];
  let t17;
  if ($3[56] === Symbol.for("react.memo_cache_sentinel"))
    t17 = /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(Divider, {
      width: 40
    }, void 0, !1, void 0, this), $3[56] = t17;
  else
    t17 = $3[56];
  let t18;
  if ($3[57] !== navigableItems)
    t18 = navigableItems.slice(1), $3[57] = navigableItems, $3[58] = t18;
  else
    t18 = $3[58];
  let t19;
  if ($3[59] !== focusIndex || $3[60] !== t18)
    t19 = t18.map((item_0, index) => {
      let isCurrentlyFocused = index + 1 === focusIndex, isToggleButton = item_0.isToggle, isHeader = item_0.isHeader;
      return /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(import_react176.default.Fragment, {
        children: [
          isToggleButton && /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(Divider, {
            width: 40
          }, void 0, !1, void 0, this),
          isHeader && index > 0 && /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(ThemedBox_default, {
            marginTop: 1
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(ThemedText, {
            color: isHeader ? void 0 : isCurrentlyFocused ? "suggestion" : void 0,
            dimColor: isHeader,
            bold: isToggleButton && isCurrentlyFocused,
            children: [
              isHeader ? "" : isCurrentlyFocused ? `${figures_default.pointer} ` : "  ",
              isToggleButton ? `[ ${item_0.label} ]` : item_0.label
            ]
          }, void 0, !0, void 0, this)
        ]
      }, item_0.id, !0, void 0, this);
    }), $3[59] = focusIndex, $3[60] = t18, $3[61] = t19;
  else
    t19 = $3[61];
  let t20 = isAllSelected ? "All tools selected" : `${selectedSet.size} of ${customAgentTools.length} tools selected`, t21;
  if ($3[62] !== t20)
    t21 = /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(ThemedText, {
        dimColor: !0,
        children: t20
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[62] = t20, $3[63] = t21;
  else
    t21 = $3[63];
  let t22;
  if ($3[64] !== handleKeyDown || $3[65] !== t16 || $3[66] !== t19 || $3[67] !== t21)
    t22 = /* @__PURE__ */ jsx_dev_runtime317.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: [
        t16,
        t17,
        t19,
        t21
      ]
    }, void 0, !0, void 0, this), $3[64] = handleKeyDown, $3[65] = t16, $3[66] = t19, $3[67] = t21, $3[68] = t22;
  else
    t22 = $3[68];
  return t22;
}
function _temp812() {}
function _temp715(t_10) {
  return t_10.name;
}
function _temp618() {}
function _temp521(t_7) {
  return t_7.name;
}
function _temp431(t_6) {
  return t_6.name;
}
function _temp340(t_4) {
  return t_4.name;
}
function _temp266(t_0) {
  return t_0.name;
}
function _temp156(t2) {
  return t2.name;
}
var import_compiler_runtime250, import_react176, jsx_dev_runtime317;
var init_ToolSelector = __esm(() => {
  init_figures();
  init_mcpStringUtils();
  init_utils7();
  init_agentToolUtils();
  init_constants3();
  init_BashTool();
  init_ExitPlanModeV2Tool();
  init_FileEditTool();
  init_FileReadTool();
  init_FileWriteTool();
  init_GlobTool();
  init_GrepTool();
  init_ListMcpResourcesTool();
  init_NotebookEditTool();
  init_ReadMcpResourceTool();
  init_TaskOutputTool();
  init_TaskStopTool();
  init_TodoWriteTool();
  init_TungstenTool();
  init_WebFetchTool();
  init_WebSearchTool();
  init_ink2();
  init_useKeybinding();
  init_Divider();
  import_compiler_runtime250 = __toESM(require_react_compiler_runtime_development(), 1), import_react176 = __toESM(require_react_development(), 1), jsx_dev_runtime317 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
