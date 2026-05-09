// function: addToTotalCostState
function addToTotalCostState(cost, modelUsage, model) {
  STATE.modelUsage[model] = modelUsage, STATE.totalCostUSD += cost;
}
