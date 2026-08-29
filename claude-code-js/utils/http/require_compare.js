// var: require_compare
var require_compare = __commonJS((exports, module) => {
  var SemVer = require_semver(), compare = (a2, b, loose) => new SemVer(a2, loose).compare(new SemVer(b, loose));
  module.exports = compare;
});
