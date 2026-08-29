// var: require_copy_sync
var require_copy_sync = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs(), path16 = __require("path"), mkdirsSync = require_mkdirs().mkdirsSync, utimesMillisSync = require_utimes().utimesMillisSync, stat13 = require_stat();
  function copySync(src, dest, opts) {
    if (typeof opts === "function")
      opts = { filter: opts };
    if (opts = opts || {}, opts.clobber = "clobber" in opts ? !!opts.clobber : !0, opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber, opts.preserveTimestamps && process.arch === "ia32")
      process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
    let { srcStat, destStat } = stat13.checkPathsSync(src, dest, "copy", opts);
    return stat13.checkParentPathsSync(src, srcStat, dest, "copy"), handleFilterAndCopy(destStat, src, dest, opts);
  }
  function handleFilterAndCopy(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest))
      return;
    let destParent = path16.dirname(dest);
    if (!fs14.existsSync(destParent))
      mkdirsSync(destParent);
    return getStats(destStat, src, dest, opts);
  }
  function startCopy(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest))
      return;
    return getStats(destStat, src, dest, opts);
  }
  function getStats(destStat, src, dest, opts) {
    let srcStat = (opts.dereference ? fs14.statSync : fs14.lstatSync)(src);
    if (srcStat.isDirectory())
      return onDir(srcStat, destStat, src, dest, opts);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
      return onFile(srcStat, destStat, src, dest, opts);
    else if (srcStat.isSymbolicLink())
      return onLink(destStat, src, dest, opts);
    else if (srcStat.isSocket())
      throw Error(`Cannot copy a socket file: ${src}`);
    else if (srcStat.isFIFO())
      throw Error(`Cannot copy a FIFO pipe: ${src}`);
    throw Error(`Unknown file: ${src}`);
  }
  function onFile(srcStat, destStat, src, dest, opts) {
    if (!destStat)
      return copyFile(srcStat, src, dest, opts);
    return mayCopyFile(srcStat, src, dest, opts);
  }
  function mayCopyFile(srcStat, src, dest, opts) {
    if (opts.overwrite)
      return fs14.unlinkSync(dest), copyFile(srcStat, src, dest, opts);
    else if (opts.errorOnExist)
      throw Error(`'${dest}' already exists`);
  }
  function copyFile(srcStat, src, dest, opts) {
    if (fs14.copyFileSync(src, dest), opts.preserveTimestamps)
      handleTimestamps(srcStat.mode, src, dest);
    return setDestMode(dest, srcStat.mode);
  }
  function handleTimestamps(srcMode, src, dest) {
    if (fileIsNotWritable(srcMode))
      makeFileWritable(dest, srcMode);
    return setDestTimestamps(src, dest);
  }
  function fileIsNotWritable(srcMode) {
    return (srcMode & 128) === 0;
  }
  function makeFileWritable(dest, srcMode) {
    return setDestMode(dest, srcMode | 128);
  }
  function setDestMode(dest, srcMode) {
    return fs14.chmodSync(dest, srcMode);
  }
  function setDestTimestamps(src, dest) {
    let updatedSrcStat = fs14.statSync(src);
    return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
  }
  function onDir(srcStat, destStat, src, dest, opts) {
    if (!destStat)
      return mkDirAndCopy(srcStat.mode, src, dest, opts);
    return copyDir(src, dest, opts);
  }
  function mkDirAndCopy(srcMode, src, dest, opts) {
    return fs14.mkdirSync(dest), copyDir(src, dest, opts), setDestMode(dest, srcMode);
  }
  function copyDir(src, dest, opts) {
    fs14.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
  }
  function copyDirItem(item, src, dest, opts) {
    let srcItem = path16.join(src, item), destItem = path16.join(dest, item), { destStat } = stat13.checkPathsSync(srcItem, destItem, "copy", opts);
    return startCopy(destStat, srcItem, destItem, opts);
  }
  function onLink(destStat, src, dest, opts) {
    let resolvedSrc = fs14.readlinkSync(src);
    if (opts.dereference)
      resolvedSrc = path16.resolve(process.cwd(), resolvedSrc);
    if (!destStat)
      return fs14.symlinkSync(resolvedSrc, dest);
    else {
      let resolvedDest;
      try {
        resolvedDest = fs14.readlinkSync(dest);
      } catch (err2) {
        if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
          return fs14.symlinkSync(resolvedSrc, dest);
        throw err2;
      }
      if (opts.dereference)
        resolvedDest = path16.resolve(process.cwd(), resolvedDest);
      if (stat13.isSrcSubdir(resolvedSrc, resolvedDest))
        throw Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
      if (fs14.statSync(dest).isDirectory() && stat13.isSrcSubdir(resolvedDest, resolvedSrc))
        throw Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
      return copyLink(resolvedSrc, dest);
    }
  }
  function copyLink(resolvedSrc, dest) {
    return fs14.unlinkSync(dest), fs14.symlinkSync(resolvedSrc, dest);
  }
  module.exports = copySync;
});
