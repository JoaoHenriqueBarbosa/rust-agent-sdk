// var: require_invalid_span_constants
var require_invalid_span_constants = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = void 0;
  var trace_flags_1 = require_trace_flags();
  exports.INVALID_SPANID = "0000000000000000";
  exports.INVALID_TRACEID = "00000000000000000000000000000000";
  exports.INVALID_SPAN_CONTEXT = {
    traceId: exports.INVALID_TRACEID,
    spanId: exports.INVALID_SPANID,
    traceFlags: trace_flags_1.TraceFlags.NONE
  };
});
