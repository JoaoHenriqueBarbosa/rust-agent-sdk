// var: require_neq
var require_neq = __commonJS((exports, module) => {
  var compare = require_compare(), neq = (a2, b, loose) => compare(a2, b, loose) !== 0;
  module.exports = neq;
});
