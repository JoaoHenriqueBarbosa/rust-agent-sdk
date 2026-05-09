// Original: src/utils/inProcessTeammateHelpers.ts
function findInProcessTeammateTaskId(agentName, appState) {
  for (let task of Object.values(appState.tasks))
    if (isInProcessTeammateTask(task) && task.identity.agentName === agentName)
      return task.id;
  return;
}
function setAwaitingPlanApproval(taskId, setAppState, awaiting) {
  updateTaskState(taskId, setAppState, (task) => ({
    ...task,
    awaitingPlanApproval: awaiting
  }));
}
function handlePlanApprovalResponse(taskId, _response, setAppState) {
  setAwaitingPlanApproval(taskId, setAppState, !1);
}
var init_inProcessTeammateHelpers = __esm(() => {
  init_framework();
  init_teammateMailbox();
});
