// function: getLastAssistantMessage
function getLastAssistantMessage(messages) {
  return messages.findLast((msg) => msg.type === "assistant");
}
