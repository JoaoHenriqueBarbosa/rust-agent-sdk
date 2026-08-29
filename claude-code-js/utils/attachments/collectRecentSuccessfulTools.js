// function: collectRecentSuccessfulTools
function collectRecentSuccessfulTools(messages, lastUserMessage) {
  let useIdToName = /* @__PURE__ */ new Map, resultByUseId = /* @__PURE__ */ new Map;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let m4 = messages[i5];
    if (!m4)
      continue;
    if (isHumanTurn(m4) && m4 !== lastUserMessage)
      break;
    if (m4.type === "assistant" && typeof m4.message.content !== "string") {
      for (let block2 of m4.message.content)
        if (block2.type === "tool_use")
          useIdToName.set(block2.id, block2.name);
    } else if (m4.type === "user" && "message" in m4 && Array.isArray(m4.message.content)) {
      for (let block2 of m4.message.content)
        if (isToolResultBlock(block2))
          resultByUseId.set(block2.tool_use_id, block2.is_error === !0);
    }
  }
  let failed = /* @__PURE__ */ new Set, succeeded = /* @__PURE__ */ new Set;
  for (let [id, name3] of useIdToName) {
    let errored = resultByUseId.get(id);
    if (errored === void 0)
      continue;
    if (errored)
      failed.add(name3);
    else
      succeeded.add(name3);
  }
  return [...succeeded].filter((t2) => !failed.has(t2));
}
