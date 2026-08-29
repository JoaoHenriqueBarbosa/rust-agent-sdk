// function: createPlanAttachmentIfNeeded
function createPlanAttachmentIfNeeded(agentId) {
  let planContent = getPlan(agentId);
  if (!planContent)
    return null;
  let planFilePath = getPlanFilePath(agentId);
  return createAttachmentMessage({
    type: "plan_file_reference",
    planFilePath,
    planContent
  });
}
