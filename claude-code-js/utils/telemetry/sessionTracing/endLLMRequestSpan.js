// function: endLLMRequestSpan
function endLLMRequestSpan(span, metadata) {
  let llmSpanContext;
  if (span) {
    let spanId2 = getSpanId(span);
    llmSpanContext = activeSpans.get(spanId2)?.deref();
  } else
    llmSpanContext = Array.from(activeSpans.values()).findLast((r4) => {
      let ctx = r4.deref();
      return ctx?.attributes["span.type"] === "llm_request" || ctx?.attributes.model;
    })?.deref();
  if (!llmSpanContext)
    return;
  let duration3 = Date.now() - llmSpanContext.startTime;
  if (llmSpanContext.perfettoSpanId)
    endLLMRequestPerfettoSpan(llmSpanContext.perfettoSpanId, {
      ttftMs: metadata?.ttftMs,
      ttltMs: duration3,
      promptTokens: metadata?.inputTokens,
      outputTokens: metadata?.outputTokens,
      cacheReadTokens: metadata?.cacheReadTokens,
      cacheCreationTokens: metadata?.cacheCreationTokens,
      success: metadata?.success,
      error: metadata?.error,
      requestSetupMs: metadata?.requestSetupMs,
      attemptStartTimes: metadata?.attemptStartTimes
    });
  if (!isAnyTracingEnabled()) {
    let spanId2 = getSpanId(llmSpanContext.span);
    activeSpans.delete(spanId2), strongSpans.delete(spanId2);
    return;
  }
  let endAttributes = {
    duration_ms: duration3
  };
  if (metadata) {
    if (metadata.inputTokens !== void 0)
      endAttributes.input_tokens = metadata.inputTokens;
    if (metadata.outputTokens !== void 0)
      endAttributes.output_tokens = metadata.outputTokens;
    if (metadata.cacheReadTokens !== void 0)
      endAttributes.cache_read_tokens = metadata.cacheReadTokens;
    if (metadata.cacheCreationTokens !== void 0)
      endAttributes.cache_creation_tokens = metadata.cacheCreationTokens;
    if (metadata.success !== void 0)
      endAttributes.success = metadata.success;
    if (metadata.statusCode !== void 0)
      endAttributes.status_code = metadata.statusCode;
    if (metadata.error !== void 0)
      endAttributes.error = metadata.error;
    if (metadata.attempt !== void 0)
      endAttributes.attempt = metadata.attempt;
    if (metadata.hasToolCall !== void 0)
      endAttributes["response.has_tool_call"] = metadata.hasToolCall;
    if (metadata.ttftMs !== void 0)
      endAttributes.ttft_ms = metadata.ttftMs;
    addBetaLLMResponseAttributes(endAttributes, metadata);
  }
  llmSpanContext.span.setAttributes(endAttributes), llmSpanContext.span.end();
  let spanId = getSpanId(llmSpanContext.span);
  activeSpans.delete(spanId), strongSpans.delete(spanId);
}
