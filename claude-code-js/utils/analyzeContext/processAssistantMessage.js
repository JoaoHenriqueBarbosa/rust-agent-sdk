// function: processAssistantMessage
function processAssistantMessage(msg, breakdown) {
  for (let block2 of msg.message.content) {
    let blockStr = jsonStringify(block2), blockTokens = roughTokenCountEstimation(blockStr);
    if ("type" in block2 && block2.type === "tool_use") {
      breakdown.toolCallTokens += blockTokens;
      let toolName = ("name" in block2 ? block2.name : void 0) || "unknown";
      breakdown.toolCallsByType.set(toolName, (breakdown.toolCallsByType.get(toolName) || 0) + blockTokens);
    } else
      breakdown.assistantMessageTokens += blockTokens;
  }
}
