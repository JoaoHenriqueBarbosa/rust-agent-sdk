// var: require_string_width
var require_string_width = __commonJS((exports, module) => {
  var stripAnsi2 = require_strip_ansi(), isFullwidthCodePoint2 = require_is_fullwidth_code_point(), emojiRegex2 = require_emoji_regex(), stringWidth3 = (string4) => {
    if (typeof string4 !== "string" || string4.length === 0)
      return 0;
    if (string4 = stripAnsi2(string4), string4.length === 0)
      return 0;
    string4 = string4.replace(emojiRegex2(), "  ");
    let width = 0;
    for (let i4 = 0;i4 < string4.length; i4++) {
      let code = string4.codePointAt(i4);
      if (code <= 31 || code >= 127 && code <= 159)
        continue;
      if (code >= 768 && code <= 879)
        continue;
      if (code > 65535)
        i4++;
      width += isFullwidthCodePoint2(code) ? 2 : 1;
    }
    return width;
  };
  module.exports = stringWidth3;
  module.exports.default = stringWidth3;
});
