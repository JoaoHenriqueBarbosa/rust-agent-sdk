// var: require_readFile
var require_readFile = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.readFile = exports.fileIntercept = exports.filePromises = void 0;
  var promises_1 = __require("fs/promises");
  exports.filePromises = {};
  exports.fileIntercept = {};
  var readFile6 = (path9, options) => {
    if (exports.fileIntercept[path9] !== void 0)
      return exports.fileIntercept[path9];
    if (!exports.filePromises[path9] || options?.ignoreCache)
      exports.filePromises[path9] = (0, promises_1.readFile)(path9, "utf8");
    return exports.filePromises[path9];
  };
  exports.readFile = readFile6;
});
