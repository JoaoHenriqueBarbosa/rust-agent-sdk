// function: isToolResultMessage
function isToolResultMessage(msg) {
  if (msg.type !== "user")
    return !1;
  let content = msg.message.content;
  if (typeof content === "string")
    return !1;
  return content.some((block2) => block2.type === "tool_result");
}
