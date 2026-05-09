// function: getPlanModeV2SparseInstructions
function getPlanModeV2SparseInstructions(attachment) {
  let workflowDescription = isPlanModeInterviewPhaseEnabled() ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally." : "Follow 5-phase workflow.", content = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${attachment.planFilePath}). ${workflowDescription} End turns with ${ASK_USER_QUESTION_TOOL_NAME} (for clarifications) or ${ExitPlanModeV2Tool.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
  return wrapMessagesInSystemReminder([
    createUserMessage({ content, isMeta: !0 })
  ]);
}
