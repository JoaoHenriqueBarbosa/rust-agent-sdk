// var: require_W3CTraceContextPropagator
var require_W3CTraceContextPropagator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.W3CTraceContextPropagator = exports.parseTraceParent = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = void 0;
  var api_1 = require_src7(), suppress_tracing_1 = require_suppress_tracing(), TraceState_1 = require_TraceState();
  exports.TRACE_PARENT_HEADER = "traceparent";
  exports.TRACE_STATE_HEADER = "tracestate";
  var VERSION4 = "00", VERSION_PART = "(?!ff)[\\da-f]{2}", TRACE_ID_PART = "(?![0]{32})[\\da-f]{32}", PARENT_ID_PART = "(?![0]{16})[\\da-f]{16}", FLAGS_PART = "[\\da-f]{2}", TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
  function parseTraceParent(traceParent) {
    let match = TRACE_PARENT_REGEX.exec(traceParent);
    if (!match)
      return null;
    if (match[1] === "00" && match[5])
      return null;
    return {
      traceId: match[2],
      spanId: match[3],
      traceFlags: parseInt(match[4], 16)
    };
  }
  exports.parseTraceParent = parseTraceParent;

  class W3CTraceContextPropagator {
    inject(context3, carrier, setter) {
      let spanContext = api_1.trace.getSpanContext(context3);
      if (!spanContext || (0, suppress_tracing_1.isTracingSuppressed)(context3) || !(0, api_1.isSpanContextValid)(spanContext))
        return;
      let traceParent = `${VERSION4}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || api_1.TraceFlags.NONE).toString(16)}`;
      if (setter.set(carrier, exports.TRACE_PARENT_HEADER, traceParent), spanContext.traceState)
        setter.set(carrier, exports.TRACE_STATE_HEADER, spanContext.traceState.serialize());
    }
    extract(context3, carrier, getter) {
      let traceParentHeader = getter.get(carrier, exports.TRACE_PARENT_HEADER);
      if (!traceParentHeader)
        return context3;
      let traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
      if (typeof traceParent !== "string")
        return context3;
      let spanContext = parseTraceParent(traceParent);
      if (!spanContext)
        return context3;
      spanContext.isRemote = !0;
      let traceStateHeader = getter.get(carrier, exports.TRACE_STATE_HEADER);
      if (traceStateHeader) {
        let state3 = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
        spanContext.traceState = new TraceState_1.TraceState(typeof state3 === "string" ? state3 : void 0);
      }
      return api_1.trace.setSpanContext(context3, spanContext);
    }
    fields() {
      return [exports.TRACE_PARENT_HEADER, exports.TRACE_STATE_HEADER];
    }
  }
  exports.W3CTraceContextPropagator = W3CTraceContextPropagator;
});
