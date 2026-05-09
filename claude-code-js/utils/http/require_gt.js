// var: require_gt
var require_gt = __commonJS((exports, module) => {
  var compare = require_compare(), gt = (a2, b, loose) => compare(a2, b, loose) > 0;
  module.exports = gt;
});
