// var: require_ConsoleMetricExporter
var require_ConsoleMetricExporter = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ConsoleMetricExporter = void 0;
  var core_1 = require_src9(), AggregationSelector_1 = require_AggregationSelector();

  class ConsoleMetricExporter {
    _shutdown = !1;
    _temporalitySelector;
    constructor(options2) {
      this._temporalitySelector = options2?.temporalitySelector ?? AggregationSelector_1.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
    }
    export(metrics, resultCallback) {
      if (this._shutdown) {
        resultCallback({ code: core_1.ExportResultCode.FAILED });
        return;
      }
      return ConsoleMetricExporter._sendMetrics(metrics, resultCallback);
    }
    forceFlush() {
      return Promise.resolve();
    }
    selectAggregationTemporality(_instrumentType) {
      return this._temporalitySelector(_instrumentType);
    }
    shutdown() {
      return this._shutdown = !0, Promise.resolve();
    }
    static _sendMetrics(metrics, done) {
      for (let scopeMetrics of metrics.scopeMetrics)
        for (let metric of scopeMetrics.metrics)
          console.dir({
            descriptor: metric.descriptor,
            dataPointType: metric.dataPointType,
            dataPoints: metric.dataPoints
          }, { depth: null });
      done({ code: core_1.ExportResultCode.SUCCESS });
    }
  }
  exports.ConsoleMetricExporter = ConsoleMetricExporter;
});
