// var: require_metrics
var require_metrics = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MetricsAPI = void 0;
  var NoopMeterProvider_1 = require_NoopMeterProvider(), global_utils_1 = require_global_utils(), diag_1 = require_diag(), API_NAME = "metrics";

  class MetricsAPI {
    constructor() {}
    static getInstance() {
      if (!this._instance)
        this._instance = new MetricsAPI;
      return this._instance;
    }
    setGlobalMeterProvider(provider5) {
      return (0, global_utils_1.registerGlobal)(API_NAME, provider5, diag_1.DiagAPI.instance());
    }
    getMeterProvider() {
      return (0, global_utils_1.getGlobal)(API_NAME) || NoopMeterProvider_1.NOOP_METER_PROVIDER;
    }
    getMeter(name3, version5, options2) {
      return this.getMeterProvider().getMeter(name3, version5, options2);
    }
    disable() {
      (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
    }
  }
  exports.MetricsAPI = MetricsAPI;
});
