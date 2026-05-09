// var: require_eq
var require_eq = __commonJS((exports, module) => {
  var compare = require_compare(), eq2 = (a2, b, loose) => compare(a2, b, loose) === 0;
  module.exports = eq2;
});
