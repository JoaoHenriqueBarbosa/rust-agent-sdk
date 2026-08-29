// function: truncateToTokens
function truncateToTokens(content, maxTokens) {
  if (roughTokenCountEstimation(content) <= maxTokens)
    return content;
  let charBudget = maxTokens * 4 - SKILL_TRUNCATION_MARKER.length;
  return content.slice(0, charBudget) + SKILL_TRUNCATION_MARKER;
}
