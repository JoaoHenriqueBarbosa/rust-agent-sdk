// Original: src/tasks/InProcessTeammateTask/InProcessTeammateTask.tsx
var exports_InProcessTeammateTask = {};
__export(exports_InProcessTeammateTask, {
  requestTeammateShutdown: () => requestTeammateShutdown,
  injectUserMessageToTeammate: () => injectUserMessageToTeammate,
  getRunningTeammatesSorted: () => getRunningTeammatesSorted,
  getAllInProcessTeammateTasks: () => getAllInProcessTeammateTasks,
  findTeammateTaskByAgentId: () => findTeammateTaskByAgentId,
  appendTeammateMessage: () => appendTeammateMessage,
  InProcessTeammateTask: () => InProcessTeammateTask
});
function requestTeammateShutdown(taskId, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running" || task.shutdownRequested)
      return task;
    return {
      ...task,
      shutdownRequested: !0
    };
  });
}
function appendTeammateMessage(taskId, message, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running")
      return task;
    return {
      ...task,
      messages: appendCappedMessage(task.messages, message)
    };
  });
}
function injectUserMessageToTeammate(taskId, message, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    if (isTerminalTaskStatus(task.status))
      return logForDebugging(`Dropping message for teammate task ${taskId}: task status is "${task.status}"`), task;
    return {
      ...task,
      pendingUserMessages: [...task.pendingUserMessages, message],
      messages: appendCappedMessage(task.messages, createUserMessage({
        content: message
      }))
    };
  });
}
function findTeammateTaskByAgentId(agentId, tasks) {
  let fallback;
  for (let task of Object.values(tasks))
    if (isInProcessTeammateTask(task) && task.identity.agentId === agentId) {
      if (task.status === "running")
        return task;
      if (!fallback)
        fallback = task;
    }
  return fallback;
}
function getAllInProcessTeammateTasks(tasks) {
  return Object.values(tasks).filter(isInProcessTeammateTask);
}
function getRunningTeammatesSorted(tasks) {
  return getAllInProcessTeammateTasks(tasks).filter((t2) => t2.status === "running").sort((a2, b) => a2.identity.agentName.localeCompare(b.identity.agentName));
}
var InProcessTeammateTask;
var init_InProcessTeammateTask = __esm(() => {
  init_Task();
  init_debug();
  init_messages3();
  init_spawnInProcess();
  init_framework();
  InProcessTeammateTask = {
    name: "InProcessTeammateTask",
    type: "in_process_teammate",
    async kill(taskId, setAppState) {
      killInProcessTeammate(taskId, setAppState);
    }
  };
});
