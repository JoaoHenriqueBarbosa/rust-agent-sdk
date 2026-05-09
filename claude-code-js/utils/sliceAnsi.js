// Original: src/utils/sliceAnsi.ts
function isEndCode(code) {
  return code.code === code.endCode;
}
function filterStartCodes(codes) {
  return codes.filter((c3) => !isEndCode(c3));
}
function sliceAnsi(str, start, end) {
  let tokens = tokenize3(str), activeCodes = [], position = 0, result = "", include = !1;
  for (let token of tokens) {
    let width = token.type === "ansi" ? 0 : token.fullWidth ? 2 : stringWidth(token.value);
    if (end !== void 0 && position >= end) {
      if (token.type === "ansi" || width > 0 || !include)
        break;
    }
    if (token.type === "ansi") {
      if (activeCodes.push(token), include)
        result += token.code;
    } else {
      if (!include && position >= start) {
        if (start > 0 && width === 0)
          continue;
        include = !0, activeCodes = filterStartCodes(reduceAnsiCodes(activeCodes)), result = ansiCodesToString(activeCodes);
      }
      if (include)
        result += token.value;
      position += width;
    }
  }
  let activeStartCodes = filterStartCodes(reduceAnsiCodes(activeCodes));
  return result += ansiCodesToString(undoAnsiCodes(activeStartCodes)), result;
}
var init_sliceAnsi = __esm(() => {
  init_build();
  init_stringWidth();
});

// node_modules/string-width/index.js
function stringWidth2(string4, options = {}) {
  if (typeof string4 !== "string" || string4.length === 0)
    return 0;
  let {
    ambiguousIsNarrow = !0,
    countAnsiEscapeCodes = !1
  } = options;
  if (!countAnsiEscapeCodes)
    string4 = stripAnsi(string4);
  if (string4.length === 0)
    return 0;
  let width = 0, eastAsianWidthOptions = { ambiguousAsWide: !ambiguousIsNarrow };
  for (let { segment: character } of segmenter.segment(string4)) {
    let codePoint = character.codePointAt(0);
    if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159)
      continue;
    if (codePoint >= 8203 && codePoint <= 8207 || codePoint === 65279)
      continue;
    if (codePoint >= 768 && codePoint <= 879 || codePoint >= 6832 && codePoint <= 6911 || codePoint >= 7616 && codePoint <= 7679 || codePoint >= 8400 && codePoint <= 8447 || codePoint >= 65056 && codePoint <= 65071)
      continue;
    if (codePoint >= 55296 && codePoint <= 57343)
      continue;
    if (codePoint >= 65024 && codePoint <= 65039)
      continue;
    if (defaultIgnorableCodePointRegex.test(character))
      continue;
    if (emoji_regex_default().test(character)) {
      width += 2;
      continue;
    }
    width += eastAsianWidth(codePoint, eastAsianWidthOptions);
  }
  return width;
}
var segmenter, defaultIgnorableCodePointRegex;
var init_string_width = __esm(() => {
  init_strip_ansi();
  init_get_east_asian_width();
  segmenter = new Intl.Segmenter, defaultIgnorableCodePointRegex = /^\p{Default_Ignorable_Code_Point}$/u;
});

