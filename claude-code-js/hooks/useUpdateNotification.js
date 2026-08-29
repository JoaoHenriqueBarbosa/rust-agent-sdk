// Original: src/hooks/useUpdateNotification.ts
function getSemverPart(version6) {
  return `${import_semver12.major(version6, { loose: !0 })}.${import_semver12.minor(version6, { loose: !0 })}.${import_semver12.patch(version6, { loose: !0 })}`;
}
function useUpdateNotification(updatedVersion, initialVersion = "2.1.90") {
  let [lastNotifiedSemver, setLastNotifiedSemver] = import_react225.useState(() => getSemverPart(initialVersion));
  if (!updatedVersion)
    return null;
  let updatedSemver = getSemverPart(updatedVersion);
  if (updatedSemver !== lastNotifiedSemver)
    return setLastNotifiedSemver(updatedSemver), updatedSemver;
  return null;
}
var import_react225, import_semver12;
var init_useUpdateNotification = __esm(() => {
  import_react225 = __toESM(require_react_development(), 1), import_semver12 = __toESM(require_semver2(), 1);
});
