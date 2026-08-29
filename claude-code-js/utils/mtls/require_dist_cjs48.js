// var: require_dist_cjs48
var require_dist_cjs48 = __commonJS((exports) => {
  var recursionDetectionMiddleware = require_recursionDetectionMiddleware(), recursionDetectionMiddlewareOptions = {
    step: "build",
    tags: ["RECURSION_DETECTION"],
    name: "recursionDetectionMiddleware",
    override: !0,
    priority: "low"
  }, getRecursionDetectionPlugin = (options) => ({
    applyToStack: (clientStack) => {
      clientStack.add(recursionDetectionMiddleware.recursionDetectionMiddleware(), recursionDetectionMiddlewareOptions);
    }
  });
  exports.getRecursionDetectionPlugin = getRecursionDetectionPlugin;
  Object.prototype.hasOwnProperty.call(recursionDetectionMiddleware, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: recursionDetectionMiddleware.__proto__
  });
  Object.keys(recursionDetectionMiddleware).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = recursionDetectionMiddleware[k];
  });
});
