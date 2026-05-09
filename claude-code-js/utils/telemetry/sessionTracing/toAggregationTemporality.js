// function: toAggregationTemporality
function toAggregationTemporality(temporality) {
  switch (temporality) {
    case import_sdk_metrics3.AggregationTemporality.DELTA:
      return EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
    case import_sdk_metrics3.AggregationTemporality.CUMULATIVE:
      return EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE;
  }
}
