// var: require_utils3
var require_utils3 = __commonJS((exports) => {
  var {
    REGEX_BACKSLASH,
    REGEX_REMOVE_BACKSLASH,
    REGEX_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_GLOBAL
  } = require_constants3();
  exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
  exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
  exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
  exports.isWindows = () => {
    if (typeof navigator < "u" && navigator.platform) {
      let platform3 = navigator.platform.toLowerCase();
      return platform3 === "win32" || platform3 === "windows";
    }
    if (typeof process < "u" && process.platform)
      return process.platform === "win32";
    return !1;
  };
  exports.removeBackslashes = (str) => {
    return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
      return match === "\\" ? "" : match;
    });
  };
  exports.escapeLast = (input, char, lastIdx) => {
    let idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1)
      return input;
    if (input[idx - 1] === "\\")
      return exports.escapeLast(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
  };
  exports.removePrefix = (input, state3 = {}) => {
    let output = input;
    if (output.startsWith("./"))
      output = output.slice(2), state3.prefix = "./";
    return output;
  };
  exports.wrapOutput = (input, state3 = {}, options2 = {}) => {
    let prepend = options2.contains ? "" : "^", append2 = options2.contains ? "" : "$", output = `${prepend}(?:${input})${append2}`;
    if (state3.negated === !0)
      output = `(?:^(?!${output}).*$)`;
    return output;
  };
  exports.basename = (path16, { windows: windows2 } = {}) => {
    let segs = path16.split(windows2 ? /[\\/]/ : "/"), last2 = segs[segs.length - 1];
    if (last2 === "")
      return segs[segs.length - 2];
    return last2;
  };
});
