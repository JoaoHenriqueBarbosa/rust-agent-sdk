// function: createBaseEach
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null)
      return collection;
    if (!isArrayLike_default(collection))
      return eachFunc(collection, iteratee);
    var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index-- : ++index < length)
      if (iteratee(iterable[index], index, iterable) === !1)
        break;
    return collection;
  };
}
