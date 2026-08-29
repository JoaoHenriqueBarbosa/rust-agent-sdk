// function: endToolExecutionSpan
function endToolExecutionSpan(metadata) {
  if (!isAnyTracingEnabled())
    return;
  let executionSpanContext = Array.from(activeSpans.values()).findLast((r4) => r4.deref()?.attributes["span.type"] === "tool.execution")?.deref();
  if (!executionSpanContext)
    return;
  let attributes = {
    duration_ms: Date.now() - executionSpanContext.startTime
  };
  if (metadata) {
    if (metadata.success !== void 0)
      attributes.success = metadata.success;
    if (metadata.error !== void 0)
      attributes.error = metadata.error;
  }
  executionSpanContext.span.setAttributes(attributes), executionSpanContext.span.end();
  let spanId = getSpanId(executionSpanContext.span);
  activeSpans.delete(spanId), strongSpans.delete(spanId);
}
