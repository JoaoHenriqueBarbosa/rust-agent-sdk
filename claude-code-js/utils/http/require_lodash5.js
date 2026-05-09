// var: require_lodash5
var require_lodash5 = __commonJS((exports, module) => {
  var objectTag6 = "[object Object]";
  function isHostObject(value) {
    var result = !1;
    if (value != null && typeof value.toString != "function")
      try {
        result = !!(value + "");
      } catch (e) {}
    return result;
  }
  function overArg2(func, transform2) {
    return function(arg) {
      return func(transform2(arg));
    };
  }
  var funcProto4 = Function.prototype, objectProto17 = Object.prototype, funcToString4 = funcProto4.toString, hasOwnProperty15 = objectProto17.hasOwnProperty, objectCtorString2 = funcToString4.call(Object), objectToString4 = objectProto17.toString, getPrototype2 = overArg2(Object.getPrototypeOf, Object);
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function isPlainObject5(value) {
    if (!isObjectLike2(value) || objectToString4.call(value) != objectTag6 || isHostObject(value))
      return !1;
    var proto2 = getPrototype2(value);
    if (proto2 === null)
      return !0;
    var Ctor = hasOwnProperty15.call(proto2, "constructor") && proto2.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString4.call(Ctor) == objectCtorString2;
  }
  module.exports = isPlainObject5;
});
