// function: processUserMessage
function processUserMessage(msg, breakdown, toolUseIdToName) {
  if (typeof msg.message.content === "string") {
    let tokens = roughTokenCountEstimation(msg.message.content);
    breakdown.userMessageTokens += tokens;
    return;
  }
  for (let block2 of msg.message.content) {
    let blockStr = jsonStringify(block2), blockTokens = roughTokenCountEstimation(blockStr);
    if ("type" in block2 && block2.type === "tool_result") {
      breakdown.toolResultTokens += blockTokens;
      let toolUseId = "tool_use_id" in block2 ? block2.tool_use_id : void 0, toolName = (toolUseId ? toolUseIdToName.get(toolUseId) : void 0) || "unknown";
      breakdown.toolResultsByType.set(toolName, (breakdown.toolResultsByType.get(toolName) || 0) + blockTokens);
    } else
      breakdown.userMessageTokens += blockTokens;
  }
}
