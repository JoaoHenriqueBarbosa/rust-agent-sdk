// var: require_lodash_merge
var require_lodash_merge = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isPlainObject = void 0;
  var objectTag6 = "[object Object]", nullTag2 = "[object Null]", undefinedTag2 = "[object Undefined]", funcProto4 = Function.prototype, funcToString4 = funcProto4.toString, objectCtorString2 = funcToString4.call(Object), getPrototypeOf2 = Object.getPrototypeOf, objectProto18 = Object.prototype, hasOwnProperty16 = objectProto18.hasOwnProperty, symToStringTag3 = Symbol ? Symbol.toStringTag : void 0, nativeObjectToString3 = objectProto18.toString;
  function isPlainObject7(value) {
    if (!isObjectLike2(value) || baseGetTag2(value) !== objectTag6)
      return !1;
    let proto2 = getPrototypeOf2(value);
    if (proto2 === null)
      return !0;
    let Ctor = hasOwnProperty16.call(proto2, "constructor") && proto2.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString4.call(Ctor) === objectCtorString2;
  }
  exports.isPlainObject = isPlainObject7;
  function isObjectLike2(value) {
    return value != null && typeof value == "object";
  }
  function baseGetTag2(value) {
    if (value == null)
      return value === void 0 ? undefinedTag2 : nullTag2;
    return symToStringTag3 && symToStringTag3 in Object(value) ? getRawTag2(value) : objectToString4(value);
  }
  function getRawTag2(value) {
    let isOwn = hasOwnProperty16.call(value, symToStringTag3), tag2 = value[symToStringTag3], unmasked = !1;
    try {
      value[symToStringTag3] = void 0, unmasked = !0;
    } catch {}
    let result = nativeObjectToString3.call(value);
    if (unmasked)
      if (isOwn)
        value[symToStringTag3] = tag2;
      else
        delete value[symToStringTag3];
    return result;
  }
  function objectToString4(value) {
    return nativeObjectToString3.call(value);
  }
});
