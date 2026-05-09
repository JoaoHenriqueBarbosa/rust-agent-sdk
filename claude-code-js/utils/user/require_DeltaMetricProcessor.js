// var: require_DeltaMetricProcessor
var require_DeltaMetricProcessor = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DeltaMetricProcessor = void 0;
  var utils_1 = require_utils11(), HashMap_1 = require_HashMap();

  class DeltaMetricProcessor {
    _activeCollectionStorage = new HashMap_1.AttributeHashMap;
    _cumulativeMemoStorage = new HashMap_1.AttributeHashMap;
    _cardinalityLimit;
    _overflowAttributes = { "otel.metric.overflow": !0 };
    _overflowHashCode;
    _aggregator;
    constructor(aggregator, aggregationCardinalityLimit) {
      this._aggregator = aggregator, this._cardinalityLimit = (aggregationCardinalityLimit ?? 2000) - 1, this._overflowHashCode = (0, utils_1.hashAttributes)(this._overflowAttributes);
    }
    record(value, attributes, _context, collectionTime) {
      let accumulation = this._activeCollectionStorage.get(attributes);
      if (!accumulation) {
        if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
          this._activeCollectionStorage.getOrDefault(this._overflowAttributes, () => this._aggregator.createAccumulation(collectionTime))?.record(value);
          return;
        }
        accumulation = this._aggregator.createAccumulation(collectionTime), this._activeCollectionStorage.set(attributes, accumulation);
      }
      accumulation?.record(value);
    }
    batchCumulate(measurements, collectionTime) {
      Array.from(measurements.entries()).forEach(([attributes, value, hashCode]) => {
        let accumulation = this._aggregator.createAccumulation(collectionTime);
        accumulation?.record(value);
        let delta = accumulation;
        if (this._cumulativeMemoStorage.has(attributes, hashCode)) {
          let previous = this._cumulativeMemoStorage.get(attributes, hashCode);
          delta = this._aggregator.diff(previous, accumulation);
        } else if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
          if (attributes = this._overflowAttributes, hashCode = this._overflowHashCode, this._cumulativeMemoStorage.has(attributes, hashCode)) {
            let previous = this._cumulativeMemoStorage.get(attributes, hashCode);
            delta = this._aggregator.diff(previous, accumulation);
          }
        }
        if (this._activeCollectionStorage.has(attributes, hashCode)) {
          let active = this._activeCollectionStorage.get(attributes, hashCode);
          delta = this._aggregator.merge(active, delta);
        }
        this._cumulativeMemoStorage.set(attributes, accumulation, hashCode), this._activeCollectionStorage.set(attributes, delta, hashCode);
      });
    }
    collect() {
      let unreportedDelta = this._activeCollectionStorage;
      return this._activeCollectionStorage = new HashMap_1.AttributeHashMap, unreportedDelta;
    }
  }
  exports.DeltaMetricProcessor = DeltaMetricProcessor;
});
