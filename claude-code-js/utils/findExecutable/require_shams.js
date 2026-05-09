// var: require_shams
var require_shams = __commonJS((exports, module) => {
  module.exports = function() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function")
      return !1;
    if (typeof Symbol.iterator === "symbol")
      return !0;
    var obj = {}, sym = Symbol("test"), symObj = Object(sym);
    if (typeof sym === "string")
      return !1;
    if (Object.prototype.toString.call(sym) !== "[object Symbol]")
      return !1;
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]")
      return !1;
    var symVal = 42;
    obj[sym] = symVal;
    for (var _ in obj)
      return !1;
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0)
      return !1;
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0)
      return !1;
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym)
      return !1;
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
      if (descriptor.value !== symVal || descriptor.enumerable !== !0)
        return !1;
    }
    return !0;
  };
});
