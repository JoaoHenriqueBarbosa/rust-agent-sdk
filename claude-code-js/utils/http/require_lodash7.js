// var: require_lodash7
var require_lodash7 = __commonJS((exports, module) => {
  var FUNC_ERROR_TEXT2 = "Expected a function", INFINITY3 = 1 / 0, MAX_INTEGER = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, NAN = NaN, symbolTag5 = "[object Symbol]", reTrim = /^\s+|\s+$/g, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, freeParseInt = parseInt, objectProto17 = Object.prototype, objectToString4 = objectProto17.toString;
  function before(n5, func) {
    var result;
    if (typeof func != "function")
      throw TypeError(FUNC_ERROR_TEXT2);
    return n5 = toInteger(n5), function() {
      if (--n5 > 0)
        result = func.apply(this, arguments);
      if (n5 <= 1)
        func = void 0;
      return result;
    };
  }
  function once9(func) {
    return before(2, func);
  }
  function isObject5(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
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
  module.exports = once9;
});
