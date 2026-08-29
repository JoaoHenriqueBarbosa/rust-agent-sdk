// function: getSelectableBackgroundTasks
function getSelectableBackgroundTasks(tasks, foregroundedTaskId) {
  return Object.values(tasks ?? {}).filter(isBackgroundTask).filter((task) => !(task.type === "local_agent" && task.id === foregroundedTaskId));
}
