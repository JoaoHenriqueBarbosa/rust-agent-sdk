// var: require_parse3
var require_parse3 = __commonJS((exports, module) => {
  var SemVer = require_semver(), parse9 = (version4, options, throwErrors = !1) => {
    if (version4 instanceof SemVer)
      return version4;
    try {
      return new SemVer(version4, options);
    } catch (er) {
      if (!throwErrors)
        return null;
      throw er;
    }
  };
  module.exports = parse9;
});
