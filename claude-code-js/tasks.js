// Original: src/tasks.ts
function getAllTasks() {
  let tasks = [
    LocalShellTask,
    LocalAgentTask,
    RemoteAgentTask,
    DreamTask
  ];
  if (LocalWorkflowTask)
    tasks.push(LocalWorkflowTask);
  if (MonitorMcpTask)
    tasks.push(MonitorMcpTask);
  return tasks;
}
function getTaskByType(type) {
  return getAllTasks().find((t2) => t2.type === type);
}
var LocalWorkflowTask = null, MonitorMcpTask = null;
var init_tasks2 = __esm(() => {
  init_DreamTask();
  init_LocalAgentTask();
  init_LocalShellTask();
  init_RemoteAgentTask();
});
