// var: require_rcompare
var require_rcompare = __commonJS((exports, module) => {
  var compare = require_compare(), rcompare = (a2, b, loose) => compare(b, a2, loose);
  module.exports = rcompare;
});
