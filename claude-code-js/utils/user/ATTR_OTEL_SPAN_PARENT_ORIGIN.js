// var: ATTR_OTEL_SPAN_PARENT_ORIGIN
var ATTR_OTEL_SPAN_PARENT_ORIGIN = "otel.span.parent.origin", ATTR_OTEL_SPAN_SAMPLING_RESULT = "otel.span.sampling_result", METRIC_OTEL_SDK_SPAN_LIVE = "otel.sdk.span.live", METRIC_OTEL_SDK_SPAN_STARTED = "otel.sdk.span.started";

// node_modules/@opentelemetry/sdk-trace-base/build/esm/TracerMetrics.js
class TracerMetrics {
  startedSpans;
  liveSpans;
  constructor(meter) {
    this.startedSpans = meter.createCounter(METRIC_OTEL_SDK_SPAN_STARTED, {
      unit: "{span}",
      description: "The number of created spans."
    }), this.liveSpans = meter.createUpDownCounter(METRIC_OTEL_SDK_SPAN_LIVE, {
      unit: "{span}",
      description: "The number of currently live spans."
    });
  }
  startSpan(parentSpanCtx, samplingDecision) {
    let samplingDecisionStr = samplingDecisionToString(samplingDecision);
    if (this.startedSpans.add(1, {
      [ATTR_OTEL_SPAN_PARENT_ORIGIN]: parentOrigin(parentSpanCtx),
      [ATTR_OTEL_SPAN_SAMPLING_RESULT]: samplingDecisionStr
    }), samplingDecision === SamplingDecision.NOT_RECORD)
      return () => {};
    let liveSpanAttributes = {
      [ATTR_OTEL_SPAN_SAMPLING_RESULT]: samplingDecisionStr
    };
    return this.liveSpans.add(1, liveSpanAttributes), () => {
      this.liveSpans.add(-1, liveSpanAttributes);
    };
  }
}
