// function: tryWithVersionLock
async function tryWithVersionLock(versionFilePath, callback, retries = 0) {
  let dirs = getBaseDirectories(), lockfilePath = getLockFilePathFromVersionPath(dirs, versionFilePath);
  if (await mkdir10(dirs.locks, { recursive: !0 }), isPidBasedLockingEnabled()) {
    let attempts = 0, maxAttempts = retries + 1, minTimeout = retries > 0 ? 1000 : 100, maxTimeout = retries > 0 ? 5000 : 500;
    while (attempts < maxAttempts) {
      if (await withLock(versionFilePath, lockfilePath, async () => {
        try {
          await callback();
        } catch (error44) {
          throw logError2(error44), error44;
        }
      }))
        return logEvent("tengu_version_lock_acquired", {
          is_pid_based: !0,
          is_lifetime_lock: !1,
          attempts: attempts + 1
        }), !0;
      if (attempts++, attempts < maxAttempts) {
        let timeout = Math.min(minTimeout * Math.pow(2, attempts - 1), maxTimeout);
        await sleep3(timeout);
      }
    }
    return logEvent("tengu_version_lock_failed", {
      is_pid_based: !0,
      is_lifetime_lock: !1,
      attempts: maxAttempts
    }), logLockAcquisitionError(versionFilePath, Error("Lock held by another process")), !1;
  }
  let release = null;
  try {
    try {
      release = await lock(versionFilePath, {
        stale: LOCK_STALE_MS,
        retries: {
          retries,
          minTimeout: retries > 0 ? 1000 : 100,
          maxTimeout: retries > 0 ? 5000 : 500
        },
        lockfilePath,
        onCompromised: (err2) => {
          logForDebugging(`NON-FATAL: Version lock was compromised during operation: ${err2.message}`, { level: "info" });
        }
      });
    } catch (lockError) {
      return logEvent("tengu_version_lock_failed", {
        is_pid_based: !1,
        is_lifetime_lock: !1
      }), logLockAcquisitionError(versionFilePath, lockError), !1;
    }
    try {
      return await callback(), logEvent("tengu_version_lock_acquired", {
        is_pid_based: !1,
        is_lifetime_lock: !1
      }), !0;
    } catch (error44) {
      throw logError2(error44), error44;
    }
  } finally {
    if (release)
      await release();
  }
}
