// function: updateTaskState2
function updateTaskState2(taskId, updater, setAppState) {
  setAppState((prev) => {
    let task = prev.tasks[taskId];
    if (!task || task.type !== "in_process_teammate")
      return prev;
    let updated = updater(task);
    if (updated === task)
      return prev;
    return {
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: updated
      }
    };
  });
}
