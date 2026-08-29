// function: getSpanId
function getSpanId(span) {
  return span.spanContext().spanId || "";
}
