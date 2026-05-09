// function: getPreviousRequestIdFromMessages
function getPreviousRequestIdFromMessages(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (msg.type === "assistant" && msg.requestId)
      return msg.requestId;
  }
  return;
}
