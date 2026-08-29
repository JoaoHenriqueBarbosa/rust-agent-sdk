// function: copyFileHistoryForResume
async function copyFileHistoryForResume(log3) {
  if (!fileHistoryEnabled())
    return;
  let fileHistorySnapshots = log3.fileHistorySnapshots;
  if (!fileHistorySnapshots || log3.messages.length === 0)
    return;
  let previousSessionId = log3.messages[log3.messages.length - 1]?.sessionId;
  if (!previousSessionId) {
    logError2(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
    return;
  }
  let sessionId = getSessionId();
  if (previousSessionId === sessionId) {
    logForDebugging(`FileHistory: No need to copy file history for resuming with same session id: ${sessionId}`);
    return;
  }
  try {
    let newBackupDir = join74(getClaudeConfigHomeDir(), "file-history", sessionId);
    await mkdir14(newBackupDir, { recursive: !0 });
    let failedSnapshots = 0;
    if (await Promise.allSettled(fileHistorySnapshots.map(async (snapshot2) => {
      let backupEntries = Object.values(snapshot2.trackedFileBackups).filter((backup) => backup.backupFileName !== null);
      if (!(await Promise.allSettled(backupEntries.map(async ({ backupFileName }) => {
        let oldBackupPath = resolveBackupPath(backupFileName, previousSessionId), newBackupPath = join74(newBackupDir, backupFileName);
        try {
          await link3(oldBackupPath, newBackupPath);
        } catch (e) {
          let code = getErrnoCode(e);
          if (code === "EEXIST")
            return;
          if (code === "ENOENT")
            throw logError2(Error(`FileHistory: Failed to copy backup ${backupFileName} on restore (backup file does not exist in ${previousSessionId})`)), e;
          logError2(Error("FileHistory: Error hard linking backup file from previous session"));
          try {
            await copyFile4(oldBackupPath, newBackupPath);
          } catch (copyErr) {
            throw logError2(Error("FileHistory: Error copying over backup from previous session")), copyErr;
          }
        }
        logForDebugging(`FileHistory: Copied backup ${backupFileName} from session ${previousSessionId} to ${sessionId}`);
      }))).some((r4) => r4.status === "rejected"))
        recordFileHistorySnapshot(snapshot2.messageId, snapshot2, !1).catch((_) => {
          logError2(Error("FileHistory: Failed to record copy backup snapshot"));
        });
      else
        failedSnapshots++;
    })), failedSnapshots > 0)
      logEvent("tengu_file_history_resume_copy_failed", {
        numSnapshots: fileHistorySnapshots.length,
        failedSnapshots
      });
  } catch (error44) {
    logError2(error44);
  }
}
