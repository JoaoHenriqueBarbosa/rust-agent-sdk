// Original: src/utils/sequential.ts
function sequential(fn) {
  let queue = [], processing = !1;
  async function processQueue() {
    if (processing)
      return;
    if (queue.length === 0)
      return;
    processing = !0;
    while (queue.length > 0) {
      let { args, resolve: resolve2, reject, context } = queue.shift();
      try {
        let result = await fn.apply(context, args);
        resolve2(result);
      } catch (error41) {
        reject(error41);
      }
    }
    if (processing = !1, queue.length > 0)
      processQueue();
  }
  return function(...args) {
    return new Promise((resolve2, reject) => {
      queue.push({ args, resolve: resolve2, reject, context: this }), processQueue();
    });
  };
}

// node_modules/lodash-es/_assignMergeValue.js
function assignMergeValue(object2, key, value) {
  if (value !== void 0 && !eq_default(object2[key], value) || value === void 0 && !(key in object2))
    _baseAssignValue_default(object2, key, value);
}
var _assignMergeValue_default;
var init__assignMergeValue = __esm(() => {
  init__baseAssignValue();
  init_eq();
  _assignMergeValue_default = assignMergeValue;
});

// node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object2, iteratee, keysFunc) {
    var index = -1, iterable = Object(object2), props = keysFunc(object2), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === !1)
        break;
    }
    return object2;
  };
}
var _createBaseFor_default;
var init__createBaseFor = __esm(() => {
  _createBaseFor_default = createBaseFor;
});

// node_modules/lodash-es/_baseFor.js
var baseFor, _baseFor_default;
var init__baseFor = __esm(() => {
  init__createBaseFor();
  baseFor = _createBaseFor_default(), _baseFor_default = baseFor;
});

// node_modules/lodash-es/isArrayLikeObject.js
function isArrayLikeObject(value) {
  return isObjectLike_default(value) && isArrayLike_default(value);
}
var isArrayLikeObject_default;
var init_isArrayLikeObject = __esm(() => {
  init_isArrayLike();
  init_isObjectLike();
  isArrayLikeObject_default = isArrayLikeObject;
});

// node_modules/lodash-es/isPlainObject.js
function isPlainObject3(value) {
  if (!isObjectLike_default(value) || _baseGetTag_default(value) != objectTag5)
    return !1;
  var proto2 = _getPrototype_default(value);
  if (proto2 === null)
    return !0;
  var Ctor = hasOwnProperty13.call(proto2, "constructor") && proto2.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString3.call(Ctor) == objectCtorString;
}
var objectTag5 = "[object Object]", funcProto3, objectProto16, funcToString3, hasOwnProperty13, objectCtorString, isPlainObject_default;
var init_isPlainObject = __esm(() => {
  init__baseGetTag();
  init__getPrototype();
  init_isObjectLike();
  funcProto3 = Function.prototype, objectProto16 = Object.prototype, funcToString3 = funcProto3.toString, hasOwnProperty13 = objectProto16.hasOwnProperty, objectCtorString = funcToString3.call(Object);
  isPlainObject_default = isPlainObject3;
});

// node_modules/lodash-es/_safeGet.js
function safeGet(object2, key) {
  if (key === "constructor" && typeof object2[key] === "function")
    return;
  if (key == "__proto__")
    return;
  return object2[key];
}
var _safeGet_default;
var init__safeGet = __esm(() => {
  _safeGet_default = safeGet;
});

// node_modules/lodash-es/toPlainObject.js
function toPlainObject(value) {
  return _copyObject_default(value, keysIn_default(value));
}
var toPlainObject_default;
var init_toPlainObject = __esm(() => {
  init__copyObject();
  init_keysIn();
  toPlainObject_default = toPlainObject;
});

// node_modules/lodash-es/_baseMergeDeep.js
function baseMergeDeep(object2, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet_default(object2, key), srcValue = _safeGet_default(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    _assignMergeValue_default(object2, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object2, source, stack) : void 0, isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray_default(srcValue), isBuff = !isArr && isBuffer_default(srcValue), isTyped = !isArr && !isBuff && isTypedArray_default(srcValue);
    if (newValue = srcValue, isArr || isBuff || isTyped)
      if (isArray_default(objValue))
        newValue = objValue;
      else if (isArrayLikeObject_default(objValue))
        newValue = _copyArray_default(objValue);
      else if (isBuff)
        isCommon = !1, newValue = _cloneBuffer_default(srcValue, !0);
      else if (isTyped)
        isCommon = !1, newValue = _cloneTypedArray_default(srcValue, !0);
      else
        newValue = [];
    else if (isPlainObject_default(srcValue) || isArguments_default(srcValue)) {
      if (newValue = objValue, isArguments_default(objValue))
        newValue = toPlainObject_default(objValue);
      else if (!isObject_default(objValue) || isFunction_default(objValue))
        newValue = _initCloneObject_default(srcValue);
    } else
      isCommon = !1;
  }
  if (isCommon)
    stack.set(srcValue, newValue), mergeFunc(newValue, srcValue, srcIndex, customizer, stack), stack.delete(srcValue);
  _assignMergeValue_default(object2, key, newValue);
}
var _baseMergeDeep_default;
var init__baseMergeDeep = __esm(() => {
  init__assignMergeValue();
  init__cloneBuffer();
  init__cloneTypedArray();
  init__copyArray();
  init__initCloneObject();
  init_isArguments();
  init_isArray();
  init_isArrayLikeObject();
  init_isBuffer();
  init_isFunction();
  init_isObject();
  init_isPlainObject();
  init_isTypedArray();
  init__safeGet();
  init_toPlainObject();
  _baseMergeDeep_default = baseMergeDeep;
});