// node_modules/wrap-ansi/index.js
function wrapAnsi(string4, columns, options) {
  return String(string4).normalize().replaceAll(`\r
`, `
`).split(`
`).map((line) => exec3(line, columns, options)).join(`
`);
}
var ESCAPES2, END_CODE = 39, ANSI_ESCAPE_BELL = "\x07", ANSI_CSI = "[", ANSI_OSC = "]", ANSI_SGR_TERMINATOR = "m", ANSI_ESCAPE_LINK, wrapAnsiCode = (code) => `${ESCAPES2.values().next().value}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`, wrapAnsiHyperlink = (url3) => `${ESCAPES2.values().next().value}${ANSI_ESCAPE_LINK}${url3}${ANSI_ESCAPE_BELL}`, wordLengths = (string4) => string4.split(" ").map((character) => stringWidth2(character)), wrapWord = (rows, word, columns) => {
  let characters = [...word], isInsideEscape = !1, isInsideLinkEscape = !1, visible = stringWidth2(stripAnsi(rows.at(-1)));
  for (let [index, character] of characters.entries()) {
    let characterLength = stringWidth2(character);
    if (visible + characterLength <= columns)
      rows[rows.length - 1] += character;
    else
      rows.push(character), visible = 0;
    if (ESCAPES2.has(character))
      isInsideEscape = !0, isInsideLinkEscape = characters.slice(index + 1, index + 1 + ANSI_ESCAPE_LINK.length).join("") === ANSI_ESCAPE_LINK;
    if (isInsideEscape) {
      if (isInsideLinkEscape) {
        if (character === ANSI_ESCAPE_BELL)
          isInsideEscape = !1, isInsideLinkEscape = !1;
      } else if (character === ANSI_SGR_TERMINATOR)
        isInsideEscape = !1;
      continue;
    }
    if (visible += characterLength, visible === columns && index < characters.length - 1)
      rows.push(""), visible = 0;
  }
  if (!visible && rows.at(-1).length > 0 && rows.length > 1)
    rows[rows.length - 2] += rows.pop();
}, stringVisibleTrimSpacesRight = (string4) => {
  let words = string4.split(" "), last = words.length;
  while (last > 0) {
    if (stringWidth2(words[last - 1]) > 0)
      break;
    last--;
  }
  if (last === words.length)
    return string4;
  return words.slice(0, last).join(" ") + words.slice(last).join("");
}, exec3 = (string4, columns, options = {}) => {
  if (options.trim !== !1 && string4.trim() === "")
    return "";
  let returnValue = "", escapeCode, escapeUrl, lengths = wordLengths(string4), rows = [""];
  for (let [index, word] of string4.split(" ").entries()) {
    if (options.trim !== !1)
      rows[rows.length - 1] = rows.at(-1).trimStart();
    let rowLength = stringWidth2(rows.at(-1));
    if (index !== 0) {
      if (rowLength >= columns && (options.wordWrap === !1 || options.trim === !1))
        rows.push(""), rowLength = 0;
      if (rowLength > 0 || options.trim === !1)
        rows[rows.length - 1] += " ", rowLength++;
    }
    if (options.hard && lengths[index] > columns) {
      let remainingColumns = columns - rowLength, breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
      if (Math.floor((lengths[index] - 1) / columns) < breaksStartingThisLine)
        rows.push("");
      wrapWord(rows, word, columns);
      continue;
    }
    if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
      if (options.wordWrap === !1 && rowLength < columns) {
        wrapWord(rows, word, columns);
        continue;
      }
      rows.push("");
    }
    if (rowLength + lengths[index] > columns && options.wordWrap === !1) {
      wrapWord(rows, word, columns);
      continue;
    }
    rows[rows.length - 1] += word;
  }
  if (options.trim !== !1)
    rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
  let preString = rows.join(`
`), pre = [...preString], preStringIndex = 0;
  for (let [index, character] of pre.entries()) {
    if (returnValue += character, ESCAPES2.has(character)) {
      let { groups } = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`).exec(preString.slice(preStringIndex)) || { groups: {} };
      if (groups.code !== void 0) {
        let code2 = Number.parseFloat(groups.code);
        escapeCode = code2 === END_CODE ? void 0 : code2;
      } else if (groups.uri !== void 0)
        escapeUrl = groups.uri.length === 0 ? void 0 : groups.uri;
    }
    let code = ansi_styles_default2.codes.get(Number(escapeCode));
    if (pre[index + 1] === `
`) {
      if (escapeUrl)
        returnValue += wrapAnsiHyperlink("");
      if (escapeCode && code)
        returnValue += wrapAnsiCode(code);
    } else if (character === `
`) {
      if (escapeCode && code)
        returnValue += wrapAnsiCode(escapeCode);
      if (escapeUrl)
        returnValue += wrapAnsiHyperlink(escapeUrl);
    }
    preStringIndex += character.length;
  }
  return returnValue;
};
var init_wrap_ansi = __esm(() => {
  init_string_width();
  init_strip_ansi();
  init_ansi_styles2();
  ESCAPES2 = /* @__PURE__ */ new Set([
    "\x1B",
    "\x9B"
  ]), ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
});
