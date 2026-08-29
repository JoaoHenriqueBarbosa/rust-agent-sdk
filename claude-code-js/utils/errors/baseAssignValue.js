// function: baseAssignValue
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && _defineProperty_default)
    _defineProperty_default(object, key, {
      configurable: !0,
      enumerable: !0,
      value,
      writable: !0
    });
  else
    object[key] = value;
}
