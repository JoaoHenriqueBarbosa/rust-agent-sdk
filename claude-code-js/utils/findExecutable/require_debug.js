// var: require_debug
var require_debug = __commonJS((exports, module) => {
  var debug;
  module.exports = function() {
    if (!debug) {
      try {
        debug = require_src()("follow-redirects");
      } catch (error41) {}
      if (typeof debug !== "function")
        debug = function() {};
    }
    debug.apply(null, arguments);
  };
});
