// function: createMemorySavedMessage
function createMemorySavedMessage(writtenPaths) {
  return {
    type: "system",
    subtype: "memory_saved",
    writtenPaths,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22(),
    isMeta: !1
  };
}
