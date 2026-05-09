// function: saveConfigWithLock
function saveConfigWithLock(file2, createDefault, mergeFn) {
  let defaultConfig = createDefault(), dir = dirname12(file2), fs4 = getFsImplementation();
  fs4.mkdirSync(dir);
  let release;
  try {
    let lockFilePath = `${file2}.lock`, startTime = Date.now();
    release = lockSync(file2, {
      lockfilePath: lockFilePath,
      onCompromised: (err) => {
        logForDebugging(`Config lock compromised: ${err}`, { level: "error" });
      }
    });
    let lockTime = Date.now() - startTime;
    if (lockTime > 100)
      logForDebugging("Lock acquisition took longer than expected - another Claude instance may be running"), logEvent("tengu_config_lock_contention", {
        lock_time_ms: lockTime
      });
    if (lastReadFileStats && file2 === getGlobalClaudeFile())
      try {
        let currentStats = fs4.statSync(file2);
        if (currentStats.mtimeMs !== lastReadFileStats.mtime || currentStats.size !== lastReadFileStats.size)
          logEvent("tengu_config_stale_write", {
            read_mtime: lastReadFileStats.mtime,
            write_mtime: currentStats.mtimeMs,
            read_size: lastReadFileStats.size,
            write_size: currentStats.size
          });
      } catch (e) {
        if (getErrnoCode(e) !== "ENOENT")
          throw e;
      }
    let currentConfig = getConfig(file2, createDefault);
    if (file2 === getGlobalClaudeFile() && wouldLoseAuthState(currentConfig))
      return logForDebugging("saveConfigWithLock: re-read config is missing auth that cache has; refusing to write to avoid wiping ~/.claude.json. See GH #3117.", { level: "error" }), logEvent("tengu_config_auth_loss_prevented", {}), !1;
    let mergedConfig = mergeFn(currentConfig);
    if (mergedConfig === currentConfig)
      return !1;
    let filteredConfig = pickBy_default(mergedConfig, (value, key) => jsonStringify(value) !== jsonStringify(defaultConfig[key]));
    try {
      let fileBase = basename4(file2), backupDir = getConfigBackupDir();
      try {
        fs4.mkdirSync(backupDir);
      } catch (mkdirErr) {
        if (getErrnoCode(mkdirErr) !== "EEXIST")
          throw mkdirErr;
      }
      let MIN_BACKUP_INTERVAL_MS = 60000, existingBackups = fs4.readdirStringSync(backupDir).filter((f) => f.startsWith(`${fileBase}.backup.`)).sort().reverse(), mostRecentBackup = existingBackups[0], mostRecentTimestamp = mostRecentBackup ? Number(mostRecentBackup.split(".backup.").pop()) : 0, shouldCreateBackup = Number.isNaN(mostRecentTimestamp) || Date.now() - mostRecentTimestamp >= MIN_BACKUP_INTERVAL_MS;
      if (shouldCreateBackup) {
        let backupPath = join20(backupDir, `${fileBase}.backup.${Date.now()}`);
        fs4.copyFileSync(file2, backupPath);
      }
      let MAX_BACKUPS = 5, backupsForCleanup = shouldCreateBackup ? fs4.readdirStringSync(backupDir).filter((f) => f.startsWith(`${fileBase}.backup.`)).sort().reverse() : existingBackups;
      for (let oldBackup of backupsForCleanup.slice(MAX_BACKUPS))
        try {
          fs4.unlinkSync(join20(backupDir, oldBackup));
        } catch {}
    } catch (e) {
      if (getErrnoCode(e) !== "ENOENT")
        logForDebugging(`Failed to backup config: ${e}`, {
          level: "error"
        });
    }
    if (writeFileSyncAndFlush_DEPRECATED(file2, jsonStringify(filteredConfig, null, 2), {
      encoding: "utf-8",
      mode: 384
    }), file2 === getGlobalClaudeFile())
      globalConfigWriteCount++;
    return !0;
  } finally {
    if (release)
      release();
  }
}
