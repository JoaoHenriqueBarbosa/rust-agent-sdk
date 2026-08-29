// var: require_AggregationSelector
var require_AggregationSelector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = exports.DEFAULT_AGGREGATION_SELECTOR = void 0;
  var AggregationTemporality_1 = require_AggregationTemporality(), AggregationOption_1 = require_AggregationOption(), DEFAULT_AGGREGATION_SELECTOR = (_instrumentType) => {
    return {
      type: AggregationOption_1.AggregationType.DEFAULT
    };
  };
  exports.DEFAULT_AGGREGATION_SELECTOR = DEFAULT_AGGREGATION_SELECTOR;
  var DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = (_instrumentType) => AggregationTemporality_1.AggregationTemporality.CUMULATIVE;
  exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
});
