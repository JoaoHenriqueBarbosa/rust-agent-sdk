// function: checkOriginFileChanged
async function checkOriginFileChanged(originalFile, backupFileName, originalStatsHint) {
  let backupPath = resolveBackupPath(backupFileName), originalStats = originalStatsHint ?? null;
  if (!originalStats)
    try {
      originalStats = await stat20(originalFile);
    } catch (e) {
      if (!isENOENT(e))
        return !0;
    }
  let backupStats = null;
  try {
    backupStats = await stat20(backupPath);
  } catch (e) {
    if (!isENOENT(e))
      return !0;
  }
  return compareStatsAndContent(originalStats, backupStats, async () => {
    try {
      let [originalContent, backupContent] = await Promise.all([
        readFile22(originalFile, "utf-8"),
        readFile22(backupPath, "utf-8")
      ]);
      return originalContent !== backupContent;
    } catch {
      return !0;
    }
  });
}
