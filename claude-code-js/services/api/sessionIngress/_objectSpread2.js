// function: _objectSpread2
function _objectSpread2(e) {
  for (var r4 = 1;r4 < arguments.length; r4++) {
    var t2 = arguments[r4] != null ? arguments[r4] : {};
    r4 % 2 ? ownKeys(Object(t2), !0).forEach(function(r5) {
      _defineProperty(e, r5, t2[r5]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r5) {
      Object.defineProperty(e, r5, Object.getOwnPropertyDescriptor(t2, r5));
    });
  }
  return e;
}
