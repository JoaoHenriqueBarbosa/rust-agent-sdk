// var: require_ansi_escapes
var require_ansi_escapes = __commonJS((exports, module) => {
  var ansiEscapes = exports;
  exports.default = ansiEscapes;
  var ESC2 = "\x1B[", OSC3 = "\x1B]", BEL3 = "\x07", SEP2 = ";", isTerminalApp = process.env.TERM_PROGRAM === "Apple_Terminal";
  ansiEscapes.cursorTo = (x3, y2) => {
    if (typeof x3 !== "number")
      throw TypeError("The `x` argument is required");
    if (typeof y2 !== "number")
      return ESC2 + (x3 + 1) + "G";
    return ESC2 + (y2 + 1) + ";" + (x3 + 1) + "H";
  };
  ansiEscapes.cursorMove = (x3, y2) => {
    if (typeof x3 !== "number")
      throw TypeError("The `x` argument is required");
    let ret = "";
    if (x3 < 0)
      ret += ESC2 + -x3 + "D";
    else if (x3 > 0)
      ret += ESC2 + x3 + "C";
    if (y2 < 0)
      ret += ESC2 + -y2 + "A";
    else if (y2 > 0)
      ret += ESC2 + y2 + "B";
    return ret;
  };
  ansiEscapes.cursorUp = (count3 = 1) => ESC2 + count3 + "A";
  ansiEscapes.cursorDown = (count3 = 1) => ESC2 + count3 + "B";
  ansiEscapes.cursorForward = (count3 = 1) => ESC2 + count3 + "C";
  ansiEscapes.cursorBackward = (count3 = 1) => ESC2 + count3 + "D";
  ansiEscapes.cursorLeft = ESC2 + "G";
  ansiEscapes.cursorSavePosition = isTerminalApp ? "\x1B7" : ESC2 + "s";
  ansiEscapes.cursorRestorePosition = isTerminalApp ? "\x1B8" : ESC2 + "u";
  ansiEscapes.cursorGetPosition = ESC2 + "6n";
  ansiEscapes.cursorNextLine = ESC2 + "E";
  ansiEscapes.cursorPrevLine = ESC2 + "F";
  ansiEscapes.cursorHide = ESC2 + "?25l";
  ansiEscapes.cursorShow = ESC2 + "?25h";
  ansiEscapes.eraseLines = (count3) => {
    let clear = "";
    for (let i4 = 0;i4 < count3; i4++)
      clear += ansiEscapes.eraseLine + (i4 < count3 - 1 ? ansiEscapes.cursorUp() : "");
    if (count3)
      clear += ansiEscapes.cursorLeft;
    return clear;
  };
  ansiEscapes.eraseEndLine = ESC2 + "K";
  ansiEscapes.eraseStartLine = ESC2 + "1K";
  ansiEscapes.eraseLine = ESC2 + "2K";
  ansiEscapes.eraseDown = ESC2 + "J";
  ansiEscapes.eraseUp = ESC2 + "1J";
  ansiEscapes.eraseScreen = ESC2 + "2J";
  ansiEscapes.scrollUp = ESC2 + "S";
  ansiEscapes.scrollDown = ESC2 + "T";
  ansiEscapes.clearScreen = "\x1Bc";
  ansiEscapes.clearTerminal = process.platform === "win32" ? `${ansiEscapes.eraseScreen}${ESC2}0f` : `${ansiEscapes.eraseScreen}${ESC2}3J${ESC2}H`;
  ansiEscapes.beep = BEL3;
  ansiEscapes.link = (text2, url3) => {
    return [
      OSC3,
      "8",
      SEP2,
      SEP2,
      url3,
      BEL3,
      text2,
      OSC3,
      "8",
      SEP2,
      SEP2,
      BEL3
    ].join("");
  };
  ansiEscapes.image = (buffer, options = {}) => {
    let ret = `${OSC3}1337;File=inline=1`;
    if (options.width)
      ret += `;width=${options.width}`;
    if (options.height)
      ret += `;height=${options.height}`;
    if (options.preserveAspectRatio === !1)
      ret += ";preserveAspectRatio=0";
    return ret + ":" + buffer.toString("base64") + BEL3;
  };
  ansiEscapes.iTerm = {
    setCwd: (cwd2 = process.cwd()) => `${OSC3}50;CurrentDir=${cwd2}${BEL3}`,
    annotation: (message, options = {}) => {
      let ret = `${OSC3}1337;`, hasX = typeof options.x < "u", hasY = typeof options.y < "u";
      if ((hasX || hasY) && !(hasX && hasY && typeof options.length < "u"))
        throw Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
      if (message = message.replace(/\|/g, ""), ret += options.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", options.length > 0)
        ret += (hasX ? [message, options.length, options.x, options.y] : [options.length, message]).join("|");
      else
        ret += message;
      return ret + BEL3;
    }
  };
});
