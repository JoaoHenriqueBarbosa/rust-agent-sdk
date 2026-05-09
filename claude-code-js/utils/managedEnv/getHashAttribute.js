// function: getHashAttribute
function getHashAttribute(ctx, attr, fallback) {
  let hashAttribute = attr || "id", hashValue = "", attributes2 = getAttributes(ctx);
  if (attributes2[hashAttribute])
    hashValue = attributes2[hashAttribute];
  if (!hashValue && fallback) {
    if (attributes2[fallback])
      hashValue = attributes2[fallback];
    if (hashValue)
      hashAttribute = fallback;
  }
  return {
    hashAttribute,
    hashValue
  };
}
