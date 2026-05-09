// function: hasToolResultContent
function hasToolResultContent(content) {
  return Array.isArray(content) && content.some(isToolResultBlock);
}
