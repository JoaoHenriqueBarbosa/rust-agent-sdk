// function: getPlanModeAttachments
async function getPlanModeAttachments(messages, toolUseContext) {
  if (toolUseContext.getAppState().toolPermissionContext.mode !== "plan")
    return [];
  if (messages && messages.length > 0) {
    let { turnCount, foundPlanModeAttachment } = getPlanModeAttachmentTurnCount(messages);
    if (foundPlanModeAttachment && turnCount < PLAN_MODE_ATTACHMENT_CONFIG.TURNS_BETWEEN_ATTACHMENTS)
      return [];
  }
  let planFilePath = getPlanFilePath(toolUseContext.agentId), existingPlan = getPlan(toolUseContext.agentId), attachments = [];
  if (hasExitedPlanModeInSession() && existingPlan !== null)
    attachments.push({ type: "plan_mode_reentry", planFilePath }), setHasExitedPlanMode(!1);
  let reminderType = (countPlanModeAttachmentsSinceLastExit(messages ?? []) + 1) % PLAN_MODE_ATTACHMENT_CONFIG.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
  return attachments.push({
    type: "plan_mode",
    reminderType,
    isSubAgent: !!toolUseContext.agentId,
    planFilePath,
    planExists: existingPlan !== null
  }), attachments;
}
