// function: waitForTaskCompletion
async function waitForTaskCompletion(taskId, getAppState, timeoutMs, abortController) {
  let startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (abortController?.signal.aborted)
      throw new AbortError;
    let task = getAppState().tasks?.[taskId];
    if (!task)
      return null;
    if (task.status !== "running" && task.status !== "pending")
      return task;
    await sleep3(100);
  }
  return getAppState().tasks?.[taskId] ?? null;
}
