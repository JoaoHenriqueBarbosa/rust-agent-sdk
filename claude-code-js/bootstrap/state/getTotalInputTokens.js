// function: getTotalInputTokens
function getTotalInputTokens() {
  return sumBy_default(Object.values(STATE.modelUsage), "inputTokens");
}
