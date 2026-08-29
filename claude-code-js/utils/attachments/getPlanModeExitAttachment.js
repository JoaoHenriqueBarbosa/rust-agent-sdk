// function: getPlanModeExitAttachment
async function getPlanModeExitAttachment(toolUseContext) {
  if (!needsPlanModeExitAttachment())
    return [];
  if (toolUseContext.getAppState().toolPermissionContext.mode === "plan")
    return setNeedsPlanModeExitAttachment(!1), [];
  setNeedsPlanModeExitAttachment(!1);
  let planFilePath = getPlanFilePath(toolUseContext.agentId), planExists = getPlan(toolUseContext.agentId) !== null;
  return [{ type: "plan_mode_exit", planFilePath, planExists }];
}
