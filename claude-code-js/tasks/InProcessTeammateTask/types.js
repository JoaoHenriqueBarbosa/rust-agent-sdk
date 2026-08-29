// Original: src/tasks/InProcessTeammateTask/types.ts
function isInProcessTeammateTask(task) {
  return typeof task === "object" && task !== null && "type" in task && task.type === "in_process_teammate";
}
function appendCappedMessage(prev, item) {
  if (prev === void 0 || prev.length === 0)
    return [item];
  if (prev.length >= TEAMMATE_MESSAGES_UI_CAP) {
    let next = prev.slice(-(TEAMMATE_MESSAGES_UI_CAP - 1));
    return next.push(item), next;
  }
  return [...prev, item];
}
var TEAMMATE_MESSAGES_UI_CAP = 50;
