// var: require_spancontext_utils
var require_spancontext_utils = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.wrapSpanContext = exports.isSpanContextValid = exports.isValidSpanId = exports.isValidTraceId = void 0;
  var invalid_span_constants_1 = require_invalid_span_constants(), NonRecordingSpan_1 = require_NonRecordingSpan(), isHex = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1
  ]);
  function isValidHex(id, length) {
    if (typeof id !== "string" || id.length !== length)
      return !1;
    let r4 = 0;
    for (let i5 = 0;i5 < id.length; i5 += 4)
      r4 += (isHex[id.charCodeAt(i5)] | 0) + (isHex[id.charCodeAt(i5 + 1)] | 0) + (isHex[id.charCodeAt(i5 + 2)] | 0) + (isHex[id.charCodeAt(i5 + 3)] | 0);
    return r4 === length;
  }
  function isValidTraceId(traceId) {
    return isValidHex(traceId, 32) && traceId !== invalid_span_constants_1.INVALID_TRACEID;
  }
  exports.isValidTraceId = isValidTraceId;
  function isValidSpanId(spanId) {
    return isValidHex(spanId, 16) && spanId !== invalid_span_constants_1.INVALID_SPANID;
  }
  exports.isValidSpanId = isValidSpanId;
  function isSpanContextValid(spanContext) {
    return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
  }
  exports.isSpanContextValid = isSpanContextValid;
  function wrapSpanContext(spanContext) {
    return new NonRecordingSpan_1.NonRecordingSpan(spanContext);
  }
  exports.wrapSpanContext = wrapSpanContext;
});
