// function: _defineProperty
function _defineProperty(obj, key2, value) {
  if (key2 = _toPropertyKey(key2), key2 in obj)
    Object.defineProperty(obj, key2, {
      value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    });
  else
    obj[key2] = value;
  return obj;
}
