// function: toLogRecord
function toLogRecord(log3, encoder) {
  return {
    timeUnixNano: encoder.encodeHrTime(log3.hrTime),
    observedTimeUnixNano: encoder.encodeHrTime(log3.hrTimeObserved),
    severityNumber: toSeverityNumber(log3.severityNumber),
    severityText: log3.severityText,
    body: toAnyValue(log3.body, encoder),
    eventName: log3.eventName,
    attributes: toLogAttributes(log3.attributes, encoder),
    droppedAttributesCount: log3.droppedAttributesCount,
    flags: log3.spanContext?.traceFlags,
    traceId: encoder.encodeOptionalSpanContext(log3.spanContext?.traceId),
    spanId: encoder.encodeOptionalSpanContext(log3.spanContext?.spanId)
  };
}