// node_modules/lodash-es/_baseMerge.js
function baseMerge(object2, source, srcIndex, customizer, stack) {
  if (object2 === source)
    return;
  _baseFor_default(source, function(srcValue, key) {
    if (stack || (stack = new _Stack_default), isObject_default(srcValue))
      _baseMergeDeep_default(object2, source, key, srcIndex, baseMerge, customizer, stack);
    else {
      var newValue = customizer ? customizer(_safeGet_default(object2, key), srcValue, key + "", object2, source, stack) : void 0;
      if (newValue === void 0)
        newValue = srcValue;
      _assignMergeValue_default(object2, key, newValue);
    }
  }, keysIn_default);
}
var _baseMerge_default;
var init__baseMerge = __esm(() => {
  init__Stack();
  init__assignMergeValue();
  init__baseFor();
  init__baseMergeDeep();
  init_isObject();
  init_keysIn();
  init__safeGet();
  _baseMerge_default = baseMerge;
});

// node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var _apply_default;
var init__apply = __esm(() => {
  _apply_default = apply;
});

// node_modules/lodash-es/_overRest.js
function overRest(func, start, transform2) {
  return start = nativeMax(start === void 0 ? func.length - 1 : start, 0), function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array2 = Array(length);
    while (++index < length)
      array2[index] = args[start + index];
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start)
      otherArgs[index] = args[index];
    return otherArgs[start] = transform2(array2), _apply_default(func, this, otherArgs);
  };
}
var nativeMax, _overRest_default;
var init__overRest = __esm(() => {
  init__apply();
  nativeMax = Math.max;
  _overRest_default = overRest;
});

// node_modules/lodash-es/constant.js
function constant(value) {
  return function() {
    return value;
  };
}
var constant_default;
var init_constant = __esm(() => {
  constant_default = constant;
});

// node_modules/lodash-es/_baseSetToString.js
var baseSetToString, _baseSetToString_default;
var init__baseSetToString = __esm(() => {
  init_constant();
  init__defineProperty();
  init_identity();
  baseSetToString = !_defineProperty_default ? identity_default : function(func, string4) {
    return _defineProperty_default(func, "toString", {
      configurable: !0,
      enumerable: !1,
      value: constant_default(string4),
      writable: !0
    });
  }, _baseSetToString_default = baseSetToString;
});

// node_modules/lodash-es/_shortOut.js
function shortOut(func) {
  var count2 = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    if (lastCalled = stamp, remaining > 0) {
      if (++count2 >= HOT_COUNT)
        return arguments[0];
    } else
      count2 = 0;
    return func.apply(void 0, arguments);
  };
}
var HOT_COUNT = 800, HOT_SPAN = 16, nativeNow, _shortOut_default;
var init__shortOut = __esm(() => {
  nativeNow = Date.now;
  _shortOut_default = shortOut;
});

// node_modules/lodash-es/_setToString.js
var setToString, _setToString_default;
var init__setToString = __esm(() => {
  init__baseSetToString();
  init__shortOut();
  setToString = _shortOut_default(_baseSetToString_default), _setToString_default = setToString;
});

// node_modules/lodash-es/_baseRest.js
function baseRest(func, start) {
  return _setToString_default(_overRest_default(func, start, identity_default), func + "");
}
var _baseRest_default;
var init__baseRest = __esm(() => {
  init_identity();
  init__overRest();
  init__setToString();
  _baseRest_default = baseRest;
});

// node_modules/lodash-es/_isIterateeCall.js
function isIterateeCall(value, index, object2) {
  if (!isObject_default(object2))
    return !1;
  var type = typeof index;
  if (type == "number" ? isArrayLike_default(object2) && _isIndex_default(index, object2.length) : type == "string" && (index in object2))
    return eq_default(object2[index], value);
  return !1;
}
var _isIterateeCall_default;
var init__isIterateeCall = __esm(() => {
  init_eq();
  init_isArrayLike();
  init__isIndex();
  init_isObject();
  _isIterateeCall_default = isIterateeCall;
});

// node_modules/lodash-es/_createAssigner.js
function createAssigner(assigner) {
  return _baseRest_default(function(object2, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    if (customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0, guard && _isIterateeCall_default(sources[0], sources[1], guard))
      customizer = length < 3 ? void 0 : customizer, length = 1;
    object2 = Object(object2);
    while (++index < length) {
      var source = sources[index];
      if (source)
        assigner(object2, source, index, customizer);
    }
    return object2;
  });
}
var _createAssigner_default;
var init__createAssigner = __esm(() => {
  init__baseRest();
  init__isIterateeCall();
  _createAssigner_default = createAssigner;
});

// node_modules/lodash-es/mergeWith.js
var mergeWith, mergeWith_default;
var init_mergeWith = __esm(() => {
  init__baseMerge();
  init__createAssigner();
  mergeWith = _createAssigner_default(function(object2, source, srcIndex, customizer) {
    _baseMerge_default(object2, source, srcIndex, customizer);
  }), mergeWith_default = mergeWith;
});
