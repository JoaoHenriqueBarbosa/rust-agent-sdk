// function: setCostStateForRestore
function setCostStateForRestore({
  totalCostUSD,
  totalAPIDuration,
  totalAPIDurationWithoutRetries,
  totalToolDuration,
  totalLinesAdded,
  totalLinesRemoved,
  lastDuration,
  modelUsage
}) {
  if (STATE.totalCostUSD = totalCostUSD, STATE.totalAPIDuration = totalAPIDuration, STATE.totalAPIDurationWithoutRetries = totalAPIDurationWithoutRetries, STATE.totalToolDuration = totalToolDuration, STATE.totalLinesAdded = totalLinesAdded, STATE.totalLinesRemoved = totalLinesRemoved, modelUsage)
    STATE.modelUsage = modelUsage;
  if (lastDuration)
    STATE.startTime = Date.now() - lastDuration;
}
