// Original: src/tasks/LocalShellTask/killShellTasks.ts
function killTask(taskId, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running" || !isLocalShellTask(task))
      return task;
    try {
      logForDebugging(`LocalShellTask ${taskId} kill requested`), task.shellCommand?.kill(), task.shellCommand?.cleanup();
    } catch (error44) {
      logError2(error44);
    }
    if (task.unregisterCleanup?.(), task.cleanupTimeoutId)
      clearTimeout(task.cleanupTimeoutId);
    return {
      ...task,
      status: "killed",
      notified: !0,
      shellCommand: null,
      unregisterCleanup: void 0,
      cleanupTimeoutId: void 0,
      endTime: Date.now()
    };
  }), evictTaskOutput(taskId);
}
function killShellTasksForAgent(agentId, getAppState, setAppState) {
  let tasks = getAppState().tasks ?? {};
  for (let [taskId, task] of Object.entries(tasks))
    if (isLocalShellTask(task) && task.agentId === agentId && task.status === "running")
      logForDebugging(`killShellTasksForAgent: killing orphaned shell task ${taskId} (agent ${agentId} exiting)`), killTask(taskId, setAppState);
  dequeueAllMatching((cmd) => cmd.agentId === agentId);
}
var init_killShellTasks = __esm(() => {
  init_debug();
  init_log3();
  init_messageQueueManager();
  init_diskOutput();
  init_framework();
});
