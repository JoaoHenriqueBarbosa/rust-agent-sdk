// var: require_ms
var require_ms = __commonJS((exports, module) => {
  var s = 1000, m = s * 60, h2 = m * 60, d = h2 * 24, w = d * 7, y = d * 365.25;
  module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0)
      return parse7(val);
    else if (type === "number" && isFinite(val))
      return options.long ? fmtLong(val) : fmtShort(val);
    throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
  function parse7(str) {
    if (str = String(str), str.length > 100)
      return;
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match)
      return;
    var n2 = parseFloat(match[1]), type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n2 * y;
      case "weeks":
      case "week":
      case "w":
        return n2 * w;
      case "days":
      case "day":
      case "d":
        return n2 * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n2 * h2;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n2 * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n2 * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n2;
      default:
        return;
    }
  }
  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d)
      return Math.round(ms / d) + "d";
    if (msAbs >= h2)
      return Math.round(ms / h2) + "h";
    if (msAbs >= m)
      return Math.round(ms / m) + "m";
    if (msAbs >= s)
      return Math.round(ms / s) + "s";
    return ms + "ms";
  }
  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d)
      return plural(ms, msAbs, d, "day");
    if (msAbs >= h2)
      return plural(ms, msAbs, h2, "hour");
    if (msAbs >= m)
      return plural(ms, msAbs, m, "minute");
    if (msAbs >= s)
      return plural(ms, msAbs, s, "second");
    return ms + " ms";
  }
  function plural(ms, msAbs, n2, name) {
    var isPlural = msAbs >= n2 * 1.5;
    return Math.round(ms / n2) + " " + name + (isPlural ? "s" : "");
  }
});
