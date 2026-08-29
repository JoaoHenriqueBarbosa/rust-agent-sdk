// function: createTurnDurationMessage
function createTurnDurationMessage(durationMs, budget, messageCount) {
  return {
    type: "system",
    subtype: "turn_duration",
    durationMs,
    budgetTokens: budget?.tokens,
    budgetLimit: budget?.limit,
    budgetNudges: budget?.nudges,
    messageCount,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22(),
    isMeta: !1
  };
}
