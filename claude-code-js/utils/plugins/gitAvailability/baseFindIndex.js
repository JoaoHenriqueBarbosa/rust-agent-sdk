// function: baseFindIndex
function baseFindIndex(array2, predicate, fromIndex, fromRight) {
  var length = array2.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length)
    if (predicate(array2[index], index, array2))
      return index;
  return -1;
}
