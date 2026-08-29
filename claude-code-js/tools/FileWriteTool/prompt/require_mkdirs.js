// var: require_mkdirs
var require_mkdirs = __commonJS((exports, module) => {
  var u5 = require_universalify().fromPromise, { makeDir: _makeDir, makeDirSync } = require_make_dir(), makeDir = u5(_makeDir);
  module.exports = {
    mkdirs: makeDir,
    mkdirsSync: makeDirSync,
    mkdirp: makeDir,
    mkdirpSync: makeDirSync,
    ensureDir: makeDir,
    ensureDirSync: makeDirSync
  };
});
