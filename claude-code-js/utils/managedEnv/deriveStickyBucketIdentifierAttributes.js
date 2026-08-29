// function: deriveStickyBucketIdentifierAttributes
function deriveStickyBucketIdentifierAttributes(ctx, data) {
  let attributes2 = /* @__PURE__ */ new Set, features = data && data.features ? data.features : ctx.global.features || {}, experiments = data && data.experiments ? data.experiments : ctx.global.experiments || [];
  return Object.keys(features).forEach((id) => {
    let feature = features[id];
    if (feature.rules) {
      for (let rule of feature.rules)
        if (rule.variations) {
          if (attributes2.add(rule.hashAttribute || "id"), rule.fallbackAttribute)
            attributes2.add(rule.fallbackAttribute);
        }
    }
  }), experiments.map((experiment) => {
    if (attributes2.add(experiment.hashAttribute || "id"), experiment.fallbackAttribute)
      attributes2.add(experiment.fallbackAttribute);
  }), Array.from(attributes2);
}
