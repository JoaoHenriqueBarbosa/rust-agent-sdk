// var: require_supports_color
var require_supports_color = __commonJS((exports, module) => {
  var os3 = __require("os"), tty4 = __require("tty"), hasFlag2 = require_has_flag(), { env: env3 } = process, forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never"))
    forceColor = 0;
  else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always"))
    forceColor = 1;
  if ("FORCE_COLOR" in env3)
    if (env3.FORCE_COLOR === "true")
      forceColor = 1;
    else if (env3.FORCE_COLOR === "false")
      forceColor = 0;
    else
      forceColor = env3.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env3.FORCE_COLOR, 10), 3);
  function translateLevel2(level) {
    if (level === 0)
      return !1;
    return {
      level,
      hasBasic: !0,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor2(haveStream, streamIsTTY) {
    if (forceColor === 0)
      return 0;
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor"))
      return 3;
    if (hasFlag2("color=256"))
      return 2;
    if (haveStream && !streamIsTTY && forceColor === void 0)
      return 0;
    let min = forceColor || 0;
    if (env3.TERM === "dumb")
      return min;
    if (process.platform === "win32") {
      let osRelease2 = os3.release().split(".");
      if (Number(osRelease2[0]) >= 10 && Number(osRelease2[2]) >= 10586)
        return Number(osRelease2[2]) >= 14931 ? 3 : 2;
      return 1;
    }
    if ("CI" in env3) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => (sign in env3)) || env3.CI_NAME === "codeship")
        return 1;
      return min;
    }
    if ("TEAMCITY_VERSION" in env3)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env3.TEAMCITY_VERSION) ? 1 : 0;
    if (env3.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in env3) {
      let version2 = parseInt((env3.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env3.TERM_PROGRAM) {
        case "iTerm.app":
          return version2 >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env3.TERM))
      return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env3.TERM))
      return 1;
    if ("COLORTERM" in env3)
      return 1;
    return min;
  }
  function getSupportLevel(stream) {
    let level = supportsColor2(stream, stream && stream.isTTY);
    return translateLevel2(level);
  }
  module.exports = {
    supportsColor: getSupportLevel,
    stdout: translateLevel2(supportsColor2(!0, tty4.isatty(1))),
    stderr: translateLevel2(supportsColor2(!0, tty4.isatty(2)))
  };
});
