// var: require_max_satisfying
var require_max_satisfying = __commonJS((exports, module) => {
  var SemVer = require_semver(), Range = require_range2(), maxSatisfying = (versions2, range, options) => {
    let max = null, maxSV = null, rangeObj = null;
    try {
      rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }
    return versions2.forEach((v2) => {
      if (rangeObj.test(v2)) {
        if (!max || maxSV.compare(v2) === -1)
          max = v2, maxSV = new SemVer(max, options);
      }
    }), max;
  };
  module.exports = maxSatisfying;
});
