// function: stripToolReferenceBlocksFromUserMessage
function stripToolReferenceBlocksFromUserMessage(message) {
  let content = message.message.content;
  if (!Array.isArray(content))
    return message;
  if (!content.some((block2) => block2.type === "tool_result" && Array.isArray(block2.content) && block2.content.some(isToolReferenceBlock)))
    return message;
  return {
    ...message,
    message: {
      ...message.message,
      content: content.map((block2) => {
        if (block2.type !== "tool_result" || !Array.isArray(block2.content))
          return block2;
        let filteredContent = block2.content.filter((c3) => !isToolReferenceBlock(c3));
        if (filteredContent.length === 0)
          return {
            ...block2,
            content: [
              {
                type: "text",
                text: "[Tool references removed - tool search not enabled]"
              }
            ]
          };
        return {
          ...block2,
          content: filteredContent
        };
      })
    }
  };
}
