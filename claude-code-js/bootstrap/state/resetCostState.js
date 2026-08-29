// function: resetCostState
function resetCostState() {
  STATE.totalCostUSD = 0, STATE.totalAPIDuration = 0, STATE.totalAPIDurationWithoutRetries = 0, STATE.totalToolDuration = 0, STATE.startTime = Date.now(), STATE.totalLinesAdded = 0, STATE.totalLinesRemoved = 0, STATE.hasUnknownModelCost = !1, STATE.modelUsage = {}, STATE.promptId = null;
}
