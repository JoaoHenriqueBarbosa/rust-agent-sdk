// var: require_AsyncMetricStorage
var require_AsyncMetricStorage = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AsyncMetricStorage = void 0;
  var MetricStorage_1 = require_MetricStorage(), DeltaMetricProcessor_1 = require_DeltaMetricProcessor(), TemporalMetricProcessor_1 = require_TemporalMetricProcessor(), HashMap_1 = require_HashMap();

  class AsyncMetricStorage extends MetricStorage_1.MetricStorage {
    _aggregationCardinalityLimit;
    _deltaMetricStorage;
    _temporalMetricStorage;
    _attributesProcessor;
    constructor(_instrumentDescriptor, aggregator, attributesProcessor, collectorHandles, aggregationCardinalityLimit) {
      super(_instrumentDescriptor);
      this._aggregationCardinalityLimit = aggregationCardinalityLimit, this._deltaMetricStorage = new DeltaMetricProcessor_1.DeltaMetricProcessor(aggregator, this._aggregationCardinalityLimit), this._temporalMetricStorage = new TemporalMetricProcessor_1.TemporalMetricProcessor(aggregator, collectorHandles), this._attributesProcessor = attributesProcessor;
    }
    record(measurements, observationTime) {
      let processed = new HashMap_1.AttributeHashMap;
      Array.from(measurements.entries()).forEach(([attributes, value]) => {
        processed.set(this._attributesProcessor.process(attributes), value);
      }), this._deltaMetricStorage.batchCumulate(processed, observationTime);
    }
    collect(collector, collectionTime) {
      let accumulations = this._deltaMetricStorage.collect();
      return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
    }
  }
  exports.AsyncMetricStorage = AsyncMetricStorage;
});
