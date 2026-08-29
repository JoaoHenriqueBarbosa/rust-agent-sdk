// function: addToToolDuration
function addToToolDuration(duration) {
  STATE.totalToolDuration += duration, STATE.turnToolDurationMs += duration, STATE.turnToolCount++;
}
