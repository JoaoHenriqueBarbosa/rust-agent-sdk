// function: profileCheckpoint
function profileCheckpoint(name) {
  if (!SHOULD_PROFILE)
    return;
  if (getPerformance().mark(name), DETAILED_PROFILING)
    memorySnapshots.push(process.memoryUsage());
}
