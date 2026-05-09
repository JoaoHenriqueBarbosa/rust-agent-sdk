// function: ensureNonEmptyAssistantContent
function ensureNonEmptyAssistantContent(messages) {
  if (messages.length === 0)
    return messages;
  let hasChanges = !1, result = messages.map((message, index) => {
    if (message.type !== "assistant")
      return message;
    if (index === messages.length - 1)
      return message;
    let content = message.message.content;
    if (Array.isArray(content) && content.length === 0)
      return hasChanges = !0, logEvent("tengu_fixed_empty_assistant_content", {
        messageUUID: message.uuid,
        messageIndex: index
      }), {
        ...message,
        message: {
          ...message.message,
          content: [
            { type: "text", text: NO_CONTENT_MESSAGE, citations: [] }
          ]
        }
      };
    return message;
  });
  return hasChanges ? result : messages;
}
