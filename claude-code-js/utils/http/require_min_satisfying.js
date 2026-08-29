// var: require_min_satisfying
var require_min_satisfying = __commonJS((exports, module) => {
  var SemVer = require_semver(), Range = require_range2(), minSatisfying = (versions2, range, options) => {
    let min = null, minSV = null, rangeObj = null;
    try {
      rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }
    return versions2.forEach((v2) => {
      if (rangeObj.test(v2)) {
        if (!min || minSV.compare(v2) === 1)
          min = v2, minSV = new SemVer(min, options);
      }
    }), min;
  };
  module.exports = minSatisfying;
});
