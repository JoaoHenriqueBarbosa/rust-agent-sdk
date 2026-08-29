// function: toOtlpLink
function toOtlpLink(link3, encoder) {
  return {
    attributes: link3.attributes ? toAttributes(link3.attributes, encoder) : [],
    spanId: encoder.encodeSpanContext(link3.context.spanId),
    traceId: encoder.encodeSpanContext(link3.context.traceId),
    traceState: link3.context.traceState?.serialize(),
    droppedAttributesCount: link3.droppedAttributesCount || 0,
    flags: buildSpanFlagsFrom(link3.context.traceFlags, link3.context.isRemote)
  };
}
