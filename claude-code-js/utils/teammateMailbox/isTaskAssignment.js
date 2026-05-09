// function: isTaskAssignment
function isTaskAssignment(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (parsed && parsed.type === "task_assignment")
      return parsed;
  } catch {}
  return null;
}
