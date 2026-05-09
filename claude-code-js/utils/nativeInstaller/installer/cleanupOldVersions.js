// function: cleanupOldVersions
async function cleanupOldVersions() {
  await Promise.resolve();
  let dirs = getBaseDirectories(), oneHourAgo = Date.now() - 3600000;
  if (getPlatform3().startsWith("win32")) {
    let executableDir = dirname30(dirs.executable);
    try {
      let files2 = await readdir8(executableDir), cleanedCount = 0;
      for (let file2 of files2) {
        if (!/^claude\.exe\.old\.\d+$/.test(file2))
          continue;
        try {
          await unlink6(join69(executableDir, file2)), cleanedCount++;
        } catch {}
      }
      if (cleanedCount > 0)
        logForDebugging(`Cleaned up ${cleanedCount} old Windows executables on startup`);
    } catch (error44) {
      if (!isENOENT(error44))
        logForDebugging(`Failed to clean up old Windows executables: ${error44}`);
    }
  }
  try {
    let stagingEntries = await readdir8(dirs.staging), stagingCleanedCount = 0;
    for (let entry of stagingEntries) {
      let stagingPath = join69(dirs.staging, entry);
      try {
        if ((await stat19(stagingPath)).mtime.getTime() < oneHourAgo)
          await rm5(stagingPath, { recursive: !0, force: !0 }), stagingCleanedCount++, logForDebugging(`Cleaned up old staging directory: ${entry}`);
      } catch {}
    }
    if (stagingCleanedCount > 0)
      logForDebugging(`Cleaned up ${stagingCleanedCount} orphaned staging directories`), logEvent("tengu_native_staging_cleanup", {
        cleaned_count: stagingCleanedCount
      });
  } catch (error44) {
    if (!isENOENT(error44))
      logForDebugging(`Failed to clean up staging directories: ${error44}`);
  }
  if (isPidBasedLockingEnabled()) {
    let staleLocksCleaned = cleanupStaleLocks(dirs.locks);
    if (staleLocksCleaned > 0)
      logForDebugging(`Cleaned up ${staleLocksCleaned} stale version locks`), logEvent("tengu_native_stale_locks_cleanup", {
        cleaned_count: staleLocksCleaned
      });
  }
  let versionEntries;
  try {
    versionEntries = await readdir8(dirs.versions);
  } catch (error44) {
    if (!isENOENT(error44))
      logForDebugging(`Failed to readdir versions directory: ${error44}`);
    return;
  }
  let versionFiles = [], tempFilesCleanedCount = 0;
  for (let entry of versionEntries) {
    let entryPath = join69(dirs.versions, entry);
    if (/\.tmp\.\d+\.\d+$/.test(entry)) {
      try {
        if ((await stat19(entryPath)).mtime.getTime() < oneHourAgo)
          await unlink6(entryPath), tempFilesCleanedCount++, logForDebugging(`Cleaned up orphaned temp install file: ${entry}`);
      } catch {}
      continue;
    }
    try {
      let stats = await stat19(entryPath);
      if (!stats.isFile())
        continue;
      if (process.platform !== "win32" && stats.size > 0 && (stats.mode & 73) === 0)
        continue;
      versionFiles.push({
        name: entry,
        path: entryPath,
        resolvedPath: resolve26(entryPath),
        mtime: stats.mtime
      });
    } catch {}
  }
  if (tempFilesCleanedCount > 0)
    logForDebugging(`Cleaned up ${tempFilesCleanedCount} orphaned temp install files`), logEvent("tengu_native_temp_files_cleanup", {
      cleaned_count: tempFilesCleanedCount
    });
  if (versionFiles.length === 0)
    return;
  try {
    let currentBinaryPath = process.execPath, protectedVersions = /* @__PURE__ */ new Set;
    if (currentBinaryPath && currentBinaryPath.includes(dirs.versions))
      protectedVersions.add(resolve26(currentBinaryPath));
    let currentSymlinkVersion = await getVersionFromSymlink(dirs.executable);
    if (currentSymlinkVersion)
      protectedVersions.add(currentSymlinkVersion);
    for (let v2 of versionFiles) {
      if (protectedVersions.has(v2.resolvedPath))
        continue;
      let lockFilePath = getLockFilePathFromVersionPath(dirs, v2.resolvedPath), hasActiveLock = !1;
      if (isPidBasedLockingEnabled())
        hasActiveLock = isLockActive(lockFilePath);
      else
        try {
          hasActiveLock = await check2(v2.resolvedPath, {
            stale: LOCK_STALE_MS,
            lockfilePath: lockFilePath
          });
        } catch {
          hasActiveLock = !1;
        }
      if (hasActiveLock)
        protectedVersions.add(v2.resolvedPath), logForDebugging(`Protecting locked version from cleanup: ${v2.name}`);
    }
    let versionsToDelete = versionFiles.filter((v2) => !protectedVersions.has(v2.resolvedPath)).sort((a2, b) => b.mtime.getTime() - a2.mtime.getTime()).slice(VERSION_RETENTION_COUNT);
    if (versionsToDelete.length === 0) {
      logEvent("tengu_native_version_cleanup", {
        total_count: versionFiles.length,
        deleted_count: 0,
        protected_count: protectedVersions.size,
        retained_count: VERSION_RETENTION_COUNT,
        lock_failed_count: 0,
        error_count: 0
      });
      return;
    }
    let deletedCount = 0, lockFailedCount = 0, errorCount = 0;
    await Promise.all(versionsToDelete.map(async (version5) => {
      try {
        if (await tryWithVersionLock(version5.path, async () => {
          await unlink6(version5.path);
        }))
          deletedCount++;
        else
          lockFailedCount++, logForDebugging(`Skipping deletion of ${version5.name} - locked by another process`);
      } catch (error44) {
        errorCount++, logError2(Error(`Failed to delete version ${version5.name}: ${error44}`));
      }
    })), logEvent("tengu_native_version_cleanup", {
      total_count: versionFiles.length,
      deleted_count: deletedCount,
      protected_count: protectedVersions.size,
      retained_count: VERSION_RETENTION_COUNT,
      lock_failed_count: lockFailedCount,
      error_count: errorCount
    });
  } catch (error44) {
    if (!isENOENT(error44))
      logError2(Error(`Version cleanup failed: ${error44}`));
  }
}
