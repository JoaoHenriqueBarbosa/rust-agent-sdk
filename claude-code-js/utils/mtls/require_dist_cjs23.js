// var: require_dist_cjs23
var require_dist_cjs23 = __commonJS((exports) => {
  var fromBase64 = require_fromBase642(), toBase64 = require_toBase642();
  Object.prototype.hasOwnProperty.call(fromBase64, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: fromBase64.__proto__
  });
  Object.keys(fromBase64).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = fromBase64[k];
  });
  Object.prototype.hasOwnProperty.call(toBase64, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: toBase64.__proto__
  });
  Object.keys(toBase64).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = toBase64[k];
  });
});
