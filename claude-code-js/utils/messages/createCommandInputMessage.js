// function: createCommandInputMessage
function createCommandInputMessage(content) {
  return {
    type: "system",
    subtype: "local_command",
    content,
    level: "info",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22(),
    isMeta: !1
  };
}
