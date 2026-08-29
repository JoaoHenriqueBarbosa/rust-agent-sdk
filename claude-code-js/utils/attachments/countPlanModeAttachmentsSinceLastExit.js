// function: countPlanModeAttachmentsSinceLastExit
function countPlanModeAttachmentsSinceLastExit(messages) {
  let count4 = 0;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message?.type === "attachment") {
      if (message.attachment.type === "plan_mode_exit")
        break;
      if (message.attachment.type === "plan_mode")
        count4++;
    }
  }
  return count4;
}
