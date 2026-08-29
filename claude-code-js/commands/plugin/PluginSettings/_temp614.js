// function: _temp614
function _temp614(e_0) {
  if (isTransientError(e_0))
    return !1;
  if (e_0.type === "marketplace-not-found" || e_0.type === "marketplace-load-failed" || e_0.type === "marketplace-blocked-by-policy")
    return !1;
  return getPluginNameFromError(e_0) !== void 0;
}
