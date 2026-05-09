// function: defaultExtractSearchText
function defaultExtractSearchText(msg) {
  let cached3 = fallbackLowerCache.get(msg);
  if (cached3 !== void 0)
    return cached3;
  let lowered = renderableSearchText(msg);
  return fallbackLowerCache.set(msg, lowered), lowered;
}
