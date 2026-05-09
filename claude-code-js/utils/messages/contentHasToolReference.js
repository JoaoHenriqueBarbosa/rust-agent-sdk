// function: contentHasToolReference
function contentHasToolReference(content) {
  return content.some((block2) => block2.type === "tool_result" && Array.isArray(block2.content) && block2.content.some(isToolReferenceBlock));
}
