// var: require_TemporalMetricProcessor
var require_TemporalMetricProcessor = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.TemporalMetricProcessor = void 0;
  var AggregationTemporality_1 = require_AggregationTemporality(), HashMap_1 = require_HashMap();

  class TemporalMetricProcessor {
    _aggregator;
    _unreportedAccumulations = /* @__PURE__ */ new Map;
    _reportHistory = /* @__PURE__ */ new Map;
    constructor(aggregator, collectorHandles) {
      this._aggregator = aggregator, collectorHandles.forEach((handle) => {
        this._unreportedAccumulations.set(handle, []);
      });
    }
    buildMetrics(collector, instrumentDescriptor, currentAccumulations, collectionTime) {
      this._stashAccumulations(currentAccumulations);
      let unreportedAccumulations = this._getMergedUnreportedAccumulations(collector), result = unreportedAccumulations, aggregationTemporality;
      if (this._reportHistory.has(collector)) {
        let last2 = this._reportHistory.get(collector), lastCollectionTime = last2.collectionTime;
        if (aggregationTemporality = last2.aggregationTemporality, aggregationTemporality === AggregationTemporality_1.AggregationTemporality.CUMULATIVE)
          result = TemporalMetricProcessor.merge(last2.accumulations, unreportedAccumulations, this._aggregator);
        else
          result = TemporalMetricProcessor.calibrateStartTime(last2.accumulations, unreportedAccumulations, lastCollectionTime);
      } else
        aggregationTemporality = collector.selectAggregationTemporality(instrumentDescriptor.type);
      this._reportHistory.set(collector, {
        accumulations: result,
        collectionTime,
        aggregationTemporality
      });
      let accumulationRecords = AttributesMapToAccumulationRecords(result);
      if (accumulationRecords.length === 0)
        return;
      return this._aggregator.toMetricData(instrumentDescriptor, aggregationTemporality, accumulationRecords, collectionTime);
    }
    _stashAccumulations(currentAccumulation) {
      let registeredCollectors = this._unreportedAccumulations.keys();
      for (let collector of registeredCollectors) {
        let stash = this._unreportedAccumulations.get(collector);
        if (stash === void 0)
          stash = [], this._unreportedAccumulations.set(collector, stash);
        stash.push(currentAccumulation);
      }
    }
    _getMergedUnreportedAccumulations(collector) {
      let result = new HashMap_1.AttributeHashMap, unreportedList = this._unreportedAccumulations.get(collector);
      if (this._unreportedAccumulations.set(collector, []), unreportedList === void 0)
        return result;
      for (let it of unreportedList)
        result = TemporalMetricProcessor.merge(result, it, this._aggregator);
      return result;
    }
    static merge(last2, current, aggregator) {
      let result = last2, iterator2 = current.entries(), next = iterator2.next();
      while (next.done !== !0) {
        let [key2, record3, hash] = next.value;
        if (last2.has(key2, hash)) {
          let lastAccumulation = last2.get(key2, hash), accumulation = aggregator.merge(lastAccumulation, record3);
          result.set(key2, accumulation, hash);
        } else
          result.set(key2, record3, hash);
        next = iterator2.next();
      }
      return result;
    }
    static calibrateStartTime(last2, current, lastCollectionTime) {
      for (let [key2, hash] of last2.keys())
        current.get(key2, hash)?.setStartTime(lastCollectionTime);
      return current;
    }
  }
  exports.TemporalMetricProcessor = TemporalMetricProcessor;
  function AttributesMapToAccumulationRecords(map8) {
    return Array.from(map8.entries());
  }
});
