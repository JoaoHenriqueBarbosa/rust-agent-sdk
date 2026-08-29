// var: require_symlink_type
var require_symlink_type = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs();
  function symlinkType(srcpath, type, callback) {
    if (callback = typeof type === "function" ? type : callback, type = typeof type === "function" ? !1 : type, type)
      return callback(null, type);
    fs14.lstat(srcpath, (err2, stats) => {
      if (err2)
        return callback(null, "file");
      type = stats && stats.isDirectory() ? "dir" : "file", callback(null, type);
    });
  }
  function symlinkTypeSync(srcpath, type) {
    let stats;
    if (type)
      return type;
    try {
      stats = fs14.lstatSync(srcpath);
    } catch {
      return "file";
    }
    return stats && stats.isDirectory() ? "dir" : "file";
  }
  module.exports = {
    symlinkType,
    symlinkTypeSync
  };
});
