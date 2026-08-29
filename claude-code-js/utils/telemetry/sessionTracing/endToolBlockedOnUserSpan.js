// function: endToolBlockedOnUserSpan
function endToolBlockedOnUserSpan(decision, source) {
  let blockedSpanContext = Array.from(activeSpans.values()).findLast((r4) => r4.deref()?.attributes["span.type"] === "tool.blocked_on_user")?.deref();
  if (!blockedSpanContext)
    return;
  if (blockedSpanContext.perfettoSpanId)
    endUserInputPerfettoSpan(blockedSpanContext.perfettoSpanId, {
      decision,
      source
    });
  if (!isAnyTracingEnabled()) {
    let spanId2 = getSpanId(blockedSpanContext.span);
    activeSpans.delete(spanId2), strongSpans.delete(spanId2);
    return;
  }
  let attributes = {
    duration_ms: Date.now() - blockedSpanContext.startTime
  };
  if (decision)
    attributes.decision = decision;
  if (source)
    attributes.source = source;
  blockedSpanContext.span.setAttributes(attributes), blockedSpanContext.span.end();
  let spanId = getSpanId(blockedSpanContext.span);
  activeSpans.delete(spanId), strongSpans.delete(spanId);
}
