// function: createAgentsKilledMessage
function createAgentsKilledMessage() {
  return {
    type: "system",
    subtype: "agents_killed",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22(),
    isMeta: !1
  };
}
