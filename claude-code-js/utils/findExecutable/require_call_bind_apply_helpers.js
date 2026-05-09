// var: require_call_bind_apply_helpers
var require_call_bind_apply_helpers = __commonJS((exports, module) => {
  var bind2 = require_function_bind(), $TypeError = require_type(), $call = require_functionCall(), $actualApply = require_actualApply();
  module.exports = function(args) {
    if (args.length < 1 || typeof args[0] !== "function")
      throw new $TypeError("a function is required");
    return $actualApply(bind2, $call, args);
  };
});
