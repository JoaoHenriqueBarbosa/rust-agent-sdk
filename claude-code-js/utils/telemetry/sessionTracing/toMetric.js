// function: toMetric
function toMetric(metricData, encoder) {
  let out = {
    name: metricData.descriptor.name,
    description: metricData.descriptor.description,
    unit: metricData.descriptor.unit
  }, aggregationTemporality = toAggregationTemporality(metricData.aggregationTemporality);
  switch (metricData.dataPointType) {
    case import_sdk_metrics3.DataPointType.SUM:
      out.sum = {
        aggregationTemporality,
        isMonotonic: metricData.isMonotonic,
        dataPoints: toSingularDataPoints(metricData, encoder)
      };
      break;
    case import_sdk_metrics3.DataPointType.GAUGE:
      out.gauge = {
        dataPoints: toSingularDataPoints(metricData, encoder)
      };
      break;
    case import_sdk_metrics3.DataPointType.HISTOGRAM:
      out.histogram = {
        aggregationTemporality,
        dataPoints: toHistogramDataPoints(metricData, encoder)
      };
      break;
    case import_sdk_metrics3.DataPointType.EXPONENTIAL_HISTOGRAM:
      out.exponentialHistogram = {
        aggregationTemporality,
        dataPoints: toExponentialHistogramDataPoints(metricData, encoder)
      };
      break;
  }
  return out;
}
