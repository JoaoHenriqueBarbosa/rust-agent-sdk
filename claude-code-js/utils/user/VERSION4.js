// var: VERSION4
var VERSION4 = "2.6.1";

// node_modules/@opentelemetry/sdk-trace-base/build/esm/Tracer.js
class Tracer {
  _sampler;
  _generalLimits;
  _spanLimits;
  _idGenerator;
  instrumentationScope;
  _resource;
  _spanProcessor;
  _tracerMetrics;
  constructor(instrumentationScope, config10, resource, spanProcessor) {
    let localConfig = mergeConfig3(config10);
    this._sampler = localConfig.sampler, this._generalLimits = localConfig.generalLimits, this._spanLimits = localConfig.spanLimits, this._idGenerator = config10.idGenerator || new RandomIdGenerator, this._resource = resource, this._spanProcessor = spanProcessor, this.instrumentationScope = instrumentationScope;
    let meter = localConfig.meterProvider ? localConfig.meterProvider.getMeter("@opentelemetry/sdk-trace", VERSION4) : api3.createNoopMeter();
    this._tracerMetrics = new TracerMetrics(meter);
  }
  startSpan(name3, options2 = {}, context6 = api3.context.active()) {
    if (options2.root)
      context6 = api3.trace.deleteSpan(context6);
    let parentSpan = api3.trace.getSpan(context6);
    if (import_core53.isTracingSuppressed(context6))
      return api3.diag.debug("Instrumentation suppressed, returning Noop Span"), api3.trace.wrapSpanContext(api3.INVALID_SPAN_CONTEXT);
    let parentSpanContext = parentSpan?.spanContext(), spanId = this._idGenerator.generateSpanId(), validParentSpanContext, traceId, traceState;
    if (!parentSpanContext || !api3.trace.isSpanContextValid(parentSpanContext))
      traceId = this._idGenerator.generateTraceId();
    else
      traceId = parentSpanContext.traceId, traceState = parentSpanContext.traceState, validParentSpanContext = parentSpanContext;
    let spanKind = options2.kind ?? api3.SpanKind.INTERNAL, links = (options2.links ?? []).map((link3) => {
      return {
        context: link3.context,
        attributes: import_core53.sanitizeAttributes(link3.attributes)
      };
    }), attributes = import_core53.sanitizeAttributes(options2.attributes), samplingResult = this._sampler.shouldSample(context6, traceId, name3, spanKind, attributes, links), recordEndMetrics = this._tracerMetrics.startSpan(parentSpanContext, samplingResult.decision);
    traceState = samplingResult.traceState ?? traceState;
    let traceFlags = samplingResult.decision === api3.SamplingDecision.RECORD_AND_SAMPLED ? api3.TraceFlags.SAMPLED : api3.TraceFlags.NONE, spanContext = { traceId, spanId, traceFlags, traceState };
    if (samplingResult.decision === api3.SamplingDecision.NOT_RECORD)
      return api3.diag.debug("Recording is off, propagating context in a non-recording span"), api3.trace.wrapSpanContext(spanContext);
    let initAttributes = import_core53.sanitizeAttributes(Object.assign(attributes, samplingResult.attributes));
    return new SpanImpl({
      resource: this._resource,
      scope: this.instrumentationScope,
      context: context6,
      spanContext,
      name: name3,
      kind: spanKind,
      links,
      parentSpanContext: validParentSpanContext,
      attributes: initAttributes,
      startTime: options2.startTime,
      spanProcessor: this._spanProcessor,
      spanLimits: this._spanLimits,
      recordEndMetrics
    });
  }
  startActiveSpan(name3, arg2, arg3, arg4) {
    let opts, ctx, fn;
    if (arguments.length < 2)
      return;
    else if (arguments.length === 2)
      fn = arg2;
    else if (arguments.length === 3)
      opts = arg2, fn = arg3;
    else
      opts = arg2, ctx = arg3, fn = arg4;
    let parentContext = ctx ?? api3.context.active(), span = this.startSpan(name3, opts, parentContext), contextWithSpanSet = api3.trace.setSpan(parentContext, span);
    return api3.context.with(contextWithSpanSet, fn, void 0, span);
  }
  getGeneralLimits() {
    return this._generalLimits;
  }
  getSpanLimits() {
    return this._spanLimits;
  }
}
