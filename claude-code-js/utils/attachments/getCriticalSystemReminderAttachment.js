// function: getCriticalSystemReminderAttachment
function getCriticalSystemReminderAttachment(toolUseContext) {
  let reminder = toolUseContext.criticalSystemReminder_EXPERIMENTAL;
  if (!reminder)
    return [];
  return [{ type: "critical_system_reminder", content: reminder }];
}
