// function: mergeAssistantMessages
function mergeAssistantMessages(a2, b) {
  return {
    ...a2,
    message: {
      ...a2.message,
      content: [...a2.message.content, ...b.message.content]
    }
  };
}
