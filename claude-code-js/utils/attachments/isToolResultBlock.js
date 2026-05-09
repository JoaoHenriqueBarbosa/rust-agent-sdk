// function: isToolResultBlock
function isToolResultBlock(b) {
  return typeof b === "object" && b !== null && b.type === "tool_result" && typeof b.tool_use_id === "string";
}
