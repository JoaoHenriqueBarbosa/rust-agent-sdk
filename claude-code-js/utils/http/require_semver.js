// var: require_semver
var require_semver = __commonJS((exports, module) => {
  var debug = require_debug2(), { MAX_LENGTH, MAX_SAFE_INTEGER: MAX_SAFE_INTEGER3 } = require_constants2(), { safeRe: re, t: t2 } = require_re(), parseOptions = require_parse_options(), { compareIdentifiers } = require_identifiers();

  class SemVer {
    constructor(version4, options) {
      if (options = parseOptions(options), version4 instanceof SemVer)
        if (version4.loose === !!options.loose && version4.includePrerelease === !!options.includePrerelease)
          return version4;
        else
          version4 = version4.version;
      else if (typeof version4 !== "string")
        throw TypeError(`Invalid version. Must be a string. Got type "${typeof version4}".`);
      if (version4.length > MAX_LENGTH)
        throw TypeError(`version is longer than ${MAX_LENGTH} characters`);
      debug("SemVer", version4, options), this.options = options, this.loose = !!options.loose, this.includePrerelease = !!options.includePrerelease;
      let m4 = version4.trim().match(options.loose ? re[t2.LOOSE] : re[t2.FULL]);
      if (!m4)
        throw TypeError(`Invalid Version: ${version4}`);
      if (this.raw = version4, this.major = +m4[1], this.minor = +m4[2], this.patch = +m4[3], this.major > MAX_SAFE_INTEGER3 || this.major < 0)
        throw TypeError("Invalid major version");
      if (this.minor > MAX_SAFE_INTEGER3 || this.minor < 0)
        throw TypeError("Invalid minor version");
      if (this.patch > MAX_SAFE_INTEGER3 || this.patch < 0)
        throw TypeError("Invalid patch version");
      if (!m4[4])
        this.prerelease = [];
      else
        this.prerelease = m4[4].split(".").map((id) => {
          if (/^[0-9]+$/.test(id)) {
            let num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER3)
              return num;
          }
          return id;
        });
      this.build = m4[5] ? m4[5].split(".") : [], this.format();
    }
    format() {
      if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length)
        this.version += `-${this.prerelease.join(".")}`;
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(other) {
      if (debug("SemVer.compare", this.version, this.options, other), !(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version)
          return 0;
        other = new SemVer(other, this.options);
      }
      if (other.version === this.version)
        return 0;
      return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
      if (!(other instanceof SemVer))
        other = new SemVer(other, this.options);
      if (this.major < other.major)
        return -1;
      if (this.major > other.major)
        return 1;
      if (this.minor < other.minor)
        return -1;
      if (this.minor > other.minor)
        return 1;
      if (this.patch < other.patch)
        return -1;
      if (this.patch > other.patch)
        return 1;
      return 0;
    }
    comparePre(other) {
      if (!(other instanceof SemVer))
        other = new SemVer(other, this.options);
      if (this.prerelease.length && !other.prerelease.length)
        return -1;
      else if (!this.prerelease.length && other.prerelease.length)
        return 1;
      else if (!this.prerelease.length && !other.prerelease.length)
        return 0;
      let i4 = 0;
      do {
        let a2 = this.prerelease[i4], b = other.prerelease[i4];
        if (debug("prerelease compare", i4, a2, b), a2 === void 0 && b === void 0)
          return 0;
        else if (b === void 0)
          return 1;
        else if (a2 === void 0)
          return -1;
        else if (a2 === b)
          continue;
        else
          return compareIdentifiers(a2, b);
      } while (++i4);
    }
    compareBuild(other) {
      if (!(other instanceof SemVer))
        other = new SemVer(other, this.options);
      let i4 = 0;
      do {
        let a2 = this.build[i4], b = other.build[i4];
        if (debug("build compare", i4, a2, b), a2 === void 0 && b === void 0)
          return 0;
        else if (b === void 0)
          return 1;
        else if (a2 === void 0)
          return -1;
        else if (a2 === b)
          continue;
        else
          return compareIdentifiers(a2, b);
      } while (++i4);
    }
    inc(release, identifier, identifierBase) {
      if (release.startsWith("pre")) {
        if (!identifier && identifierBase === !1)
          throw Error("invalid increment argument: identifier is empty");
        if (identifier) {
          let match = `-${identifier}`.match(this.options.loose ? re[t2.PRERELEASELOOSE] : re[t2.PRERELEASE]);
          if (!match || match[1] !== identifier)
            throw Error(`invalid identifier: ${identifier}`);
        }
      }
      switch (release) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", identifier, identifierBase);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", identifier, identifierBase);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", identifier, identifierBase), this.inc("pre", identifier, identifierBase);
          break;
        case "prerelease":
          if (this.prerelease.length === 0)
            this.inc("patch", identifier, identifierBase);
          this.inc("pre", identifier, identifierBase);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
            this.major++;
          this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0)
            this.minor++;
          this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0)
            this.patch++;
          this.prerelease = [];
          break;
        case "pre": {
          let base2 = Number(identifierBase) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [base2];
          else {
            let i4 = this.prerelease.length;
            while (--i4 >= 0)
              if (typeof this.prerelease[i4] === "number")
                this.prerelease[i4]++, i4 = -2;
            if (i4 === -1) {
              if (identifier === this.prerelease.join(".") && identifierBase === !1)
                throw Error("invalid increment argument: identifier already exists");
              this.prerelease.push(base2);
            }
          }
          if (identifier) {
            let prerelease = [identifier, base2];
            if (identifierBase === !1)
              prerelease = [identifier];
            if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
              if (isNaN(this.prerelease[1]))
                this.prerelease = prerelease;
            } else
              this.prerelease = prerelease;
          }
          break;
        }
        default:
          throw Error(`invalid increment argument: ${release}`);
      }
      if (this.raw = this.format(), this.build.length)
        this.raw += `+${this.build.join(".")}`;
      return this;
    }
  }
  module.exports = SemVer;
});
