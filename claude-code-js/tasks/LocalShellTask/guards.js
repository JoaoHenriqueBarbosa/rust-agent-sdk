// Original: src/tasks/LocalShellTask/guards.ts
function isLocalShellTask(task) {
  return typeof task === "object" && task !== null && "type" in task && task.type === "local_bash";
}
