// Original: src/hooks/useTeammateViewAutoExit.ts
function useTeammateViewAutoExit() {
  let setAppState = useSetAppState(), viewingAgentTaskId = useAppState((s2) => s2.viewingAgentTaskId), task = useAppState((s2) => s2.viewingAgentTaskId ? s2.tasks[s2.viewingAgentTaskId] : void 0), viewedTask = task && isInProcessTeammateTask(task) ? task : void 0, viewedStatus = viewedTask?.status, viewedError = viewedTask?.error, taskExists = task !== void 0;
  import_react268.useEffect(() => {
    if (!viewingAgentTaskId)
      return;
    if (!taskExists) {
      exitTeammateView(setAppState);
      return;
    }
    if (!viewedTask)
      return;
    if (viewedStatus === "killed" || viewedStatus === "failed" || viewedError || viewedStatus !== "running" && viewedStatus !== "completed" && viewedStatus !== "pending") {
      exitTeammateView(setAppState);
      return;
    }
  }, [
    viewingAgentTaskId,
    taskExists,
    viewedTask,
    viewedStatus,
    viewedError,
    setAppState
  ]);
}
var import_react268;
var init_useTeammateViewAutoExit = __esm(() => {
  init_AppState();
  init_teammateViewHelpers();
  import_react268 = __toESM(require_react_development(), 1);
});
