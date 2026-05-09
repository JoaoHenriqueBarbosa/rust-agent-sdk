// var: require_is
var require_is = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
  function boolean5(value) {
    return value === !0 || value === !1;
  }
  exports.boolean = boolean5;
  function string5(value) {
    return typeof value === "string" || value instanceof String;
  }
  exports.string = string5;
  function number5(value) {
    return typeof value === "number" || value instanceof Number;
  }
  exports.number = number5;
  function error44(value) {
    return value instanceof Error;
  }
  exports.error = error44;
  function func(value) {
    return typeof value === "function";
  }
  exports.func = func;
  function array3(value) {
    return Array.isArray(value);
  }
  exports.array = array3;
  function stringArray(value) {
    return array3(value) && value.every((elem) => string5(elem));
  }
  exports.stringArray = stringArray;
});
