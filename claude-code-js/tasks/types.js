// Original: src/tasks/types.ts
function isBackgroundTask(task) {
  if (task.status !== "running" && task.status !== "pending")
    return !1;
  if ("isBackgrounded" in task && task.isBackgrounded === !1)
    return !1;
  return !0;
}
