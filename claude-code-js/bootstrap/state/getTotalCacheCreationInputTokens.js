// function: getTotalCacheCreationInputTokens
function getTotalCacheCreationInputTokens() {
  return sumBy_default(Object.values(STATE.modelUsage), "cacheCreationInputTokens");
}
