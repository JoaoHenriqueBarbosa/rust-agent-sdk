// var: require_stat
var require_stat = __commonJS((exports, module) => {
  var fs14 = require_fs(), path16 = __require("path"), util12 = __require("util");
  function getStats(src, dest, opts) {
    let statFunc = opts.dereference ? (file2) => fs14.stat(file2, { bigint: !0 }) : (file2) => fs14.lstat(file2, { bigint: !0 });
    return Promise.all([
      statFunc(src),
      statFunc(dest).catch((err2) => {
        if (err2.code === "ENOENT")
          return null;
        throw err2;
      })
    ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
  }
  function getStatsSync(src, dest, opts) {
    let destStat, statFunc = opts.dereference ? (file2) => fs14.statSync(file2, { bigint: !0 }) : (file2) => fs14.lstatSync(file2, { bigint: !0 }), srcStat = statFunc(src);
    try {
      destStat = statFunc(dest);
    } catch (err2) {
      if (err2.code === "ENOENT")
        return { srcStat, destStat: null };
      throw err2;
    }
    return { srcStat, destStat };
  }
  function checkPaths(src, dest, funcName, opts, cb) {
    util12.callbackify(getStats)(src, dest, opts, (err2, stats) => {
      if (err2)
        return cb(err2);
      let { srcStat, destStat } = stats;
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          let srcBaseName = path16.basename(src), destBaseName = path16.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase())
            return cb(null, { srcStat, destStat, isChangingCase: !0 });
          return cb(Error("Source and destination must not be the same."));
        }
        if (srcStat.isDirectory() && !destStat.isDirectory())
          return cb(Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
        if (!srcStat.isDirectory() && destStat.isDirectory())
          return cb(Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest))
        return cb(Error(errMsg(src, dest, funcName)));
      return cb(null, { srcStat, destStat });
    });
  }
  function checkPathsSync(src, dest, funcName, opts) {
    let { srcStat, destStat } = getStatsSync(src, dest, opts);
    if (destStat) {
      if (areIdentical(srcStat, destStat)) {
        let srcBaseName = path16.basename(src), destBaseName = path16.basename(dest);
        if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase())
          return { srcStat, destStat, isChangingCase: !0 };
        throw Error("Source and destination must not be the same.");
      }
      if (srcStat.isDirectory() && !destStat.isDirectory())
        throw Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
      if (!srcStat.isDirectory() && destStat.isDirectory())
        throw Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
    }
    if (srcStat.isDirectory() && isSrcSubdir(src, dest))
      throw Error(errMsg(src, dest, funcName));
    return { srcStat, destStat };
  }
  function checkParentPaths(src, srcStat, dest, funcName, cb) {
    let srcParent = path16.resolve(path16.dirname(src)), destParent = path16.resolve(path16.dirname(dest));
    if (destParent === srcParent || destParent === path16.parse(destParent).root)
      return cb();
    fs14.stat(destParent, { bigint: !0 }, (err2, destStat) => {
      if (err2) {
        if (err2.code === "ENOENT")
          return cb();
        return cb(err2);
      }
      if (areIdentical(srcStat, destStat))
        return cb(Error(errMsg(src, dest, funcName)));
      return checkParentPaths(src, srcStat, destParent, funcName, cb);
    });
  }
  function checkParentPathsSync(src, srcStat, dest, funcName) {
    let srcParent = path16.resolve(path16.dirname(src)), destParent = path16.resolve(path16.dirname(dest));
    if (destParent === srcParent || destParent === path16.parse(destParent).root)
      return;
    let destStat;
    try {
      destStat = fs14.statSync(destParent, { bigint: !0 });
    } catch (err2) {
      if (err2.code === "ENOENT")
        return;
      throw err2;
    }
    if (areIdentical(srcStat, destStat))
      throw Error(errMsg(src, dest, funcName));
    return checkParentPathsSync(src, srcStat, destParent, funcName);
  }
  function areIdentical(srcStat, destStat) {
    return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
  }
  function isSrcSubdir(src, dest) {
    let srcArr = path16.resolve(src).split(path16.sep).filter((i5) => i5), destArr = path16.resolve(dest).split(path16.sep).filter((i5) => i5);
    return srcArr.reduce((acc, cur, i5) => acc && destArr[i5] === cur, !0);
  }
  function errMsg(src, dest, funcName) {
    return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
  }
  module.exports = {
    checkPaths,
    checkPathsSync,
    checkParentPaths,
    checkParentPathsSync,
    isSrcSubdir,
    areIdentical
  };
});
