// function: endToolSpan
function endToolSpan(toolResult, resultTokens) {
  let toolSpanContext = toolContext.getStore();
  if (!toolSpanContext)
    return;
  if (toolSpanContext.perfettoSpanId)
    endToolPerfettoSpan(toolSpanContext.perfettoSpanId, {
      success: !0,
      resultTokens
    });
  if (!isAnyTracingEnabled()) {
    let spanId2 = getSpanId(toolSpanContext.span);
    activeSpans.delete(spanId2), toolContext.enterWith(void 0);
    return;
  }
  let endAttributes = {
    duration_ms: Date.now() - toolSpanContext.startTime
  };
  if (toolResult) {
    let toolName = toolSpanContext.attributes.tool_name || "unknown";
    addBetaToolResultAttributes(endAttributes, toolName, toolResult);
  }
  if (resultTokens !== void 0)
    endAttributes.result_tokens = resultTokens;
  toolSpanContext.span.setAttributes(endAttributes), toolSpanContext.span.end();
  let spanId = getSpanId(toolSpanContext.span);
  activeSpans.delete(spanId), toolContext.enterWith(void 0);
}
