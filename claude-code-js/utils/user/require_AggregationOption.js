// var: require_AggregationOption
var require_AggregationOption = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.toAggregation = exports.AggregationType = void 0;
  var Aggregation_1 = require_Aggregation(), AggregationType;
  (function(AggregationType2) {
    AggregationType2[AggregationType2.DEFAULT = 0] = "DEFAULT", AggregationType2[AggregationType2.DROP = 1] = "DROP", AggregationType2[AggregationType2.SUM = 2] = "SUM", AggregationType2[AggregationType2.LAST_VALUE = 3] = "LAST_VALUE", AggregationType2[AggregationType2.EXPLICIT_BUCKET_HISTOGRAM = 4] = "EXPLICIT_BUCKET_HISTOGRAM", AggregationType2[AggregationType2.EXPONENTIAL_HISTOGRAM = 5] = "EXPONENTIAL_HISTOGRAM";
  })(AggregationType = exports.AggregationType || (exports.AggregationType = {}));
  function toAggregation(option) {
    switch (option.type) {
      case AggregationType.DEFAULT:
        return Aggregation_1.DEFAULT_AGGREGATION;
      case AggregationType.DROP:
        return Aggregation_1.DROP_AGGREGATION;
      case AggregationType.SUM:
        return Aggregation_1.SUM_AGGREGATION;
      case AggregationType.LAST_VALUE:
        return Aggregation_1.LAST_VALUE_AGGREGATION;
      case AggregationType.EXPONENTIAL_HISTOGRAM: {
        let expOption = option;
        return new Aggregation_1.ExponentialHistogramAggregation(expOption.options?.maxSize, expOption.options?.recordMinMax);
      }
      case AggregationType.EXPLICIT_BUCKET_HISTOGRAM: {
        let expOption = option;
        if (expOption.options == null)
          return Aggregation_1.HISTOGRAM_AGGREGATION;
        else
          return new Aggregation_1.ExplicitBucketHistogramAggregation(expOption.options?.boundaries, expOption.options?.recordMinMax);
      }
      default:
        throw Error("Unsupported Aggregation");
    }
  }
  exports.toAggregation = toAggregation;
});
