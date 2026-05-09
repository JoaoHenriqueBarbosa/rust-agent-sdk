// function: createAggregator
function createAggregator(setter, initializer3) {
  return function(collection, iteratee) {
    var func = isArray_default(collection) ? _arrayAggregator_default : _baseAggregator_default, accumulator = initializer3 ? initializer3() : {};
    return func(collection, setter, _baseIteratee_default(iteratee, 2), accumulator);
  };
}
