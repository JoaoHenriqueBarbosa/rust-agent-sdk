// function: evaluateTimeBasedTrigger
function evaluateTimeBasedTrigger(messages, querySource) {
  let config10 = getTimeBasedMCConfig();
  if (!config10.enabled || !querySource || !isMainThreadSource(querySource))
    return null;
  let lastAssistant = messages.findLast((m4) => m4.type === "assistant");
  if (!lastAssistant)
    return null;
  let gapMinutes = (Date.now() - new Date(lastAssistant.timestamp).getTime()) / 60000;
  if (!Number.isFinite(gapMinutes) || gapMinutes < config10.gapThresholdMinutes)
    return null;
  return { gapMinutes, config: config10 };
}
