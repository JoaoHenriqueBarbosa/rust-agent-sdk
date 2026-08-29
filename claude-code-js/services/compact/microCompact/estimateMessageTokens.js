// function: estimateMessageTokens
function estimateMessageTokens(messages) {
  let totalTokens = 0;
  for (let message of messages) {
    if (message.type !== "user" && message.type !== "assistant")
      continue;
    if (!Array.isArray(message.message.content))
      continue;
    for (let block of message.message.content)
      if (block.type === "text")
        totalTokens += roughTokenCountEstimation(block.text);
      else if (block.type === "tool_result")
        totalTokens += calculateToolResultTokens(block);
      else if (block.type === "image" || block.type === "document")
        totalTokens += IMAGE_MAX_TOKEN_SIZE;
      else if (block.type === "thinking")
        totalTokens += roughTokenCountEstimation(block.thinking);
      else if (block.type === "redacted_thinking")
        totalTokens += roughTokenCountEstimation(block.data);
      else if (block.type === "tool_use")
        totalTokens += roughTokenCountEstimation(block.name + jsonStringify(block.input ?? {}));
      else
        totalTokens += roughTokenCountEstimation(jsonStringify(block));
  }
  return Math.ceil(totalTokens * 1.3333333333333333);
}
