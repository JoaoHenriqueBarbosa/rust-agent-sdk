// function: createSystemMessage
function createSystemMessage(content, level, toolUseID, preventContinuation) {
  return {
    type: "system",
    subtype: "informational",
    content,
    isMeta: !1,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22(),
    toolUseID,
    level,
    ...preventContinuation && { preventContinuation }
  };
}
