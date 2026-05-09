// var: require_diff
var require_diff = __commonJS((exports, module) => {
  var parse9 = require_parse3(), diff = (version1, version22) => {
    let v12 = parse9(version1, null, !0), v2 = parse9(version22, null, !0), comparison = v12.compare(v2);
    if (comparison === 0)
      return null;
    let v1Higher = comparison > 0, highVersion = v1Higher ? v12 : v2, lowVersion = v1Higher ? v2 : v12, highHasPre = !!highVersion.prerelease.length;
    if (!!lowVersion.prerelease.length && !highHasPre) {
      if (!lowVersion.patch && !lowVersion.minor)
        return "major";
      if (lowVersion.compareMain(highVersion) === 0) {
        if (lowVersion.minor && !lowVersion.patch)
          return "minor";
        return "patch";
      }
    }
    let prefix = highHasPre ? "pre" : "";
    if (v12.major !== v2.major)
      return prefix + "major";
    if (v12.minor !== v2.minor)
      return prefix + "minor";
    if (v12.patch !== v2.patch)
      return prefix + "patch";
    return "prerelease";
  };
  module.exports = diff;
});
