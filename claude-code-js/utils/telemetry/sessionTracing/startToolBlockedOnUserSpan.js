// function: startToolBlockedOnUserSpan
function startToolBlockedOnUserSpan() {
  let perfettoSpanId = isPerfettoTracingEnabled() ? startUserInputPerfettoSpan("tool_permission") : void 0;
  if (!isAnyTracingEnabled()) {
    if (perfettoSpanId) {
      let dummySpan = import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy"), spanId2 = getSpanId(dummySpan), spanContextObj2 = {
        span: dummySpan,
        startTime: Date.now(),
        attributes: { "span.type": "tool.blocked_on_user" },
        perfettoSpanId
      };
      return activeSpans.set(spanId2, new WeakRef(spanContextObj2)), strongSpans.set(spanId2, spanContextObj2), dummySpan;
    }
    return import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy");
  }
  let tracer = getTracer(), parentSpanCtx = toolContext.getStore(), attributes = createSpanAttributes("tool.blocked_on_user"), ctx = parentSpanCtx ? import_api10.trace.setSpan(import_api10.context.active(), parentSpanCtx.span) : import_api10.context.active(), span = tracer.startSpan("claude_code.tool.blocked_on_user", { attributes }, ctx), spanId = getSpanId(span), spanContextObj = {
    span,
    startTime: Date.now(),
    attributes,
    perfettoSpanId
  };
  return activeSpans.set(spanId, new WeakRef(spanContextObj)), strongSpans.set(spanId, spanContextObj), span;
}
