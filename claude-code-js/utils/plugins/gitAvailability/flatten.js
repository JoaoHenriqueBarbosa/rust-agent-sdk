// function: flatten
function flatten(array2) {
  var length = array2 == null ? 0 : array2.length;
  return length ? _baseFlatten_default(array2, 1) : [];
}
