// function: isNotEmptyMessage
function isNotEmptyMessage(message) {
  if (message.type === "progress" || message.type === "attachment" || message.type === "system")
    return !0;
  if (typeof message.message.content === "string")
    return message.message.content.trim().length > 0;
  if (message.message.content.length === 0)
    return !1;
  if (message.message.content.length > 1)
    return !0;
  if (message.message.content[0].type !== "text")
    return !0;
  return message.message.content[0].text.trim().length > 0 && message.message.content[0].text !== NO_CONTENT_MESSAGE && message.message.content[0].text !== INTERRUPT_MESSAGE_FOR_TOOL_USE;
}
