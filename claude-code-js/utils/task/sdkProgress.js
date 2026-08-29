// Original: src/utils/task/sdkProgress.ts
function emitTaskProgress(params) {
  enqueueSdkEvent({
    type: "system",
    subtype: "task_progress",
    task_id: params.taskId,
    tool_use_id: params.toolUseId,
    description: params.description,
    usage: {
      total_tokens: params.totalTokens,
      tool_uses: params.toolUses,
      duration_ms: Date.now() - params.startTime
    },
    last_tool_name: params.lastToolName,
    summary: params.summary,
    workflow_progress: params.workflowProgress
  });
}
var init_sdkProgress = __esm(() => {
  init_sdkEventQueue();
});
