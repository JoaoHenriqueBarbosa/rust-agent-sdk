// function: arrayEach
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length)
    if (iteratee(array[index], index, array) === !1)
      break;
  return array;
}
