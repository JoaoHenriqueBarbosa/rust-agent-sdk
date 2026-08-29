// var: require_shams2
var require_shams2 = __commonJS((exports, module) => {
  var hasSymbols = require_shams();
  module.exports = function() {
    return hasSymbols() && !!Symbol.toStringTag;
  };
});
