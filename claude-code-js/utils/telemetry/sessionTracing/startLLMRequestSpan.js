// function: startLLMRequestSpan
function startLLMRequestSpan(model, newContext, messagesForAPI, fastMode) {
  let perfettoSpanId = isPerfettoTracingEnabled() ? startLLMRequestPerfettoSpan({
    model,
    querySource: newContext?.querySource,
    messageId: void 0
  }) : void 0;
  if (!isAnyTracingEnabled()) {
    if (perfettoSpanId) {
      let dummySpan = import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy"), spanId2 = getSpanId(dummySpan), spanContextObj2 = {
        span: dummySpan,
        startTime: Date.now(),
        attributes: { model },
        perfettoSpanId
      };
      return activeSpans.set(spanId2, new WeakRef(spanContextObj2)), strongSpans.set(spanId2, spanContextObj2), dummySpan;
    }
    return import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy");
  }
  let tracer = getTracer(), parentSpanCtx = interactionContext.getStore(), attributes = createSpanAttributes("llm_request", {
    model,
    "llm_request.context": parentSpanCtx ? "interaction" : "standalone",
    speed: fastMode ? "fast" : "normal"
  }), ctx = parentSpanCtx ? import_api10.trace.setSpan(import_api10.context.active(), parentSpanCtx.span) : import_api10.context.active(), span = tracer.startSpan("claude_code.llm_request", { attributes }, ctx);
  if (newContext?.querySource)
    span.setAttribute("query_source", newContext.querySource);
  addBetaLLMRequestAttributes(span, newContext, messagesForAPI);
  let spanId = getSpanId(span), spanContextObj = {
    span,
    startTime: Date.now(),
    attributes,
    perfettoSpanId
  };
  return activeSpans.set(spanId, new WeakRef(spanContextObj)), strongSpans.set(spanId, spanContextObj), span;
}
