// function: toLogAttributes
function toLogAttributes(attributes, encoder) {
  return Object.keys(attributes).map((key2) => toKeyValue(key2, attributes[key2], encoder));
}
