// var: require_mode
var require_mode = __commonJS((exports, module) => {
  module.exports = isexe;
  isexe.sync = sync;
  var fs2 = __require("fs");
  function isexe(path2, options, cb) {
    fs2.stat(path2, function(er, stat) {
      cb(er, er ? !1 : checkStat(stat, options));
    });
  }
  function sync(path2, options) {
    return checkStat(fs2.statSync(path2), options);
  }
  function checkStat(stat, options) {
    return stat.isFile() && checkMode(stat, options);
  }
  function checkMode(stat, options) {
    var { mode: mod, uid, gid } = stat, myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid(), myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid(), u = parseInt("100", 8), g = parseInt("010", 8), o = parseInt("001", 8), ug = u | g, ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
    return ret;
  }
});
