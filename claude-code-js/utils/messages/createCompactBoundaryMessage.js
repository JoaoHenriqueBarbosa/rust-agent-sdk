// function: createCompactBoundaryMessage
function createCompactBoundaryMessage(trigger, preTokens, lastPreCompactMessageUuid, userContext, messagesSummarized) {
  return {
    type: "system",
    subtype: "compact_boundary",
    content: "Conversation compacted",
    isMeta: !1,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22(),
    level: "info",
    compactMetadata: {
      trigger,
      preTokens,
      userContext,
      messagesSummarized
    },
    ...lastPreCompactMessageUuid && {
      logicalParentUuid: lastPreCompactMessageUuid
    }
  };
}
