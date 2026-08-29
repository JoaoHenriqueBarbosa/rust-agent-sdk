// var: require_utils
var require_utils = __commonJS((exports, module) => {
  var path16 = __require("path");
  exports.checkPath = function(pth) {
    if (process.platform === "win32") {
      if (/[<>:"|?*]/.test(pth.replace(path16.parse(pth).root, ""))) {
        let error44 = Error(`Path contains invalid characters: ${pth}`);
        throw error44.code = "EINVAL", error44;
      }
    }
  };
});
