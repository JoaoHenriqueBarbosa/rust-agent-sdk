// function: adjustParamsForNonStreaming
function adjustParamsForNonStreaming(params, maxTokensCap) {
  let cappedMaxTokens = Math.min(params.max_tokens, maxTokensCap), adjustedParams = { ...params };
  if (adjustedParams.thinking?.type === "enabled" && adjustedParams.thinking.budget_tokens)
    adjustedParams.thinking = {
      ...adjustedParams.thinking,
      budget_tokens: Math.min(adjustedParams.thinking.budget_tokens, cappedMaxTokens - 1)
    };
  return {
    ...adjustedParams,
    max_tokens: cappedMaxTokens
  };
}
