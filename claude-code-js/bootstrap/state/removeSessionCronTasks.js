// function: removeSessionCronTasks
function removeSessionCronTasks(ids) {
  if (ids.length === 0)
    return 0;
  let idSet = new Set(ids), remaining = STATE.sessionCronTasks.filter((t) => !idSet.has(t.id)), removed = STATE.sessionCronTasks.length - remaining.length;
  if (removed === 0)
    return 0;
  return STATE.sessionCronTasks = remaining, removed;
}
