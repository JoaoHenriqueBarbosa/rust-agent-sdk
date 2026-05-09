// class: ConsoleSpanExporter
class ConsoleSpanExporter {
  export(spans, resultCallback) {
    return this._sendSpans(spans, resultCallback);
  }
  shutdown() {
    return this._sendSpans([]), this.forceFlush();
  }
  forceFlush() {
    return Promise.resolve();
  }
  _exportInfo(span) {
    return {
      resource: {
        attributes: span.resource.attributes
      },
      instrumentationScope: span.instrumentationScope,
      traceId: span.spanContext().traceId,
      parentSpanContext: span.parentSpanContext,
      traceState: span.spanContext().traceState?.serialize(),
      name: span.name,
      id: span.spanContext().spanId,
      kind: span.kind,
      timestamp: import_core56.hrTimeToMicroseconds(span.startTime),
      duration: import_core56.hrTimeToMicroseconds(span.duration),
      attributes: span.attributes,
      status: span.status,
      events: span.events,
      links: span.links
    };
  }
  _sendSpans(spans, done) {
    for (let span of spans)
      console.dir(this._exportInfo(span), { depth: 3 });
    if (done)
      return done({ code: import_core56.ExportResultCode.SUCCESS });
  }
}
