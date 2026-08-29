// var: require_min_version
var require_min_version = __commonJS((exports, module) => {
  var SemVer = require_semver(), Range = require_range2(), gt = require_gt(), minVersion = (range, loose) => {
    range = new Range(range, loose);
    let minver = new SemVer("0.0.0");
    if (range.test(minver))
      return minver;
    if (minver = new SemVer("0.0.0-0"), range.test(minver))
      return minver;
    minver = null;
    for (let i4 = 0;i4 < range.set.length; ++i4) {
      let comparators = range.set[i4], setMin = null;
      if (comparators.forEach((comparator) => {
        let compver = new SemVer(comparator.semver.version);
        switch (comparator.operator) {
          case ">":
            if (compver.prerelease.length === 0)
              compver.patch++;
            else
              compver.prerelease.push(0);
            compver.raw = compver.format();
          case "":
          case ">=":
            if (!setMin || gt(compver, setMin))
              setMin = compver;
            break;
          case "<":
          case "<=":
            break;
          default:
            throw Error(`Unexpected operation: ${comparator.operator}`);
        }
      }), setMin && (!minver || gt(minver, setMin)))
        minver = setMin;
    }
    if (minver && range.test(minver))
      return minver;
    return null;
  };
  module.exports = minVersion;
});
