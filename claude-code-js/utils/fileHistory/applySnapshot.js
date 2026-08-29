// function: applySnapshot
async function applySnapshot(state3, targetSnapshot) {
  let filesChanged = [];
  for (let trackingPath of state3.trackedFiles)
    try {
      let filePath = maybeExpandFilePath(trackingPath), targetBackup = targetSnapshot.trackedFileBackups[trackingPath], backupFileName = targetBackup ? targetBackup.backupFileName : getBackupFileNameFirstVersion(trackingPath, state3);
      if (backupFileName === void 0) {
        logError2(Error("FileHistory: Error finding the backup file to apply")), logEvent("tengu_file_history_rewind_restore_file_failed", {
          dryRun: !1
        });
        continue;
      }
      if (backupFileName === null) {
        try {
          await unlink8(filePath), logForDebugging(`FileHistory: [Rewind] Deleted ${filePath}`), filesChanged.push(filePath);
        } catch (e) {
          if (!isENOENT(e))
            throw e;
        }
        continue;
      }
      if (await checkOriginFileChanged(filePath, backupFileName))
        await restoreBackup(filePath, backupFileName), logForDebugging(`FileHistory: [Rewind] Restored ${filePath} from ${backupFileName}`), filesChanged.push(filePath);
    } catch (error44) {
      logError2(error44), logEvent("tengu_file_history_rewind_restore_file_failed", {
        dryRun: !1
      });
    }
  return filesChanged;
}
