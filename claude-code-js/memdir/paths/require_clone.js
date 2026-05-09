// var: require_clone
var require_clone = __commonJS((exports, module) => {
  module.exports = clone3;
  var getPrototypeOf2 = Object.getPrototypeOf || function(obj) {
    return obj.__proto__;
  };
  function clone3(obj) {
    if (obj === null || typeof obj !== "object")
      return obj;
    if (obj instanceof Object)
      var copy = { __proto__: getPrototypeOf2(obj) };
    else
      var copy = Object.create(null);
    return Object.getOwnPropertyNames(obj).forEach(function(key) {
      Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    }), copy;
  }
});
