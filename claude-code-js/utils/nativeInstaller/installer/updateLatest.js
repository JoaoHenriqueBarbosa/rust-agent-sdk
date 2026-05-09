// function: updateLatest
async function updateLatest(channelOrVersion, forceReinstall = !1) {
  let startTime = Date.now(), version5 = await getLatestVersion2(channelOrVersion), { executable: executablePath } = getBaseDirectories();
  if (logForDebugging(`Checking for native installer update to version ${version5}`), !forceReinstall) {
    let maxVersion = await getMaxVersion();
    if (maxVersion && gt(version5, maxVersion)) {
      if (logForDebugging(`Native installer: maxVersion ${maxVersion} is set, capping update from ${version5} to ${maxVersion}`), gte("2.1.90", maxVersion))
        return logForDebugging(`Native installer: current version 2.1.90 is already at or above maxVersion ${maxVersion}, skipping update`), logEvent("tengu_native_update_skipped_max_version", {
          latency_ms: Date.now() - startTime,
          max_version: maxVersion,
          available_version: version5
        }), { success: !0, latestVersion: version5 };
      version5 = maxVersion;
    }
  }
  if (!forceReinstall && version5 === "2.1.90" && await versionIsAvailable(version5) && await isPossibleClaudeBinary(executablePath))
    return logForDebugging(`Found ${version5} at ${executablePath}, skipping install`), logEvent("tengu_native_update_complete", {
      latency_ms: Date.now() - startTime,
      was_new_install: !1,
      was_force_reinstall: !1,
      was_already_running: !0
    }), { success: !0, latestVersion: version5 };
  if (!forceReinstall && shouldSkipVersion(version5))
    return logEvent("tengu_native_update_skipped_minimum_version", {
      latency_ms: Date.now() - startTime,
      target_version: version5
    }), { success: !0, latestVersion: version5 };
  let wasNewInstall = !1, latencyMs;
  if (isEnvTruthy(process.env.ENABLE_LOCKLESS_UPDATES))
    wasNewInstall = await performVersionUpdate(version5, forceReinstall), latencyMs = Date.now() - startTime;
  else {
    let { installPath } = await getVersionPaths(version5);
    if (forceReinstall)
      await forceRemoveLock(installPath);
    let lockAcquired = await tryWithVersionLock(installPath, async () => {
      wasNewInstall = await performVersionUpdate(version5, forceReinstall);
    }, 3);
    if (latencyMs = Date.now() - startTime, !lockAcquired) {
      let dirs = getBaseDirectories(), lockHolderPid;
      if (isPidBasedLockingEnabled()) {
        let lockfilePath = getLockFilePathFromVersionPath(dirs, installPath);
        if (isLockActive(lockfilePath))
          lockHolderPid = readLockContent(lockfilePath)?.pid;
      }
      return logEvent("tengu_native_update_lock_failed", {
        latency_ms: latencyMs,
        lock_holder_pid: lockHolderPid
      }), {
        success: !1,
        latestVersion: version5,
        lockFailed: !0,
        lockHolderPid
      };
    }
  }
  return logEvent("tengu_native_update_complete", {
    latency_ms: latencyMs,
    was_new_install: wasNewInstall,
    was_force_reinstall: forceReinstall
  }), logForDebugging(`Successfully updated to version ${version5}`), { success: !0, latestVersion: version5 };
}
