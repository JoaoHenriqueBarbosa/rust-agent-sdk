// var: require_comparator
var require_comparator = __commonJS((exports, module) => {
  var ANY = Symbol("SemVer ANY");

  class Comparator {
    static get ANY() {
      return ANY;
    }
    constructor(comp, options) {
      if (options = parseOptions(options), comp instanceof Comparator)
        if (comp.loose === !!options.loose)
          return comp;
        else
          comp = comp.value;
      if (comp = comp.trim().split(/\s+/).join(" "), debug("comparator", comp, options), this.options = options, this.loose = !!options.loose, this.parse(comp), this.semver === ANY)
        this.value = "";
      else
        this.value = this.operator + this.semver.version;
      debug("comp", this);
    }
    parse(comp) {
      let r4 = this.options.loose ? re[t2.COMPARATORLOOSE] : re[t2.COMPARATOR], m4 = comp.match(r4);
      if (!m4)
        throw TypeError(`Invalid comparator: ${comp}`);
      if (this.operator = m4[1] !== void 0 ? m4[1] : "", this.operator === "=")
        this.operator = "";
      if (!m4[2])
        this.semver = ANY;
      else
        this.semver = new SemVer(m4[2], this.options.loose);
    }
    toString() {
      return this.value;
    }
    test(version4) {
      if (debug("Comparator.test", version4, this.options.loose), this.semver === ANY || version4 === ANY)
        return !0;
      if (typeof version4 === "string")
        try {
          version4 = new SemVer(version4, this.options);
        } catch (er) {
          return !1;
        }
      return cmp(version4, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator))
        throw TypeError("a Comparator is required");
      if (this.operator === "") {
        if (this.value === "")
          return !0;
        return new Range(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "")
          return !0;
        return new Range(this.value, options).test(comp.semver);
      }
      if (options = parseOptions(options), options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0"))
        return !1;
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0")))
        return !1;
      if (this.operator.startsWith(">") && comp.operator.startsWith(">"))
        return !0;
      if (this.operator.startsWith("<") && comp.operator.startsWith("<"))
        return !0;
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("="))
        return !0;
      if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<"))
        return !0;
      if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">"))
        return !0;
      return !1;
    }
  }
  module.exports = Comparator;
  var parseOptions = require_parse_options(), { safeRe: re, t: t2 } = require_re(), cmp = require_cmp(), debug = require_debug2(), SemVer = require_semver(), Range = require_range2();
});
