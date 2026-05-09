// function: addToTotalDurationState
function addToTotalDurationState(duration, durationWithoutRetries) {
  STATE.totalAPIDuration += duration, STATE.totalAPIDurationWithoutRetries += durationWithoutRetries;
}
