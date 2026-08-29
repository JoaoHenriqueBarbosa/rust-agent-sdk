// Original: src/ink/tabstops.ts
function expandTabs(text, interval = DEFAULT_TAB_INTERVAL) {
  if (!text.includes("\t"))
    return text;
  let tokenizer = createTokenizer(), tokens = tokenizer.feed(text);
  tokens.push(...tokenizer.flush());
  let result = "", column = 0;
  for (let token of tokens)
    if (token.type === "sequence")
      result += token.value;
    else {
      let parts = token.value.split(/(\t|\n)/);
      for (let part of parts)
        if (part === "\t") {
          let spaces = interval - column % interval;
          result += " ".repeat(spaces), column += spaces;
        } else if (part === `
`)
          result += part, column = 0;
        else
          result += part, column += stringWidth(part);
    }
  return result;
}
var DEFAULT_TAB_INTERVAL = 8;
var init_tabstops = __esm(() => {
  init_stringWidth();
  init_tokenize();
});

// node_modules/ansi-styles/index.js
function assembleStyles2() {
  let codes = /* @__PURE__ */ new Map;
  for (let [groupName, group] of Object.entries(styles3)) {
    for (let [styleName, style] of Object.entries(group))
      styles3[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      }, group[styleName] = styles3[styleName], codes.set(style[0], style[1]);
    Object.defineProperty(styles3, groupName, {
      value: group,
      enumerable: !1
    });
  }
  return Object.defineProperty(styles3, "codes", {
    value: codes,
    enumerable: !1
  }), styles3.color.close = "\x1B[39m", styles3.bgColor.close = "\x1B[49m", styles3.color.ansi = wrapAnsi162(), styles3.color.ansi256 = wrapAnsi2562(), styles3.color.ansi16m = wrapAnsi16m2(), styles3.bgColor.ansi = wrapAnsi162(10), styles3.bgColor.ansi256 = wrapAnsi2562(10), styles3.bgColor.ansi16m = wrapAnsi16m2(10), Object.defineProperties(styles3, {
    rgbToAnsi256: {
      value(red2, green2, blue2) {
        if (red2 === green2 && green2 === blue2) {
          if (red2 < 8)
            return 16;
          if (red2 > 248)
            return 231;
          return Math.round((red2 - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red2 / 255 * 5) + 6 * Math.round(green2 / 255 * 5) + Math.round(blue2 / 255 * 5);
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
      value: (hex) => styles3.rgbToAnsi256(...styles3.hexToRgb(hex)),
      enumerable: !1
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8)
          return 30 + code;
        if (code < 16)
          return 90 + (code - 8);
        let red2, green2, blue2;
        if (code >= 232)
          red2 = ((code - 232) * 10 + 8) / 255, green2 = red2, blue2 = red2;
        else {
          code -= 16;
          let remainder = code % 36;
          red2 = Math.floor(code / 36) / 5, green2 = Math.floor(remainder / 6) / 5, blue2 = remainder % 6 / 5;
        }
        let value = Math.max(red2, green2, blue2) * 2;
        if (value === 0)
          return 30;
        let result = 30 + (Math.round(blue2) << 2 | Math.round(green2) << 1 | Math.round(red2));
        if (value === 2)
          result += 60;
        return result;
      },
      enumerable: !1
    },
    rgbToAnsi: {
      value: (red2, green2, blue2) => styles3.ansi256ToAnsi(styles3.rgbToAnsi256(red2, green2, blue2)),
      enumerable: !1
    },
    hexToAnsi: {
      value: (hex) => styles3.ansi256ToAnsi(styles3.hexToAnsi256(hex)),
      enumerable: !1
    }
  }), styles3;
}
var wrapAnsi162 = (offset = 0) => (code) => `\x1B[${code + offset}m`, wrapAnsi2562 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`, wrapAnsi16m2 = (offset = 0) => (red2, green2, blue2) => `\x1B[${38 + offset};2;${red2};${green2};${blue2}m`, styles3, modifierNames2, foregroundColorNames2, backgroundColorNames2, colorNames2, ansiStyles2, ansi_styles_default2;
var init_ansi_styles2 = __esm(() => {
  styles3 = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
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
      gray: [90, 39],
      grey: [90, 39],
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
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  }, modifierNames2 = Object.keys(styles3.modifier), foregroundColorNames2 = Object.keys(styles3.color), backgroundColorNames2 = Object.keys(styles3.bgColor), colorNames2 = [...foregroundColorNames2, ...backgroundColorNames2];
  ansiStyles2 = assembleStyles2(), ansi_styles_default2 = ansiStyles2;
});

// node_modules/@alcalzone/ansi-tokenize/build/ansiCodes.js
function getEndCode(code) {
  if (endCodesSet.has(code))
    return code;
  if (endCodesMap.has(code))
    return endCodesMap.get(code);
  if (code.startsWith(linkStartCodePrefix))
    return linkEndCode;
  if (code = code.slice(2), code.includes(";"))
    code = code[0] + "0";
  let ret = ansi_styles_default2.codes.get(parseInt(code, 10));
  if (ret)
    return ansi_styles_default2.color.ansi(ret);
  else
    return ansi_styles_default2.reset.open;
}
function ansiCodesToString(codes) {
  return codes.map((code) => code.code).join("");
}
var ESCAPES, endCodesSet, endCodesMap, linkStartCodePrefix = "\x1B]8;;", linkStartCodePrefixCharCodes, linkCodeSuffix = "\x07", linkCodeSuffixCharCode, linkEndCode;
var init_ansiCodes = __esm(() => {
  init_ansi_styles2();
  ESCAPES = /* @__PURE__ */ new Set([27, 155]), endCodesSet = /* @__PURE__ */ new Set, endCodesMap = /* @__PURE__ */ new Map;
  for (let [start, end] of ansi_styles_default2.codes)
    endCodesSet.add(ansi_styles_default2.color.ansi(end)), endCodesMap.set(ansi_styles_default2.color.ansi(start), ansi_styles_default2.color.ansi(end));
  linkStartCodePrefixCharCodes = linkStartCodePrefix.split("").map((char) => char.charCodeAt(0)), linkCodeSuffixCharCode = linkCodeSuffix.charCodeAt(0), linkEndCode = `\x1B]8;;${linkCodeSuffix}`;
});

// node_modules/@alcalzone/ansi-tokenize/build/reduce.js
function reduceAnsiCodes(codes) {
  return reduceAnsiCodesIncremental([], codes);
}
function reduceAnsiCodesIncremental(codes, newCodes) {
  let ret = [...codes];
  for (let code of newCodes)
    if (code.code === ansi_styles_default2.reset.open)
      ret = [];
    else if (endCodesSet.has(code.code))
      ret = ret.filter((retCode) => retCode.endCode !== code.code);
    else
      ret = ret.filter((retCode) => retCode.endCode !== code.endCode), ret.push(code);
  return ret;
}
var init_reduce = __esm(() => {
  init_ansi_styles2();
  init_ansiCodes();
});

// node_modules/@alcalzone/ansi-tokenize/build/undo.js
function undoAnsiCodes(codes) {
  return reduceAnsiCodes(codes).reverse().map((code) => ({
    ...code,
    code: code.endCode
  }));
}
var init_undo = __esm(() => {
  init_reduce();
});

// node_modules/@alcalzone/ansi-tokenize/build/diff.js
function diffAnsiCodes(from, to) {
  let endCodesInTo = new Set(to.map((code) => code.endCode)), startCodesInFrom = new Set(from.map((code) => code.code));
  return [
    ...undoAnsiCodes(from.filter((code) => !endCodesInTo.has(code.endCode))),
    ...to.filter((code) => !startCodesInFrom.has(code.code))
  ];
}
var init_diff = __esm(() => {
  init_undo();
});

// node_modules/@alcalzone/ansi-tokenize/build/styledChars.js
function styledCharsFromTokens(tokens) {
  let codes = [], ret = [];
  for (let token of tokens)
    if (token.type === "ansi")
      codes = reduceAnsiCodesIncremental(codes, [token]);
    else if (token.type === "char")
      ret.push({
        ...token,
        styles: [...codes]
      });
  return ret;
}
var init_styledChars = __esm(() => {
  init_ansiCodes();
  init_diff();
  init_reduce();
});

// node_modules/is-fullwidth-code-point/index.js
function isFullwidthCodePoint(codePoint) {
  if (!Number.isInteger(codePoint))
    return !1;
  return codePoint >= 4352 && (codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || 11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || 12880 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65131 || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 262141);
}

// node_modules/@alcalzone/ansi-tokenize/build/tokenize.js
function findNumberIndex(str) {
  for (let index = 0;index < str.length; index++) {
    let charCode = str.charCodeAt(index);
    if (charCode >= 48 && charCode <= 57)
      return index;
  }
  return -1;
}
function parseLinkCode(string4, offset) {
  string4 = string4.slice(offset);
  for (let index = 1;index < linkStartCodePrefixCharCodes.length; index++)
    if (string4.charCodeAt(index) !== linkStartCodePrefixCharCodes[index])
      return;
  let endIndex = string4.indexOf("\x07", linkStartCodePrefix.length);
  if (endIndex === -1)
    return;
  return string4.slice(0, endIndex + 1);
}
function parseAnsiCode(string4, offset) {
  string4 = string4.slice(offset, offset + 19);
  let startIndex = findNumberIndex(string4);
  if (startIndex !== -1) {
    let endIndex = string4.indexOf("m", startIndex);
    if (endIndex === -1)
      endIndex = string4.length;
    return string4.slice(0, endIndex + 1);
  }
}
function tokenize3(str, endChar = Number.POSITIVE_INFINITY) {
  let ret = [], index = 0, visible = 0;
  while (index < str.length) {
    let codePoint = str.codePointAt(index);
    if (ESCAPES.has(codePoint)) {
      let code = parseLinkCode(str, index) || parseAnsiCode(str, index);
      if (code) {
        ret.push({
          type: "ansi",
          code,
          endCode: getEndCode(code)
        }), index += code.length;
        continue;
      }
    }
    let fullWidth = isFullwidthCodePoint(codePoint), character = String.fromCodePoint(codePoint);
    if (ret.push({
      type: "char",
      value: character,
      fullWidth
    }), index += character.length, visible += fullWidth ? 2 : character.length, visible >= endChar)
      break;
  }
  return ret;
}
var init_tokenize2 = __esm(() => {
  init_ansiCodes();
});

// node_modules/@alcalzone/ansi-tokenize/build/index.js
var init_build = __esm(() => {
  init_ansiCodes();
  init_diff();
  init_reduce();
  init_undo();
  init_styledChars();
  init_tokenize2();
});
