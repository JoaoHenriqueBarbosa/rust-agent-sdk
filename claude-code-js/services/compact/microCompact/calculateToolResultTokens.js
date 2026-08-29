// function: calculateToolResultTokens
function calculateToolResultTokens(block) {
  if (!block.content)
    return 0;
  if (typeof block.content === "string")
    return roughTokenCountEstimation(block.content);
  return block.content.reduce((sum, item) => {
    if (item.type === "text")
      return sum + roughTokenCountEstimation(item.text);
    else if (item.type === "image" || item.type === "document")
      return sum + IMAGE_MAX_TOKEN_SIZE;
    return sum;
  }, 0);
}
