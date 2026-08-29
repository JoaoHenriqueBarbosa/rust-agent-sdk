// function: isIncludedInRollout
function isIncludedInRollout(ctx, seed, hashAttribute, fallbackAttribute, range, coverage, hashVersion) {
  if (!range && coverage === void 0)
    return !0;
  if (!range && coverage === 0)
    return !1;
  let {
    hashValue
  } = getHashAttribute(ctx, hashAttribute, fallbackAttribute);
  if (!hashValue)
    return !1;
  let n6 = hash(seed, hashValue, hashVersion || 1);
  if (n6 === null)
    return !1;
  return range ? inRange(n6, range) : coverage !== void 0 ? n6 <= coverage : !0;
}
