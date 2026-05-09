// var: require_valid
var require_valid = __commonJS((exports, module) => {
  var parse9 = require_parse3(), valid = (version4, options) => {
    let v2 = parse9(version4, options);
    return v2 ? v2.version : null;
  };
  module.exports = valid;
});
