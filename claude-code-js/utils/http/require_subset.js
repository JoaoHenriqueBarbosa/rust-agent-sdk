// var: require_subset
var require_subset = __commonJS((exports, module) => {
  var Range = require_range2(), Comparator = require_comparator(), { ANY } = Comparator, satisfies = require_satisfies(), compare = require_compare(), subset = (sub, dom, options = {}) => {
    if (sub === dom)
      return !0;
    sub = new Range(sub, options), dom = new Range(dom, options);
    let sawNonNull = !1;
    OUTER:
      for (let simpleSub of sub.set) {
        for (let simpleDom of dom.set) {
          let isSub = simpleSubset(simpleSub, simpleDom, options);
          if (sawNonNull = sawNonNull || isSub !== null, isSub)
            continue OUTER;
        }
        if (sawNonNull)
          return !1;
      }
    return !0;
  }, minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")], minimumVersion = [new Comparator(">=0.0.0")], simpleSubset = (sub, dom, options) => {
    if (sub === dom)
      return !0;
    if (sub.length === 1 && sub[0].semver === ANY)
      if (dom.length === 1 && dom[0].semver === ANY)
        return !0;
      else if (options.includePrerelease)
        sub = minimumVersionWithPreRelease;
      else
        sub = minimumVersion;
    if (dom.length === 1 && dom[0].semver === ANY)
      if (options.includePrerelease)
        return !0;
      else
        dom = minimumVersion;
    let eqSet = /* @__PURE__ */ new Set, gt, lt;
    for (let c3 of sub)
      if (c3.operator === ">" || c3.operator === ">=")
        gt = higherGT(gt, c3, options);
      else if (c3.operator === "<" || c3.operator === "<=")
        lt = lowerLT(lt, c3, options);
      else
        eqSet.add(c3.semver);
    if (eqSet.size > 1)
      return null;
    let gtltComp;
    if (gt && lt) {
      if (gtltComp = compare(gt.semver, lt.semver, options), gtltComp > 0)
        return null;
      else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<="))
        return null;
    }
    for (let eq2 of eqSet) {
      if (gt && !satisfies(eq2, String(gt), options))
        return null;
      if (lt && !satisfies(eq2, String(lt), options))
        return null;
      for (let c3 of dom)
        if (!satisfies(eq2, String(c3), options))
          return !1;
      return !0;
    }
    let higher, lower, hasDomLT, hasDomGT, needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : !1, needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : !1;
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0)
      needDomLTPre = !1;
    for (let c3 of dom) {
      if (hasDomGT = hasDomGT || c3.operator === ">" || c3.operator === ">=", hasDomLT = hasDomLT || c3.operator === "<" || c3.operator === "<=", gt) {
        if (needDomGTPre) {
          if (c3.semver.prerelease && c3.semver.prerelease.length && c3.semver.major === needDomGTPre.major && c3.semver.minor === needDomGTPre.minor && c3.semver.patch === needDomGTPre.patch)
            needDomGTPre = !1;
        }
        if (c3.operator === ">" || c3.operator === ">=") {
          if (higher = higherGT(gt, c3, options), higher === c3 && higher !== gt)
            return !1;
        } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c3), options))
          return !1;
      }
      if (lt) {
        if (needDomLTPre) {
          if (c3.semver.prerelease && c3.semver.prerelease.length && c3.semver.major === needDomLTPre.major && c3.semver.minor === needDomLTPre.minor && c3.semver.patch === needDomLTPre.patch)
            needDomLTPre = !1;
        }
        if (c3.operator === "<" || c3.operator === "<=") {
          if (lower = lowerLT(lt, c3, options), lower === c3 && lower !== lt)
            return !1;
        } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c3), options))
          return !1;
      }
      if (!c3.operator && (lt || gt) && gtltComp !== 0)
        return !1;
    }
    if (gt && hasDomLT && !lt && gtltComp !== 0)
      return !1;
    if (lt && hasDomGT && !gt && gtltComp !== 0)
      return !1;
    if (needDomGTPre || needDomLTPre)
      return !1;
    return !0;
  }, higherGT = (a2, b, options) => {
    if (!a2)
      return b;
    let comp = compare(a2.semver, b.semver, options);
    return comp > 0 ? a2 : comp < 0 ? b : b.operator === ">" && a2.operator === ">=" ? b : a2;
  }, lowerLT = (a2, b, options) => {
    if (!a2)
      return b;
    let comp = compare(a2.semver, b.semver, options);
    return comp < 0 ? a2 : comp > 0 ? b : b.operator === "<" && a2.operator === "<=" ? b : a2;
  };
  module.exports = subset;
});
