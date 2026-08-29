// Original: src/utils/sideQuery.ts
function extractFirstUserMessageText(messages) {
  let firstUserMessage = messages.find((m4) => m4.role === "user");
  if (!firstUserMessage)
    return "";
  let content = firstUserMessage.content;
  if (typeof content === "string")
    return content;
  let textBlock = content.find((block2) => block2.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}
async function sideQuery(opts) {
  let {
    model,
    system,
    messages,
    tools,
    tool_choice,
    output_format,
    max_tokens = 1024,
    maxRetries = 2,
    signal,
    skipSystemPromptPrefix,
    temperature,
    thinking,
    stop_sequences
  } = opts, client15 = await getAnthropicClient({
    maxRetries,
    model,
    source: "side_query"
  }), betas = [...getModelBetas(model)];
  if (output_format && modelSupportsStructuredOutputs(model) && !betas.includes(STRUCTURED_OUTPUTS_BETA_HEADER))
    betas.push(STRUCTURED_OUTPUTS_BETA_HEADER);
  let messageText = extractFirstUserMessageText(messages), fingerprint = computeFingerprint(messageText, "2.1.90"), attributionHeader = getAttributionHeader(fingerprint), systemBlocks = [
    attributionHeader ? { type: "text", text: attributionHeader } : null,
    ...skipSystemPromptPrefix ? [] : [
      {
        type: "text",
        text: getCLISyspromptPrefix({
          isNonInteractive: !1,
          hasAppendSystemPrompt: !1
        })
      }
    ],
    ...Array.isArray(system) ? system : system ? [{ type: "text", text: system }] : []
  ].filter((block2) => block2 !== null), thinkingConfig;
  if (thinking === !1)
    thinkingConfig = { type: "disabled" };
  else if (thinking !== void 0)
    thinkingConfig = {
      type: "enabled",
      budget_tokens: Math.min(thinking, max_tokens - 1)
    };
  let normalizedModel = normalizeModelStringForAPI(model), start = Date.now(), response7 = await client15.beta.messages.create({
    model: normalizedModel,
    max_tokens,
    system: systemBlocks,
    messages,
    ...tools && { tools },
    ...tool_choice && { tool_choice },
    ...output_format && { output_config: { format: output_format } },
    ...temperature !== void 0 && { temperature },
    ...stop_sequences && { stop_sequences },
    ...thinkingConfig && { thinking: thinkingConfig },
    ...betas.length > 0 && { betas },
    metadata: getAPIMetadata()
  }, { signal }), requestId = response7._request_id ?? void 0, now2 = Date.now(), lastCompletion = getLastApiCompletionTimestamp();
  return logEvent("tengu_api_success", {
    requestId,
    querySource: opts.querySource,
    model: normalizedModel,
    inputTokens: response7.usage.input_tokens,
    outputTokens: response7.usage.output_tokens,
    cachedInputTokens: response7.usage.cache_read_input_tokens ?? 0,
    uncachedInputTokens: response7.usage.cache_creation_input_tokens ?? 0,
    durationMsIncludingRetries: now2 - start,
    timeSinceLastApiCallMs: lastCompletion !== null ? now2 - lastCompletion : void 0
  }), setLastApiCompletionTimestamp(now2), response7;
}
var init_sideQuery = __esm(() => {
  init_state();
  init_betas();
  init_system();
  init_claude();
  init_client17();
  init_betas2();
  init_fingerprint();
  init_model();
});
