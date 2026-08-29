// Original: src/state/selectors.ts
function getViewedTeammateTask(appState) {
  let { viewingAgentTaskId, tasks } = appState;
  if (!viewingAgentTaskId)
    return;
  let task = tasks[viewingAgentTaskId];
  if (!task)
    return;
  if (!isInProcessTeammateTask(task))
    return;
  return task;
}
function getActiveAgentForInput(appState) {
  let viewedTask = getViewedTeammateTask(appState);
  if (viewedTask)
    return { type: "viewed", task: viewedTask };
  let { viewingAgentTaskId, tasks } = appState;
  if (viewingAgentTaskId) {
    let task = tasks[viewingAgentTaskId];
    if (task?.type === "local_agent")
      return { type: "named_agent", task };
  }
  return { type: "leader" };
}
var init_selectors = () => {};
