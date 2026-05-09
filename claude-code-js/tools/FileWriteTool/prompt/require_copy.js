// var: require_copy
var require_copy = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs(), path16 = __require("path"), mkdirs = require_mkdirs().mkdirs, pathExists2 = require_path_exists().pathExists, utimesMillis = require_utimes().utimesMillis, stat13 = require_stat();
  function copy(src, dest, opts, cb) {
    if (typeof opts === "function" && !cb)
      cb = opts, opts = {};
    else if (typeof opts === "function")
      opts = { filter: opts };
    if (cb = cb || function() {}, opts = opts || {}, opts.clobber = "clobber" in opts ? !!opts.clobber : !0, opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber, opts.preserveTimestamps && process.arch === "ia32")
      process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
    stat13.checkPaths(src, dest, "copy", opts, (err2, stats) => {
      if (err2)
        return cb(err2);
      let { srcStat, destStat } = stats;
      stat13.checkParentPaths(src, srcStat, dest, "copy", (err3) => {
        if (err3)
          return cb(err3);
        if (opts.filter)
          return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
        return checkParentDir(destStat, src, dest, opts, cb);
      });
    });
  }
  function checkParentDir(destStat, src, dest, opts, cb) {
    let destParent = path16.dirname(dest);
    pathExists2(destParent, (err2, dirExists) => {
      if (err2)
        return cb(err2);
      if (dirExists)
        return getStats(destStat, src, dest, opts, cb);
      mkdirs(destParent, (err3) => {
        if (err3)
          return cb(err3);
        return getStats(destStat, src, dest, opts, cb);
      });
    });
  }
  function handleFilter(onInclude, destStat, src, dest, opts, cb) {
    Promise.resolve(opts.filter(src, dest)).then((include) => {
      if (include)
        return onInclude(destStat, src, dest, opts, cb);
      return cb();
    }, (error44) => cb(error44));
  }
  function startCopy(destStat, src, dest, opts, cb) {
    if (opts.filter)
      return handleFilter(getStats, destStat, src, dest, opts, cb);
    return getStats(destStat, src, dest, opts, cb);
  }
  function getStats(destStat, src, dest, opts, cb) {
    (opts.dereference ? fs14.stat : fs14.lstat)(src, (err2, srcStat) => {
      if (err2)
        return cb(err2);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts, cb);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts, cb);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts, cb);
      else if (srcStat.isSocket())
        return cb(Error(`Cannot copy a socket file: ${src}`));
      else if (srcStat.isFIFO())
        return cb(Error(`Cannot copy a FIFO pipe: ${src}`));
      return cb(Error(`Unknown file: ${src}`));
    });
  }
  function onFile(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat)
      return copyFile(srcStat, src, dest, opts, cb);
    return mayCopyFile(srcStat, src, dest, opts, cb);
  }
  function mayCopyFile(srcStat, src, dest, opts, cb) {
    if (opts.overwrite)
      fs14.unlink(dest, (err2) => {
        if (err2)
          return cb(err2);
        return copyFile(srcStat, src, dest, opts, cb);
      });
    else if (opts.errorOnExist)
      return cb(Error(`'${dest}' already exists`));
    else
      return cb();
  }
  function copyFile(srcStat, src, dest, opts, cb) {
    fs14.copyFile(src, dest, (err2) => {
      if (err2)
        return cb(err2);
      if (opts.preserveTimestamps)
        return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
      return setDestMode(dest, srcStat.mode, cb);
    });
  }
  function handleTimestampsAndMode(srcMode, src, dest, cb) {
    if (fileIsNotWritable(srcMode))
      return makeFileWritable(dest, srcMode, (err2) => {
        if (err2)
          return cb(err2);
        return setDestTimestampsAndMode(srcMode, src, dest, cb);
      });
    return setDestTimestampsAndMode(srcMode, src, dest, cb);
  }
  function fileIsNotWritable(srcMode) {
    return (srcMode & 128) === 0;
  }
  function makeFileWritable(dest, srcMode, cb) {
    return setDestMode(dest, srcMode | 128, cb);
  }
  function setDestTimestampsAndMode(srcMode, src, dest, cb) {
    setDestTimestamps(src, dest, (err2) => {
      if (err2)
        return cb(err2);
      return setDestMode(dest, srcMode, cb);
    });
  }
  function setDestMode(dest, srcMode, cb) {
    return fs14.chmod(dest, srcMode, cb);
  }
  function setDestTimestamps(src, dest, cb) {
    fs14.stat(src, (err2, updatedSrcStat) => {
      if (err2)
        return cb(err2);
      return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
    });
  }
  function onDir(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat)
      return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
    return copyDir(src, dest, opts, cb);
  }
  function mkDirAndCopy(srcMode, src, dest, opts, cb) {
    fs14.mkdir(dest, (err2) => {
      if (err2)
        return cb(err2);
      copyDir(src, dest, opts, (err3) => {
        if (err3)
          return cb(err3);
        return setDestMode(dest, srcMode, cb);
      });
    });
  }
  function copyDir(src, dest, opts, cb) {
    fs14.readdir(src, (err2, items) => {
      if (err2)
        return cb(err2);
      return copyDirItems(items, src, dest, opts, cb);
    });
  }
  function copyDirItems(items, src, dest, opts, cb) {
    let item = items.pop();
    if (!item)
      return cb();
    return copyDirItem(items, item, src, dest, opts, cb);
  }
  function copyDirItem(items, item, src, dest, opts, cb) {
    let srcItem = path16.join(src, item), destItem = path16.join(dest, item);
    stat13.checkPaths(srcItem, destItem, "copy", opts, (err2, stats) => {
      if (err2)
        return cb(err2);
      let { destStat } = stats;
      startCopy(destStat, srcItem, destItem, opts, (err3) => {
        if (err3)
          return cb(err3);
        return copyDirItems(items, src, dest, opts, cb);
      });
    });
  }
  function onLink(destStat, src, dest, opts, cb) {
    fs14.readlink(src, (err2, resolvedSrc) => {
      if (err2)
        return cb(err2);
      if (opts.dereference)
        resolvedSrc = path16.resolve(process.cwd(), resolvedSrc);
      if (!destStat)
        return fs14.symlink(resolvedSrc, dest, cb);
      else
        fs14.readlink(dest, (err3, resolvedDest) => {
          if (err3) {
            if (err3.code === "EINVAL" || err3.code === "UNKNOWN")
              return fs14.symlink(resolvedSrc, dest, cb);
            return cb(err3);
          }
          if (opts.dereference)
            resolvedDest = path16.resolve(process.cwd(), resolvedDest);
          if (stat13.isSrcSubdir(resolvedSrc, resolvedDest))
            return cb(Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
          if (destStat.isDirectory() && stat13.isSrcSubdir(resolvedDest, resolvedSrc))
            return cb(Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
          return copyLink(resolvedSrc, dest, cb);
        });
    });
  }
  function copyLink(resolvedSrc, dest, cb) {
    fs14.unlink(dest, (err2) => {
      if (err2)
        return cb(err2);
      return fs14.symlink(resolvedSrc, dest, cb);
    });
  }
  module.exports = copy;
});
