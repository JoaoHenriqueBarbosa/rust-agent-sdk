// function: stripUnavailableToolReferencesFromUserMessage
function stripUnavailableToolReferencesFromUserMessage(message, availableToolNames) {
  let content = message.message.content;
  if (!Array.isArray(content))
    return message;
  if (!content.some((block2) => block2.type === "tool_result" && Array.isArray(block2.content) && block2.content.some((c3) => {
    if (!isToolReferenceBlock(c3))
      return !1;
    let toolName = c3.tool_name;
    return toolName && !availableToolNames.has(normalizeLegacyToolName(toolName));
  })))
    return message;
  return {
    ...message,
    message: {
      ...message.message,
      content: content.map((block2) => {
        if (block2.type !== "tool_result" || !Array.isArray(block2.content))
          return block2;
        let filteredContent = block2.content.filter((c3) => {
          if (!isToolReferenceBlock(c3))
            return !0;
          let rawToolName = c3.tool_name;
          if (!rawToolName)
            return !0;
          let toolName = normalizeLegacyToolName(rawToolName), isAvailable = availableToolNames.has(toolName);
          if (!isAvailable)
            logForDebugging(`Filtering out tool_reference for unavailable tool: ${toolName}`, { level: "warn" });
          return isAvailable;
        });
        if (filteredContent.length === 0)
          return {
            ...block2,
            content: [
              {
                type: "text",
                text: "[Tool references removed - tools no longer available]"
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
