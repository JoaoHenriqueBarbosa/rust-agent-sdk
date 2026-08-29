// var: require_remove
var require_remove = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs(), u5 = require_universalify().fromCallback, rimraf = require_rimraf();
  function remove(path16, callback) {
    if (fs14.rm)
      return fs14.rm(path16, { recursive: !0, force: !0 }, callback);
    rimraf(path16, callback);
  }
  function removeSync(path16) {
    if (fs14.rmSync)
      return fs14.rmSync(path16, { recursive: !0, force: !0 });
    rimraf.sync(path16);
  }
  module.exports = {
    remove: u5(remove),
    removeSync
  };
});
