// function: reject
function reject(collection, predicate) {
  var func = isArray_default(collection) ? _arrayFilter_default : _baseFilter_default;
  return func(collection, negate_default(_baseIteratee_default(predicate, 3)));
}
