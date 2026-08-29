// var: require_MeterSharedState
var require_MeterSharedState = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MeterSharedState = void 0;
  var InstrumentDescriptor_1 = require_InstrumentDescriptor(), Meter_1 = require_Meter(), AsyncMetricStorage_1 = require_AsyncMetricStorage(), MetricStorageRegistry_1 = require_MetricStorageRegistry(), MultiWritableMetricStorage_1 = require_MultiWritableMetricStorage(), ObservableRegistry_1 = require_ObservableRegistry(), SyncMetricStorage_1 = require_SyncMetricStorage(), AttributesProcessor_1 = require_AttributesProcessor();

  class MeterSharedState {
    metricStorageRegistry = new MetricStorageRegistry_1.MetricStorageRegistry;
    observableRegistry = new ObservableRegistry_1.ObservableRegistry;
    meter;
    _meterProviderSharedState;
    _instrumentationScope;
    constructor(meterProviderSharedState, instrumentationScope) {
      this.meter = new Meter_1.Meter(this), this._meterProviderSharedState = meterProviderSharedState, this._instrumentationScope = instrumentationScope;
    }
    registerMetricStorage(descriptor) {
      let storages = this._registerMetricStorage(descriptor, SyncMetricStorage_1.SyncMetricStorage);
      if (storages.length === 1)
        return storages[0];
      return new MultiWritableMetricStorage_1.MultiMetricStorage(storages);
    }
    registerAsyncMetricStorage(descriptor) {
      return this._registerMetricStorage(descriptor, AsyncMetricStorage_1.AsyncMetricStorage);
    }
    async collect(collector, collectionTime, options2) {
      let errors8 = await this.observableRegistry.observe(collectionTime, options2?.timeoutMillis), storages = this.metricStorageRegistry.getStorages(collector);
      if (storages.length === 0)
        return null;
      let metricDataList = [];
      if (storages.forEach((metricStorage) => {
        let metricData = metricStorage.collect(collector, collectionTime);
        if (metricData != null)
          metricDataList.push(metricData);
      }), metricDataList.length === 0)
        return { errors: errors8 };
      return {
        scopeMetrics: {
          scope: this._instrumentationScope,
          metrics: metricDataList
        },
        errors: errors8
      };
    }
    _registerMetricStorage(descriptor, MetricStorageType) {
      let storages = this._meterProviderSharedState.viewRegistry.findViews(descriptor, this._instrumentationScope).map((view) => {
        let viewDescriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptorWithView)(view, descriptor), compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleStorage(viewDescriptor);
        if (compatibleStorage != null)
          return compatibleStorage;
        let aggregator = view.aggregation.createAggregator(viewDescriptor), viewStorage = new MetricStorageType(viewDescriptor, aggregator, view.attributesProcessor, this._meterProviderSharedState.metricCollectors, view.aggregationCardinalityLimit);
        return this.metricStorageRegistry.register(viewStorage), viewStorage;
      });
      if (storages.length === 0) {
        let collectorStorages = this._meterProviderSharedState.selectAggregations(descriptor.type).map(([collector, aggregation]) => {
          let compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(collector, descriptor);
          if (compatibleStorage != null)
            return compatibleStorage;
          let aggregator = aggregation.createAggregator(descriptor), cardinalityLimit = collector.selectCardinalityLimit(descriptor.type), storage = new MetricStorageType(descriptor, aggregator, (0, AttributesProcessor_1.createNoopAttributesProcessor)(), [collector], cardinalityLimit);
          return this.metricStorageRegistry.registerForCollector(collector, storage), storage;
        });
        storages = storages.concat(collectorStorages);
      }
      return storages;
    }
  }
  exports.MeterSharedState = MeterSharedState;
});
