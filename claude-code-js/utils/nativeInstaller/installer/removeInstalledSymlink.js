// function: removeInstalledSymlink
async function removeInstalledSymlink() {
  let dirs = getBaseDirectories();
  try {
    if (await isNpmSymlink(dirs.executable)) {
      logForDebugging(`Skipping removal of ${dirs.executable} - appears to be npm-managed`);
      return;
    }
    await unlink6(dirs.executable), logForDebugging(`Removed claude symlink at ${dirs.executable}`);
  } catch (error44) {
    if (isENOENT(error44))
      return;
    logError2(Error(`Failed to remove claude symlink: ${error44}`));
  }
}
