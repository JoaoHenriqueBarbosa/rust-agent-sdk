// function: createProgressMessage
function createProgressMessage({
  toolUseID,
  parentToolUseID,
  data
}) {
  return {
    type: "progress",
    data,
    toolUseID,
    parentToolUseID,
    uuid: randomUUID22(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
