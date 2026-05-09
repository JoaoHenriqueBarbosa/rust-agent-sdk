// function: toHistogramDataPoints
function toHistogramDataPoints(metricData, encoder) {
  return metricData.dataPoints.map((dataPoint) => {
    let histogram = dataPoint.value;
    return {
      attributes: toAttributes(dataPoint.attributes, encoder),
      bucketCounts: histogram.buckets.counts,
      explicitBounds: histogram.buckets.boundaries,
      count: histogram.count,
      sum: histogram.sum,
      min: histogram.min,
      max: histogram.max,
      startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
      timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
    };
  });
}
