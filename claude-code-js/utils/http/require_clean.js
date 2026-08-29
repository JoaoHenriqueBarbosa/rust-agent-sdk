// var: require_clean
var require_clean = __commonJS((exports, module) => {
  var parse9 = require_parse3(), clean = (version4, options) => {
    let s2 = parse9(version4.trim().replace(/^[=v]+/, ""), options);
    return s2 ? s2.version : null;
  };
  module.exports = clean;
});
