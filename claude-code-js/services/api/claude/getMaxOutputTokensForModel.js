// function: getMaxOutputTokensForModel
function getMaxOutputTokensForModel(model) {
  let maxOutputTokens = getModelMaxOutputTokens(model), defaultTokens = isMaxTokensCapEnabled() ? Math.min(maxOutputTokens.default, CAPPED_DEFAULT_MAX_TOKENS) : maxOutputTokens.default;
  return validateBoundedIntEnvVar("CLAUDE_CODE_MAX_OUTPUT_TOKENS", process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS, defaultTokens, maxOutputTokens.upperLimit).effective;
}
