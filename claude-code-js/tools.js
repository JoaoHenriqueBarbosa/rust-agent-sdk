// Original: src/tools.ts
function parseToolPreset(preset) {
  let presetString = preset.toLowerCase();
  if (!TOOL_PRESETS.includes(presetString))
    return null;
  return presetString;
}
function getToolsForDefaultPreset() {
  let tools = getAllBaseTools(), isEnabled2 = tools.map((tool) => tool.isEnabled());
  return tools.filter((_, i5) => isEnabled2[i5]).map((tool) => tool.name);
}
function getAllBaseTools() {
  return [
    AgentTool,
    TaskOutputTool,
    BashTool,
    ...hasEmbeddedSearchTools() ? [] : [GlobTool, GrepTool],
    ExitPlanModeV2Tool,
    FileReadTool,
    FileEditTool,
    FileWriteTool,
    NotebookEditTool,
    WebFetchTool,
    TodoWriteTool,
    WebSearchTool,
    TaskStopTool,
    AskUserQuestionTool,
    SkillTool,
    EnterPlanModeTool,
    ...[],
    ...[],
    ...SuggestBackgroundPRTool ? [SuggestBackgroundPRTool] : [],
    ...WebBrowserTool ? [WebBrowserTool] : [],
    ...isTodoV2Enabled() ? [TaskCreateTool, TaskGetTool, TaskUpdateTool, TaskListTool] : [],
    ...OverflowTestTool ? [OverflowTestTool] : [],
    ...CtxInspectTool ? [CtxInspectTool] : [],
    ...TerminalCaptureTool ? [TerminalCaptureTool] : [],
    ...isEnvTruthy(process.env.ENABLE_LSP_TOOL) ? [LSPTool] : [],
    ...isWorktreeModeEnabled() ? [EnterWorktreeTool, ExitWorktreeTool] : [],
    getSendMessageTool(),
    ...ListPeersTool ? [ListPeersTool] : [],
    ...isAgentSwarmsEnabled() ? [getTeamCreateTool(), getTeamDeleteTool()] : [],
    ...VerifyPlanExecutionTool2 ? [VerifyPlanExecutionTool2] : [],
    ...[],
    ...WorkflowTool ? [WorkflowTool] : [],
    ...SleepTool ? [SleepTool] : [],
    ...cronTools,
    ...RemoteTriggerTool ? [RemoteTriggerTool] : [],
    ...MonitorTool ? [MonitorTool] : [],
    BriefTool,
    ...SendUserFileTool ? [SendUserFileTool] : [],
    ...PushNotificationTool ? [PushNotificationTool] : [],
    ...SubscribePRTool ? [SubscribePRTool] : [],
    ...getPowerShellTool2() ? [getPowerShellTool2()] : [],
    ...SnipTool ? [SnipTool] : [],
    ...[],
    ListMcpResourcesTool,
    ReadMcpResourceTool,
    ...isToolSearchEnabledOptimistic() ? [ToolSearchTool] : []
  ];
}
function filterToolsByDenyRules(tools, permissionContext) {
  return tools.filter((tool) => !getDenyRuleForTool(permissionContext, tool));
}
function assembleToolPool(permissionContext, mcpTools) {
  let builtInTools = getTools(permissionContext), allowedMcpTools = filterToolsByDenyRules(mcpTools, permissionContext), byName = (a2, b) => a2.name.localeCompare(b.name);
  return uniqBy_default([...builtInTools].sort(byName).concat(allowedMcpTools.sort(byName)), "name");
}
var REPLTool = null, SuggestBackgroundPRTool = null, SleepTool = null, cronTools, RemoteTriggerTool = null, MonitorTool = null, SendUserFileTool = null, PushNotificationTool = null, SubscribePRTool = null, getTeamCreateTool = () => (init_TeamCreateTool(), __toCommonJS(exports_TeamCreateTool)).TeamCreateTool, getTeamDeleteTool = () => (init_TeamDeleteTool(), __toCommonJS(exports_TeamDeleteTool)).TeamDeleteTool, getSendMessageTool = () => (init_SendMessageTool(), __toCommonJS(exports_SendMessageTool)).SendMessageTool, VerifyPlanExecutionTool2, OverflowTestTool = null, CtxInspectTool = null, TerminalCaptureTool = null, WebBrowserTool = null, SnipTool = null, ListPeersTool = null, WorkflowTool = null, getPowerShellTool2 = () => {
  if (!isPowerShellToolEnabled())
    return null;
  return (init_PowerShellTool(), __toCommonJS(exports_PowerShellTool)).PowerShellTool;
}, TOOL_PRESETS, getTools = (permissionContext) => {
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
    if (isReplModeEnabled() && REPLTool)
      return filterToolsByDenyRules([REPLTool], permissionContext);
    return filterToolsByDenyRules([BashTool, FileReadTool, FileEditTool], permissionContext);
  }
  let specialTools = /* @__PURE__ */ new Set([
    ListMcpResourcesTool.name,
    ReadMcpResourceTool.name,
    SYNTHETIC_OUTPUT_TOOL_NAME
  ]), tools = getAllBaseTools().filter((tool) => !specialTools.has(tool.name)), allowedTools = filterToolsByDenyRules(tools, permissionContext);
  if (isReplModeEnabled()) {
    if (allowedTools.some((tool) => toolMatchesName(tool, REPL_TOOL_NAME)))
      allowedTools = allowedTools.filter((tool) => !REPL_ONLY_TOOLS.has(tool.name));
  }
  let isEnabled2 = allowedTools.map((_) => _.isEnabled());
  return allowedTools.filter((_, i5) => isEnabled2[i5]);
};
var init_tools2 = __esm(() => {
  init_Tool();
  init_AgentTool();
  init_SkillTool();
  init_BashTool();
  init_FileEditTool();
  init_FileReadTool();
  init_FileWriteTool();
  init_GlobTool();
  init_NotebookEditTool();
  init_WebFetchTool();
  init_TaskStopTool();
  init_BriefTool();
  init_TaskOutputTool();
  init_WebSearchTool();
  init_TodoWriteTool();
  init_ExitPlanModeV2Tool();
  init_TestingPermissionTool();
  init_GrepTool();
  init_TungstenTool();
  init_AskUserQuestionTool();
  init_LSPTool();
  init_ListMcpResourcesTool();
  init_ReadMcpResourceTool();
  init_ToolSearchTool();
  init_EnterPlanModeTool();
  init_EnterWorktreeTool();
  init_ExitWorktreeTool();
  init_ConfigTool();
  init_TaskCreateTool();
  init_TaskGetTool();
  init_TaskUpdateTool();
  init_TaskListTool();
  init_uniqBy();
  init_toolSearch();
  init_tasks();
  init_SyntheticOutputTool();
  init_tools();
  init_permissions2();
  init_embeddedTools();
  init_envUtils();
  init_shellToolUtils();
  init_agentSwarmsEnabled();
  init_constants9();
  cronTools = [], VerifyPlanExecutionTool2 = process.env.CLAUDE_CODE_VERIFY_PLAN === "true" ? (init_VerifyPlanExecutionTool(), __toCommonJS(exports_VerifyPlanExecutionTool)).VerifyPlanExecutionTool : null, TOOL_PRESETS = ["default"];
});
