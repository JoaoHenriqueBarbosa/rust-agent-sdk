// var: require_polyfills
var require_polyfills = __commonJS((exports, module) => {
  var constants7 = __require("constants"), origCwd = process.cwd, cwd2 = null, platform2 = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    if (!cwd2)
      cwd2 = origCwd.call(process);
    return cwd2;
  };
  try {
    process.cwd();
  } catch (er) {}
  if (typeof process.chdir === "function") {
    if (chdir = process.chdir, process.chdir = function(d) {
      cwd2 = null, chdir.call(process, d);
    }, Object.setPrototypeOf)
      Object.setPrototypeOf(process.chdir, chdir);
  }
  var chdir;
  module.exports = patch;
  function patch(fs4) {
    if (constants7.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./))
      patchLchmod(fs4);
    if (!fs4.lutimes)
      patchLutimes(fs4);
    if (fs4.chown = chownFix(fs4.chown), fs4.fchown = chownFix(fs4.fchown), fs4.lchown = chownFix(fs4.lchown), fs4.chmod = chmodFix(fs4.chmod), fs4.fchmod = chmodFix(fs4.fchmod), fs4.lchmod = chmodFix(fs4.lchmod), fs4.chownSync = chownFixSync(fs4.chownSync), fs4.fchownSync = chownFixSync(fs4.fchownSync), fs4.lchownSync = chownFixSync(fs4.lchownSync), fs4.chmodSync = chmodFixSync(fs4.chmodSync), fs4.fchmodSync = chmodFixSync(fs4.fchmodSync), fs4.lchmodSync = chmodFixSync(fs4.lchmodSync), fs4.stat = statFix(fs4.stat), fs4.fstat = statFix(fs4.fstat), fs4.lstat = statFix(fs4.lstat), fs4.statSync = statFixSync(fs4.statSync), fs4.fstatSync = statFixSync(fs4.fstatSync), fs4.lstatSync = statFixSync(fs4.lstatSync), fs4.chmod && !fs4.lchmod)
      fs4.lchmod = function(path9, mode, cb) {
        if (cb)
          process.nextTick(cb);
      }, fs4.lchmodSync = function() {};
    if (fs4.chown && !fs4.lchown)
      fs4.lchown = function(path9, uid, gid, cb) {
        if (cb)
          process.nextTick(cb);
      }, fs4.lchownSync = function() {};
    if (platform2 === "win32")
      fs4.rename = typeof fs4.rename !== "function" ? fs4.rename : function(fs$rename) {
        function rename(from, to, cb) {
          var start = Date.now(), backoff = 0;
          fs$rename(from, to, function CB(er) {
            if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 60000) {
              if (setTimeout(function() {
                fs4.stat(to, function(stater, st) {
                  if (stater && stater.code === "ENOENT")
                    fs$rename(from, to, CB);
                  else
                    cb(er);
                });
              }, backoff), backoff < 100)
                backoff += 10;
              return;
            }
            if (cb)
              cb(er);
          });
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(rename, fs$rename);
        return rename;
      }(fs4.rename);
    fs4.read = typeof fs4.read !== "function" ? fs4.read : function(fs$read) {
      function read(fd, buffer, offset, length, position, callback_) {
        var callback;
        if (callback_ && typeof callback_ === "function") {
          var eagCounter = 0;
          callback = function(er, _, __) {
            if (er && er.code === "EAGAIN" && eagCounter < 10)
              return eagCounter++, fs$read.call(fs4, fd, buffer, offset, length, position, callback);
            callback_.apply(this, arguments);
          };
        }
        return fs$read.call(fs4, fd, buffer, offset, length, position, callback);
      }
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(read, fs$read);
      return read;
    }(fs4.read), fs4.readSync = typeof fs4.readSync !== "function" ? fs4.readSync : function(fs$readSync) {
      return function(fd, buffer, offset, length, position) {
        var eagCounter = 0;
        while (!0)
          try {
            return fs$readSync.call(fs4, fd, buffer, offset, length, position);
          } catch (er) {
            if (er.code === "EAGAIN" && eagCounter < 10) {
              eagCounter++;
              continue;
            }
            throw er;
          }
      };
    }(fs4.readSync);
    function patchLchmod(fs5) {
      fs5.lchmod = function(path9, mode, callback) {
        fs5.open(path9, constants7.O_WRONLY | constants7.O_SYMLINK, mode, function(err, fd) {
          if (err) {
            if (callback)
              callback(err);
            return;
          }
          fs5.fchmod(fd, mode, function(err2) {
            fs5.close(fd, function(err22) {
              if (callback)
                callback(err2 || err22);
            });
          });
        });
      }, fs5.lchmodSync = function(path9, mode) {
        var fd = fs5.openSync(path9, constants7.O_WRONLY | constants7.O_SYMLINK, mode), threw = !0, ret;
        try {
          ret = fs5.fchmodSync(fd, mode), threw = !1;
        } finally {
          if (threw)
            try {
              fs5.closeSync(fd);
            } catch (er) {}
          else
            fs5.closeSync(fd);
        }
        return ret;
      };
    }
    function patchLutimes(fs5) {
      if (constants7.hasOwnProperty("O_SYMLINK") && fs5.futimes)
        fs5.lutimes = function(path9, at, mt, cb) {
          fs5.open(path9, constants7.O_SYMLINK, function(er, fd) {
            if (er) {
              if (cb)
                cb(er);
              return;
            }
            fs5.futimes(fd, at, mt, function(er2) {
              fs5.close(fd, function(er22) {
                if (cb)
                  cb(er2 || er22);
              });
            });
          });
        }, fs5.lutimesSync = function(path9, at, mt) {
          var fd = fs5.openSync(path9, constants7.O_SYMLINK), ret, threw = !0;
          try {
            ret = fs5.futimesSync(fd, at, mt), threw = !1;
          } finally {
            if (threw)
              try {
                fs5.closeSync(fd);
              } catch (er) {}
            else
              fs5.closeSync(fd);
          }
          return ret;
        };
      else if (fs5.futimes)
        fs5.lutimes = function(_a2, _b, _c, cb) {
          if (cb)
            process.nextTick(cb);
        }, fs5.lutimesSync = function() {};
    }
    function chmodFix(orig) {
      if (!orig)
        return orig;
      return function(target, mode, cb) {
        return orig.call(fs4, target, mode, function(er) {
          if (chownErOk(er))
            er = null;
          if (cb)
            cb.apply(this, arguments);
        });
      };
    }
    function chmodFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, mode) {
        try {
          return orig.call(fs4, target, mode);
        } catch (er) {
          if (!chownErOk(er))
            throw er;
        }
      };
    }
    function chownFix(orig) {
      if (!orig)
        return orig;
      return function(target, uid, gid, cb) {
        return orig.call(fs4, target, uid, gid, function(er) {
          if (chownErOk(er))
            er = null;
          if (cb)
            cb.apply(this, arguments);
        });
      };
    }
    function chownFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, uid, gid) {
        try {
          return orig.call(fs4, target, uid, gid);
        } catch (er) {
          if (!chownErOk(er))
            throw er;
        }
      };
    }
    function statFix(orig) {
      if (!orig)
        return orig;
      return function(target, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        function callback(er, stats) {
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          if (cb)
            cb.apply(this, arguments);
        }
        return options ? orig.call(fs4, target, options, callback) : orig.call(fs4, target, callback);
      };
    }
    function statFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, options) {
        var stats = options ? orig.call(fs4, target, options) : orig.call(fs4, target);
        if (stats) {
          if (stats.uid < 0)
            stats.uid += 4294967296;
          if (stats.gid < 0)
            stats.gid += 4294967296;
        }
        return stats;
      };
    }
    function chownErOk(er) {
      if (!er)
        return !0;
      if (er.code === "ENOSYS")
        return !0;
      var nonroot = !process.getuid || process.getuid() !== 0;
      if (nonroot) {
        if (er.code === "EINVAL" || er.code === "EPERM")
          return !0;
      }
      return !1;
    }
  }
});
