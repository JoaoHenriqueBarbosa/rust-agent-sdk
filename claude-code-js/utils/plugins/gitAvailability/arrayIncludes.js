// function: arrayIncludes
function arrayIncludes(array2, value) {
  var length = array2 == null ? 0 : array2.length;
  return !!length && _baseIndexOf_default(array2, value, 0) > -1;
}
