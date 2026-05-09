// Original: src/utils/teammate.ts
var exports_teammate = {};
__export(exports_teammate, {
  waitForTeammatesToBecomeIdle: () => waitForTeammatesToBecomeIdle,
  setDynamicTeamContext: () => setDynamicTeamContext,
  runWithTeammateContext: () => runWithTeammateContext,
  isTeammate: () => isTeammate,
  isTeamLead: () => isTeamLead,
  isPlanModeRequired: () => isPlanModeRequired,
  isInProcessTeammate: () => isInProcessTeammate,
  hasWorkingInProcessTeammates: () => hasWorkingInProcessTeammates,
  hasActiveInProcessTeammates: () => hasActiveInProcessTeammates,
  getTeammateContext: () => getTeammateContext,
  getTeammateColor: () => getTeammateColor,
  getTeamName: () => getTeamName,
  getParentSessionId: () => getParentSessionId2,
  getDynamicTeamContext: () => getDynamicTeamContext,
  getAgentName: () => getAgentName,
  getAgentId: () => getAgentId,
  createTeammateContext: () => createTeammateContext,
  clearDynamicTeamContext: () => clearDynamicTeamContext
});
function getParentSessionId2() {
  let inProcessCtx = getTeammateContext();
  if (inProcessCtx)
    return inProcessCtx.parentSessionId;
  return dynamicTeamContext?.parentSessionId;
}
function setDynamicTeamContext(context3) {
  dynamicTeamContext = context3;
}
function clearDynamicTeamContext() {
  dynamicTeamContext = null;
}
function getDynamicTeamContext() {
  return dynamicTeamContext;
}
function getAgentId() {
  let inProcessCtx = getTeammateContext();
  if (inProcessCtx)
    return inProcessCtx.agentId;
  return dynamicTeamContext?.agentId;
}
function getAgentName() {
  let inProcessCtx = getTeammateContext();
  if (inProcessCtx)
    return inProcessCtx.agentName;
  return dynamicTeamContext?.agentName;
}
function getTeamName(teamContext) {
  let inProcessCtx = getTeammateContext();
  if (inProcessCtx)
    return inProcessCtx.teamName;
  if (dynamicTeamContext?.teamName)
    return dynamicTeamContext.teamName;
  return teamContext?.teamName;
}
function isTeammate() {
  if (getTeammateContext())
    return !0;
  return !!(dynamicTeamContext?.agentId && dynamicTeamContext?.teamName);
}
function getTeammateColor() {
  let inProcessCtx = getTeammateContext();
  if (inProcessCtx)
    return inProcessCtx.color;
  return dynamicTeamContext?.color;
}
function isPlanModeRequired() {
  let inProcessCtx = getTeammateContext();
  if (inProcessCtx)
    return inProcessCtx.planModeRequired;
  if (dynamicTeamContext !== null)
    return dynamicTeamContext.planModeRequired;
  return isEnvTruthy(process.env.CLAUDE_CODE_PLAN_MODE_REQUIRED);
}
function isTeamLead(teamContext) {
  if (!teamContext?.leadAgentId)
    return !1;
  let myAgentId = getAgentId(), leadAgentId = teamContext.leadAgentId;
  if (myAgentId === leadAgentId)
    return !0;
  if (!myAgentId)
    return !0;
  return !1;
}
function hasActiveInProcessTeammates(appState) {
  for (let task of Object.values(appState.tasks))
    if (task.type === "in_process_teammate" && task.status === "running")
      return !0;
  return !1;
}
function hasWorkingInProcessTeammates(appState) {
  for (let task of Object.values(appState.tasks))
    if (task.type === "in_process_teammate" && task.status === "running" && !task.isIdle)
      return !0;
  return !1;
}
function waitForTeammatesToBecomeIdle(setAppState, appState) {
  let workingTaskIds = [];
  for (let [taskId, task] of Object.entries(appState.tasks))
    if (task.type === "in_process_teammate" && task.status === "running" && !task.isIdle)
      workingTaskIds.push(taskId);
  if (workingTaskIds.length === 0)
    return Promise.resolve();
  return new Promise((resolve23) => {
    let remaining = workingTaskIds.length, onIdle = () => {
      if (remaining--, remaining === 0)
        resolve23();
    };
    setAppState((prev) => {
      let newTasks = { ...prev.tasks };
      for (let taskId of workingTaskIds) {
        let task = newTasks[taskId];
        if (task && task.type === "in_process_teammate")
          if (task.isIdle)
            onIdle();
          else
            newTasks[taskId] = {
              ...task,
              onIdleCallbacks: [...task.onIdleCallbacks ?? [], onIdle]
            };
      }
      return { ...prev, tasks: newTasks };
    });
  });
}
var dynamicTeamContext = null;
var init_teammate = __esm(() => {
  init_teammateContext();
  init_envUtils();
  init_teammateContext();
});
