// var: require_shebang_command
var require_shebang_command = __commonJS((exports, module) => {
  var shebangRegex = require_shebang_regex();
  module.exports = (string4 = "") => {
    let match = string4.match(shebangRegex);
    if (!match)
      return null;
    let [path2, argument] = match[0].replace(/#! ?/, "").split(" "), binary = path2.split("/").pop();
    if (binary === "env")
      return argument;
    return argument ? `${binary} ${argument}` : binary;
  };
});
