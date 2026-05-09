// function: arrayIncludesWith
function arrayIncludesWith(array2, value, comparator) {
  var index = -1, length = array2 == null ? 0 : array2.length;
  while (++index < length)
    if (comparator(value, array2[index]))
      return !0;
  return !1;
}
