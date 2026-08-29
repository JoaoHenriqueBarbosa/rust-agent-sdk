// function: reorderAttachmentsForAPI
function reorderAttachmentsForAPI(messages) {
  let result = [], pendingAttachments = [];
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message.type === "attachment")
      pendingAttachments.push(message);
    else if ((message.type === "assistant" || message.type === "user" && Array.isArray(message.message.content) && message.message.content[0]?.type === "tool_result") && pendingAttachments.length > 0) {
      for (let j4 = 0;j4 < pendingAttachments.length; j4++)
        result.push(pendingAttachments[j4]);
      result.push(message), pendingAttachments.length = 0;
    } else
      result.push(message);
  }
  for (let j4 = 0;j4 < pendingAttachments.length; j4++)
    result.push(pendingAttachments[j4]);
  return result.reverse(), result;
}
