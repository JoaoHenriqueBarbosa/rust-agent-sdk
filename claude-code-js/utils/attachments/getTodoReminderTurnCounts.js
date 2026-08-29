// function: getTodoReminderTurnCounts
function getTodoReminderTurnCounts(messages) {
  let lastTodoWriteIndex = -1, lastReminderIndex = -1, assistantTurnsSinceWrite = 0, assistantTurnsSinceReminder = 0;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message?.type === "assistant") {
      if (isThinkingMessage(message))
        continue;
      if (lastTodoWriteIndex === -1 && "message" in message && Array.isArray(message.message?.content) && message.message.content.some((block2) => block2.type === "tool_use" && block2.name === "TodoWrite"))
        lastTodoWriteIndex = i5;
      if (lastTodoWriteIndex === -1)
        assistantTurnsSinceWrite++;
      if (lastReminderIndex === -1)
        assistantTurnsSinceReminder++;
    } else if (lastReminderIndex === -1 && message?.type === "attachment" && message.attachment.type === "todo_reminder")
      lastReminderIndex = i5;
    if (lastTodoWriteIndex !== -1 && lastReminderIndex !== -1)
      break;
  }
  return {
    turnsSinceLastTodoWrite: assistantTurnsSinceWrite,
    turnsSinceLastReminder: assistantTurnsSinceReminder
  };
}
