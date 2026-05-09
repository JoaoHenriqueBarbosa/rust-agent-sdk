// function: startInteractionSpan
function startInteractionSpan(userPrompt) {
  ensureCleanupInterval();
  let perfettoSpanId = isPerfettoTracingEnabled() ? startInteractionPerfettoSpan(userPrompt) : void 0;
  if (!isAnyTracingEnabled()) {
    if (perfettoSpanId) {
      let dummySpan = import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy"), spanId2 = getSpanId(dummySpan), spanContextObj2 = {
        span: dummySpan,
        startTime: Date.now(),
        attributes: {},
        perfettoSpanId
      };
      return activeSpans.set(spanId2, new WeakRef(spanContextObj2)), interactionContext.enterWith(spanContextObj2), dummySpan;
    }
    return import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy");
  }
  let tracer = getTracer(), promptToLog = isEnvTruthy(process.env.OTEL_LOG_USER_PROMPTS) ? userPrompt : "<REDACTED>";
  interactionSequence++;
  let attributes = createSpanAttributes("interaction", {
    user_prompt: promptToLog,
    user_prompt_length: userPrompt.length,
    "interaction.sequence": interactionSequence
  }), span = tracer.startSpan("claude_code.interaction", {
    attributes
  });
  addBetaInteractionAttributes(span, userPrompt);
  let spanId = getSpanId(span), spanContextObj = {
    span,
    startTime: Date.now(),
    attributes,
    perfettoSpanId
  };
  return activeSpans.set(spanId, new WeakRef(spanContextObj)), interactionContext.enterWith(spanContextObj), span;
}
