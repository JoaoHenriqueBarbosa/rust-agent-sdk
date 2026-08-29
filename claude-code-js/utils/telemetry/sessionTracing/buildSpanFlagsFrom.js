// function: buildSpanFlagsFrom
function buildSpanFlagsFrom(traceFlags, isRemote) {
  let flags = traceFlags & 255 | SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK;
  if (isRemote)
    flags |= SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK;
  return flags;
}
