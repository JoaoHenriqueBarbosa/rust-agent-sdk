// function: getTaskReminderAttachments
async function getTaskReminderAttachments(messages, toolUseContext) {
  if (!isTodoV2Enabled())
    return [];
  if (BRIEF_TOOL_NAME5 && toolUseContext.options.tools.some((t2) => toolMatchesName(t2, BRIEF_TOOL_NAME5)))
    return [];
  if (!toolUseContext.options.tools.some((t2) => toolMatchesName(t2, TASK_UPDATE_TOOL_NAME)))
    return [];
  if (!messages || messages.length === 0)
    return [];
  let { turnsSinceLastTaskManagement, turnsSinceLastReminder } = getTaskReminderTurnCounts(messages);
  if (turnsSinceLastTaskManagement >= TODO_REMINDER_CONFIG.TURNS_SINCE_WRITE && turnsSinceLastReminder >= TODO_REMINDER_CONFIG.TURNS_BETWEEN_REMINDERS) {
    let tasks = await listTasks(getTaskListId());
    return [
      {
        type: "task_reminder",
        content: tasks,
        itemCount: tasks.length
      }
    ];
  }
  return [];
}
