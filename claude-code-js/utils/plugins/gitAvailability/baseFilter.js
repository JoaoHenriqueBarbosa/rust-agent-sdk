// function: baseFilter
function baseFilter(collection, predicate) {
  var result = [];
  return _baseEach_default(collection, function(value, index, collection2) {
    if (predicate(value, index, collection2))
      result.push(value);
  }), result;
}
