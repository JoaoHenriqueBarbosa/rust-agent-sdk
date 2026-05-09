// function: stripSignatureBlocks
function stripSignatureBlocks(messages) {
  let changed = !1, result = messages.map((msg) => {
    if (msg.type !== "assistant")
      return msg;
    let content = msg.message.content;
    if (!Array.isArray(content))
      return msg;
    let filtered = content.filter((block2) => {
      if (isThinkingBlock(block2))
        return !1;
      return !0;
    });
    if (filtered.length === content.length)
      return msg;
    return changed = !0, {
      ...msg,
      message: { ...msg.message, content: filtered }
    };
  });
  return changed ? result : messages;
}
