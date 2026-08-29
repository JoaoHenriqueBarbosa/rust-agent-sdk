// var: require_lodash
var require_lodash = __commonJS((exports, module) => {
  var INFINITY3 = 1 / 0, MAX_SAFE_INTEGER3 = 9007199254740991, MAX_INTEGER = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, NAN = NaN, argsTag5 = "[object Arguments]", funcTag4 = "[object Function]", genTag3 = "[object GeneratorFunction]", stringTag5 = "[object String]", symbolTag5 = "[object Symbol]", reTrim = /^\s+|\s+$/g, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, reIsUint2 = /^(?:0|[1-9]\d*)$/, freeParseInt = parseInt;
  function arrayMap2(array2, iteratee) {
    var index = -1, length = array2 ? array2.length : 0, result = Array(length);
    while (++index < length)
      result[index] = iteratee(array2[index], index, array2);
    return result;
  }
  function baseFindIndex(array2, predicate, fromIndex, fromRight) {
    var length = array2.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length)
      if (predicate(array2[index], index, array2))
        return index;
    return -1;
  }
  function baseIndexOf(array2, value, fromIndex) {
    if (value !== value)
      return baseFindIndex(array2, baseIsNaN, fromIndex);
    var index = fromIndex - 1, length = array2.length;
    while (++index < length)
      if (array2[index] === value)
        return index;
    return -1;
  }
  function baseIsNaN(value) {
    return value !== value;
  }
  function baseTimes2(n5, iteratee) {
    var index = -1, result = Array(n5);
    while (++index < n5)
      result[index] = iteratee(index);
    return result;
  }
  function baseValues(object2, props) {
    return arrayMap2(props, function(key) {
      return object2[key];
    });
  }
  function overArg2(func, transform2) {
    return function(arg) {
      return func(transform2(arg));
    };
  }
  var objectProto17 = Object.prototype, hasOwnProperty15 = objectProto17.hasOwnProperty, objectToString4 = objectProto17.toString, propertyIsEnumerable3 = objectProto17.propertyIsEnumerable, nativeKeys2 = overArg2(Object.keys, Object), nativeMax2 = Math.max;
  function arrayLikeKeys2(value, inherited) {
    var result = isArray6(value) || isArguments2(value) ? baseTimes2(value.length, String) : [], length = result.length, skipIndexes = !!length;
    for (var key in value)
      if ((inherited || hasOwnProperty15.call(value, key)) && !(skipIndexes && (key == "length" || isIndex2(key, length))))
        result.push(key);
    return result;
  }
  function baseKeys2(object2) {
    if (!isPrototype2(object2))
      return nativeKeys2(object2);
    var result = [];
    for (var key in Object(object2))
      if (hasOwnProperty15.call(object2, key) && key != "constructor")
        result.push(key);
    return result;
  }
  function isIndex2(value, length) {
    return length = length == null ? MAX_SAFE_INTEGER3 : length, !!length && (typeof value == "number" || reIsUint2.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isPrototype2(value) {
    var Ctor = value && value.constructor, proto2 = typeof Ctor == "function" && Ctor.prototype || objectProto17;
    return value === proto2;
  }
  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike2(collection) ? collection : values2(collection), fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0)
      fromIndex = nativeMax2(length + fromIndex, 0);
    return isString2(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
  }
  function isArguments2(value) {
    return isArrayLikeObject2(value) && hasOwnProperty15.call(value, "callee") && (!propertyIsEnumerable3.call(value, "callee") || objectToString4.call(value) == argsTag5);
  }
  var isArray6 = Array.isArray;
  function isArrayLike2(value) {
    return value != null && isLength2(value.length) && !isFunction4(value);
  }
  function isArrayLikeObject2(value) {
    return isObjectLike2(value) && isArrayLike2(value);
  }
  function isFunction4(value) {
    var tag = isObject5(value) ? objectToString4.call(value) : "";
    return tag == funcTag4 || tag == genTag3;
  }
  function isLength2(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER3;
  }
  function isObject5(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function isString2(value) {
    return typeof value == "string" || !isArray6(value) && isObjectLike2(value) && objectToString4.call(value) == stringTag5;
  }
  function isSymbol2(value) {
    return typeof value == "symbol" || isObjectLike2(value) && objectToString4.call(value) == symbolTag5;
  }
  function toFinite(value) {
    if (!value)
      return value === 0 ? value : 0;
    if (value = toNumber(value), value === INFINITY3 || value === -INFINITY3) {
      var sign2 = value < 0 ? -1 : 1;
      return sign2 * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }
  function toNumber(value) {
    if (typeof value == "number")
      return value;
    if (isSymbol2(value))
      return NAN;
    if (isObject5(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject5(other) ? other + "" : other;
    }
    if (typeof value != "string")
      return value === 0 ? value : +value;
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  function keys2(object2) {
    return isArrayLike2(object2) ? arrayLikeKeys2(object2) : baseKeys2(object2);
  }
  function values2(object2) {
    return object2 ? baseValues(object2, keys2(object2)) : [];
  }
  module.exports = includes;
});
