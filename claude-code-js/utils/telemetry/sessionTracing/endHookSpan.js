// function: endHookSpan
function endHookSpan(span, metadata) {
  if (!isBetaTracingEnabled())
    return;
  let spanId = getSpanId(span), spanContext = activeSpans.get(spanId)?.deref();
  if (!spanContext)
    return;
  let endAttributes = {
    duration_ms: Date.now() - spanContext.startTime
  };
  if (metadata) {
    if (metadata.numSuccess !== void 0)
      endAttributes.num_success = metadata.numSuccess;
    if (metadata.numBlocking !== void 0)
      endAttributes.num_blocking = metadata.numBlocking;
    if (metadata.numNonBlockingError !== void 0)
      endAttributes.num_non_blocking_error = metadata.numNonBlockingError;
    if (metadata.numCancelled !== void 0)
      endAttributes.num_cancelled = metadata.numCancelled;
  }
  spanContext.span.setAttributes(endAttributes), spanContext.span.end(), activeSpans.delete(spanId), strongSpans.delete(spanId);
}
