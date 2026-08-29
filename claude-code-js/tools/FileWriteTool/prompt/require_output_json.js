// var: require_output_json
var require_output_json = __commonJS((exports, module) => {
  var { stringify: stringify2 } = require_utils2(), { outputFile } = require_output_file();
  async function outputJson(file2, data, options = {}) {
    let str = stringify2(data, options);
    await outputFile(file2, str, options);
  }
  module.exports = outputJson;
});
