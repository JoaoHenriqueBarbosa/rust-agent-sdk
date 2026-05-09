// function: performVersionUpdate
async function performVersionUpdate(version5, forceReinstall) {
  let { stagingPath: baseStagingPath, installPath } = await getVersionPaths(version5), { executable: executablePath } = getBaseDirectories(), stagingPath = isEnvTruthy(process.env.ENABLE_LOCKLESS_UPDATES) ? `${baseStagingPath}.${process.pid}.${Date.now()}` : baseStagingPath, needsInstall = !await versionIsAvailable(version5) || forceReinstall;
  if (needsInstall) {
    logForDebugging(forceReinstall ? `Force reinstalling native installer version ${version5}` : `Downloading native installer version ${version5}`);
    let downloadType = await downloadVersion(version5, stagingPath);
    await installVersion(stagingPath, installPath, downloadType);
  } else
    logForDebugging(`Version ${version5} already installed, updating symlink`);
  if (await removeDirectoryIfEmpty(executablePath), await updateSymlink(executablePath, installPath), !await isPossibleClaudeBinary(executablePath)) {
    let installPathExists = !1;
    try {
      await stat19(installPath), installPathExists = !0;
    } catch {}
    throw Error(`Failed to create executable at ${executablePath}. Source file exists: ${installPathExists}. Check write permissions to ${executablePath}.`);
  }
  return needsInstall;
}
