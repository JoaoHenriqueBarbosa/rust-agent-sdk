// function: mapValues
function mapValues(object2, iteratee) {
  var result = {};
  return iteratee = _baseIteratee_default(iteratee, 3), _baseForOwn_default(object2, function(value, key, object3) {
    _baseAssignValue_default(result, key, iteratee(value, key, object3));
  }), result;
}
