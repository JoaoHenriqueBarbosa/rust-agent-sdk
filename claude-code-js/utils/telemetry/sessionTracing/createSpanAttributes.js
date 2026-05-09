// function: createSpanAttributes
function createSpanAttributes(spanType, customAttributes = {}) {
  return {
    ...getTelemetryAttributes(),
    "span.type": spanType,
    ...customAttributes
  };
}
