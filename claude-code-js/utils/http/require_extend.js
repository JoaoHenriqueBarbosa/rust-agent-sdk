// var: require_extend
var require_extend = __commonJS((exports, module) => {
  var hasOwn4 = Object.prototype.hasOwnProperty, toStr = Object.prototype.toString, defineProperty2 = Object.defineProperty, gOPD = Object.getOwnPropertyDescriptor, isArray6 = function(arr) {
    if (typeof Array.isArray === "function")
      return Array.isArray(arr);
    return toStr.call(arr) === "[object Array]";
  }, isPlainObject5 = function(obj) {
    if (!obj || toStr.call(obj) !== "[object Object]")
      return !1;
    var hasOwnConstructor = hasOwn4.call(obj, "constructor"), hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn4.call(obj.constructor.prototype, "isPrototypeOf");
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf)
      return !1;
    var key;
    for (key in obj)
      ;
    return typeof key > "u" || hasOwn4.call(obj, key);
  }, setProperty2 = function(target, options) {
    if (defineProperty2 && options.name === "__proto__")
      defineProperty2(target, options.name, {
        enumerable: !0,
        configurable: !0,
        value: options.newValue,
        writable: !0
      });
    else
      target[options.name] = options.newValue;
  }, getProperty = function(obj, name3) {
    if (name3 === "__proto__") {
      if (!hasOwn4.call(obj, name3))
        return;
      else if (gOPD)
        return gOPD(obj, name3).value;
    }
    return obj[name3];
  };
  module.exports = function extend() {
    var options, name3, src, copy, copyIsArray, clone3, target = arguments[0], i4 = 1, length = arguments.length, deep = !1;
    if (typeof target === "boolean")
      deep = target, target = arguments[1] || {}, i4 = 2;
    if (target == null || typeof target !== "object" && typeof target !== "function")
      target = {};
    for (;i4 < length; ++i4)
      if (options = arguments[i4], options != null) {
        for (name3 in options)
          if (src = getProperty(target, name3), copy = getProperty(options, name3), target !== copy) {
            if (deep && copy && (isPlainObject5(copy) || (copyIsArray = isArray6(copy)))) {
              if (copyIsArray)
                copyIsArray = !1, clone3 = src && isArray6(src) ? src : [];
              else
                clone3 = src && isPlainObject5(src) ? src : {};
              setProperty2(target, { name: name3, newValue: extend(deep, clone3, copy) });
            } else if (typeof copy < "u")
              setProperty2(target, { name: name3, newValue: copy });
          }
      }
    return target;
  };
});
