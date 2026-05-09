// function: isCompactBoundaryMessage
function isCompactBoundaryMessage(message) {
  return message?.type === "system" && message.subtype === "compact_boundary";
}
