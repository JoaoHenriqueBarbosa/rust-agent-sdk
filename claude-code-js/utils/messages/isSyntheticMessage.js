// function: isSyntheticMessage
function isSyntheticMessage(message) {
  return message.type !== "progress" && message.type !== "attachment" && message.type !== "system" && Array.isArray(message.message.content) && message.message.content[0]?.type === "text" && SYNTHETIC_MESSAGES.has(message.message.content[0].text);
}
