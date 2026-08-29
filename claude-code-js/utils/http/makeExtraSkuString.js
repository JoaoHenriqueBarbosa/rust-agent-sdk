// function: makeExtraSkuString
function makeExtraSkuString(params) {
  let { skus, libraryName, libraryVersion, extensionName, extensionVersion } = params, skuMap = /* @__PURE__ */ new Map([
    [0, [libraryName, libraryVersion]],
    [2, [extensionName, extensionVersion]]
  ]), skuArr = [];
  if (skus?.length) {
    if (skuArr = skus.split(skuGroupSeparator), skuArr.length < 4)
      return skus;
  } else
    skuArr = Array.from({ length: 4 }, () => skuValueSeparator);
  return skuMap.forEach((value, key) => {
    if (value.length === 2 && value[0]?.length && value[1]?.length)
      setSku({
        skuArr,
        index: key,
        skuName: value[0],
        skuVersion: value[1]
      });
  }), skuArr.join(skuGroupSeparator);
}
