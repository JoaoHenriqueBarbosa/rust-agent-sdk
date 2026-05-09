// var: require_path_key
var require_path_key = __commonJS((exports, module) => {
  var pathKey = (options = {}) => {
    let environment = options.env || process.env;
    if ((options.platform || process.platform) !== "win32")
      return "PATH";
    return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
  };
  module.exports = pathKey;
  module.exports.default = pathKey;
});
