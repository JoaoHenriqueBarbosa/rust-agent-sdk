// function: baseKeysIn
function baseKeysIn(object) {
  if (!isObject_default(object))
    return _nativeKeysIn_default(object);
  var isProto = _isPrototype_default(object), result = [];
  for (var key in object)
    if (!(key == "constructor" && (isProto || !hasOwnProperty11.call(object, key))))
      result.push(key);
  return result;
}
