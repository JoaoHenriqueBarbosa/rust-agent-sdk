// function: extractSearchableText
function extractSearchableText(message) {
  if (message.type !== "user" && message.type !== "assistant")
    return "";
  let content = "message" in message ? message.message?.content : void 0;
  if (!content)
    return "";
  if (typeof content === "string")
    return content;
  if (Array.isArray(content))
    return content.map((block2) => {
      if (typeof block2 === "string")
        return block2;
      if ("text" in block2 && typeof block2.text === "string")
        return block2.text;
      return "";
    }).filter(Boolean).join(" ");
  return "";
}
