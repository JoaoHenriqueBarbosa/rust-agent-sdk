// function: baseUnset
function baseUnset(object2, path16) {
  path16 = _castPath_default(path16, object2);
  var index = -1, length = path16.length;
  if (!length)
    return !0;
  while (++index < length) {
    var key = _toKey_default(path16[index]);
    if (key === "__proto__" && !hasOwnProperty15.call(object2, "__proto__"))
      return !1;
    if ((key === "constructor" || key === "prototype") && index < length - 1)
      return !1;
  }
  var obj = _parent_default(object2, path16);
  return obj == null || delete obj[_toKey_default(last_default(path16))];
}
