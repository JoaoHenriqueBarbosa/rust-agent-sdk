// function: ensureCleanupInterval
function ensureCleanupInterval() {
  if (_cleanupIntervalStarted)
    return;
  _cleanupIntervalStarted = !0;
  let interval = setInterval(() => {
    let cutoff = Date.now() - SPAN_TTL_MS;
    for (let [spanId, weakRef] of activeSpans) {
      let ctx = weakRef.deref();
      if (ctx === void 0)
        activeSpans.delete(spanId), strongSpans.delete(spanId);
      else if (ctx.startTime < cutoff) {
        if (!ctx.ended)
          ctx.span.end();
        activeSpans.delete(spanId), strongSpans.delete(spanId);
      }
    }
  }, 60000);
  if (typeof interval.unref === "function")
    interval.unref();
}
