// function: isFilteredOut
function isFilteredOut(filters2, ctx) {
  return filters2.some((filter3) => {
    let {
      hashValue
    } = getHashAttribute(ctx, filter3.attribute);
    if (!hashValue)
      return !0;
    let n6 = hash(filter3.seed, hashValue, filter3.hashVersion || 2);
    if (n6 === null)
      return !0;
    return !filter3.ranges.some((r4) => inRange(n6, r4));
  });
}
