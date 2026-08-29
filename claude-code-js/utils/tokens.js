// Original: src/utils/tokens.ts
function getTokenUsage(message) {
  if (message?.type === "assistant" && "usage" in message.message && !(message.message.content[0]?.type === "text" && SYNTHETIC_MESSAGES.has(message.message.content[0].text)) && message.message.model !== SYNTHETIC_MODEL)
    return message.message.usage;
  return;
}
function getAssistantMessageId(message) {
  if (message?.type === "assistant" && "id" in message.message && message.message.model !== SYNTHETIC_MODEL)
    return message.message.id;
  return;
}
function getTokenCountFromUsage(usage) {
  return usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + usage.output_tokens;
}
function tokenCountFromLastAPIResponse(messages) {
  let i5 = messages.length - 1;
  while (i5 >= 0) {
    let message = messages[i5], usage = message ? getTokenUsage(message) : void 0;
    if (usage)
      return getTokenCountFromUsage(usage);
    i5--;
  }
  return 0;
}
function finalContextTokensFromLastResponse(messages) {
  let i5 = messages.length - 1;
  while (i5 >= 0) {
    let message = messages[i5], usage = message ? getTokenUsage(message) : void 0;
    if (usage) {
      let iterations = usage.iterations;
      if (iterations && iterations.length > 0) {
        let last2 = iterations.at(-1);
        return last2.input_tokens + last2.output_tokens;
      }
      return usage.input_tokens + usage.output_tokens;
    }
    i5--;
  }
  return 0;
}
function getCurrentUsage(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5], usage = message ? getTokenUsage(message) : void 0;
    if (usage)
      return {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: usage.cache_read_input_tokens ?? 0
      };
  }
  return null;
}
function doesMostRecentAssistantMessageExceed200k(messages) {
  let lastAsst = messages.findLast((m4) => m4.type === "assistant");
  if (!lastAsst)
    return !1;
  let usage = getTokenUsage(lastAsst);
  return usage ? getTokenCountFromUsage(usage) > 200000 : !1;
}
function getAssistantMessageContentLength(message) {
  let contentLength = 0;
  for (let block2 of message.message.content)
    if (block2.type === "text")
      contentLength += block2.text.length;
    else if (block2.type === "thinking")
      contentLength += block2.thinking.length;
    else if (block2.type === "redacted_thinking")
      contentLength += block2.data.length;
    else if (block2.type === "tool_use")
      contentLength += jsonStringify(block2.input).length;
  return contentLength;
}
function tokenCountWithEstimation(messages) {
  let i5 = messages.length - 1;
  while (i5 >= 0) {
    let message = messages[i5], usage = message ? getTokenUsage(message) : void 0;
    if (message && usage) {
      let responseId = getAssistantMessageId(message);
      if (responseId) {
        let j4 = i5 - 1;
        while (j4 >= 0) {
          let prior = messages[j4], priorId = prior ? getAssistantMessageId(prior) : void 0;
          if (priorId === responseId)
            i5 = j4;
          else if (priorId !== void 0)
            break;
          j4--;
        }
      }
      return getTokenCountFromUsage(usage) + roughTokenCountEstimationForMessages(messages.slice(i5 + 1));
    }
    i5--;
  }
  return roughTokenCountEstimationForMessages(messages);
}
var init_tokens = __esm(() => {
  init_tokenEstimation();
  init_messages3();
  init_slowOperations();
});
