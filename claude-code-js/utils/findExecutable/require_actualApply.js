// var: require_actualApply
var require_actualApply = __commonJS((exports, module) => {
  var bind2 = require_function_bind(), $apply = require_functionApply(), $call = require_functionCall(), $reflectApply = require_reflectApply();
  module.exports = $reflectApply || bind2.call($call, $apply);
});
