// var: require_symlink
var require_symlink = __commonJS((exports, module) => {
  var u5 = require_universalify().fromCallback, path16 = __require("path"), fs14 = require_fs(), _mkdirs = require_mkdirs(), mkdirs = _mkdirs.mkdirs, mkdirsSync = _mkdirs.mkdirsSync, _symlinkPaths = require_symlink_paths(), symlinkPaths = _symlinkPaths.symlinkPaths, symlinkPathsSync = _symlinkPaths.symlinkPathsSync, _symlinkType = require_symlink_type(), symlinkType = _symlinkType.symlinkType, symlinkTypeSync = _symlinkType.symlinkTypeSync, pathExists2 = require_path_exists().pathExists, { areIdentical } = require_stat();
  function createSymlink(srcpath, dstpath, type, callback) {
    callback = typeof type === "function" ? type : callback, type = typeof type === "function" ? !1 : type, fs14.lstat(dstpath, (err2, stats) => {
      if (!err2 && stats.isSymbolicLink())
        Promise.all([
          fs14.stat(srcpath),
          fs14.stat(dstpath)
        ]).then(([srcStat, dstStat]) => {
          if (areIdentical(srcStat, dstStat))
            return callback(null);
          _createSymlink(srcpath, dstpath, type, callback);
        });
      else
        _createSymlink(srcpath, dstpath, type, callback);
    });
  }
  function _createSymlink(srcpath, dstpath, type, callback) {
    symlinkPaths(srcpath, dstpath, (err2, relative6) => {
      if (err2)
        return callback(err2);
      srcpath = relative6.toDst, symlinkType(relative6.toCwd, type, (err3, type2) => {
        if (err3)
          return callback(err3);
        let dir = path16.dirname(dstpath);
        pathExists2(dir, (err4, dirExists) => {
          if (err4)
            return callback(err4);
          if (dirExists)
            return fs14.symlink(srcpath, dstpath, type2, callback);
          mkdirs(dir, (err5) => {
            if (err5)
              return callback(err5);
            fs14.symlink(srcpath, dstpath, type2, callback);
          });
        });
      });
    });
  }
  function createSymlinkSync(srcpath, dstpath, type) {
    let stats;
    try {
      stats = fs14.lstatSync(dstpath);
    } catch {}
    if (stats && stats.isSymbolicLink()) {
      let srcStat = fs14.statSync(srcpath), dstStat = fs14.statSync(dstpath);
      if (areIdentical(srcStat, dstStat))
        return;
    }
    let relative6 = symlinkPathsSync(srcpath, dstpath);
    srcpath = relative6.toDst, type = symlinkTypeSync(relative6.toCwd, type);
    let dir = path16.dirname(dstpath);
    if (fs14.existsSync(dir))
      return fs14.symlinkSync(srcpath, dstpath, type);
    return mkdirsSync(dir), fs14.symlinkSync(srcpath, dstpath, type);
  }
  module.exports = {
    createSymlink: u5(createSymlink),
    createSymlinkSync
  };
});
