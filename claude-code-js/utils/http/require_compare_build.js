// var: require_compare_build
var require_compare_build = __commonJS((exports, module) => {
  var SemVer = require_semver(), compareBuild = (a2, b, loose) => {
    let versionA = new SemVer(a2, loose), versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  };
  module.exports = compareBuild;
});
