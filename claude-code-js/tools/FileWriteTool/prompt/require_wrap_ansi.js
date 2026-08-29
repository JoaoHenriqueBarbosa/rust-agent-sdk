// var: require_wrap_ansi
var require_wrap_ansi = __commonJS((exports, module) => {
  var stringWidth3 = require_string_width(), stripAnsi2 = require_strip_ansi(), ansiStyles3 = require_ansi_styles(), ESCAPES3 = /* @__PURE__ */ new Set([
    "\x1B",
    "\x9B"
  ]), wrapAnsi3 = (code) => `${ESCAPES3.values().next().value}[${code}m`, wordLengths2 = (string4) => string4.split(" ").map((character) => stringWidth3(character)), wrapWord2 = (rows, word, columns) => {
    let characters = [...word], isInsideEscape = !1, visible = stringWidth3(stripAnsi2(rows[rows.length - 1]));
    for (let [index, character] of characters.entries()) {
      let characterLength = stringWidth3(character);
      if (visible + characterLength <= columns)
        rows[rows.length - 1] += character;
      else
        rows.push(character), visible = 0;
      if (ESCAPES3.has(character))
        isInsideEscape = !0;
      else if (isInsideEscape && character === "m") {
        isInsideEscape = !1;
        continue;
      }
      if (isInsideEscape)
        continue;
      if (visible += characterLength, visible === columns && index < characters.length - 1)
        rows.push(""), visible = 0;
    }
    if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1)
      rows[rows.length - 2] += rows.pop();
  }, stringVisibleTrimSpacesRight2 = (str) => {
    let words = str.split(" "), last2 = words.length;
    while (last2 > 0) {
      if (stringWidth3(words[last2 - 1]) > 0)
        break;
      last2--;
    }
    if (last2 === words.length)
      return str;
    return words.slice(0, last2).join(" ") + words.slice(last2).join("");
  }, exec4 = (string4, columns, options = {}) => {
    if (options.trim !== !1 && string4.trim() === "")
      return "";
    let pre = "", ret = "", escapeCode, lengths = wordLengths2(string4), rows = [""];
    for (let [index, word] of string4.split(" ").entries()) {
      if (options.trim !== !1)
        rows[rows.length - 1] = rows[rows.length - 1].trimLeft();
      let rowLength = stringWidth3(rows[rows.length - 1]);
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
        wrapWord2(rows, word, columns);
        continue;
      }
      if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
        if (options.wordWrap === !1 && rowLength < columns) {
          wrapWord2(rows, word, columns);
          continue;
        }
        rows.push("");
      }
      if (rowLength + lengths[index] > columns && options.wordWrap === !1) {
        wrapWord2(rows, word, columns);
        continue;
      }
      rows[rows.length - 1] += word;
    }
    if (options.trim !== !1)
      rows = rows.map(stringVisibleTrimSpacesRight2);
    pre = rows.join(`
`);
    for (let [index, character] of [...pre].entries()) {
      if (ret += character, ESCAPES3.has(character)) {
        let code2 = parseFloat(/\d[^m]*/.exec(pre.slice(index, index + 4)));
        escapeCode = code2 === 39 ? null : code2;
      }
      let code = ansiStyles3.codes.get(Number(escapeCode));
      if (escapeCode && code) {
        if (pre[index + 1] === `
`)
          ret += wrapAnsi3(code);
        else if (character === `
`)
          ret += wrapAnsi3(escapeCode);
      }
    }
    return ret;
  };
  module.exports = (string4, columns, options) => {
    return String(string4).normalize().replace(/\r\n/g, `
`).split(`
`).map((line) => exec4(line, columns, options)).join(`
`);
  };
});
