// Original: src/tasks/stopTask.ts
async function stopTask(taskId, context6) {
  let { getAppState, setAppState } = context6, task = getAppState().tasks?.[taskId];
  if (!task)
    throw new StopTaskError(`No task found with ID: ${taskId}`, "not_found");
  if (task.status !== "running")
    throw new StopTaskError(`Task ${taskId} is not running (status: ${task.status})`, "not_running");
  let taskImpl = getTaskByType(task.type);
  if (!taskImpl)
    throw new StopTaskError(`Unsupported task type: ${task.type}`, "unsupported_type");
  if (await taskImpl.kill(taskId, setAppState), isLocalShellTask(task)) {
    let suppressed = !1;
    if (setAppState((prev) => {
      let prevTask = prev.tasks[taskId];
      if (!prevTask || prevTask.notified)
        return prev;
      return suppressed = !0, {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...prevTask, notified: !0 }
        }
      };
    }), suppressed)
      emitTaskTerminatedSdk(taskId, "stopped", {
        toolUseId: task.toolUseId,
        summary: task.description
      });
  }
  let command12 = isLocalShellTask(task) ? task.command : task.description;
  return { taskId, taskType: task.type, command: command12 };
}
var StopTaskError;
var init_stopTask = __esm(() => {
  init_tasks2();
  init_sdkEventQueue();
  StopTaskError = class StopTaskError extends Error {
    code;
    constructor(message, code) {
      super(message);
      this.code = code;
      this.name = "StopTaskError";
    }
  };
});
