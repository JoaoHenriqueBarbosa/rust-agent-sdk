// var: require_yoctocolors_cjs
var require_yoctocolors_cjs = __commonJS((exports, module) => {
  var tty4 = __require("tty"), hasColors2 = tty4?.WriteStream?.prototype?.hasColors?.() ?? !1, format4 = (open5, close) => {
    if (!hasColors2)
      return (input) => input;
    let openCode = `\x1B[${open5}m`, closeCode = `\x1B[${close}m`;
    return (input) => {
      let string4 = input + "", index = string4.indexOf(closeCode);
      if (index === -1)
        return openCode + string4 + closeCode;
      let result = openCode, lastIndex = 0, replaceCode = (close === 22 ? closeCode : "") + openCode;
      while (index !== -1)
        result += string4.slice(lastIndex, index) + replaceCode, lastIndex = index + closeCode.length, index = string4.indexOf(closeCode, lastIndex);
      return result += string4.slice(lastIndex) + closeCode, result;
    };
  }, colors = {};
  colors.reset = format4(0, 0);
  colors.bold = format4(1, 22);
  colors.dim = format4(2, 22);
  colors.italic = format4(3, 23);
  colors.underline = format4(4, 24);
  colors.overline = format4(53, 55);
  colors.inverse = format4(7, 27);
  colors.hidden = format4(8, 28);
  colors.strikethrough = format4(9, 29);
  colors.black = format4(30, 39);
  colors.red = format4(31, 39);
  colors.green = format4(32, 39);
  colors.yellow = format4(33, 39);
  colors.blue = format4(34, 39);
  colors.magenta = format4(35, 39);
  colors.cyan = format4(36, 39);
  colors.white = format4(37, 39);
  colors.gray = format4(90, 39);
  colors.bgBlack = format4(40, 49);
  colors.bgRed = format4(41, 49);
  colors.bgGreen = format4(42, 49);
  colors.bgYellow = format4(43, 49);
  colors.bgBlue = format4(44, 49);
  colors.bgMagenta = format4(45, 49);
  colors.bgCyan = format4(46, 49);
  colors.bgWhite = format4(47, 49);
  colors.bgGray = format4(100, 49);
  colors.redBright = format4(91, 39);
  colors.greenBright = format4(92, 39);
  colors.yellowBright = format4(93, 39);
  colors.blueBright = format4(94, 39);
  colors.magentaBright = format4(95, 39);
  colors.cyanBright = format4(96, 39);
  colors.whiteBright = format4(97, 39);
  colors.bgRedBright = format4(101, 49);
  colors.bgGreenBright = format4(102, 49);
  colors.bgYellowBright = format4(103, 49);
  colors.bgBlueBright = format4(104, 49);
  colors.bgMagentaBright = format4(105, 49);
  colors.bgCyanBright = format4(106, 49);
  colors.bgWhiteBright = format4(107, 49);
  module.exports = colors;
});
