// Original: src/tools/BashTool/sedEditParser.ts
import { randomBytes as randomBytes10 } from "crypto";
function parseSedEditCommand(command12) {
  let trimmed = command12.trim(), sedMatch = trimmed.match(/^\s*sed\s+/);
  if (!sedMatch)
    return null;
  let withoutSed = trimmed.slice(sedMatch[0].length), parseResult = tryParseShellCommand(withoutSed);
  if (!parseResult.success)
    return null;
  let tokens = parseResult.tokens, args = [];
  for (let token of tokens)
    if (typeof token === "string")
      args.push(token);
    else if (typeof token === "object" && token !== null && "op" in token && token.op === "glob")
      return null;
  let hasInPlaceFlag = !1, extendedRegex = !1, expression = null, filePath = null, i5 = 0;
  while (i5 < args.length) {
    let arg = args[i5];
    if (arg === "-i" || arg === "--in-place") {
      if (hasInPlaceFlag = !0, i5++, i5 < args.length) {
        let nextArg = args[i5];
        if (typeof nextArg === "string" && !nextArg.startsWith("-") && (nextArg === "" || nextArg.startsWith(".")))
          i5++;
      }
      continue;
    }
    if (arg.startsWith("-i")) {
      hasInPlaceFlag = !0, i5++;
      continue;
    }
    if (arg === "-E" || arg === "-r" || arg === "--regexp-extended") {
      extendedRegex = !0, i5++;
      continue;
    }
    if (arg === "-e" || arg === "--expression") {
      if (i5 + 1 < args.length && typeof args[i5 + 1] === "string") {
        if (expression !== null)
          return null;
        expression = args[i5 + 1], i5 += 2;
        continue;
      }
      return null;
    }
    if (arg.startsWith("--expression=")) {
      if (expression !== null)
        return null;
      expression = arg.slice(13), i5++;
      continue;
    }
    if (arg.startsWith("-"))
      return null;
    if (expression === null)
      expression = arg;
    else if (filePath === null)
      filePath = arg;
    else
      return null;
    i5++;
  }
  if (!hasInPlaceFlag || !expression || !filePath)
    return null;
  if (!expression.match(/^s\//))
    return null;
  let rest = expression.slice(2), pattern = "", replacement = "", flags = "", state3 = "pattern", j4 = 0;
  while (j4 < rest.length) {
    let char = rest[j4];
    if (char === "\\" && j4 + 1 < rest.length) {
      if (state3 === "pattern")
        pattern += char + rest[j4 + 1];
      else if (state3 === "replacement")
        replacement += char + rest[j4 + 1];
      else
        flags += char + rest[j4 + 1];
      j4 += 2;
      continue;
    }
    if (char === "/") {
      if (state3 === "pattern")
        state3 = "replacement";
      else if (state3 === "replacement")
        state3 = "flags";
      else
        return null;
      j4++;
      continue;
    }
    if (state3 === "pattern")
      pattern += char;
    else if (state3 === "replacement")
      replacement += char;
    else
      flags += char;
    j4++;
  }
  if (state3 !== "flags")
    return null;
  if (!/^[gpimIM1-9]*$/.test(flags))
    return null;
  return {
    filePath,
    pattern,
    replacement,
    flags,
    extendedRegex
  };
}
function applySedSubstitution(content, sedInfo) {
  let regexFlags = "";
  if (sedInfo.flags.includes("g"))
    regexFlags += "g";
  if (sedInfo.flags.includes("i") || sedInfo.flags.includes("I"))
    regexFlags += "i";
  if (sedInfo.flags.includes("m") || sedInfo.flags.includes("M"))
    regexFlags += "m";
  let jsPattern = sedInfo.pattern.replace(/\\\//g, "/");
  if (!sedInfo.extendedRegex)
    jsPattern = jsPattern.replace(/\\\\/g, BACKSLASH_PLACEHOLDER).replace(/\\\+/g, PLUS_PLACEHOLDER).replace(/\\\?/g, QUESTION_PLACEHOLDER).replace(/\\\|/g, PIPE_PLACEHOLDER).replace(/\\\(/g, LPAREN_PLACEHOLDER).replace(/\\\)/g, RPAREN_PLACEHOLDER).replace(/\+/g, "\\+").replace(/\?/g, "\\?").replace(/\|/g, "\\|").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(BACKSLASH_PLACEHOLDER_RE, "\\\\").replace(PLUS_PLACEHOLDER_RE, "+").replace(QUESTION_PLACEHOLDER_RE, "?").replace(PIPE_PLACEHOLDER_RE, "|").replace(LPAREN_PLACEHOLDER_RE, "(").replace(RPAREN_PLACEHOLDER_RE, ")");
  let ESCAPED_AMP_PLACEHOLDER = `___ESCAPED_AMPERSAND_${randomBytes10(8).toString("hex")}___`, jsReplacement = sedInfo.replacement.replace(/\\\//g, "/").replace(/\\&/g, ESCAPED_AMP_PLACEHOLDER).replace(/&/g, "$$&").replace(new RegExp(ESCAPED_AMP_PLACEHOLDER, "g"), "&");
  try {
    let regex2 = new RegExp(jsPattern, regexFlags);
    return content.replace(regex2, jsReplacement);
  } catch {
    return content;
  }
}
var BACKSLASH_PLACEHOLDER = "\x00BACKSLASH\x00", PLUS_PLACEHOLDER = "\x00PLUS\x00", QUESTION_PLACEHOLDER = "\x00QUESTION\x00", PIPE_PLACEHOLDER = "\x00PIPE\x00", LPAREN_PLACEHOLDER = "\x00LPAREN\x00", RPAREN_PLACEHOLDER = "\x00RPAREN\x00", BACKSLASH_PLACEHOLDER_RE, PLUS_PLACEHOLDER_RE, QUESTION_PLACEHOLDER_RE, PIPE_PLACEHOLDER_RE, LPAREN_PLACEHOLDER_RE, RPAREN_PLACEHOLDER_RE;
var init_sedEditParser = __esm(() => {
  init_shellQuote();
  BACKSLASH_PLACEHOLDER_RE = new RegExp(BACKSLASH_PLACEHOLDER, "g"), PLUS_PLACEHOLDER_RE = new RegExp(PLUS_PLACEHOLDER, "g"), QUESTION_PLACEHOLDER_RE = new RegExp(QUESTION_PLACEHOLDER, "g"), PIPE_PLACEHOLDER_RE = new RegExp(PIPE_PLACEHOLDER, "g"), LPAREN_PLACEHOLDER_RE = new RegExp(LPAREN_PLACEHOLDER, "g"), RPAREN_PLACEHOLDER_RE = new RegExp(RPAREN_PLACEHOLDER, "g");
});
