// function: isToolResultBlock2
function isToolResultBlock2(block2) {
  return block2 !== null && typeof block2 === "object" && "type" in block2 && block2.type === "tool_result" && "tool_use_id" in block2;
}
