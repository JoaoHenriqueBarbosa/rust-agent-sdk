// function: getTotalOutputTokens
function getTotalOutputTokens() {
  return sumBy_default(Object.values(STATE.modelUsage), "outputTokens");
}
