// var: require_InMemoryMetricExporter
var require_InMemoryMetricExporter = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.InMemoryMetricExporter = void 0;
  var core_1 = require_src9();

  class InMemoryMetricExporter {
    _shutdown = !1;
    _aggregationTemporality;
    _metrics = [];
    constructor(aggregationTemporality) {
      this._aggregationTemporality = aggregationTemporality;
    }
    export(metrics, resultCallback) {
      if (this._shutdown) {
        setTimeout(() => resultCallback({ code: core_1.ExportResultCode.FAILED }), 0);
        return;
      }
      this._metrics.push(metrics), setTimeout(() => resultCallback({ code: core_1.ExportResultCode.SUCCESS }), 0);
    }
    getMetrics() {
      return this._metrics;
    }
    forceFlush() {
      return Promise.resolve();
    }
    reset() {
      this._metrics = [];
    }
    selectAggregationTemporality(_instrumentType) {
      return this._aggregationTemporality;
    }
    shutdown() {
      return this._shutdown = !0, Promise.resolve();
    }
  }
  exports.InMemoryMetricExporter = InMemoryMetricExporter;
});
