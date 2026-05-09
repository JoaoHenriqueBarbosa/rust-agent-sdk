// var: require_context_helpers
var require_context_helpers = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.deleteBaggage = exports.setBaggage = exports.getActiveBaggage = exports.getBaggage = void 0;
  var context_1 = require_context2(), context_2 = require_context(), BAGGAGE_KEY = (0, context_2.createContextKey)("OpenTelemetry Baggage Key");
  function getBaggage(context3) {
    return context3.getValue(BAGGAGE_KEY) || void 0;
  }
  exports.getBaggage = getBaggage;
  function getActiveBaggage() {
    return getBaggage(context_1.ContextAPI.getInstance().active());
  }
  exports.getActiveBaggage = getActiveBaggage;
  function setBaggage(context3, baggage) {
    return context3.setValue(BAGGAGE_KEY, baggage);
  }
  exports.setBaggage = setBaggage;
  function deleteBaggage(context3) {
    return context3.deleteValue(BAGGAGE_KEY);
  }
  exports.deleteBaggage = deleteBaggage;
});
