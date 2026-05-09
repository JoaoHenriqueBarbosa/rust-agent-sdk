// function: userMessageToMessageParam
function userMessageToMessageParam(message, addCache = !1, enablePromptCaching, querySource) {
  if (addCache)
    if (typeof message.message.content === "string")
      return {
        role: "user",
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
        role: "user",
        content: message.message.content.map((_, i5) => ({
          ..._,
          ...i5 === message.message.content.length - 1 ? enablePromptCaching ? { cache_control: getCacheControl({ querySource }) } : {} : {}
        }))
      };
  return {
    role: "user",
    content: Array.isArray(message.message.content) ? [...message.message.content] : message.message.content
  };
}
