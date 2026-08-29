// Original: src/utils/collapseTeammateShutdowns.ts
function isTeammateShutdownAttachment(msg) {
  return msg.type === "attachment" && msg.attachment.type === "task_status" && msg.attachment.taskType === "in_process_teammate" && msg.attachment.status === "completed";
}
function collapseTeammateShutdowns(messages) {
  let result = [], i5 = 0;
  while (i5 < messages.length) {
    let msg = messages[i5];
    if (isTeammateShutdownAttachment(msg)) {
      let count4 = 0;
      while (i5 < messages.length && isTeammateShutdownAttachment(messages[i5]))
        count4++, i5++;
      if (count4 === 1)
        result.push(msg);
      else
        result.push({
          type: "attachment",
          uuid: msg.uuid,
          timestamp: msg.timestamp,
          attachment: {
            type: "teammate_shutdown_batch",
            count: count4
          }
        });
    } else
      result.push(msg), i5++;
  }
  return result;
}
