// var: require_context_utils
var require_context_utils = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getSpanContext = exports.setSpanContext = exports.deleteSpan = exports.setSpan = exports.getActiveSpan = exports.getSpan = void 0;
  var context_1 = require_context(), NonRecordingSpan_1 = require_NonRecordingSpan(), context_2 = require_context2(), SPAN_KEY = (0, context_1.createContextKey)("OpenTelemetry Context Key SPAN");
  function getSpan(context3) {
    return context3.getValue(SPAN_KEY) || void 0;
  }
  exports.getSpan = getSpan;
  function getActiveSpan() {
    return getSpan(context_2.ContextAPI.getInstance().active());
  }
  exports.getActiveSpan = getActiveSpan;
  function setSpan(context3, span) {
    return context3.setValue(SPAN_KEY, span);
  }
  exports.setSpan = setSpan;
  function deleteSpan(context3) {
    return context3.deleteValue(SPAN_KEY);
  }
  exports.deleteSpan = deleteSpan;
  function setSpanContext(context3, spanContext) {
    return setSpan(context3, new NonRecordingSpan_1.NonRecordingSpan(spanContext));
  }
  exports.setSpanContext = setSpanContext;
  function getSpanContext(context3) {
    var _a3;
    return (_a3 = getSpan(context3)) === null || _a3 === void 0 ? void 0 : _a3.spanContext();
  }
  exports.getSpanContext = getSpanContext;
});
