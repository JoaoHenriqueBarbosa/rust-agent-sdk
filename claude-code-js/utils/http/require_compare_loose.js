// var: require_compare_loose
var require_compare_loose = __commonJS((exports, module) => {
  var compare = require_compare(), compareLoose = (a2, b) => compare(a2, b, !0);
  module.exports = compareLoose;
});
