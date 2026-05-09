// Original: src/state/teammateViewHelpers.ts
function isLocalAgent(task) {
  return typeof task === "object" && task !== null && "type" in task && task.type === "local_agent";
}
function release(task) {
  return {
    ...task,
    retain: !1,
    messages: void 0,
    diskLoaded: !1,
    evictAfter: isTerminalTaskStatus(task.status) ? Date.now() + PANEL_GRACE_MS2 : void 0
  };
}
function enterTeammateView(taskId, setAppState) {
  logEvent("tengu_transcript_view_enter", {}), setAppState((prev) => {
    let task = prev.tasks[taskId], prevId = prev.viewingAgentTaskId, prevTask = prevId !== void 0 ? prev.tasks[prevId] : void 0, switching = prevId !== void 0 && prevId !== taskId && isLocalAgent(prevTask) && prevTask.retain, needsRetain = isLocalAgent(task) && (!task.retain || task.evictAfter !== void 0), needsView = prev.viewingAgentTaskId !== taskId || prev.viewSelectionMode !== "viewing-agent";
    if (!needsRetain && !needsView && !switching)
      return prev;
    let tasks = prev.tasks;
    if (switching || needsRetain) {
      if (tasks = { ...prev.tasks }, switching)
        tasks[prevId] = release(prevTask);
      if (needsRetain)
        tasks[taskId] = { ...task, retain: !0, evictAfter: void 0 };
    }
    return {
      ...prev,
      viewingAgentTaskId: taskId,
      viewSelectionMode: "viewing-agent",
      tasks
    };
  });
}
function exitTeammateView(setAppState) {
  logEvent("tengu_transcript_view_exit", {}), setAppState((prev) => {
    let id = prev.viewingAgentTaskId, cleared = {
      ...prev,
      viewingAgentTaskId: void 0,
      viewSelectionMode: "none"
    };
    if (id === void 0)
      return prev.viewSelectionMode === "none" ? prev : cleared;
    let task = prev.tasks[id];
    if (!isLocalAgent(task) || !task.retain)
      return cleared;
    return {
      ...cleared,
      tasks: { ...prev.tasks, [id]: release(task) }
    };
  });
}
function stopOrDismissAgent(taskId, setAppState) {
  setAppState((prev) => {
    let task = prev.tasks[taskId];
    if (!isLocalAgent(task))
      return prev;
    if (task.status === "running")
      return task.abortController?.abort(), prev;
    if (task.evictAfter === 0)
      return prev;
    let viewingThis = prev.viewingAgentTaskId === taskId;
    return {
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { ...release(task), evictAfter: 0 }
      },
      ...viewingThis && {
        viewingAgentTaskId: void 0,
        viewSelectionMode: "none"
      }
    };
  });
}
var PANEL_GRACE_MS2 = 30000;
var init_teammateViewHelpers = __esm(() => {
  init_Task();
});
