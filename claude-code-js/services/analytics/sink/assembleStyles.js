// function: assembleStyles
function assembleStyles() {
  let codes = /* @__PURE__ */ new Map;
  for (let [groupName, group] of Object.entries(styles)) {
    for (let [styleName, style] of Object.entries(group))
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      }, group[styleName] = styles[styleName], codes.set(style[0], style[1]);
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: !1
    });
  }
  return Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: !1
  }), styles.color.close = "\x1B[39m", styles.bgColor.close = "\x1B[49m", styles.color.ansi = wrapAnsi16(), styles.color.ansi256 = wrapAnsi256(), styles.color.ansi16m = wrapAnsi16m(), styles.bgColor.ansi = wrapAnsi16(10), styles.bgColor.ansi256 = wrapAnsi256(10), styles.bgColor.ansi16m = wrapAnsi16m(10), Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8)
            return 16;
          if (red > 248)
            return 231;
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: !1
    },
    hexToRgb: {
      value(hex) {
        let matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches)
          return [0, 0, 0];
        let [colorString] = matches;
        if (colorString.length === 3)
          colorString = [...colorString].map((character) => character + character).join("");
        let integer2 = Number.parseInt(colorString, 16);
        return [
          integer2 >> 16 & 255,
          integer2 >> 8 & 255,
          integer2 & 255
        ];
      },
      enumerable: !1
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: !1
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8)
          return 30 + code;
        if (code < 16)
          return 90 + (code - 8);
        let red, green, blue;
        if (code >= 232)
          red = ((code - 232) * 10 + 8) / 255, green = red, blue = red;
        else {
          code -= 16;
          let remainder = code % 36;
          red = Math.floor(code / 36) / 5, green = Math.floor(remainder / 6) / 5, blue = remainder % 6 / 5;
        }
        let value = Math.max(red, green, blue) * 2;
        if (value === 0)
          return 30;
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2)
          result += 60;
        return result;
      },
      enumerable: !1
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: !1
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: !1
    }
  }), styles;
}
