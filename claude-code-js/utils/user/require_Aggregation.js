// var: require_Aggregation
var require_Aggregation = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DEFAULT_AGGREGATION = exports.EXPONENTIAL_HISTOGRAM_AGGREGATION = exports.HISTOGRAM_AGGREGATION = exports.LAST_VALUE_AGGREGATION = exports.SUM_AGGREGATION = exports.DROP_AGGREGATION = exports.DefaultAggregation = exports.ExponentialHistogramAggregation = exports.ExplicitBucketHistogramAggregation = exports.HistogramAggregation = exports.LastValueAggregation = exports.SumAggregation = exports.DropAggregation = void 0;
  var api3 = require_src7(), aggregator_1 = require_aggregator(), MetricData_1 = require_MetricData();

  class DropAggregation {
    static DEFAULT_INSTANCE = new aggregator_1.DropAggregator;
    createAggregator(_instrument) {
      return DropAggregation.DEFAULT_INSTANCE;
    }
  }
  exports.DropAggregation = DropAggregation;

  class SumAggregation {
    static MONOTONIC_INSTANCE = new aggregator_1.SumAggregator(!0);
    static NON_MONOTONIC_INSTANCE = new aggregator_1.SumAggregator(!1);
    createAggregator(instrument) {
      switch (instrument.type) {
        case MetricData_1.InstrumentType.COUNTER:
        case MetricData_1.InstrumentType.OBSERVABLE_COUNTER:
        case MetricData_1.InstrumentType.HISTOGRAM:
          return SumAggregation.MONOTONIC_INSTANCE;
        default:
          return SumAggregation.NON_MONOTONIC_INSTANCE;
      }
    }
  }
  exports.SumAggregation = SumAggregation;

  class LastValueAggregation {
    static DEFAULT_INSTANCE = new aggregator_1.LastValueAggregator;
    createAggregator(_instrument) {
      return LastValueAggregation.DEFAULT_INSTANCE;
    }
  }
  exports.LastValueAggregation = LastValueAggregation;

  class HistogramAggregation {
    static DEFAULT_INSTANCE = new aggregator_1.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 1e4], !0);
    createAggregator(_instrument) {
      return HistogramAggregation.DEFAULT_INSTANCE;
    }
  }
  exports.HistogramAggregation = HistogramAggregation;

  class ExplicitBucketHistogramAggregation {
    _boundaries;
    _recordMinMax;
    constructor(boundaries, recordMinMax = !0) {
      if (boundaries == null)
        throw Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
      boundaries = boundaries.concat(), boundaries = boundaries.sort((a2, b) => a2 - b);
      let minusInfinityIndex = boundaries.lastIndexOf(-1 / 0), infinityIndex = boundaries.indexOf(1 / 0);
      if (infinityIndex === -1)
        infinityIndex = void 0;
      this._boundaries = boundaries.slice(minusInfinityIndex + 1, infinityIndex), this._recordMinMax = recordMinMax;
    }
    createAggregator(_instrument) {
      return new aggregator_1.HistogramAggregator(this._boundaries, this._recordMinMax);
    }
  }
  exports.ExplicitBucketHistogramAggregation = ExplicitBucketHistogramAggregation;

  class ExponentialHistogramAggregation {
    _maxSize;
    _recordMinMax;
    constructor(maxSize = 160, recordMinMax = !0) {
      this._maxSize = maxSize, this._recordMinMax = recordMinMax;
    }
    createAggregator(_instrument) {
      return new aggregator_1.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax);
    }
  }
  exports.ExponentialHistogramAggregation = ExponentialHistogramAggregation;

  class DefaultAggregation {
    _resolve(instrument) {
      switch (instrument.type) {
        case MetricData_1.InstrumentType.COUNTER:
        case MetricData_1.InstrumentType.UP_DOWN_COUNTER:
        case MetricData_1.InstrumentType.OBSERVABLE_COUNTER:
        case MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
          return exports.SUM_AGGREGATION;
        case MetricData_1.InstrumentType.GAUGE:
        case MetricData_1.InstrumentType.OBSERVABLE_GAUGE:
          return exports.LAST_VALUE_AGGREGATION;
        case MetricData_1.InstrumentType.HISTOGRAM: {
          if (instrument.advice.explicitBucketBoundaries)
            return new ExplicitBucketHistogramAggregation(instrument.advice.explicitBucketBoundaries);
          return exports.HISTOGRAM_AGGREGATION;
        }
      }
      return api3.diag.warn(`Unable to recognize instrument type: ${instrument.type}`), exports.DROP_AGGREGATION;
    }
    createAggregator(instrument) {
      return this._resolve(instrument).createAggregator(instrument);
    }
  }
  exports.DefaultAggregation = DefaultAggregation;
  exports.DROP_AGGREGATION = new DropAggregation;
  exports.SUM_AGGREGATION = new SumAggregation;
  exports.LAST_VALUE_AGGREGATION = new LastValueAggregation;
  exports.HISTOGRAM_AGGREGATION = new HistogramAggregation;
  exports.EXPONENTIAL_HISTOGRAM_AGGREGATION = new ExponentialHistogramAggregation;
  exports.DEFAULT_AGGREGATION = new DefaultAggregation;
});
