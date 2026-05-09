// var: require_asymmetricKeyDetailsSupported
var require_asymmetricKeyDetailsSupported = __commonJS((exports, module) => {
  var semver = require_semver2();
  module.exports = semver.satisfies(process.version, ">=15.7.0");
});
