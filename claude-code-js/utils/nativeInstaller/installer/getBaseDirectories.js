// function: getBaseDirectories
function getBaseDirectories() {
  let platform5 = getPlatform3(), executableName = getBinaryName(platform5);
  return {
    versions: join69(getXDGDataHome(), "claude", "versions"),
    staging: join69(getXDGCacheHome(), "claude", "staging"),
    locks: join69(getXDGStateHome(), "claude", "locks"),
    executable: join69(getUserBinDir(), executableName)
  };
}
