// function: createUserMessage
function createUserMessage({
  content,
  isMeta,
  isVisibleInTranscriptOnly,
  isVirtual,
  isCompactSummary,
  summarizeMetadata,
  toolUseResult,
  mcpMeta,
  uuid: uuid8,
  timestamp,
  imagePasteIds,
  sourceToolAssistantUUID,
  permissionMode,
  origin: origin2
}) {
  return {
    type: "user",
    message: {
      role: "user",
      content: content || NO_CONTENT_MESSAGE
    },
    isMeta,
    isVisibleInTranscriptOnly,
    isVirtual,
    isCompactSummary,
    summarizeMetadata,
    uuid: uuid8 || randomUUID22(),
    timestamp: timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
    toolUseResult,
    mcpMeta,
    imagePasteIds,
    sourceToolAssistantUUID,
    permissionMode,
    origin: origin2
  };
}
