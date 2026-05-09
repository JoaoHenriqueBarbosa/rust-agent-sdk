// function: countToolCalls
function countToolCalls(messages, toolName, maxCount) {
  let count4 = 0;
  for (let msg of messages) {
    if (!msg)
      continue;
    if (msg.type === "assistant" && Array.isArray(msg.message.content)) {
      if (msg.message.content.some((block2) => block2.type === "tool_use" && block2.name === toolName)) {
        if (count4++, maxCount && count4 >= maxCount)
          return count4;
      }
    }
  }
  return count4;
}
