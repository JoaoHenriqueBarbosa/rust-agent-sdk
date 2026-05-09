// var: require_aggregator
var require_aggregator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.SumAggregator = exports.SumAccumulation = exports.LastValueAggregator = exports.LastValueAccumulation = exports.ExponentialHistogramAggregator = exports.ExponentialHistogramAccumulation = exports.HistogramAggregator = exports.HistogramAccumulation = exports.DropAggregator = void 0;
  var Drop_1 = require_Drop();
  Object.defineProperty(exports, "DropAggregator", { enumerable: !0, get: function() {
    return Drop_1.DropAggregator;
  } });
  var Histogram_1 = require_Histogram();
  Object.defineProperty(exports, "HistogramAccumulation", { enumerable: !0, get: function() {
    return Histogram_1.HistogramAccumulation;
  } });
  Object.defineProperty(exports, "HistogramAggregator", { enumerable: !0, get: function() {
    return Histogram_1.HistogramAggregator;
  } });
  var ExponentialHistogram_1 = require_ExponentialHistogram();
  Object.defineProperty(exports, "ExponentialHistogramAccumulation", { enumerable: !0, get: function() {
    return ExponentialHistogram_1.ExponentialHistogramAccumulation;
  } });
  Object.defineProperty(exports, "ExponentialHistogramAggregator", { enumerable: !0, get: function() {
    return ExponentialHistogram_1.ExponentialHistogramAggregator;
  } });
  var LastValue_1 = require_LastValue();
  Object.defineProperty(exports, "LastValueAccumulation", { enumerable: !0, get: function() {
    return LastValue_1.LastValueAccumulation;
  } });
  Object.defineProperty(exports, "LastValueAggregator", { enumerable: !0, get: function() {
    return LastValue_1.LastValueAggregator;
  } });
  var Sum_1 = require_Sum();
  Object.defineProperty(exports, "SumAccumulation", { enumerable: !0, get: function() {
    return Sum_1.SumAccumulation;
  } });
  Object.defineProperty(exports, "SumAggregator", { enumerable: !0, get: function() {
    return Sum_1.SumAggregator;
  } });
});
