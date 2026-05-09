// var: require_minor
var require_minor = __commonJS((exports, module) => {
  var SemVer = require_semver(), minor = (a2, loose) => new SemVer(a2, loose).minor;
  module.exports = minor;
});
