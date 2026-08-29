// var: require_lte
var require_lte = __commonJS((exports, module) => {
  var compare = require_compare(), lte = (a2, b, loose) => compare(a2, b, loose) <= 0;
  module.exports = lte;
});
