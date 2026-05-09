// var: require_strip_ansi
var require_strip_ansi = __commonJS((exports, module) => {
  var ansiRegex2 = require_ansi_regex();
  module.exports = (string4) => typeof string4 === "string" ? string4.replace(ansiRegex2(), "") : string4;
});
