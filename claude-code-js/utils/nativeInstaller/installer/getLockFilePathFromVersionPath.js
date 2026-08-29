// function: getLockFilePathFromVersionPath
function getLockFilePathFromVersionPath(dirs, versionPath) {
  let versionName = basename15(versionPath);
  return join69(dirs.locks, `${versionName}.lock`);
}
