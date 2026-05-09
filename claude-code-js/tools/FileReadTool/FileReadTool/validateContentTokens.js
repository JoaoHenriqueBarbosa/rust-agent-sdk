// function: validateContentTokens
async function validateContentTokens(content, ext, maxTokens) {
  let effectiveMaxTokens = maxTokens ?? getDefaultFileReadingLimits().maxTokens, tokenEstimate = roughTokenCountEstimationForFileType(content, ext);
  if (!tokenEstimate || tokenEstimate <= effectiveMaxTokens / 4)
    return;
  let effectiveCount = await countTokensWithAPI(content) ?? tokenEstimate;
  if (effectiveCount > effectiveMaxTokens)
    throw new MaxFileReadTokenExceededError(effectiveCount, effectiveMaxTokens);
}
