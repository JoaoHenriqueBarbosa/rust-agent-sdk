// var: require_symlink_paths
var require_symlink_paths = __commonJS((exports, module) => {
  var path16 = __require("path"), fs14 = require_graceful_fs(), pathExists2 = require_path_exists().pathExists;
  function symlinkPaths(srcpath, dstpath, callback) {
    if (path16.isAbsolute(srcpath))
      return fs14.lstat(srcpath, (err2) => {
        if (err2)
          return err2.message = err2.message.replace("lstat", "ensureSymlink"), callback(err2);
        return callback(null, {
          toCwd: srcpath,
          toDst: srcpath
        });
      });
    else {
      let dstdir = path16.dirname(dstpath), relativeToDst = path16.join(dstdir, srcpath);
      return pathExists2(relativeToDst, (err2, exists) => {
        if (err2)
          return callback(err2);
        if (exists)
          return callback(null, {
            toCwd: relativeToDst,
            toDst: srcpath
          });
        else
          return fs14.lstat(srcpath, (err3) => {
            if (err3)
              return err3.message = err3.message.replace("lstat", "ensureSymlink"), callback(err3);
            return callback(null, {
              toCwd: srcpath,
              toDst: path16.relative(dstdir, srcpath)
            });
          });
      });
    }
  }
  function symlinkPathsSync(srcpath, dstpath) {
    let exists;
    if (path16.isAbsolute(srcpath)) {
      if (exists = fs14.existsSync(srcpath), !exists)
        throw Error("absolute srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: srcpath
      };
    } else {
      let dstdir = path16.dirname(dstpath), relativeToDst = path16.join(dstdir, srcpath);
      if (exists = fs14.existsSync(relativeToDst), exists)
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      else {
        if (exists = fs14.existsSync(srcpath), !exists)
          throw Error("relative srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: path16.relative(dstdir, srcpath)
        };
      }
    }
  }
  module.exports = {
    symlinkPaths,
    symlinkPathsSync
  };
});
