// var: require_move
var require_move = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs(), path16 = __require("path"), copy = require_copy2().copy, remove = require_remove().remove, mkdirp = require_mkdirs().mkdirp, pathExists2 = require_path_exists().pathExists, stat13 = require_stat();
  function move(src, dest, opts, cb) {
    if (typeof opts === "function")
      cb = opts, opts = {};
    opts = opts || {};
    let overwrite = opts.overwrite || opts.clobber || !1;
    stat13.checkPaths(src, dest, "move", opts, (err2, stats) => {
      if (err2)
        return cb(err2);
      let { srcStat, isChangingCase = !1 } = stats;
      stat13.checkParentPaths(src, srcStat, dest, "move", (err3) => {
        if (err3)
          return cb(err3);
        if (isParentRoot(dest))
          return doRename(src, dest, overwrite, isChangingCase, cb);
        mkdirp(path16.dirname(dest), (err4) => {
          if (err4)
            return cb(err4);
          return doRename(src, dest, overwrite, isChangingCase, cb);
        });
      });
    });
  }
  function isParentRoot(dest) {
    let parent2 = path16.dirname(dest);
    return path16.parse(parent2).root === parent2;
  }
  function doRename(src, dest, overwrite, isChangingCase, cb) {
    if (isChangingCase)
      return rename(src, dest, overwrite, cb);
    if (overwrite)
      return remove(dest, (err2) => {
        if (err2)
          return cb(err2);
        return rename(src, dest, overwrite, cb);
      });
    pathExists2(dest, (err2, destExists) => {
      if (err2)
        return cb(err2);
      if (destExists)
        return cb(Error("dest already exists."));
      return rename(src, dest, overwrite, cb);
    });
  }
  function rename(src, dest, overwrite, cb) {
    fs14.rename(src, dest, (err2) => {
      if (!err2)
        return cb();
      if (err2.code !== "EXDEV")
        return cb(err2);
      return moveAcrossDevice(src, dest, overwrite, cb);
    });
  }
  function moveAcrossDevice(src, dest, overwrite, cb) {
    copy(src, dest, {
      overwrite,
      errorOnExist: !0
    }, (err2) => {
      if (err2)
        return cb(err2);
      return remove(src, cb);
    });
  }
  module.exports = move;
});
