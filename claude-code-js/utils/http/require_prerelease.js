// var: require_prerelease
var require_prerelease = __commonJS((exports, module) => {
  var parse9 = require_parse3(), prerelease = (version4, options) => {
    let parsed = parse9(version4, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  };
  module.exports = prerelease;
});
