// function: toAnyValue
function toAnyValue(value, encoder) {
  let t2 = typeof value;
  if (t2 === "string")
    return { stringValue: value };
  if (t2 === "number") {
    if (!Number.isInteger(value))
      return { doubleValue: value };
    return { intValue: value };
  }
  if (t2 === "boolean")
    return { boolValue: value };
  if (value instanceof Uint8Array)
    return { bytesValue: encoder.encodeUint8Array(value) };
  if (Array.isArray(value)) {
    let values3 = Array(value.length);
    for (let i5 = 0;i5 < value.length; i5++)
      values3[i5] = toAnyValue(value[i5], encoder);
    return { arrayValue: { values: values3 } };
  }
  if (t2 === "object" && value != null) {
    let keys2 = Object.keys(value), values3 = Array(keys2.length);
    for (let i5 = 0;i5 < keys2.length; i5++)
      values3[i5] = {
        key: keys2[i5],
        value: toAnyValue(value[keys2[i5]], encoder)
      };
    return { kvlistValue: { values: values3 } };
  }
  return {};
}
