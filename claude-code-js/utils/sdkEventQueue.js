// Original: src/utils/sdkEventQueue.ts
import { randomUUID as randomUUID6 } from "crypto";
function enqueueSdkEvent(event) {
  if (!getIsNonInteractiveSession())
    return;
  if (queue.length >= MAX_QUEUE_SIZE)
    queue.shift();
  queue.push(event);
}
function drainSdkEvents() {
  if (queue.length === 0)
    return [];
  return queue.splice(0).map((e) => ({
    ...e,
    uuid: randomUUID6(),
    session_id: getSessionId()
  }));
}
function emitTaskTerminatedSdk(taskId, status, opts) {
  enqueueSdkEvent({
    type: "system",
    subtype: "task_notification",
    task_id: taskId,
    tool_use_id: opts?.toolUseId,
    status,
    output_file: opts?.outputFile ?? "",
    summary: opts?.summary ?? "",
    usage: opts?.usage
  });
}
var MAX_QUEUE_SIZE = 1000, queue;
var init_sdkEventQueue = __esm(() => {
  init_state();
  queue = [];
});
