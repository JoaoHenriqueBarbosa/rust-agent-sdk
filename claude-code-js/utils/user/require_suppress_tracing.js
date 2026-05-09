// var: require_suppress_tracing
var require_suppress_tracing = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isTracingSuppressed = exports.unsuppressTracing = exports.suppressTracing = void 0;
  var api_1 = require_src7(), SUPPRESS_TRACING_KEY = (0, api_1.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
  function suppressTracing(context3) {
    return context3.setValue(SUPPRESS_TRACING_KEY, !0);
  }
  exports.suppressTracing = suppressTracing;
  function unsuppressTracing(context3) {
    return context3.deleteValue(SUPPRESS_TRACING_KEY);
  }
  exports.unsuppressTracing = unsuppressTracing;
  function isTracingSuppressed(context3) {
    return context3.getValue(SUPPRESS_TRACING_KEY) === !0;
  }
  exports.isTracingSuppressed = isTracingSuppressed;
});
