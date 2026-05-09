// function: getForcedFeatureValues
function getForcedFeatureValues(ctx) {
  let ret = /* @__PURE__ */ new Map;
  if (ctx.global.forcedFeatureValues)
    ctx.global.forcedFeatureValues.forEach((v2, k3) => ret.set(k3, v2));
  if (ctx.user.forcedFeatureValues)
    ctx.user.forcedFeatureValues.forEach((v2, k3) => ret.set(k3, v2));
  return ret;
}
