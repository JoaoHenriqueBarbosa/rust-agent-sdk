// var: require_patch
var require_patch = __commonJS((exports, module) => {
  var SemVer = require_semver(), patch = (a2, loose) => new SemVer(a2, loose).patch;
  module.exports = patch;
});
