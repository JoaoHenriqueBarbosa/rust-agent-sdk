// var: require_lt
var require_lt = __commonJS((exports, module) => {
  var compare = require_compare(), lt = (a2, b, loose) => compare(a2, b, loose) < 0;
  module.exports = lt;
});
