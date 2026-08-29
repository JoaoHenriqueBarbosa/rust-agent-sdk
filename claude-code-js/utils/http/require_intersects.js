// var: require_intersects
var require_intersects = __commonJS((exports, module) => {
  var Range = require_range2(), intersects = (r1, r22, options) => {
    return r1 = new Range(r1, options), r22 = new Range(r22, options), r1.intersects(r22, options);
  };
  module.exports = intersects;
});
