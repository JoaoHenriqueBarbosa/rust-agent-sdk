// function: restoreBackup
async function restoreBackup(filePath, backupFileName) {
  let backupPath = resolveBackupPath(backupFileName), backupStats;
  try {
    backupStats = await stat20(backupPath);
  } catch (e) {
    if (isENOENT(e)) {
      logEvent("tengu_file_history_rewind_restore_file_failed", {}), logError2(Error(`FileHistory: [Rewind] Backup file not found: ${backupPath}`));
      return;
    }
    throw e;
  }
  try {
    await copyFile4(backupPath, filePath);
  } catch (e) {
    if (!isENOENT(e))
      throw e;
    await mkdir14(dirname31(filePath), { recursive: !0 }), await copyFile4(backupPath, filePath);
  }
  await chmod6(filePath, backupStats.mode);
}
