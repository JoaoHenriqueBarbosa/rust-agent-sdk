// function: tryClaimNextTask
async function tryClaimNextTask(taskListId, agentName) {
  try {
    let tasks = await listTasks(taskListId), availableTask = findAvailableTask(tasks);
    if (!availableTask)
      return;
    let result = await claimTask(taskListId, availableTask.id, agentName);
    if (!result.success) {
      logForDebugging(`[inProcessRunner] Failed to claim task #${availableTask.id}: ${result.reason}`);
      return;
    }
    return await updateTask(taskListId, availableTask.id, { status: "in_progress" }), logForDebugging(`[inProcessRunner] Claimed task #${availableTask.id}: ${availableTask.subject}`), formatTaskAsPrompt(availableTask);
  } catch (err2) {
    logForDebugging(`[inProcessRunner] Error checking task list: ${err2}`);
    return;
  }
}
