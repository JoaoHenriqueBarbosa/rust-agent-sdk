// var: require_outside
var require_outside = __commonJS((exports, module) => {
  var SemVer = require_semver(), Comparator = require_comparator(), { ANY } = Comparator, Range = require_range2(), satisfies = require_satisfies(), gt = require_gt(), lt = require_lt(), lte = require_lte(), gte = require_gte(), outside = (version4, range, hilo, options) => {
    version4 = new SemVer(version4, options), range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt, ltefn = lte, ltfn = lt, comp = ">", ecomp = ">=";
        break;
      case "<":
        gtfn = lt, ltefn = gte, ltfn = gt, comp = "<", ecomp = "<=";
        break;
      default:
        throw TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (satisfies(version4, range, options))
      return !1;
    for (let i4 = 0;i4 < range.set.length; ++i4) {
      let comparators = range.set[i4], high = null, low = null;
      if (comparators.forEach((comparator) => {
        if (comparator.semver === ANY)
          comparator = new Comparator(">=0.0.0");
        if (high = high || comparator, low = low || comparator, gtfn(comparator.semver, high.semver, options))
          high = comparator;
        else if (ltfn(comparator.semver, low.semver, options))
          low = comparator;
      }), high.operator === comp || high.operator === ecomp)
        return !1;
      if ((!low.operator || low.operator === comp) && ltefn(version4, low.semver))
        return !1;
      else if (low.operator === ecomp && ltfn(version4, low.semver))
        return !1;
    }
    return !0;
  };
  module.exports = outside;
});
