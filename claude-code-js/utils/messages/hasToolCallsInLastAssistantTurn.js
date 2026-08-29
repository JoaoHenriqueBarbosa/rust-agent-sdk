// function: hasToolCallsInLastAssistantTurn
function hasToolCallsInLastAssistantTurn(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message && message.type === "assistant") {
      let content = message.message.content;
      if (Array.isArray(content))
        return content.some((block2) => block2.type === "tool_use");
    }
  }
  return !1;
}
