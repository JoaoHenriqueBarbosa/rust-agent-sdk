// var: require_MeterProvider
var require_MeterProvider = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MeterProvider = void 0;
  var api_1 = require_src7(), resources_1 = require_src10(), MeterProviderSharedState_1 = require_MeterProviderSharedState(), MetricCollector_1 = require_MetricCollector(), View_1 = require_View();

  class MeterProvider {
    _sharedState;
    _shutdown = !1;
    constructor(options2) {
      if (this._sharedState = new MeterProviderSharedState_1.MeterProviderSharedState(options2?.resource ?? (0, resources_1.defaultResource)()), options2?.views != null && options2.views.length > 0)
        for (let viewOption of options2.views)
          this._sharedState.viewRegistry.addView(new View_1.View(viewOption));
      if (options2?.readers != null && options2.readers.length > 0)
        for (let metricReader of options2.readers) {
          let collector = new MetricCollector_1.MetricCollector(this._sharedState, metricReader);
          metricReader.setMetricProducer(collector), this._sharedState.metricCollectors.push(collector);
        }
    }
    getMeter(name3, version5 = "", options2 = {}) {
      if (this._shutdown)
        return api_1.diag.warn("A shutdown MeterProvider cannot provide a Meter"), (0, api_1.createNoopMeter)();
      return this._sharedState.getMeterSharedState({
        name: name3,
        version: version5,
        schemaUrl: options2.schemaUrl
      }).meter;
    }
    async shutdown(options2) {
      if (this._shutdown) {
        api_1.diag.warn("shutdown may only be called once per MeterProvider");
        return;
      }
      this._shutdown = !0, await Promise.all(this._sharedState.metricCollectors.map((collector) => {
        return collector.shutdown(options2);
      }));
    }
    async forceFlush(options2) {
      if (this._shutdown) {
        api_1.diag.warn("invalid attempt to force flush after MeterProvider shutdown");
        return;
      }
      await Promise.all(this._sharedState.metricCollectors.map((collector) => {
        return collector.forceFlush(options2);
      }));
    }
  }
  exports.MeterProvider = MeterProvider;
});
