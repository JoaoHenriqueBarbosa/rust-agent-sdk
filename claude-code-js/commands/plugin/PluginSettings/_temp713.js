// function: _temp713
function _temp713(e_1) {
  if (isTransientError(e_1))
    return !1;
  if (e_1.type === "marketplace-not-found" || e_1.type === "marketplace-load-failed" || e_1.type === "marketplace-blocked-by-policy")
    return !1;
  return getPluginNameFromError(e_1) === void 0;
}
