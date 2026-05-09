// function: toKeyValue
function toKeyValue(key2, value, encoder) {
  return {
    key: key2,
    value: toAnyValue(value, encoder)
  };
}
