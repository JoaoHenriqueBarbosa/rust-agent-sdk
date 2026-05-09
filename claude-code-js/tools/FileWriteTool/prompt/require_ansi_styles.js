// var: require_ansi_styles
var require_ansi_styles = __commonJS((exports, module) => {
  var wrapAnsi163 = (fn, offset) => (...args) => {
    return `\x1B[${fn(...args) + offset}m`;
  }, wrapAnsi2563 = (fn, offset) => (...args) => {
    let code = fn(...args);
    return `\x1B[${38 + offset};5;${code}m`;
  }, wrapAnsi16m3 = (fn, offset) => (...args) => {
    let rgb2 = fn(...args);
    return `\x1B[${38 + offset};2;${rgb2[0]};${rgb2[1]};${rgb2[2]}m`;
  }, ansi2ansi = (n5) => n5, rgb2rgb = (r4, g, b) => [r4, g, b], setLazyProperty = (object2, property2, get2) => {
    Object.defineProperty(object2, property2, {
      get: () => {
        let value = get2();
        return Object.defineProperty(object2, property2, {
          value,
          enumerable: !0,
          configurable: !0
        }), value;
      },
      enumerable: !0,
      configurable: !0
    });
  }, colorConvert, makeDynamicStyles = (wrap, targetSpace, identity16, isBackground) => {
    if (colorConvert === void 0)
      colorConvert = require_color_convert();
    let offset = isBackground ? 10 : 0, styles5 = {};
    for (let [sourceSpace, suite] of Object.entries(colorConvert)) {
      let name3 = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
      if (sourceSpace === targetSpace)
        styles5[name3] = wrap(identity16, offset);
      else if (typeof suite === "object")
        styles5[name3] = wrap(suite[targetSpace], offset);
    }
    return styles5;
  };
  function assembleStyles3() {
    let codes = /* @__PURE__ */ new Map, styles5 = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        blackBright: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    styles5.color.gray = styles5.color.blackBright, styles5.bgColor.bgGray = styles5.bgColor.bgBlackBright, styles5.color.grey = styles5.color.blackBright, styles5.bgColor.bgGrey = styles5.bgColor.bgBlackBright;
    for (let [groupName, group] of Object.entries(styles5)) {
      for (let [styleName, style] of Object.entries(group))
        styles5[styleName] = {
          open: `\x1B[${style[0]}m`,
          close: `\x1B[${style[1]}m`
        }, group[styleName] = styles5[styleName], codes.set(style[0], style[1]);
      Object.defineProperty(styles5, groupName, {
        value: group,
        enumerable: !1
      });
    }
    return Object.defineProperty(styles5, "codes", {
      value: codes,
      enumerable: !1
    }), styles5.color.close = "\x1B[39m", styles5.bgColor.close = "\x1B[49m", setLazyProperty(styles5.color, "ansi", () => makeDynamicStyles(wrapAnsi163, "ansi16", ansi2ansi, !1)), setLazyProperty(styles5.color, "ansi256", () => makeDynamicStyles(wrapAnsi2563, "ansi256", ansi2ansi, !1)), setLazyProperty(styles5.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m3, "rgb", rgb2rgb, !1)), setLazyProperty(styles5.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi163, "ansi16", ansi2ansi, !0)), setLazyProperty(styles5.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi2563, "ansi256", ansi2ansi, !0)), setLazyProperty(styles5.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m3, "rgb", rgb2rgb, !0)), styles5;
  }
  Object.defineProperty(module, "exports", {
    enumerable: !0,
    get: assembleStyles3
  });
});
