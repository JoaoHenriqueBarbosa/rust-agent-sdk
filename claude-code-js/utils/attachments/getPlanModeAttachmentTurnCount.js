// function: getPlanModeAttachmentTurnCount
function getPlanModeAttachmentTurnCount(messages) {
  let turnsSinceLastAttachment = 0, foundPlanModeAttachment = !1;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message?.type === "user" && !message.isMeta && !hasToolResultContent(message.message.content))
      turnsSinceLastAttachment++;
    else if (message?.type === "attachment" && (message.attachment.type === "plan_mode" || message.attachment.type === "plan_mode_reentry")) {
      foundPlanModeAttachment = !0;
      break;
    }
  }
  return { turnCount: turnsSinceLastAttachment, foundPlanModeAttachment };
}
