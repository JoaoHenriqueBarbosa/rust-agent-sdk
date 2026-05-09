// function: createBackup
async function createBackup(filePath, version5) {
  if (filePath === null)
    return { backupFileName: null, version: version5, backupTime: /* @__PURE__ */ new Date };
  let backupFileName = getBackupFileName(filePath, version5), backupPath = resolveBackupPath(backupFileName), srcStats;
  try {
    srcStats = await stat20(filePath);
  } catch (e) {
    if (isENOENT(e))
      return { backupFileName: null, version: version5, backupTime: /* @__PURE__ */ new Date };
    throw e;
  }
  try {
    await copyFile4(filePath, backupPath);
  } catch (e) {
    if (!isENOENT(e))
      throw e;
    await mkdir14(dirname31(backupPath), { recursive: !0 }), await copyFile4(filePath, backupPath);
  }
  return await chmod6(backupPath, srcStats.mode), logEvent("tengu_file_history_backup_file_created", {
    version: version5,
    fileSize: srcStats.size
  }), {
    backupFileName,
    version: version5,
    backupTime: /* @__PURE__ */ new Date
  };
}
