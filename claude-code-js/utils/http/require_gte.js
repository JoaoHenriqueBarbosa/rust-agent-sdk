// var: require_gte
var require_gte = __commonJS((exports, module) => {
  var compare = require_compare(), gte = (a2, b, loose) => compare(a2, b, loose) >= 0;
  module.exports = gte;
});
