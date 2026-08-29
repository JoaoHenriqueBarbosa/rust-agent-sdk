// function: getSearchOrReadInfo
function getSearchOrReadInfo(progressMessage, tools, toolUseByID) {
  if (!hasProgressMessage(progressMessage.data))
    return null;
  let message = progressMessage.data.message;
  if (message.type === "assistant")
    return getSearchOrReadFromContent(message.message.content[0], tools);
  if (message.type === "user") {
    let content = message.message.content[0];
    if (content?.type === "tool_result") {
      let toolUse = toolUseByID.get(content.tool_use_id);
      if (toolUse)
        return getSearchOrReadFromContent(toolUse, tools);
    }
  }
  return null;
}
