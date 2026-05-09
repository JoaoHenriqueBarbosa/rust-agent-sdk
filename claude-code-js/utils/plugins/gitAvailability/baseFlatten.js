// function: baseFlatten
function baseFlatten(array2, depth, predicate, isStrict, result) {
  var index = -1, length = array2.length;
  predicate || (predicate = _isFlattenable_default), result || (result = []);
  while (++index < length) {
    var value = array2[index];
    if (depth > 0 && predicate(value))
      if (depth > 1)
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      else
        _arrayPush_default(result, value);
    else if (!isStrict)
      result[result.length] = value;
  }
  return result;
}
