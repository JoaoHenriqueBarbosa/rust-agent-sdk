// function: startToolSpan
function startToolSpan(toolName, toolAttributes, toolInput) {
  let perfettoSpanId = isPerfettoTracingEnabled() ? startToolPerfettoSpan(toolName, toolAttributes) : void 0;
  if (!isAnyTracingEnabled()) {
    if (perfettoSpanId) {
      let dummySpan = import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy"), spanId2 = getSpanId(dummySpan), spanContextObj2 = {
        span: dummySpan,
        startTime: Date.now(),
        attributes: { "span.type": "tool", tool_name: toolName },
        perfettoSpanId
      };
      return activeSpans.set(spanId2, new WeakRef(spanContextObj2)), toolContext.enterWith(spanContextObj2), dummySpan;
    }
    return import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy");
  }
  let tracer = getTracer(), parentSpanCtx = interactionContext.getStore(), attributes = createSpanAttributes("tool", {
    tool_name: toolName,
    ...toolAttributes
  }), ctx = parentSpanCtx ? import_api10.trace.setSpan(import_api10.context.active(), parentSpanCtx.span) : import_api10.context.active(), span = tracer.startSpan("claude_code.tool", { attributes }, ctx);
  if (toolInput)
    addBetaToolInputAttributes(span, toolName, toolInput);
  let spanId = getSpanId(span), spanContextObj = {
    span,
    startTime: Date.now(),
    attributes,
    perfettoSpanId
  };
  return activeSpans.set(spanId, new WeakRef(spanContextObj)), toolContext.enterWith(spanContextObj), span;
}
