// function: getApplySeccompBinaryPath
function getApplySeccompBinaryPath(seccompBinaryPath) {
  let cacheKey = seccompBinaryPath ?? "";
  if (applySeccompPathCache.has(cacheKey))
    return applySeccompPathCache.get(cacheKey);
  let result = findApplySeccompPath(seccompBinaryPath);
  return applySeccompPathCache.set(cacheKey, result), result;
}
