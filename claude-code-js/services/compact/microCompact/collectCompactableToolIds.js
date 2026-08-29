// function: collectCompactableToolIds
function collectCompactableToolIds(messages) {
  let ids = [];
  for (let message of messages)
    if (message.type === "assistant" && Array.isArray(message.message.content)) {
      for (let block of message.message.content)
        if (block.type === "tool_use" && COMPACTABLE_TOOLS.has(block.name))
          ids.push(block.id);
    }
  return ids;
}
