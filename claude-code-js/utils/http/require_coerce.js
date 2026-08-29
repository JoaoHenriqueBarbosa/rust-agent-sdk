// var: require_coerce
var require_coerce = __commonJS((exports, module) => {
  var SemVer = require_semver(), parse9 = require_parse3(), { safeRe: re, t: t2 } = require_re(), coerce = (version4, options) => {
    if (version4 instanceof SemVer)
      return version4;
    if (typeof version4 === "number")
      version4 = String(version4);
    if (typeof version4 !== "string")
      return null;
    options = options || {};
    let match = null;
    if (!options.rtl)
      match = version4.match(options.includePrerelease ? re[t2.COERCEFULL] : re[t2.COERCE]);
    else {
      let coerceRtlRegex = options.includePrerelease ? re[t2.COERCERTLFULL] : re[t2.COERCERTL], next;
      while ((next = coerceRtlRegex.exec(version4)) && (!match || match.index + match[0].length !== version4.length)) {
        if (!match || next.index + next[0].length !== match.index + match[0].length)
          match = next;
        coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
      }
      coerceRtlRegex.lastIndex = -1;
    }
    if (match === null)
      return null;
    let major = match[2], minor = match[3] || "0", patch = match[4] || "0", prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "", build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
    return parse9(`${major}.${minor}.${patch}${prerelease}${build}`, options);
  };
  module.exports = coerce;
});
