// function: shouldIncludeFileReadMitigation
function shouldIncludeFileReadMitigation() {
  let shortName = getCanonicalName(getMainLoopModel());
  return !MITIGATION_EXEMPT_MODELS.has(shortName);
}
