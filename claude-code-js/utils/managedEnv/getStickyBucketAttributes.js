// function: getStickyBucketAttributes
function getStickyBucketAttributes(ctx, data) {
  let attributes2 = {};
  return deriveStickyBucketIdentifierAttributes(ctx, data).forEach((attr) => {
    let {
      hashValue
    } = getHashAttribute(ctx, attr);
    attributes2[attr] = toString7(hashValue);
  }), attributes2;
}
