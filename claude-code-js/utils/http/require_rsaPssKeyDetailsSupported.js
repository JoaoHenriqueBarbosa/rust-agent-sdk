// var: require_rsaPssKeyDetailsSupported
var require_rsaPssKeyDetailsSupported = __commonJS((exports, module) => {
  var semver = require_semver2();
  module.exports = semver.satisfies(process.version, ">=16.9.0");
});
