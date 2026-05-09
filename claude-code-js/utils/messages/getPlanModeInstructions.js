// function: getPlanModeInstructions
function getPlanModeInstructions(attachment) {
  if (attachment.isSubAgent)
    return getPlanModeV2SubAgentInstructions(attachment);
  if (attachment.reminderType === "sparse")
    return getPlanModeV2SparseInstructions(attachment);
  return getPlanModeV2Instructions(attachment);
}
