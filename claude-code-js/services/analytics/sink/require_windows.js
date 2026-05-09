// var: require_windows
var require_windows = __commonJS((exports, module) => {
  module.exports = isexe;
  isexe.sync = sync;
  var fs2 = __require("fs");
  function checkPathExt(path2, options) {
    var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
    if (!pathext)
      return !0;
    if (pathext = pathext.split(";"), pathext.indexOf("") !== -1)
      return !0;
    for (var i = 0;i < pathext.length; i++) {
      var p = pathext[i].toLowerCase();
      if (p && path2.substr(-p.length).toLowerCase() === p)
        return !0;
    }
    return !1;
  }
  function checkStat(stat, path2, options) {
    if (!stat.isSymbolicLink() && !stat.isFile())
      return !1;
    return checkPathExt(path2, options);
  }
  function isexe(path2, options, cb) {
    fs2.stat(path2, function(er, stat) {
      cb(er, er ? !1 : checkStat(stat, path2, options));
    });
  }
  function sync(path2, options) {
    return checkStat(fs2.statSync(path2), path2, options);
  }
});
