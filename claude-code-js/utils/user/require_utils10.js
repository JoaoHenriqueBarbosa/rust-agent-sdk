// var: require_utils10
var require_utils10 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.normalizeType = exports.normalizeArch = void 0;
  var normalizeArch2 = (nodeArchString) => {
    switch (nodeArchString) {
      case "arm":
        return "arm32";
      case "ppc":
        return "ppc32";
      case "x64":
        return "amd64";
      default:
        return nodeArchString;
    }
  };
  exports.normalizeArch = normalizeArch2;
  var normalizeType = (nodePlatform) => {
    switch (nodePlatform) {
      case "sunos":
        return "solaris";
      case "win32":
        return "windows";
      default:
        return nodePlatform;
    }
  };
  exports.normalizeType = normalizeType;
});
