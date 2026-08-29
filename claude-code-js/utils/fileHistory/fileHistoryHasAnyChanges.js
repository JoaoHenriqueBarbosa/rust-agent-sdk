// function: fileHistoryHasAnyChanges
async function fileHistoryHasAnyChanges(state3, messageId) {
  if (!fileHistoryEnabled())
    return !1;
  let targetSnapshot = state3.snapshots.findLast((snapshot2) => snapshot2.messageId === messageId);
  if (!targetSnapshot)
    return !1;
  for (let trackingPath of state3.trackedFiles)
    try {
      let filePath = maybeExpandFilePath(trackingPath), targetBackup = targetSnapshot.trackedFileBackups[trackingPath], backupFileName = targetBackup ? targetBackup.backupFileName : getBackupFileNameFirstVersion(trackingPath, state3);
      if (backupFileName === void 0)
        continue;
      if (backupFileName === null) {
        if (await pathExists(filePath))
          return !0;
        continue;
      }
      if (await checkOriginFileChanged(filePath, backupFileName))
        return !0;
    } catch (error44) {
      logError2(error44);
    }
  return !1;
}
