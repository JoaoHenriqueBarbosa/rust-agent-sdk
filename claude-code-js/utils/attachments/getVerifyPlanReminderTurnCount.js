// function: getVerifyPlanReminderTurnCount
function getVerifyPlanReminderTurnCount(messages) {
  let turnCount = 0;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message && isHumanTurn(message))
      turnCount++;
    if (message?.type === "attachment" && message.attachment.type === "plan_mode_exit")
      return turnCount;
  }
  return 0;
}
