// var: require_proper_lockfile
var require_proper_lockfile = __commonJS((exports, module) => {
  var lockfile = require_lockfile(), { toPromise, toSync, toSyncOptions } = require_adapter();
  async function lock(file2, options) {
    let release = await toPromise(lockfile.lock)(file2, options);
    return toPromise(release);
  }
  function lockSync(file2, options) {
    let release = toSync(lockfile.lock)(file2, toSyncOptions(options));
    return toSync(release);
  }
  function unlock(file2, options) {
    return toPromise(lockfile.unlock)(file2, options);
  }
  function unlockSync(file2, options) {
    return toSync(lockfile.unlock)(file2, toSyncOptions(options));
  }
  function check2(file2, options) {
    return toPromise(lockfile.check)(file2, options);
  }
  function checkSync(file2, options) {
    return toSync(lockfile.check)(file2, toSyncOptions(options));
  }
  module.exports = lock;
  module.exports.lock = lock;
  module.exports.unlock = unlock;
  module.exports.lockSync = lockSync;
  module.exports.unlockSync = unlockSync;
  module.exports.check = check2;
  module.exports.checkSync = checkSync;
});
