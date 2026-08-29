// function: getUserMessageText
function getUserMessageText(message) {
  if (message.type !== "user")
    return null;
  let content = message.message.content;
  return getContentText(content);
}
