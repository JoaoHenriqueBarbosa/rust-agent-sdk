// function: getTotalCacheReadInputTokens
function getTotalCacheReadInputTokens() {
  return sumBy_default(Object.values(STATE.modelUsage), "cacheReadInputTokens");
}
