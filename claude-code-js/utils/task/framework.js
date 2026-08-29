// Original: src/utils/task/framework.ts
function updateTaskState(taskId, setAppState, updater) {
  setAppState((prev) => {
    let task = prev.tasks?.[taskId];
    if (!task)
      return prev;
    let updated = updater(task);
    if (updated === task)
      return prev;
    return {
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: updated
      }
    };
  });
}
function registerTask(task, setAppState) {
  let isReplacement = !1;
  if (setAppState((prev) => {
    let existing = prev.tasks[task.id];
    isReplacement = existing !== void 0;
    let merged = existing && "retain" in existing ? {
      ...task,
      retain: existing.retain,
      startTime: existing.startTime,
      messages: existing.messages,
      diskLoaded: existing.diskLoaded,
      pendingMessages: existing.pendingMessages
    } : task;
    return { ...prev, tasks: { ...prev.tasks, [task.id]: merged } };
  }), isReplacement)
    return;
  enqueueSdkEvent({
    type: "system",
    subtype: "task_started",
    task_id: task.id,
    tool_use_id: task.toolUseId,
    description: task.description,
    task_type: task.type,
    workflow_name: "workflowName" in task ? task.workflowName : void 0,
    prompt: "prompt" in task ? task.prompt : void 0
  });
}
function evictTerminalTask(taskId, setAppState) {
  setAppState((prev) => {
    let task = prev.tasks?.[taskId];
    if (!task)
      return prev;
    if (!isTerminalTaskStatus(task.status))
      return prev;
    if (!task.notified)
      return prev;
    if ("retain" in task && (task.evictAfter ?? 1 / 0) > Date.now())
      return prev;
    let { [taskId]: _, ...remainingTasks } = prev.tasks;
    return { ...prev, tasks: remainingTasks };
  });
}
function getRunningTasks(state3) {
  let tasks = state3.tasks ?? {};
  return Object.values(tasks).filter((task) => task.status === "running");
}
async function generateTaskAttachments(state3) {
  let attachments = [], updatedTaskOffsets = {}, evictedTaskIds = [], tasks = state3.tasks ?? {};
  for (let taskState of Object.values(tasks)) {
    if (taskState.notified)
      switch (taskState.status) {
        case "completed":
        case "failed":
        case "killed":
          evictedTaskIds.push(taskState.id);
          continue;
        case "pending":
          continue;
        case "running":
          break;
      }
    if (taskState.status === "running") {
      let delta = await getTaskOutputDelta(taskState.id, taskState.outputOffset);
      if (delta.content)
        updatedTaskOffsets[taskState.id] = delta.newOffset;
    }
  }
  return { attachments, updatedTaskOffsets, evictedTaskIds };
}
function applyTaskOffsetsAndEvictions(setAppState, updatedTaskOffsets, evictedTaskIds) {
  let offsetIds = Object.keys(updatedTaskOffsets);
  if (offsetIds.length === 0 && evictedTaskIds.length === 0)
    return;
  setAppState((prev) => {
    let changed = !1, newTasks = { ...prev.tasks };
    for (let id of offsetIds) {
      let fresh = newTasks[id];
      if (fresh?.status === "running")
        newTasks[id] = { ...fresh, outputOffset: updatedTaskOffsets[id] }, changed = !0;
    }
    for (let id of evictedTaskIds) {
      let fresh = newTasks[id];
      if (!fresh || !isTerminalTaskStatus(fresh.status) || !fresh.notified)
        continue;
      if ("retain" in fresh && (fresh.evictAfter ?? 1 / 0) > Date.now())
        continue;
      delete newTasks[id], changed = !0;
    }
    return changed ? { ...prev, tasks: newTasks } : prev;
  });
}
var STOPPED_DISPLAY_MS = 3000, PANEL_GRACE_MS = 30000;
var init_framework = __esm(() => {
  init_xml();
  init_Task();
  init_messageQueueManager();
  init_sdkEventQueue();
  init_diskOutput();
});
