// Original: src/ink/colorize.ts
function boostChalkLevelForXtermJs() {
  if (process.env.TERM_PROGRAM === "vscode" && source_default.level === 2)
    return source_default.level = 3, !0;
  return !1;
}
function clampChalkLevelForTmux() {
  if (process.env.CLAUDE_CODE_TMUX_TRUECOLOR)
    return !1;
  if (process.env.TMUX && source_default.level > 2)
    return source_default.level = 2, !0;
  return !1;
}
function applyTextStyles(text, styles3) {
  let result = text;
  if (styles3.inverse)
    result = source_default.inverse(result);
  if (styles3.strikethrough)
    result = source_default.strikethrough(result);
  if (styles3.underline)
    result = source_default.underline(result);
  if (styles3.italic)
    result = source_default.italic(result);
  if (styles3.bold)
    result = source_default.bold(result);
  if (styles3.dim)
    result = source_default.dim(result);
  if (styles3.color)
    result = colorize(result, styles3.color, "foreground");
  if (styles3.backgroundColor)
    result = colorize(result, styles3.backgroundColor, "background");
  return result;
}
function applyColor(text, color) {
  if (!color)
    return text;
  return colorize(text, color, "foreground");
}
var CHALK_BOOSTED_FOR_XTERMJS, CHALK_CLAMPED_FOR_TMUX, RGB_REGEX, ANSI_REGEX, colorize = (str, color, type) => {
  if (!color)
    return str;
  if (color.startsWith("ansi:"))
    switch (color.substring(5)) {
      case "black":
        return type === "foreground" ? source_default.black(str) : source_default.bgBlack(str);
      case "red":
        return type === "foreground" ? source_default.red(str) : source_default.bgRed(str);
      case "green":
        return type === "foreground" ? source_default.green(str) : source_default.bgGreen(str);
      case "yellow":
        return type === "foreground" ? source_default.yellow(str) : source_default.bgYellow(str);
      case "blue":
        return type === "foreground" ? source_default.blue(str) : source_default.bgBlue(str);
      case "magenta":
        return type === "foreground" ? source_default.magenta(str) : source_default.bgMagenta(str);
      case "cyan":
        return type === "foreground" ? source_default.cyan(str) : source_default.bgCyan(str);
      case "white":
        return type === "foreground" ? source_default.white(str) : source_default.bgWhite(str);
      case "blackBright":
        return type === "foreground" ? source_default.blackBright(str) : source_default.bgBlackBright(str);
      case "redBright":
        return type === "foreground" ? source_default.redBright(str) : source_default.bgRedBright(str);
      case "greenBright":
        return type === "foreground" ? source_default.greenBright(str) : source_default.bgGreenBright(str);
      case "yellowBright":
        return type === "foreground" ? source_default.yellowBright(str) : source_default.bgYellowBright(str);
      case "blueBright":
        return type === "foreground" ? source_default.blueBright(str) : source_default.bgBlueBright(str);
      case "magentaBright":
        return type === "foreground" ? source_default.magentaBright(str) : source_default.bgMagentaBright(str);
      case "cyanBright":
        return type === "foreground" ? source_default.cyanBright(str) : source_default.bgCyanBright(str);
      case "whiteBright":
        return type === "foreground" ? source_default.whiteBright(str) : source_default.bgWhiteBright(str);
    }
  if (color.startsWith("#"))
    return type === "foreground" ? source_default.hex(color)(str) : source_default.bgHex(color)(str);
  if (color.startsWith("ansi256")) {
    let matches = ANSI_REGEX.exec(color);
    if (!matches)
      return str;
    let value = Number(matches[1]);
    return type === "foreground" ? source_default.ansi256(value)(str) : source_default.bgAnsi256(value)(str);
  }
  if (color.startsWith("rgb")) {
    let matches = RGB_REGEX.exec(color);
    if (!matches)
      return str;
    let firstValue = Number(matches[1]), secondValue = Number(matches[2]), thirdValue = Number(matches[3]);
    return type === "foreground" ? source_default.rgb(firstValue, secondValue, thirdValue)(str) : source_default.bgRgb(firstValue, secondValue, thirdValue)(str);
  }
  return str;
};
var init_colorize = __esm(() => {
  init_source();
  CHALK_BOOSTED_FOR_XTERMJS = boostChalkLevelForXtermJs(), CHALK_CLAMPED_FOR_TMUX = clampChalkLevelForTmux(), RGB_REGEX = /^rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/, ANSI_REGEX = /^ansi256\(\s?(\d+)\s?\)$/;
});
