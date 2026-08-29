// function: baseClone
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer)
    result = object ? customizer(value, key, object, stack) : customizer(value);
  if (result !== void 0)
    return result;
  if (!isObject_default(value))
    return value;
  var isArr = isArray_default(value);
  if (isArr) {
    if (result = _initCloneArray_default(value), !isDeep)
      return _copyArray_default(value, result);
  } else {
    var tag = _getTag_default(value), isFunc = tag == funcTag3 || tag == genTag2;
    if (isBuffer_default(value))
      return _cloneBuffer_default(value, isDeep);
    if (tag == objectTag4 || tag == argsTag4 || isFunc && !object) {
      if (result = isFlat || isFunc ? {} : _initCloneObject_default(value), !isDeep)
        return isFlat ? _copySymbolsIn_default(value, _baseAssignIn_default(result, value)) : _copySymbols_default(value, _baseAssign_default(result, value));
    } else {
      if (!cloneableTags[tag])
        return object ? value : {};
      result = _initCloneByTag_default(value, tag, isDeep);
    }
  }
  stack || (stack = new _Stack_default);
  var stacked = stack.get(value);
  if (stacked)
    return stacked;
  if (stack.set(value, result), isSet_default(value))
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  else if (isMap_default(value))
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  var keysFunc = isFull ? isFlat ? _getAllKeysIn_default : _getAllKeys_default : isFlat ? keysIn_default : keys_default, props = isArr ? void 0 : keysFunc(value);
  return _arrayEach_default(props || value, function(subValue, key2) {
    if (props)
      key2 = subValue, subValue = value[key2];
    _assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  }), result;
}
