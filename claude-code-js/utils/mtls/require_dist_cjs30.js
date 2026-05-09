// var: require_dist_cjs30
var require_dist_cjs30 = __commonJS((exports) => {
  var types3 = require_dist_cjs29(), getSmithyContext = (context) => context[types3.SMITHY_CONTEXT_KEY] || (context[types3.SMITHY_CONTEXT_KEY] = {}), normalizeProvider = (input) => {
    if (typeof input === "function")
      return input;
    let promisified = Promise.resolve(input);
    return () => promisified;
  };
  exports.getSmithyContext = getSmithyContext;
  exports.normalizeProvider = normalizeProvider;
});
