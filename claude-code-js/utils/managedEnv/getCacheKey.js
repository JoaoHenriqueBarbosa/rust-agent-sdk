// function: getCacheKey
function getCacheKey(instance) {
  let baseKey = getKey(instance);
  if (!("isRemoteEval" in instance) || !instance.isRemoteEval())
    return baseKey;
  let attributes2 = instance.getAttributes(), cacheKeyAttributes = instance.getCacheKeyAttributes() || Object.keys(instance.getAttributes()), ca2 = {};
  cacheKeyAttributes.forEach((key3) => {
    ca2[key3] = attributes2[key3];
  });
  let fv = instance.getForcedVariations(), url3 = instance.getUrl();
  return `${baseKey}||${JSON.stringify({
    ca: ca2,
    fv,
    url: url3
  })}`;
}
