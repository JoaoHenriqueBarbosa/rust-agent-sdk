// function: hoistToolResults
function hoistToolResults(content) {
  let toolResults = [], otherBlocks = [];
  for (let block2 of content)
    if (block2.type === "tool_result")
      toolResults.push(block2);
    else
      otherBlocks.push(block2);
  return [...toolResults, ...otherBlocks];
}
