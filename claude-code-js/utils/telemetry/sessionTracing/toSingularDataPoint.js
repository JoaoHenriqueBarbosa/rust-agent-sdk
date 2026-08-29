// function: toSingularDataPoint
function toSingularDataPoint(dataPoint, valueType, encoder) {
  let out = {
    attributes: toAttributes(dataPoint.attributes, encoder),
    startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
    timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
  };
  switch (valueType) {
    case import_api12.ValueType.INT:
      out.asInt = dataPoint.value;
      break;
    case import_api12.ValueType.DOUBLE:
      out.asDouble = dataPoint.value;
      break;
  }
  return out;
}
