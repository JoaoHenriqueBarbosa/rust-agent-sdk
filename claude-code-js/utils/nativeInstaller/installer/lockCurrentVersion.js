// function: lockCurrentVersion
async function lockCurrentVersion() {
  let dirs = getBaseDirectories();
  if (!process.execPath.includes(dirs.versions))
    return;
  let versionPath = resolve26(process.execPath);
  try {
    let lockfilePath = getLockFilePathFromVersionPath(dirs, versionPath);
    if (await mkdir10(dirs.locks, { recursive: !0 }), isPidBasedLockingEnabled()) {
      if (!await acquireProcessLifetimeLock(versionPath, lockfilePath)) {
        logEvent("tengu_version_lock_failed", {
          is_pid_based: !0,
          is_lifetime_lock: !0
        }), logLockAcquisitionError(versionPath, Error("Lock already held by another process"));
        return;
      }
      logEvent("tengu_version_lock_acquired", {
        is_pid_based: !0,
        is_lifetime_lock: !0
      }), logForDebugging(`Acquired PID lock on running version: ${versionPath}`);
    } else {
      let release;
      try {
        release = await lock(versionPath, {
          stale: LOCK_STALE_MS,
          retries: 0,
          lockfilePath,
          onCompromised: (err2) => {
            logForDebugging(`NON-FATAL: Lock on running version was compromised: ${err2.message}`, { level: "info" });
          }
        }), logEvent("tengu_version_lock_acquired", {
          is_pid_based: !1,
          is_lifetime_lock: !0
        }), logForDebugging(`Acquired mtime-based lock on running version: ${versionPath}`), registerCleanup(async () => {
          try {
            await release?.();
          } catch {}
        });
      } catch (lockError) {
        if (isENOENT(lockError)) {
          logForDebugging(`Cannot lock current version - file does not exist: ${versionPath}`, { level: "info" });
          return;
        }
        logEvent("tengu_version_lock_failed", {
          is_pid_based: !1,
          is_lifetime_lock: !0
        }), logLockAcquisitionError(versionPath, lockError);
        return;
      }
    }
  } catch (error44) {
    if (isENOENT(error44)) {
      logForDebugging(`Cannot lock current version - file does not exist: ${versionPath}`, { level: "info" });
      return;
    }
    logForDebugging(`NON-FATAL: Failed to lock current version during execution ${errorMessage(error44)}`, { level: "info" });
  }
}
