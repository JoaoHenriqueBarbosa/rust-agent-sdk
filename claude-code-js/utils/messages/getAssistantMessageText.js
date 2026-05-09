// function: getAssistantMessageText
function getAssistantMessageText(message) {
  if (message.type !== "assistant")
    return null;
  if (Array.isArray(message.message.content))
    return message.message.content.filter((block2) => block2.type === "text").map((block2) => block2.type === "text" ? block2.text : "").join(`
`).trim() || null;
  return null;
}
