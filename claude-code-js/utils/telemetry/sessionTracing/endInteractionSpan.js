// function: endInteractionSpan
function endInteractionSpan() {
  let spanContext = interactionContext.getStore();
  if (!spanContext)
    return;
  if (spanContext.ended)
    return;
  if (spanContext.perfettoSpanId)
    endInteractionPerfettoSpan(spanContext.perfettoSpanId);
  if (!isAnyTracingEnabled()) {
    spanContext.ended = !0, activeSpans.delete(getSpanId(spanContext.span)), interactionContext.enterWith(void 0);
    return;
  }
  let duration3 = Date.now() - spanContext.startTime;
  spanContext.span.setAttributes({
    "interaction.duration_ms": duration3
  }), spanContext.span.end(), spanContext.ended = !0, activeSpans.delete(getSpanId(spanContext.span)), interactionContext.enterWith(void 0);
}
