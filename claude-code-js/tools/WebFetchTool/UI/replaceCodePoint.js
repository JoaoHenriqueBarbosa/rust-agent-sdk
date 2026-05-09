// function: replaceCodePoint
function replaceCodePoint(codePoint) {
  var _a4;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111)
    return 65533;
  return (_a4 = decodeMap.get(codePoint)) !== null && _a4 !== void 0 ? _a4 : codePoint;
}
