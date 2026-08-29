// function: sanitizeErrorToolResultContent
function sanitizeErrorToolResultContent(messages) {
  return messages.map((msg) => {
    if (msg.type !== "user")
      return msg;
    let content = msg.message.content;
    if (!Array.isArray(content))
      return msg;
    let changed = !1, newContent = content.map((b) => {
      if (b.type !== "tool_result" || !b.is_error)
        return b;
      let trContent = b.content;
      if (!Array.isArray(trContent))
        return b;
      if (trContent.every((c3) => c3.type === "text"))
        return b;
      changed = !0;
      let texts = trContent.filter((c3) => c3.type === "text").map((c3) => c3.text), textOnly = texts.length > 0 ? [{ type: "text", text: texts.join(`

`) }] : [];
      return { ...b, content: textOnly };
    });
    if (!changed)
      return msg;
    return { ...msg, message: { ...msg.message, content: newContent } };
  });
}
