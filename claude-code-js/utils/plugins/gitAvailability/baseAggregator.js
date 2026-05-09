// function: baseAggregator
function baseAggregator(collection, setter, iteratee, accumulator) {
  return _baseEach_default(collection, function(value, key, collection2) {
    setter(accumulator, value, iteratee(value), collection2);
  }), accumulator;
}
