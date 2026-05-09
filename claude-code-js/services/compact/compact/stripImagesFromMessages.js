// function: stripImagesFromMessages
function stripImagesFromMessages(messages) {
  return messages.map((message) => {
    if (message.type !== "user")
      return message;
    let content = message.message.content;
    if (!Array.isArray(content))
      return message;
    let hasMediaBlock = !1, newContent = content.flatMap((block2) => {
      if (block2.type === "image")
        return hasMediaBlock = !0, [{ type: "text", text: "[image]" }];
      if (block2.type === "document")
        return hasMediaBlock = !0, [{ type: "text", text: "[document]" }];
      if (block2.type === "tool_result" && Array.isArray(block2.content)) {
        let toolHasMedia = !1, newToolContent = block2.content.map((item) => {
          if (item.type === "image")
            return toolHasMedia = !0, { type: "text", text: "[image]" };
          if (item.type === "document")
            return toolHasMedia = !0, { type: "text", text: "[document]" };
          return item;
        });
        if (toolHasMedia)
          return hasMediaBlock = !0, [{ ...block2, content: newToolContent }];
      }
      return [block2];
    });
    if (!hasMediaBlock)
      return message;
    return {
      ...message,
      message: {
        ...message.message,
        content: newContent
      }
    };
  });
}
