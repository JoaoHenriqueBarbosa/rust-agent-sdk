// var: require_propagation
var require_propagation = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.PropagationAPI = void 0;
  var global_utils_1 = require_global_utils(), NoopTextMapPropagator_1 = require_NoopTextMapPropagator(), TextMapPropagator_1 = require_TextMapPropagator(), context_helpers_1 = require_context_helpers(), utils_1 = require_utils5(), diag_1 = require_diag(), API_NAME = "propagation", NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator_1.NoopTextMapPropagator;

  class PropagationAPI {
    constructor() {
      this.createBaggage = utils_1.createBaggage, this.getBaggage = context_helpers_1.getBaggage, this.getActiveBaggage = context_helpers_1.getActiveBaggage, this.setBaggage = context_helpers_1.setBaggage, this.deleteBaggage = context_helpers_1.deleteBaggage;
    }
    static getInstance() {
      if (!this._instance)
        this._instance = new PropagationAPI;
      return this._instance;
    }
    setGlobalPropagator(propagator) {
      return (0, global_utils_1.registerGlobal)(API_NAME, propagator, diag_1.DiagAPI.instance());
    }
    inject(context3, carrier, setter = TextMapPropagator_1.defaultTextMapSetter) {
      return this._getGlobalPropagator().inject(context3, carrier, setter);
    }
    extract(context3, carrier, getter = TextMapPropagator_1.defaultTextMapGetter) {
      return this._getGlobalPropagator().extract(context3, carrier, getter);
    }
    fields() {
      return this._getGlobalPropagator().fields();
    }
    disable() {
      (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
    }
    _getGlobalPropagator() {
      return (0, global_utils_1.getGlobal)(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
    }
  }
  exports.PropagationAPI = PropagationAPI;
});
