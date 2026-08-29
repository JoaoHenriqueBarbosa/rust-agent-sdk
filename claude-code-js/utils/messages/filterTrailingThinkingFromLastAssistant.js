// function: filterTrailingThinkingFromLastAssistant
function filterTrailingThinkingFromLastAssistant(messages) {
  let lastMessage = messages.at(-1);
  if (!lastMessage || lastMessage.type !== "assistant")
    return messages;
  let content = lastMessage.message.content, lastBlock = content.at(-1);
  if (!lastBlock || !isThinkingBlock(lastBlock))
    return messages;
  let lastValidIndex = content.length - 1;
  while (lastValidIndex >= 0) {
    let block2 = content[lastValidIndex];
    if (!block2 || !isThinkingBlock(block2))
      break;
    lastValidIndex--;
  }
  logEvent("tengu_filtered_trailing_thinking_block", {
    messageUUID: lastMessage.uuid,
    blocksRemoved: content.length - lastValidIndex - 1,
    remainingBlocks: lastValidIndex + 1
  });
  let filteredContent = lastValidIndex < 0 ? [{ type: "text", text: "[No message content]", citations: [] }] : content.slice(0, lastValidIndex + 1), result = [...messages];
  return result[messages.length - 1] = {
    ...lastMessage,
    message: {
      ...lastMessage.message,
      content: filteredContent
    }
  }, result;
}
