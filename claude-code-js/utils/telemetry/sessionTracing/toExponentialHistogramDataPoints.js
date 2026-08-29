// function: toExponentialHistogramDataPoints
function toExponentialHistogramDataPoints(metricData, encoder) {
  return metricData.dataPoints.map((dataPoint) => {
    let histogram = dataPoint.value;
    return {
      attributes: toAttributes(dataPoint.attributes, encoder),
      count: histogram.count,
      min: histogram.min,
      max: histogram.max,
      sum: histogram.sum,
      positive: {
        offset: histogram.positive.offset,
        bucketCounts: histogram.positive.bucketCounts
      },
      negative: {
        offset: histogram.negative.offset,
        bucketCounts: histogram.negative.bucketCounts
      },
      scale: histogram.scale,
      zeroCount: histogram.zeroCount,
      startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
      timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
    };
  });
}
