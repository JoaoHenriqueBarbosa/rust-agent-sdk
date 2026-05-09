// function: _supportsColor
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = !0 } = {}) {
  let noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0)
    flagForceColor = noFlagForceColor;
  let forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0)
    return 0;
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor"))
      return 3;
    if (hasFlag("color=256"))
      return 2;
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env)
    return 1;
  if (haveStream && !streamIsTTY && forceColor === void 0)
    return 0;
  let min = forceColor || 0;
  if (env.TERM === "dumb")
    return min;
  if (process3.platform === "win32") {
    let osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586)
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => (key in env)))
      return 3;
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => (sign in env)) || env.CI_NAME === "codeship")
      return 1;
    return min;
  }
  if ("TEAMCITY_VERSION" in env)
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  if (env.COLORTERM === "truecolor")
    return 3;
  if (env.TERM === "xterm-kitty")
    return 3;
  if (env.TERM === "xterm-ghostty")
    return 3;
  if (env.TERM === "wezterm")
    return 3;
  if ("TERM_PROGRAM" in env) {
    let version2 = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app":
        return version2 >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2;
    }
  }
  if (/-256(color)?$/i.test(env.TERM))
    return 2;
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM))
    return 1;
  if ("COLORTERM" in env)
    return 1;
  return min;
}
