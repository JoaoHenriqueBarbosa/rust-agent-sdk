// function: calculateAgentStats
function calculateAgentStats(progressMessages) {
  let toolUseCount = count2(progressMessages, (msg) => {
    if (!hasProgressMessage(msg.data))
      return !1;
    let message = msg.data.message;
    return message.type === "user" && message.message.content.some((content) => content.type === "tool_result");
  }), latestAssistant = progressMessages.findLast((msg) => hasProgressMessage(msg.data) && msg.data.message.type === "assistant"), tokens = null;
  if (latestAssistant?.data.message.type === "assistant") {
    let usage = latestAssistant.data.message.message.usage;
    tokens = (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + usage.input_tokens + usage.output_tokens;
  }
  return {
    toolUseCount,
    tokens
  };
}
