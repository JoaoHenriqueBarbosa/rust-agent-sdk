// function: createPlanModeAttachmentIfNeeded
async function createPlanModeAttachmentIfNeeded(context6) {
  if (context6.getAppState().toolPermissionContext.mode !== "plan")
    return null;
  let planFilePath = getPlanFilePath(context6.agentId), planExists = getPlan(context6.agentId) !== null;
  return createAttachmentMessage({
    type: "plan_mode",
    reminderType: "full",
    isSubAgent: !!context6.agentId,
    planFilePath,
    planExists
  });
}
