// function: arrayAggregator
function arrayAggregator(array2, setter, iteratee, accumulator) {
  var index = -1, length = array2 == null ? 0 : array2.length;
  while (++index < length) {
    var value = array2[index];
    setter(accumulator, value, iteratee(value), array2);
  }
  return accumulator;
}
