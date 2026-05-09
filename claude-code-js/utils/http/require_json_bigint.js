// var: require_json_bigint
var require_json_bigint = __commonJS((exports, module) => {
  var json_stringify = require_stringify3().stringify, json_parse = require_parse5();
  module.exports = function(options) {
    return {
      parse: json_parse(options),
      stringify: json_stringify
    };
  };
  module.exports.parse = json_parse();
  module.exports.stringify = json_stringify;
});
