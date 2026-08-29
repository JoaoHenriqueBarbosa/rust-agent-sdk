// function: toSingularDataPoints
function toSingularDataPoints(metricData, encoder) {
  return metricData.dataPoints.map((dataPoint) => {
    return toSingularDataPoint(dataPoint, metricData.descriptor.valueType, encoder);
  });
}
