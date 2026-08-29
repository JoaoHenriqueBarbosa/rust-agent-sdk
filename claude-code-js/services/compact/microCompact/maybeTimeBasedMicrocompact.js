// function: maybeTimeBasedMicrocompact
function maybeTimeBasedMicrocompact(messages, querySource) {
  let trigger = evaluateTimeBasedTrigger(messages, querySource);
  if (!trigger)
    return null;
  let { gapMinutes, config: config10 } = trigger, compactableIds = collectCompactableToolIds(messages), keepRecent = Math.max(1, config10.keepRecent), keepSet = new Set(compactableIds.slice(-keepRecent)), clearSet = new Set(compactableIds.filter((id) => !keepSet.has(id)));
  if (clearSet.size === 0)
    return null;
  let tokensSaved = 0, result = messages.map((message) => {
    if (message.type !== "user" || !Array.isArray(message.message.content))
      return message;
    let touched = !1, newContent = message.message.content.map((block) => {
      if (block.type === "tool_result" && clearSet.has(block.tool_use_id) && block.content !== TIME_BASED_MC_CLEARED_MESSAGE)
        return tokensSaved += calculateToolResultTokens(block), touched = !0, { ...block, content: TIME_BASED_MC_CLEARED_MESSAGE };
      return block;
    });
    if (!touched)
      return message;
    return {
      ...message,
      message: { ...message.message, content: newContent }
    };
  });
  if (tokensSaved === 0)
    return null;
  return logEvent("tengu_time_based_microcompact", {
    gapMinutes: Math.round(gapMinutes),
    gapThresholdMinutes: config10.gapThresholdMinutes,
    toolsCleared: clearSet.size,
    toolsKept: keepSet.size,
    keepRecent: config10.keepRecent,
    tokensSaved
  }), logForDebugging(`[TIME-BASED MC] gap ${Math.round(gapMinutes)}min > ${config10.gapThresholdMinutes}min, cleared ${clearSet.size} tool results (~${tokensSaved} tokens), kept last ${keepSet.size}`), suppressCompactWarning(), resetMicrocompactState(), { messages: result };
}
