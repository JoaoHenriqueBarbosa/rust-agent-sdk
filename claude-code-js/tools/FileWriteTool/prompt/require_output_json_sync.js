// var: require_output_json_sync
var require_output_json_sync = __commonJS((exports, module) => {
  var { stringify: stringify2 } = require_utils2(), { outputFileSync } = require_output_file();
  function outputJsonSync(file2, data, options) {
    let str = stringify2(data, options);
    outputFileSync(file2, str, options);
  }
  module.exports = outputJsonSync;
});
