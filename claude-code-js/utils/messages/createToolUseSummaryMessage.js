// function: createToolUseSummaryMessage
function createToolUseSummaryMessage(summary, precedingToolUseIds) {
  return {
    type: "tool_use_summary",
    summary,
    precedingToolUseIds,
    uuid: randomUUID22(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
