// var: require_utils9
var require_utils9 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isPromiseLike = void 0;
  var isPromiseLike = (val) => {
    return val !== null && typeof val === "object" && typeof val.then === "function";
  };
  exports.isPromiseLike = isPromiseLike;
});
