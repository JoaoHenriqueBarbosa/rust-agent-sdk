// var: require_path_exists
var require_path_exists = __commonJS((exports, module) => {
  var u5 = require_universalify().fromPromise, fs14 = require_fs();
  function pathExists2(path16) {
    return fs14.access(path16).then(() => !0).catch(() => !1);
  }
  module.exports = {
    pathExists: u5(pathExists2),
    pathExistsSync: fs14.existsSync
  };
});
