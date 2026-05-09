// function: stripExcessMediaItems
function stripExcessMediaItems(messages, limit) {
  let toRemove = 0;
  for (let msg of messages) {
    if (!Array.isArray(msg.message.content))
      continue;
    for (let block2 of msg.message.content) {
      if (isMedia(block2))
        toRemove++;
      if (isToolResult(block2) && Array.isArray(block2.content)) {
        for (let nested of block2.content)
          if (isMedia(nested))
            toRemove++;
      }
    }
  }
  if (toRemove -= limit, toRemove <= 0)
    return messages;
  return messages.map((msg) => {
    if (toRemove <= 0)
      return msg;
    let content = msg.message.content;
    if (!Array.isArray(content))
      return msg;
    let before2 = toRemove, stripped = content.map((block2) => {
      if (toRemove <= 0 || !isToolResult(block2) || !Array.isArray(block2.content))
        return block2;
      let filtered = block2.content.filter((n6) => {
        if (toRemove > 0 && isMedia(n6))
          return toRemove--, !1;
        return !0;
      });
      return filtered.length === block2.content.length ? block2 : { ...block2, content: filtered };
    }).filter((block2) => {
      if (toRemove > 0 && isMedia(block2))
        return toRemove--, !1;
      return !0;
    });
    return before2 === toRemove ? msg : {
      ...msg,
      message: { ...msg.message, content: stripped }
    };
  });
}
