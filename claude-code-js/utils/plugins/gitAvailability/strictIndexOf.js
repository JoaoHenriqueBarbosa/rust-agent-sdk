// function: strictIndexOf
function strictIndexOf(array2, value, fromIndex) {
  var index = fromIndex - 1, length = array2.length;
  while (++index < length)
    if (array2[index] === value)
      return index;
  return -1;
}
