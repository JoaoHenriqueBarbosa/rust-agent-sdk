// var: require_isexe
var require_isexe = __commonJS((exports, module) => {
  var fs2 = __require("fs"), core2;
  if (process.platform === "win32" || global.TESTING_WINDOWS)
    core2 = require_windows();
  else
    core2 = require_mode();
  module.exports = isexe;
  isexe.sync = sync;
  function isexe(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = {};
    if (!cb) {
      if (typeof Promise !== "function")
        throw TypeError("callback not provided");
      return new Promise(function(resolve2, reject) {
        isexe(path2, options || {}, function(er, is) {
          if (er)
            reject(er);
          else
            resolve2(is);
        });
      });
    }
    core2(path2, options || {}, function(er, is) {
      if (er) {
        if (er.code === "EACCES" || options && options.ignoreErrors)
          er = null, is = !1;
      }
      cb(er, is);
    });
  }
  function sync(path2, options) {
    try {
      return core2.sync(path2, options || {});
    } catch (er) {
      if (options && options.ignoreErrors || er.code === "EACCES")
        return !1;
      else
        throw er;
    }
  }
});
