// var: require_SyncMetricStorage
var require_SyncMetricStorage = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.SyncMetricStorage = void 0;
  var MetricStorage_1 = require_MetricStorage(), DeltaMetricProcessor_1 = require_DeltaMetricProcessor(), TemporalMetricProcessor_1 = require_TemporalMetricProcessor();

  class SyncMetricStorage extends MetricStorage_1.MetricStorage {
    _aggregationCardinalityLimit;
    _deltaMetricStorage;
    _temporalMetricStorage;
    _attributesProcessor;
    constructor(instrumentDescriptor, aggregator, attributesProcessor, collectorHandles, aggregationCardinalityLimit) {
      super(instrumentDescriptor);
      this._aggregationCardinalityLimit = aggregationCardinalityLimit, this._deltaMetricStorage = new DeltaMetricProcessor_1.DeltaMetricProcessor(aggregator, this._aggregationCardinalityLimit), this._temporalMetricStorage = new TemporalMetricProcessor_1.TemporalMetricProcessor(aggregator, collectorHandles), this._attributesProcessor = attributesProcessor;
    }
    record(value, attributes, context4, recordTime) {
      attributes = this._attributesProcessor.process(attributes, context4), this._deltaMetricStorage.record(value, attributes, context4, recordTime);
    }
    collect(collector, collectionTime) {
      let accumulations = this._deltaMetricStorage.collect();
      return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
    }
  }
  exports.SyncMetricStorage = SyncMetricStorage;
});
