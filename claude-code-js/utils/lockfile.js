// Original: src/utils/lockfile.ts
function getLockfile() {
  if (!_lockfile)
    _lockfile = require_proper_lockfile();
  return _lockfile;
}
function lock(file2, options) {
  return getLockfile().lock(file2, options);
}
function lockSync(file2, options) {
  return getLockfile().lockSync(file2, options);
}
function check2(file2, options) {
  return getLockfile().check(file2, options);
}
var _lockfile;
