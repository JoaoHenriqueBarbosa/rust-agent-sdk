// function: findAvailableTask
function findAvailableTask(tasks) {
  let unresolvedTaskIds = new Set(tasks.filter((t2) => t2.status !== "completed").map((t2) => t2.id));
  return tasks.find((task) => {
    if (task.status !== "pending")
      return !1;
    if (task.owner)
      return !1;
    return task.blockedBy.every((id) => !unresolvedTaskIds.has(id));
  });
}
