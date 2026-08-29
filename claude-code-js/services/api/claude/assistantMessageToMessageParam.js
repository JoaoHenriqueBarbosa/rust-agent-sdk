// function: assistantMessageToMessageParam
function assistantMessageToMessageParam(message, addCache = !1, enablePromptCaching, querySource) {
  if (addCache)
    if (typeof message.message.content === "string")
      return {
        role: "assistant",
        content: [
          {
            type: "text",
            text: message.message.content,
            ...enablePromptCaching && {
              cache_control: getCacheControl({ querySource })
            }
          }
        ]
      };
    else
      return {
        role: "assistant",
        content: message.message.content.map((_, i5) => ({
          ..._,
          ...i5 === message.message.content.length - 1 && _.type !== "thinking" && _.type !== "redacted_thinking" ? enablePromptCaching ? { cache_control: getCacheControl({ querySource }) } : {} : {}
        }))
      };
  return {
    role: "assistant",
    content: message.message.content
  };
}
