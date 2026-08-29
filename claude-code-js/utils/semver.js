// Original: src/utils/semver.ts
function getNpmSemver() {
  if (!_npmSemver)
    _npmSemver = require_semver2();
  return _npmSemver;
}
function gt(a2, b) {
  if (typeof Bun < "u")
    return Bun.semver.order(a2, b) === 1;
  return getNpmSemver().gt(a2, b, { loose: !0 });
}
function gte(a2, b) {
  if (typeof Bun < "u")
    return Bun.semver.order(a2, b) >= 0;
  return getNpmSemver().gte(a2, b, { loose: !0 });
}
function lt(a2, b) {
  if (typeof Bun < "u")
    return Bun.semver.order(a2, b) === -1;
  return getNpmSemver().lt(a2, b, { loose: !0 });
}
function satisfies(version5, range) {
  if (typeof Bun < "u")
    return Bun.semver.satisfies(version5, range);
  return getNpmSemver().satisfies(version5, range, { loose: !0 });
}
var _npmSemver;
