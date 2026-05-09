// function: startToolExecutionSpan
function startToolExecutionSpan() {
  if (!isAnyTracingEnabled())
    return import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy");
  let tracer = getTracer(), parentSpanCtx = toolContext.getStore(), attributes = createSpanAttributes("tool.execution"), ctx = parentSpanCtx ? import_api10.trace.setSpan(import_api10.context.active(), parentSpanCtx.span) : import_api10.context.active(), span = tracer.startSpan("claude_code.tool.execution", { attributes }, ctx), spanId = getSpanId(span), spanContextObj = {
    span,
    startTime: Date.now(),
    attributes
  };
  return activeSpans.set(spanId, new WeakRef(spanContextObj)), strongSpans.set(spanId, spanContextObj), span;
}
