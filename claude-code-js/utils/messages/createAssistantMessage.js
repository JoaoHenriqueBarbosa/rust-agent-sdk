// function: createAssistantMessage
function createAssistantMessage({
  content,
  usage,
  isVirtual
}) {
  return baseCreateAssistantMessage({
    content: typeof content === "string" ? [
      {
        type: "text",
        text: content === "" ? NO_CONTENT_MESSAGE : content
      }
    ] : content,
    usage,
    isVirtual
  });
}
