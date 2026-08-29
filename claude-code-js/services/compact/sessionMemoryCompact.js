// Original: src/services/compact/sessionMemoryCompact.ts
function setSessionMemoryCompactConfig(config10) {
  smCompactConfig = {
    ...smCompactConfig,
    ...config10
  };
}
function getSessionMemoryCompactConfig() {
  return { ...smCompactConfig };
}
async function initSessionMemoryCompactConfig() {
  if (configInitialized)
    return;
  configInitialized = !0, setSessionMemoryCompactConfig({ ...DEFAULT_SM_COMPACT_CONFIG });
}
function hasTextBlocks(message) {
  if (message.type === "assistant")
    return message.message.content.some((block2) => block2.type === "text");
  if (message.type === "user") {
    let content = message.message.content;
    if (typeof content === "string")
      return content.length > 0;
    if (Array.isArray(content))
      return content.some((block2) => block2.type === "text");
  }
  return !1;
}
function getToolResultIds(message) {
  if (message.type !== "user")
    return [];
  let content = message.message.content;
  if (!Array.isArray(content))
    return [];
  let ids = [];
  for (let block2 of content)
    if (block2.type === "tool_result")
      ids.push(block2.tool_use_id);
  return ids;
}
function hasToolUseWithIds(message, toolUseIds) {
  if (message.type !== "assistant")
    return !1;
  let content = message.message.content;
  if (!Array.isArray(content))
    return !1;
  return content.some((block2) => block2.type === "tool_use" && toolUseIds.has(block2.id));
}
function adjustIndexToPreserveAPIInvariants(messages, startIndex) {
  if (startIndex <= 0 || startIndex >= messages.length)
    return startIndex;
  let adjustedIndex = startIndex, allToolResultIds = [];
  for (let i5 = startIndex;i5 < messages.length; i5++)
    allToolResultIds.push(...getToolResultIds(messages[i5]));
  if (allToolResultIds.length > 0) {
    let toolUseIdsInKeptRange = /* @__PURE__ */ new Set;
    for (let i5 = adjustedIndex;i5 < messages.length; i5++) {
      let msg = messages[i5];
      if (msg.type === "assistant" && Array.isArray(msg.message.content)) {
        for (let block2 of msg.message.content)
          if (block2.type === "tool_use")
            toolUseIdsInKeptRange.add(block2.id);
      }
    }
    let neededToolUseIds = new Set(allToolResultIds.filter((id) => !toolUseIdsInKeptRange.has(id)));
    for (let i5 = adjustedIndex - 1;i5 >= 0 && neededToolUseIds.size > 0; i5--) {
      let message = messages[i5];
      if (hasToolUseWithIds(message, neededToolUseIds)) {
        if (adjustedIndex = i5, message.type === "assistant" && Array.isArray(message.message.content)) {
          for (let block2 of message.message.content)
            if (block2.type === "tool_use" && neededToolUseIds.has(block2.id))
              neededToolUseIds.delete(block2.id);
        }
      }
    }
  }
  let messageIdsInKeptRange = /* @__PURE__ */ new Set;
  for (let i5 = adjustedIndex;i5 < messages.length; i5++) {
    let msg = messages[i5];
    if (msg.type === "assistant" && msg.message.id)
      messageIdsInKeptRange.add(msg.message.id);
  }
  for (let i5 = adjustedIndex - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message.type === "assistant" && message.message.id && messageIdsInKeptRange.has(message.message.id))
      adjustedIndex = i5;
  }
  return adjustedIndex;
}
function calculateMessagesToKeepIndex(messages, lastSummarizedIndex) {
  if (messages.length === 0)
    return 0;
  let config10 = getSessionMemoryCompactConfig(), startIndex = lastSummarizedIndex >= 0 ? lastSummarizedIndex + 1 : messages.length, totalTokens = 0, textBlockMessageCount = 0;
  for (let i5 = startIndex;i5 < messages.length; i5++) {
    let msg = messages[i5];
    if (totalTokens += estimateMessageTokens([msg]), hasTextBlocks(msg))
      textBlockMessageCount++;
  }
  if (totalTokens >= config10.maxTokens)
    return adjustIndexToPreserveAPIInvariants(messages, startIndex);
  if (totalTokens >= config10.minTokens && textBlockMessageCount >= config10.minTextBlockMessages)
    return adjustIndexToPreserveAPIInvariants(messages, startIndex);
  let idx = messages.findLastIndex((m4) => isCompactBoundaryMessage(m4)), floor = idx === -1 ? 0 : idx + 1;
  for (let i5 = startIndex - 1;i5 >= floor; i5--) {
    let msg = messages[i5], msgTokens = estimateMessageTokens([msg]);
    if (totalTokens += msgTokens, hasTextBlocks(msg))
      textBlockMessageCount++;
    if (startIndex = i5, totalTokens >= config10.maxTokens)
      break;
    if (totalTokens >= config10.minTokens && textBlockMessageCount >= config10.minTextBlockMessages)
      break;
  }
  return adjustIndexToPreserveAPIInvariants(messages, startIndex);
}
function shouldUseSessionMemoryCompaction() {
  if (isEnvTruthy(process.env.ENABLE_CLAUDE_CODE_SM_COMPACT))
    return !0;
  if (isEnvTruthy(process.env.DISABLE_CLAUDE_CODE_SM_COMPACT))
    return !1;
  return !1;
}
function createCompactionResultFromSessionMemory(messages, sessionMemory, messagesToKeep, hookResults, transcriptPath, agentId) {
  let preCompactTokenCount = tokenCountFromLastAPIResponse(messages), boundaryMarker = createCompactBoundaryMessage("auto", preCompactTokenCount ?? 0, messages[messages.length - 1]?.uuid), preCompactDiscovered = extractDiscoveredToolNames(messages);
  if (preCompactDiscovered.size > 0)
    boundaryMarker.compactMetadata.preCompactDiscoveredTools = [
      ...preCompactDiscovered
    ].sort();
  let { truncatedContent, wasTruncated } = truncateSessionMemoryForCompact(sessionMemory), summaryContent = getCompactUserSummaryMessage(truncatedContent, !0, transcriptPath, !0);
  if (wasTruncated) {
    let memoryPath = getSessionMemoryPath();
    summaryContent += `

Some session memory sections were truncated for length. The full session memory can be viewed at: ${memoryPath}`;
  }
  let summaryMessages = [
    createUserMessage({
      content: summaryContent,
      isCompactSummary: !0,
      isVisibleInTranscriptOnly: !0
    })
  ], planAttachment = createPlanAttachmentIfNeeded(agentId), attachments = planAttachment ? [planAttachment] : [];
  return {
    boundaryMarker: annotateBoundaryWithPreservedSegment(boundaryMarker, summaryMessages[summaryMessages.length - 1].uuid, messagesToKeep),
    summaryMessages,
    attachments,
    hookResults,
    messagesToKeep,
    preCompactTokenCount,
    postCompactTokenCount: estimateMessageTokens(summaryMessages),
    truePostCompactTokenCount: estimateMessageTokens(summaryMessages)
  };
}
async function trySessionMemoryCompaction(messages, agentId, autoCompactThreshold) {
  if (!shouldUseSessionMemoryCompaction())
    return null;
  await initSessionMemoryCompactConfig(), await waitForSessionMemoryExtraction();
  let lastSummarizedMessageId2 = getLastSummarizedMessageId(), sessionMemory = await getSessionMemoryContent();
  if (!sessionMemory)
    return logEvent("tengu_sm_compact_no_session_memory", {}), null;
  if (await isSessionMemoryEmpty(sessionMemory))
    return logEvent("tengu_sm_compact_empty_template", {}), null;
  try {
    let lastSummarizedIndex;
    if (lastSummarizedMessageId2) {
      if (lastSummarizedIndex = messages.findIndex((msg) => msg.uuid === lastSummarizedMessageId2), lastSummarizedIndex === -1)
        return logEvent("tengu_sm_compact_summarized_id_not_found", {}), null;
    } else
      lastSummarizedIndex = messages.length - 1, logEvent("tengu_sm_compact_resumed_session", {});
    let startIndex = calculateMessagesToKeepIndex(messages, lastSummarizedIndex), messagesToKeep = messages.slice(startIndex).filter((m4) => !isCompactBoundaryMessage(m4)), hookResults = await processSessionStartHooks("compact", {
      model: getMainLoopModel()
    }), transcriptPath = getTranscriptPath(), compactionResult = createCompactionResultFromSessionMemory(messages, sessionMemory, messagesToKeep, hookResults, transcriptPath, agentId), postCompactMessages = buildPostCompactMessages(compactionResult), postCompactTokenCount = estimateMessageTokens(postCompactMessages);
    if (autoCompactThreshold !== void 0 && postCompactTokenCount >= autoCompactThreshold)
      return logEvent("tengu_sm_compact_threshold_exceeded", {
        postCompactTokenCount,
        autoCompactThreshold
      }), null;
    return {
      ...compactionResult,
      postCompactTokenCount,
      truePostCompactTokenCount: postCompactTokenCount
    };
  } catch (error44) {
    return logEvent("tengu_sm_compact_error", {}), null;
  }
}
var DEFAULT_SM_COMPACT_CONFIG, smCompactConfig, configInitialized = !1;
var init_sessionMemoryCompact = __esm(() => {
  init_debug();
  init_envUtils();
  init_errors();
  init_messages3();
  init_model();
  init_filesystem();
  init_sessionStart();
  init_sessionStorage();
  init_tokens();
  init_toolSearch();
  init_prompts2();
  init_sessionMemoryUtils();
  init_compact();
  init_microCompact();
  init_prompt20();
  DEFAULT_SM_COMPACT_CONFIG = {
    minTokens: 1e4,
    minTextBlockMessages: 5,
    maxTokens: 40000
  }, smCompactConfig = {
    ...DEFAULT_SM_COMPACT_CONFIG
  };
});
