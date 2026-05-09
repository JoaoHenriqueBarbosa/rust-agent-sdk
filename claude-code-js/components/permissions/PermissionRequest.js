// Original: src/components/permissions/PermissionRequest.tsx
function permissionComponentForTool(tool) {
  switch (tool) {
    case FileEditTool:
      return FileEditPermissionRequest;
    case FileWriteTool:
      return FileWritePermissionRequest;
    case BashTool:
      return BashPermissionRequest;
    case PowerShellTool:
      return PowerShellPermissionRequest;
    case ReviewArtifactTool:
      return ReviewArtifactPermissionRequest ?? FallbackPermissionRequest;
    case WebFetchTool:
      return WebFetchPermissionRequest;
    case NotebookEditTool:
      return NotebookEditPermissionRequest;
    case ExitPlanModeV2Tool:
      return ExitPlanModePermissionRequest;
    case EnterPlanModeTool:
      return EnterPlanModePermissionRequest;
    case SkillTool:
      return SkillPermissionRequest;
    case AskUserQuestionTool:
      return AskUserQuestionPermissionRequest;
    case WorkflowTool2:
      return WorkflowPermissionRequest ?? FallbackPermissionRequest;
    case MonitorTool2:
      return MonitorPermissionRequest ?? FallbackPermissionRequest;
    case GlobTool:
    case GrepTool:
    case FileReadTool:
      return FilesystemPermissionRequest;
    default:
      return FallbackPermissionRequest;
  }
}
function getNotificationMessage(toolUseConfirm) {
  let toolName = toolUseConfirm.tool.userFacingName(toolUseConfirm.input);
  if (toolUseConfirm.tool === ExitPlanModeV2Tool)
    return "Claude Code needs your approval for the plan";
  if (toolUseConfirm.tool === EnterPlanModeTool)
    return "Claude Code wants to enter plan mode";
  if (!toolName || toolName.trim() === "")
    return "Claude Code needs your attention";
  return `Claude needs your permission to use ${toolName}`;
}
function PermissionRequest(t0) {
  let $3 = import_compiler_runtime311.c(18), {
    toolUseConfirm,
    toolUseContext,
    onDone,
    onReject,
    verbose,
    workerBadge,
    setStickyFooter
  } = t0, t1;
  if ($3[0] !== onDone || $3[1] !== onReject || $3[2] !== toolUseConfirm)
    t1 = () => {
      onDone(), onReject(), toolUseConfirm.onReject();
    }, $3[0] = onDone, $3[1] = onReject, $3[2] = toolUseConfirm, $3[3] = t1;
  else
    t1 = $3[3];
  let t2;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      context: "Confirmation"
    }, $3[4] = t2;
  else
    t2 = $3[4];
  useKeybinding("app:interrupt", t1, t2);
  let t3;
  if ($3[5] !== toolUseConfirm)
    t3 = getNotificationMessage(toolUseConfirm), $3[5] = toolUseConfirm, $3[6] = t3;
  else
    t3 = $3[6];
  useNotifyAfterTimeout(t3, "permission_prompt");
  let t4;
  if ($3[7] !== toolUseConfirm.tool)
    t4 = permissionComponentForTool(toolUseConfirm.tool), $3[7] = toolUseConfirm.tool, $3[8] = t4;
  else
    t4 = $3[8];
  let PermissionComponent = t4, t5;
  if ($3[9] !== PermissionComponent || $3[10] !== onDone || $3[11] !== onReject || $3[12] !== setStickyFooter || $3[13] !== toolUseConfirm || $3[14] !== toolUseContext || $3[15] !== verbose || $3[16] !== workerBadge)
    t5 = /* @__PURE__ */ jsx_dev_runtime400.jsxDEV(PermissionComponent, {
      toolUseContext,
      toolUseConfirm,
      onDone,
      onReject,
      verbose,
      workerBadge,
      setStickyFooter
    }, void 0, !1, void 0, this), $3[9] = PermissionComponent, $3[10] = onDone, $3[11] = onReject, $3[12] = setStickyFooter, $3[13] = toolUseConfirm, $3[14] = toolUseContext, $3[15] = verbose, $3[16] = workerBadge, $3[17] = t5;
  else
    t5 = $3[17];
  return t5;
}
var import_compiler_runtime311, jsx_dev_runtime400, ReviewArtifactTool = null, ReviewArtifactPermissionRequest = null, WorkflowTool2 = null, WorkflowPermissionRequest = null, MonitorTool2 = null, MonitorPermissionRequest = null;
var init_PermissionRequest = __esm(() => {
  init_EnterPlanModeTool();
  init_ExitPlanModeV2Tool();
  init_useNotifyAfterTimeout();
  init_useKeybinding();
  init_AskUserQuestionTool();
  init_BashTool();
  init_FileEditTool();
  init_FileReadTool();
  init_FileWriteTool();
  init_GlobTool();
  init_GrepTool();
  init_NotebookEditTool();
  init_PowerShellTool();
  init_SkillTool();
  init_WebFetchTool();
  init_AskUserQuestionPermissionRequest();
  init_BashPermissionRequest();
  init_EnterPlanModePermissionRequest();
  init_ExitPlanModePermissionRequest();
  init_FallbackPermissionRequest();
  init_FileEditPermissionRequest();
  init_FilesystemPermissionRequest();
  init_FileWritePermissionRequest();
  init_NotebookEditPermissionRequest();
  init_PowerShellPermissionRequest();
  init_SkillPermissionRequest();
  init_WebFetchPermissionRequest();
  import_compiler_runtime311 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime400 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
