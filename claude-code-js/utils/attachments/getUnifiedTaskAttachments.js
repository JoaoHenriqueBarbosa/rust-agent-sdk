// function: getUnifiedTaskAttachments
async function getUnifiedTaskAttachments(toolUseContext) {
  let appState = toolUseContext.getAppState(), { attachments, updatedTaskOffsets, evictedTaskIds } = await generateTaskAttachments(appState);
  return applyTaskOffsetsAndEvictions(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds), attachments.map((taskAttachment) => ({
    type: "task_status",
    taskId: taskAttachment.taskId,
    taskType: taskAttachment.taskType,
    status: taskAttachment.status,
    description: taskAttachment.description,
    deltaSummary: taskAttachment.deltaSummary,
    outputFilePath: getTaskOutputPath(taskAttachment.taskId)
  }));
}
