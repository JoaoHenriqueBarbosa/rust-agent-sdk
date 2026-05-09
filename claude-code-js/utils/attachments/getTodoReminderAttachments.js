// function: getTodoReminderAttachments
async function getTodoReminderAttachments(messages, toolUseContext) {
  if (!toolUseContext.options.tools.some((t2) => toolMatchesName(t2, TODO_WRITE_TOOL_NAME)))
    return [];
  if (BRIEF_TOOL_NAME5 && toolUseContext.options.tools.some((t2) => toolMatchesName(t2, BRIEF_TOOL_NAME5)))
    return [];
  if (!messages || messages.length === 0)
    return [];
  let { turnsSinceLastTodoWrite, turnsSinceLastReminder } = getTodoReminderTurnCounts(messages);
  if (turnsSinceLastTodoWrite >= TODO_REMINDER_CONFIG.TURNS_SINCE_WRITE && turnsSinceLastReminder >= TODO_REMINDER_CONFIG.TURNS_BETWEEN_REMINDERS) {
    let todoKey = toolUseContext.agentId ?? getSessionId(), todos = toolUseContext.getAppState().todos[todoKey] ?? [];
    return [
      {
        type: "todo_reminder",
        content: todos,
        itemCount: todos.length
      }
    ];
  }
  return [];
}
