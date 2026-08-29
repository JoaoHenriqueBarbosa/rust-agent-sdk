// var: require_make_dir
var require_make_dir = __commonJS((exports, module) => {
  var fs14 = require_fs(), { checkPath } = require_utils(), getMode = (options) => {
    let defaults2 = { mode: 511 };
    if (typeof options === "number")
      return options;
    return { ...defaults2, ...options }.mode;
  };
  exports.makeDir = async (dir, options) => {
    return checkPath(dir), fs14.mkdir(dir, {
      mode: getMode(options),
      recursive: !0
    });
  };
  exports.makeDirSync = (dir, options) => {
    return checkPath(dir), fs14.mkdirSync(dir, {
      mode: getMode(options),
      recursive: !0
    });
  };
});
