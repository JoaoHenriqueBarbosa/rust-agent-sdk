// function: forceRemoveLock
async function forceRemoveLock(versionFilePath) {
  let dirs = getBaseDirectories(), lockfilePath = getLockFilePathFromVersionPath(dirs, versionFilePath);
  try {
    await unlink6(lockfilePath), logForDebugging(`Force-removed lock file at ${lockfilePath}`);
  } catch (error44) {
    logForDebugging(`Failed to force-remove lock file: ${errorMessage(error44)}`);
  }
}
