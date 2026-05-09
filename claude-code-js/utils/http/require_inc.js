// var: require_inc
var require_inc = __commonJS((exports, module) => {
  var SemVer = require_semver(), inc = (version4, release, options, identifier, identifierBase) => {
    if (typeof options === "string")
      identifierBase = identifier, identifier = options, options = void 0;
    try {
      return new SemVer(version4 instanceof SemVer ? version4.version : version4, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
      return null;
    }
  };
  module.exports = inc;
});
