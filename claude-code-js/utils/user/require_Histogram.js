// var: require_Histogram
var require_Histogram = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.HistogramAggregator = exports.HistogramAccumulation = void 0;
  var types_1 = require_types3(), MetricData_1 = require_MetricData(), utils_1 = require_utils11();
  function createNewEmptyCheckpoint(boundaries) {
    let counts = boundaries.map(() => 0);
    return counts.push(0), {
      buckets: {
        boundaries,
        counts
      },
      sum: 0,
      count: 0,
      hasMinMax: !1,
      min: 1 / 0,
      max: -1 / 0
    };
  }

  class HistogramAccumulation {
    startTime;
    _boundaries;
    _recordMinMax;
    _current;
    constructor(startTime, boundaries, recordMinMax = !0, current = createNewEmptyCheckpoint(boundaries)) {
      this.startTime = startTime, this._boundaries = boundaries, this._recordMinMax = recordMinMax, this._current = current;
    }
    record(value) {
      if (Number.isNaN(value))
        return;
      if (this._current.count += 1, this._current.sum += value, this._recordMinMax)
        this._current.min = Math.min(value, this._current.min), this._current.max = Math.max(value, this._current.max), this._current.hasMinMax = !0;
      let idx = (0, utils_1.binarySearchUB)(this._boundaries, value);
      this._current.buckets.counts[idx] += 1;
    }
    setStartTime(startTime) {
      this.startTime = startTime;
    }
    toPointValue() {
      return this._current;
    }
  }
  exports.HistogramAccumulation = HistogramAccumulation;

  class HistogramAggregator {
    kind = types_1.AggregatorKind.HISTOGRAM;
    _boundaries;
    _recordMinMax;
    constructor(boundaries, recordMinMax) {
      this._boundaries = boundaries, this._recordMinMax = recordMinMax;
    }
    createAccumulation(startTime) {
      return new HistogramAccumulation(startTime, this._boundaries, this._recordMinMax);
    }
    merge(previous, delta) {
      let previousValue = previous.toPointValue(), deltaValue = delta.toPointValue(), previousCounts = previousValue.buckets.counts, deltaCounts = deltaValue.buckets.counts, mergedCounts = Array(previousCounts.length);
      for (let idx = 0;idx < previousCounts.length; idx++)
        mergedCounts[idx] = previousCounts[idx] + deltaCounts[idx];
      let min = 1 / 0, max2 = -1 / 0;
      if (this._recordMinMax) {
        if (previousValue.hasMinMax && deltaValue.hasMinMax)
          min = Math.min(previousValue.min, deltaValue.min), max2 = Math.max(previousValue.max, deltaValue.max);
        else if (previousValue.hasMinMax)
          min = previousValue.min, max2 = previousValue.max;
        else if (deltaValue.hasMinMax)
          min = deltaValue.min, max2 = deltaValue.max;
      }
      return new HistogramAccumulation(previous.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
        buckets: {
          boundaries: previousValue.buckets.boundaries,
          counts: mergedCounts
        },
        count: previousValue.count + deltaValue.count,
        sum: previousValue.sum + deltaValue.sum,
        hasMinMax: this._recordMinMax && (previousValue.hasMinMax || deltaValue.hasMinMax),
        min,
        max: max2
      });
    }
    diff(previous, current) {
      let previousValue = previous.toPointValue(), currentValue = current.toPointValue(), previousCounts = previousValue.buckets.counts, currentCounts = currentValue.buckets.counts, diffedCounts = Array(previousCounts.length);
      for (let idx = 0;idx < previousCounts.length; idx++)
        diffedCounts[idx] = currentCounts[idx] - previousCounts[idx];
      return new HistogramAccumulation(current.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
        buckets: {
          boundaries: previousValue.buckets.boundaries,
          counts: diffedCounts
        },
        count: currentValue.count - previousValue.count,
        sum: currentValue.sum - previousValue.sum,
        hasMinMax: !1,
        min: 1 / 0,
        max: -1 / 0
      });
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
      return {
        descriptor,
        aggregationTemporality,
        dataPointType: MetricData_1.DataPointType.HISTOGRAM,
        dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
          let pointValue2 = accumulation.toPointValue(), allowsNegativeValues = descriptor.type === MetricData_1.InstrumentType.GAUGE || descriptor.type === MetricData_1.InstrumentType.UP_DOWN_COUNTER || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_GAUGE || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
          return {
            attributes,
            startTime: accumulation.startTime,
            endTime,
            value: {
              min: pointValue2.hasMinMax ? pointValue2.min : void 0,
              max: pointValue2.hasMinMax ? pointValue2.max : void 0,
              sum: !allowsNegativeValues ? pointValue2.sum : void 0,
              buckets: pointValue2.buckets,
              count: pointValue2.count
            }
          };
        })
      };
    }
  }
  exports.HistogramAggregator = HistogramAggregator;
});
