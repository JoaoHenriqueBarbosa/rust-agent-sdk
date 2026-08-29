// function: baseUniq
function baseUniq(array2, iteratee, comparator) {
  var index = -1, includes = _arrayIncludes_default, length = array2.length, isCommon = !0, result = [], seen = result;
  if (comparator)
    isCommon = !1, includes = _arrayIncludesWith_default;
  else if (length >= LARGE_ARRAY_SIZE2) {
    var set2 = iteratee ? null : _createSet_default(array2);
    if (set2)
      return _setToArray_default(set2);
    isCommon = !1, includes = _cacheHas_default, seen = new _SetCache_default;
  } else
    seen = iteratee ? [] : result;
  outer:
    while (++index < length) {
      var value = array2[index], computed = iteratee ? iteratee(value) : value;
      if (value = comparator || value !== 0 ? value : 0, isCommon && computed === computed) {
        var seenIndex = seen.length;
        while (seenIndex--)
          if (seen[seenIndex] === computed)
            continue outer;
        if (iteratee)
          seen.push(computed);
        result.push(value);
      } else if (!includes(seen, computed, comparator)) {
        if (seen !== result)
          seen.push(computed);
        result.push(value);
      }
    }
  return result;
}
