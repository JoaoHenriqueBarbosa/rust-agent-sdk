// function: getTaskReminderTurnCounts
function getTaskReminderTurnCounts(messages) {
  let lastTaskManagementIndex = -1, lastReminderIndex = -1, assistantTurnsSinceTaskManagement = 0, assistantTurnsSinceReminder = 0;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message?.type === "assistant") {
      if (isThinkingMessage(message))
        continue;
      if (lastTaskManagementIndex === -1 && "message" in message && Array.isArray(message.message?.content) && message.message.content.some((block2) => block2.type === "tool_use" && (block2.name === TASK_CREATE_TOOL_NAME || block2.name === TASK_UPDATE_TOOL_NAME)))
        lastTaskManagementIndex = i5;
      if (lastTaskManagementIndex === -1)
        assistantTurnsSinceTaskManagement++;
      if (lastReminderIndex === -1)
        assistantTurnsSinceReminder++;
    } else if (lastReminderIndex === -1 && message?.type === "attachment" && message.attachment.type === "task_reminder")
      lastReminderIndex = i5;
    if (lastTaskManagementIndex !== -1 && lastReminderIndex !== -1)
      break;
  }
  return {
    turnsSinceLastTaskManagement: assistantTurnsSinceTaskManagement,
    turnsSinceLastReminder: assistantTurnsSinceReminder
  };
}
