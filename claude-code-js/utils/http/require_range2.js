// var: require_range2
var require_range2 = __commonJS((exports, module) => {
  var SPACE_CHARACTERS = /\s+/g;

  class Range {
    constructor(range, options) {
      if (options = parseOptions(options), range instanceof Range)
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease)
          return range;
        else
          return new Range(range.raw, options);
      if (range instanceof Comparator)
        return this.raw = range.value, this.set = [[range]], this.formatted = void 0, this;
      if (this.options = options, this.loose = !!options.loose, this.includePrerelease = !!options.includePrerelease, this.raw = range.trim().replace(SPACE_CHARACTERS, " "), this.set = this.raw.split("||").map((r4) => this.parseRange(r4.trim())).filter((c3) => c3.length), !this.set.length)
        throw TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        let first = this.set[0];
        if (this.set = this.set.filter((c3) => !isNullSet(c3[0])), this.set.length === 0)
          this.set = [first];
        else if (this.set.length > 1) {
          for (let c3 of this.set)
            if (c3.length === 1 && isAny(c3[0])) {
              this.set = [c3];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i4 = 0;i4 < this.set.length; i4++) {
          if (i4 > 0)
            this.formatted += "||";
          let comps = this.set[i4];
          for (let k3 = 0;k3 < comps.length; k3++) {
            if (k3 > 0)
              this.formatted += " ";
            this.formatted += comps[k3].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range) {
      let memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range, cached2 = cache4.get(memoKey);
      if (cached2)
        return cached2;
      let loose = this.options.loose, hr = loose ? re[t2.HYPHENRANGELOOSE] : re[t2.HYPHENRANGE];
      range = range.replace(hr, hyphenReplace(this.options.includePrerelease)), debug("hyphen replace", range), range = range.replace(re[t2.COMPARATORTRIM], comparatorTrimReplace), debug("comparator trim", range), range = range.replace(re[t2.TILDETRIM], tildeTrimReplace), debug("tilde trim", range), range = range.replace(re[t2.CARETTRIM], caretTrimReplace), debug("caret trim", range);
      let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose)
        rangeList = rangeList.filter((comp) => {
          return debug("loose invalid filter", comp, this.options), !!comp.match(re[t2.COMPARATORLOOSE]);
        });
      debug("range list", rangeList);
      let rangeMap = /* @__PURE__ */ new Map, comparators = rangeList.map((comp) => new Comparator(comp, this.options));
      for (let comp of comparators) {
        if (isNullSet(comp))
          return [comp];
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has(""))
        rangeMap.delete("");
      let result = [...rangeMap.values()];
      return cache4.set(memoKey, result), result;
    }
    intersects(range, options) {
      if (!(range instanceof Range))
        throw TypeError("a Range is required");
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    test(version4) {
      if (!version4)
        return !1;
      if (typeof version4 === "string")
        try {
          version4 = new SemVer(version4, this.options);
        } catch (er) {
          return !1;
        }
      for (let i4 = 0;i4 < this.set.length; i4++)
        if (testSet(this.set[i4], version4, this.options))
          return !0;
      return !1;
    }
  }
  module.exports = Range;
  var LRU = require_lrucache(), cache4 = new LRU, parseOptions = require_parse_options(), Comparator = require_comparator(), debug = require_debug2(), SemVer = require_semver(), {
    safeRe: re,
    t: t2,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = require_re(), { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants2(), isNullSet = (c3) => c3.value === "<0.0.0-0", isAny = (c3) => c3.value === "", isSatisfiable = (comparators, options) => {
    let result = !0, remainingComparators = comparators.slice(), testComparator = remainingComparators.pop();
    while (result && remainingComparators.length)
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      }), testComparator = remainingComparators.pop();
    return result;
  }, parseComparator = (comp, options) => {
    return comp = comp.replace(re[t2.BUILD], ""), debug("comp", comp, options), comp = replaceCarets(comp, options), debug("caret", comp), comp = replaceTildes(comp, options), debug("tildes", comp), comp = replaceXRanges(comp, options), debug("xrange", comp), comp = replaceStars(comp, options), debug("stars", comp), comp;
  }, isX = (id) => !id || id.toLowerCase() === "x" || id === "*", replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c3) => replaceTilde(c3, options)).join(" ");
  }, replaceTilde = (comp, options) => {
    let r4 = options.loose ? re[t2.TILDELOOSE] : re[t2.TILDE];
    return comp.replace(r4, (_, M2, m4, p4, pr) => {
      debug("tilde", comp, _, M2, m4, p4, pr);
      let ret;
      if (isX(M2))
        ret = "";
      else if (isX(m4))
        ret = `>=${M2}.0.0 <${+M2 + 1}.0.0-0`;
      else if (isX(p4))
        ret = `>=${M2}.${m4}.0 <${M2}.${+m4 + 1}.0-0`;
      else if (pr)
        debug("replaceTilde pr", pr), ret = `>=${M2}.${m4}.${p4}-${pr} <${M2}.${+m4 + 1}.0-0`;
      else
        ret = `>=${M2}.${m4}.${p4} <${M2}.${+m4 + 1}.0-0`;
      return debug("tilde return", ret), ret;
    });
  }, replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c3) => replaceCaret(c3, options)).join(" ");
  }, replaceCaret = (comp, options) => {
    debug("caret", comp, options);
    let r4 = options.loose ? re[t2.CARETLOOSE] : re[t2.CARET], z2 = options.includePrerelease ? "-0" : "";
    return comp.replace(r4, (_, M2, m4, p4, pr) => {
      debug("caret", comp, _, M2, m4, p4, pr);
      let ret;
      if (isX(M2))
        ret = "";
      else if (isX(m4))
        ret = `>=${M2}.0.0${z2} <${+M2 + 1}.0.0-0`;
      else if (isX(p4))
        if (M2 === "0")
          ret = `>=${M2}.${m4}.0${z2} <${M2}.${+m4 + 1}.0-0`;
        else
          ret = `>=${M2}.${m4}.0${z2} <${+M2 + 1}.0.0-0`;
      else if (pr)
        if (debug("replaceCaret pr", pr), M2 === "0")
          if (m4 === "0")
            ret = `>=${M2}.${m4}.${p4}-${pr} <${M2}.${m4}.${+p4 + 1}-0`;
          else
            ret = `>=${M2}.${m4}.${p4}-${pr} <${M2}.${+m4 + 1}.0-0`;
        else
          ret = `>=${M2}.${m4}.${p4}-${pr} <${+M2 + 1}.0.0-0`;
      else if (debug("no pr"), M2 === "0")
        if (m4 === "0")
          ret = `>=${M2}.${m4}.${p4}${z2} <${M2}.${m4}.${+p4 + 1}-0`;
        else
          ret = `>=${M2}.${m4}.${p4}${z2} <${M2}.${+m4 + 1}.0-0`;
      else
        ret = `>=${M2}.${m4}.${p4} <${+M2 + 1}.0.0-0`;
      return debug("caret return", ret), ret;
    });
  }, replaceXRanges = (comp, options) => {
    return debug("replaceXRanges", comp, options), comp.split(/\s+/).map((c3) => replaceXRange(c3, options)).join(" ");
  }, replaceXRange = (comp, options) => {
    comp = comp.trim();
    let r4 = options.loose ? re[t2.XRANGELOOSE] : re[t2.XRANGE];
    return comp.replace(r4, (ret, gtlt, M2, m4, p4, pr) => {
      debug("xRange", comp, ret, gtlt, M2, m4, p4, pr);
      let xM = isX(M2), xm = xM || isX(m4), xp = xm || isX(p4), anyX = xp;
      if (gtlt === "=" && anyX)
        gtlt = "";
      if (pr = options.includePrerelease ? "-0" : "", xM)
        if (gtlt === ">" || gtlt === "<")
          ret = "<0.0.0-0";
        else
          ret = "*";
      else if (gtlt && anyX) {
        if (xm)
          m4 = 0;
        if (p4 = 0, gtlt === ">")
          if (gtlt = ">=", xm)
            M2 = +M2 + 1, m4 = 0, p4 = 0;
          else
            m4 = +m4 + 1, p4 = 0;
        else if (gtlt === "<=")
          if (gtlt = "<", xm)
            M2 = +M2 + 1;
          else
            m4 = +m4 + 1;
        if (gtlt === "<")
          pr = "-0";
        ret = `${gtlt + M2}.${m4}.${p4}${pr}`;
      } else if (xm)
        ret = `>=${M2}.0.0${pr} <${+M2 + 1}.0.0-0`;
      else if (xp)
        ret = `>=${M2}.${m4}.0${pr} <${M2}.${+m4 + 1}.0-0`;
      return debug("xRange return", ret), ret;
    });
  }, replaceStars = (comp, options) => {
    return debug("replaceStars", comp, options), comp.trim().replace(re[t2.STAR], "");
  }, replaceGTE0 = (comp, options) => {
    return debug("replaceGTE0", comp, options), comp.trim().replace(re[options.includePrerelease ? t2.GTE0PRE : t2.GTE0], "");
  }, hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM))
      from = "";
    else if (isX(fm))
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    else if (isX(fp))
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    else if (fpr)
      from = `>=${from}`;
    else
      from = `>=${from}${incPr ? "-0" : ""}`;
    if (isX(tM))
      to = "";
    else if (isX(tm))
      to = `<${+tM + 1}.0.0-0`;
    else if (isX(tp))
      to = `<${tM}.${+tm + 1}.0-0`;
    else if (tpr)
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    else if (incPr)
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    else
      to = `<=${to}`;
    return `${from} ${to}`.trim();
  }, testSet = (set2, version4, options) => {
    for (let i4 = 0;i4 < set2.length; i4++)
      if (!set2[i4].test(version4))
        return !1;
    if (version4.prerelease.length && !options.includePrerelease) {
      for (let i4 = 0;i4 < set2.length; i4++) {
        if (debug(set2[i4].semver), set2[i4].semver === Comparator.ANY)
          continue;
        if (set2[i4].semver.prerelease.length > 0) {
          let allowed = set2[i4].semver;
          if (allowed.major === version4.major && allowed.minor === version4.minor && allowed.patch === version4.patch)
            return !0;
        }
      }
      return !1;
    }
    return !0;
  };
});
