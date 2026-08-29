// function: filterUnresolvedToolUses
function filterUnresolvedToolUses(messages) {
  let toolUseIds = /* @__PURE__ */ new Set, toolResultIds = /* @__PURE__ */ new Set;
  for (let msg of messages) {
    if (msg.type !== "user" && msg.type !== "assistant")
      continue;
    let content = msg.message.content;
    if (!Array.isArray(content))
      continue;
    for (let block2 of content) {
      if (block2.type === "tool_use")
        toolUseIds.add(block2.id);
      if (block2.type === "tool_result")
        toolResultIds.add(block2.tool_use_id);
    }
  }
  let unresolvedIds = new Set([...toolUseIds].filter((id) => !toolResultIds.has(id)));
  if (unresolvedIds.size === 0)
    return messages;
  return messages.filter((msg) => {
    if (msg.type !== "assistant")
      return !0;
    let content = msg.message.content;
    if (!Array.isArray(content))
      return !0;
    let toolUseBlockIds = [];
    for (let b of content)
      if (b.type === "tool_use")
        toolUseBlockIds.push(b.id);
    if (toolUseBlockIds.length === 0)
      return !0;
    return !toolUseBlockIds.every((id) => unresolvedIds.has(id));
  });
}
