// function: getToolUseID
function getToolUseID(message) {
  switch (message.type) {
    case "attachment":
      if (isHookAttachmentMessage(message))
        return message.attachment.toolUseID;
      return null;
    case "assistant":
      if (message.message.content[0]?.type !== "tool_use")
        return null;
      return message.message.content[0].id;
    case "user":
      if (message.sourceToolUseID)
        return message.sourceToolUseID;
      if (message.message.content[0]?.type !== "tool_result")
        return null;
      return message.message.content[0].tool_use_id;
    case "progress":
      return message.toolUseID;
    case "system":
      return message.subtype === "informational" ? message.toolUseID ?? null : null;
  }
}
