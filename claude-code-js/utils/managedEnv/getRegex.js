// function: getRegex
function getRegex(regex2, insensitive = !1) {
  let cacheKey = `${regex2}${insensitive ? "/i" : ""}`;
  if (!_regexCache[cacheKey])
    _regexCache[cacheKey] = new RegExp(regex2.replace(/([^\\])\//g, "$1\\/"), insensitive ? "i" : void 0);
  return _regexCache[cacheKey];
}
