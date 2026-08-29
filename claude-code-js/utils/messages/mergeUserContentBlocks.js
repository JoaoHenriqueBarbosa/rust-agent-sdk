// function: mergeUserContentBlocks
function mergeUserContentBlocks(a2, b) {
  let lastBlock = last_default(a2);
  if (lastBlock?.type !== "tool_result")
    return [...a2, ...b];
  if (typeof lastBlock.content === "string" && b.every((x4) => x4.type === "text")) {
    let copy = a2.slice();
    return copy[copy.length - 1] = smooshIntoToolResult(lastBlock, b), copy;
  }
  return [...a2, ...b];
}
