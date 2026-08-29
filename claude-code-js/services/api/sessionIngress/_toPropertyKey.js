// function: _toPropertyKey
function _toPropertyKey(t2) {
  var i5 = _toPrimitive(t2, "string");
  return typeof i5 == "symbol" ? i5 : i5 + "";
}
