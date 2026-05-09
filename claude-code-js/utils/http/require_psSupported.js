// var: require_psSupported
var require_psSupported = __commonJS((exports, module) => {
  var semver = require_semver2();
  module.exports = semver.satisfies(process.version, "^6.12.0 || >=8.0.0");
});
