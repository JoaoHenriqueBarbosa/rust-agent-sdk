// var: require_MetricCollector
var require_MetricCollector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MetricCollector = void 0;
  var core_1 = require_src9();

  class MetricCollector {
    _sharedState;
    _metricReader;
    constructor(sharedState, metricReader) {
      this._sharedState = sharedState, this._metricReader = metricReader;
    }
    async collect(options2) {
      let collectionTime = (0, core_1.millisToHrTime)(Date.now()), scopeMetrics = [], errors8 = [], meterCollectionPromises = Array.from(this._sharedState.meterSharedStates.values()).map(async (meterSharedState) => {
        let current = await meterSharedState.collect(this, collectionTime, options2);
        if (current?.scopeMetrics != null)
          scopeMetrics.push(current.scopeMetrics);
        if (current?.errors != null)
          errors8.push(...current.errors);
      });
      return await Promise.all(meterCollectionPromises), {
        resourceMetrics: {
          resource: this._sharedState.resource,
          scopeMetrics
        },
        errors: errors8
      };
    }
    async forceFlush(options2) {
      await this._metricReader.forceFlush(options2);
    }
    async shutdown(options2) {
      await this._metricReader.shutdown(options2);
    }
    selectAggregationTemporality(instrumentType) {
      return this._metricReader.selectAggregationTemporality(instrumentType);
    }
    selectAggregation(instrumentType) {
      return this._metricReader.selectAggregation(instrumentType);
    }
    selectCardinalityLimit(instrumentType) {
      return this._metricReader.selectCardinalityLimit?.(instrumentType) ?? 2000;
    }
  }
  exports.MetricCollector = MetricCollector;
});
