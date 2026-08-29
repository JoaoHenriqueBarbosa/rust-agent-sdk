// var: require_move_sync
var require_move_sync = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs(), path16 = __require("path"), copySync = require_copy2().copySync, removeSync = require_remove().removeSync, mkdirpSync = require_mkdirs().mkdirpSync, stat13 = require_stat();
  function moveSync(src, dest, opts) {
    opts = opts || {};
    let overwrite = opts.overwrite || opts.clobber || !1, { srcStat, isChangingCase = !1 } = stat13.checkPathsSync(src, dest, "move", opts);
    if (stat13.checkParentPathsSync(src, srcStat, dest, "move"), !isParentRoot(dest))
      mkdirpSync(path16.dirname(dest));
    return doRename(src, dest, overwrite, isChangingCase);
  }
  function isParentRoot(dest) {
    let parent2 = path16.dirname(dest);
    return path16.parse(parent2).root === parent2;
  }
  function doRename(src, dest, overwrite, isChangingCase) {
    if (isChangingCase)
      return rename(src, dest, overwrite);
    if (overwrite)
      return removeSync(dest), rename(src, dest, overwrite);
    if (fs14.existsSync(dest))
      throw Error("dest already exists.");
    return rename(src, dest, overwrite);
  }
  function rename(src, dest, overwrite) {
    try {
      fs14.renameSync(src, dest);
    } catch (err2) {
      if (err2.code !== "EXDEV")
        throw err2;
      return moveAcrossDevice(src, dest, overwrite);
    }
  }
  function moveAcrossDevice(src, dest, overwrite) {
    return copySync(src, dest, {
      overwrite,
      errorOnExist: !0
    }), removeSync(src);
  }
  module.exports = moveSync;
});
