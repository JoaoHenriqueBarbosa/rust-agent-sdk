// function: getTotalWebSearchRequests
function getTotalWebSearchRequests() {
  return sumBy_default(Object.values(STATE.modelUsage), "webSearchRequests");
}
