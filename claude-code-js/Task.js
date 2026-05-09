// Original: src/Task.ts
import { randomBytes as randomBytes20 } from "crypto";
function isTerminalTaskStatus(status2) {
  return status2 === "completed" || status2 === "failed" || status2 === "killed";
}
function getTaskIdPrefix(type) {
  return TASK_ID_PREFIXES[type] ?? "x";
}
function generateTaskId(type) {
  let prefix = getTaskIdPrefix(type), bytes = randomBytes20(8), id = prefix;
  for (let i5 = 0;i5 < 8; i5++)
    id += TASK_ID_ALPHABET2[bytes[i5] % TASK_ID_ALPHABET2.length];
  return id;
}
function createTaskStateBase(id, type, description, toolUseId) {
  return {
    id,
    type,
    status: "pending",
    description,
    toolUseId,
    startTime: Date.now(),
    outputFile: getTaskOutputPath(id),
    outputOffset: 0,
    notified: !1
  };
}
var TASK_ID_PREFIXES, TASK_ID_ALPHABET2 = "0123456789abcdefghijklmnopqrstuvwxyz";
var init_Task = __esm(() => {
  init_diskOutput();
  TASK_ID_PREFIXES = {
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r",
    in_process_teammate: "t",
    local_workflow: "w",
    monitor_mcp: "m",
    dream: "d"
  };
});
