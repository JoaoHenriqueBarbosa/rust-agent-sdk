// function: fileHistoryGetDiffStats
async function fileHistoryGetDiffStats(state3, messageId) {
  if (!fileHistoryEnabled())
    return;
  let targetSnapshot = state3.snapshots.findLast((snapshot2) => snapshot2.messageId === messageId);
  if (!targetSnapshot)
    return;
  let results = await Promise.all(Array.from(state3.trackedFiles, async (trackingPath) => {
    try {
      let filePath = maybeExpandFilePath(trackingPath), targetBackup = targetSnapshot.trackedFileBackups[trackingPath], backupFileName = targetBackup ? targetBackup.backupFileName : getBackupFileNameFirstVersion(trackingPath, state3);
      if (backupFileName === void 0)
        return logError2(Error("FileHistory: Error finding the backup file to apply")), logEvent("tengu_file_history_rewind_restore_file_failed", {
          dryRun: !0
        }), null;
      let stats = await computeDiffStatsForFile(filePath, backupFileName === null ? void 0 : backupFileName);
      if (stats?.insertions || stats?.deletions)
        return { filePath, stats };
      if (backupFileName === null && await pathExists(filePath))
        return { filePath, stats };
      return null;
    } catch (error44) {
      return logError2(error44), logEvent("tengu_file_history_rewind_restore_file_failed", {
        dryRun: !0
      }), null;
    }
  })), filesChanged = [], insertions = 0, deletions = 0;
  for (let r4 of results) {
    if (!r4)
      continue;
    filesChanged.push(r4.filePath), insertions += r4.stats?.insertions || 0, deletions += r4.stats?.deletions || 0;
  }
  return { filesChanged, insertions, deletions };
}
