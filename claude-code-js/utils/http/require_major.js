// var: require_major
var require_major = __commonJS((exports, module) => {
  var SemVer = require_semver(), major = (a2, loose) => new SemVer(a2, loose).major;
  module.exports = major;
});
