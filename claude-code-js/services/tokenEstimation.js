// Original: src/services/tokenEstimation.ts
function hasThinkingBlocks(messages) {
  for (let message of messages)
    if (message.role === "assistant" && Array.isArray(message.content)) {
      for (let block2 of message.content)
        if (typeof block2 === "object" && block2 !== null && "type" in block2 && (block2.type === "thinking" || block2.type === "redacted_thinking"))
          return !0;
    }
  return !1;
}
function stripToolSearchFieldsFromMessages(messages) {
  return messages.map((message) => {
    if (!Array.isArray(message.content))
      return message;
    let normalizedContent = message.content.map((block2) => {
      if (block2.type === "tool_use") {
        let toolUse = block2;
        return {
          type: "tool_use",
          id: toolUse.id,
          name: toolUse.name,
          input: toolUse.input
        };
      }
      if (block2.type === "tool_result") {
        let toolResult = block2;
        if (Array.isArray(toolResult.content)) {
          let filteredContent = toolResult.content.filter((c3) => !isToolReferenceBlock(c3));
          if (filteredContent.length === 0)
            return {
              ...toolResult,
              content: [{ type: "text", text: "[tool references]" }]
            };
          if (filteredContent.length !== toolResult.content.length)
            return {
              ...toolResult,
              content: filteredContent
            };
        }
      }
      return block2;
    });
    return {
      ...message,
      content: normalizedContent
    };
  });
}
async function countTokensWithAPI(content) {
  if (!content)
    return 0;
  return countMessagesTokensWithAPI([{
    role: "user",
    content
  }], []);
}
async function countMessagesTokensWithAPI(messages, tools) {
  return withTokenCountVCR(messages, tools, async () => {
    try {
      let model = getMainLoopModel(), betas = getModelBetas(model), containsThinking = hasThinkingBlocks(messages);
      if (getAPIProvider() === "bedrock")
        return countTokensWithBedrock({
          model: normalizeModelStringForAPI(model),
          messages,
          tools,
          betas,
          containsThinking
        });
      let anthropic = await getAnthropicClient({
        maxRetries: 1,
        model,
        source: "count_tokens"
      }), filteredBetas = getAPIProvider() === "vertex" ? betas.filter((b) => VERTEX_COUNT_TOKENS_ALLOWED_BETAS.has(b)) : betas, response7 = await anthropic.beta.messages.countTokens({
        model: normalizeModelStringForAPI(model),
        messages: messages.length > 0 ? messages : [{ role: "user", content: "foo" }],
        tools,
        ...filteredBetas.length > 0 && { betas: filteredBetas },
        ...containsThinking && {
          thinking: {
            type: "enabled",
            budget_tokens: TOKEN_COUNT_THINKING_BUDGET
          }
        }
      });
      if (typeof response7.input_tokens !== "number")
        return null;
      return response7.input_tokens;
    } catch (error44) {
      return logError2(error44), null;
    }
  });
}
function roughTokenCountEstimation(content, bytesPerToken = 4) {
  return Math.round(content.length / bytesPerToken);
}
function bytesPerTokenForFileType(fileExtension2) {
  switch (fileExtension2) {
    case "json":
    case "jsonl":
    case "jsonc":
      return 2;
    default:
      return 4;
  }
}
function roughTokenCountEstimationForFileType(content, fileExtension2) {
  return roughTokenCountEstimation(content, bytesPerTokenForFileType(fileExtension2));
}
async function countTokensViaHaikuFallback(messages, tools) {
  let containsThinking = hasThinkingBlocks(messages), isVertexGlobalEndpoint = isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) && getVertexRegionForModel(getSmallFastModel()) === "global", isBedrockWithThinking = isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) && containsThinking, isVertexWithThinking = isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) && containsThinking, model = isVertexGlobalEndpoint || isBedrockWithThinking || isVertexWithThinking ? getDefaultSonnetModel() : getSmallFastModel(), anthropic = await getAnthropicClient({
    maxRetries: 1,
    model,
    source: "count_tokens"
  }), normalizedMessages = stripToolSearchFieldsFromMessages(messages), messagesToSend = normalizedMessages.length > 0 ? normalizedMessages : [{ role: "user", content: "count" }], betas = getModelBetas(model), filteredBetas = getAPIProvider() === "vertex" ? betas.filter((b) => VERTEX_COUNT_TOKENS_ALLOWED_BETAS.has(b)) : betas, usage = (await anthropic.beta.messages.create({
    model: normalizeModelStringForAPI(model),
    max_tokens: containsThinking ? TOKEN_COUNT_MAX_TOKENS : 1,
    messages: messagesToSend,
    tools: tools.length > 0 ? tools : void 0,
    ...filteredBetas.length > 0 && { betas: filteredBetas },
    metadata: getAPIMetadata(),
    ...getExtraBodyParams(),
    ...containsThinking && {
      thinking: {
        type: "enabled",
        budget_tokens: TOKEN_COUNT_THINKING_BUDGET
      }
    }
  })).usage, inputTokens = usage.input_tokens, cacheCreationTokens = usage.cache_creation_input_tokens || 0, cacheReadTokens = usage.cache_read_input_tokens || 0;
  return inputTokens + cacheCreationTokens + cacheReadTokens;
}
function roughTokenCountEstimationForMessages(messages) {
  let totalTokens = 0;
  for (let message of messages)
    totalTokens += roughTokenCountEstimationForMessage(message);
  return totalTokens;
}
function roughTokenCountEstimationForMessage(message) {
  if ((message.type === "assistant" || message.type === "user") && message.message?.content)
    return roughTokenCountEstimationForContent(message.message?.content);
  if (message.type === "attachment" && message.attachment) {
    let userMessages = normalizeAttachmentForAPI(message.attachment), total = 0;
    for (let userMsg of userMessages)
      total += roughTokenCountEstimationForContent(userMsg.message.content);
    return total;
  }
  return 0;
}
function roughTokenCountEstimationForContent(content) {
  if (!content)
    return 0;
  if (typeof content === "string")
    return roughTokenCountEstimation(content);
  let totalTokens = 0;
  for (let block2 of content)
    totalTokens += roughTokenCountEstimationForBlock(block2);
  return totalTokens;
}
function roughTokenCountEstimationForBlock(block2) {
  if (typeof block2 === "string")
    return roughTokenCountEstimation(block2);
  if (block2.type === "text")
    return roughTokenCountEstimation(block2.text);
  if (block2.type === "image" || block2.type === "document")
    return 2000;
  if (block2.type === "tool_result")
    return roughTokenCountEstimationForContent(block2.content);
  if (block2.type === "tool_use")
    return roughTokenCountEstimation(block2.name + jsonStringify(block2.input ?? {}));
  if (block2.type === "thinking")
    return roughTokenCountEstimation(block2.thinking);
  if (block2.type === "redacted_thinking")
    return roughTokenCountEstimation(block2.data);
  return roughTokenCountEstimation(jsonStringify(block2));
}
async function countTokensWithBedrock({
  model,
  messages,
  tools,
  betas,
  containsThinking
}) {
  try {
    let client15 = await createBedrockRuntimeClient(), modelId = isFoundationModel(model) ? model : await getInferenceProfileBackingModel(model);
    if (!modelId)
      return null;
    let requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      messages: messages.length > 0 ? messages : [{ role: "user", content: "foo" }],
      max_tokens: containsThinking ? TOKEN_COUNT_MAX_TOKENS : 1,
      ...tools.length > 0 && { tools },
      ...betas.length > 0 && { anthropic_beta: betas },
      ...containsThinking && {
        thinking: {
          type: "enabled",
          budget_tokens: TOKEN_COUNT_THINKING_BUDGET
        }
      }
    }, { CountTokensCommand: CountTokensCommand3 } = await Promise.resolve().then(() => (init_dist_es39(), exports_dist_es13)), input = {
      modelId,
      input: {
        invokeModel: {
          body: (/* @__PURE__ */ new TextEncoder()).encode(jsonStringify(requestBody))
        }
      }
    };
    return (await client15.send(new CountTokensCommand3(input))).inputTokens ?? null;
  } catch (error44) {
    return logError2(error44), null;
  }
}
var TOKEN_COUNT_THINKING_BUDGET = 1024, TOKEN_COUNT_MAX_TOKENS = 2048;
var init_tokenEstimation = __esm(() => {
  init_providers();
  init_betas();
  init_betas2();
  init_envUtils();
  init_log3();
  init_messages3();
  init_bedrock();
  init_model();
  init_slowOperations();
  init_toolSearch();
  init_claude();
  init_client17();
  init_vcr();
});
