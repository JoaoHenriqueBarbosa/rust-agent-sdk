// var: require_MetricReader
var require_MetricReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MetricReader = void 0;
  var api3 = require_src7(), utils_1 = require_utils11(), AggregationSelector_1 = require_AggregationSelector();

  class MetricReader {
    _shutdown = !1;
    _metricProducers;
    _sdkMetricProducer;
    _aggregationTemporalitySelector;
    _aggregationSelector;
    _cardinalitySelector;
    constructor(options2) {
      this._aggregationSelector = options2?.aggregationSelector ?? AggregationSelector_1.DEFAULT_AGGREGATION_SELECTOR, this._aggregationTemporalitySelector = options2?.aggregationTemporalitySelector ?? AggregationSelector_1.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR, this._metricProducers = options2?.metricProducers ?? [], this._cardinalitySelector = options2?.cardinalitySelector;
    }
    setMetricProducer(metricProducer) {
      if (this._sdkMetricProducer)
        throw Error("MetricReader can not be bound to a MeterProvider again.");
      this._sdkMetricProducer = metricProducer, this.onInitialized();
    }
    selectAggregation(instrumentType) {
      return this._aggregationSelector(instrumentType);
    }
    selectAggregationTemporality(instrumentType) {
      return this._aggregationTemporalitySelector(instrumentType);
    }
    selectCardinalityLimit(instrumentType) {
      return this._cardinalitySelector ? this._cardinalitySelector(instrumentType) : 2000;
    }
    onInitialized() {}
    async collect(options2) {
      if (this._sdkMetricProducer === void 0)
        throw Error("MetricReader is not bound to a MetricProducer");
      if (this._shutdown)
        throw Error("MetricReader is shutdown");
      let [sdkCollectionResults, ...additionalCollectionResults] = await Promise.all([
        this._sdkMetricProducer.collect({
          timeoutMillis: options2?.timeoutMillis
        }),
        ...this._metricProducers.map((producer) => producer.collect({
          timeoutMillis: options2?.timeoutMillis
        }))
      ]), errors8 = sdkCollectionResults.errors.concat(additionalCollectionResults.flatMap((result) => result.errors)), resource = sdkCollectionResults.resourceMetrics.resource, scopeMetrics = sdkCollectionResults.resourceMetrics.scopeMetrics.concat(additionalCollectionResults.flatMap((result) => result.resourceMetrics.scopeMetrics));
      return {
        resourceMetrics: {
          resource,
          scopeMetrics
        },
        errors: errors8
      };
    }
    async shutdown(options2) {
      if (this._shutdown) {
        api3.diag.error("Cannot call shutdown twice.");
        return;
      }
      if (options2?.timeoutMillis == null)
        await this.onShutdown();
      else
        await (0, utils_1.callWithTimeout)(this.onShutdown(), options2.timeoutMillis);
      this._shutdown = !0;
    }
    async forceFlush(options2) {
      if (this._shutdown) {
        api3.diag.warn("Cannot forceFlush on already shutdown MetricReader.");
        return;
      }
      if (options2?.timeoutMillis == null) {
        await this.onForceFlush();
        return;
      }
      await (0, utils_1.callWithTimeout)(this.onForceFlush(), options2.timeoutMillis);
    }
  }
  exports.MetricReader = MetricReader;
});
