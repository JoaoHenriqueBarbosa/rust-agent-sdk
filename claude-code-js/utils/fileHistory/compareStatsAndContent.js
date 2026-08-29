// function: compareStatsAndContent
function compareStatsAndContent(originalStats, backupStats, compareContent) {
  if (originalStats === null !== (backupStats === null))
    return !0;
  if (originalStats === null || backupStats === null)
    return !1;
  if (originalStats.mode !== backupStats.mode || originalStats.size !== backupStats.size)
    return !0;
  if (originalStats.mtimeMs < backupStats.mtimeMs)
    return !1;
  return compareContent();
}
