// function: computeDiffStatsForFile
async function computeDiffStatsForFile(originalFile, backupFileName) {
  let filesChanged = [], insertions = 0, deletions = 0;
  try {
    let backupPath = backupFileName ? resolveBackupPath(backupFileName) : void 0, [originalContent, backupContent] = await Promise.all([
      readFileAsyncOrNull(originalFile),
      backupPath ? readFileAsyncOrNull(backupPath) : null
    ]);
    if (originalContent === null && backupContent === null)
      return {
        filesChanged,
        insertions,
        deletions
      };
    filesChanged.push(originalFile), diffLines(originalContent ?? "", backupContent ?? "").forEach((c3) => {
      if (c3.added)
        insertions += c3.count || 0;
      if (c3.removed)
        deletions += c3.count || 0;
    });
  } catch (error44) {
    logError2(Error(`FileHistory: Error generating diffStats: ${error44}`));
  }
  return {
    filesChanged,
    insertions,
    deletions
  };
}
