// var: require_has_symbols
var require_has_symbols = __commonJS((exports, module) => {
  var origSymbol = typeof Symbol < "u" && Symbol, hasSymbolSham = require_shams();
  module.exports = function() {
    if (typeof origSymbol !== "function")
      return !1;
    if (typeof Symbol !== "function")
      return !1;
    if (typeof origSymbol("foo") !== "symbol")
      return !1;
    if (typeof Symbol("bar") !== "symbol")
      return !1;
    return hasSymbolSham();
  };
});
