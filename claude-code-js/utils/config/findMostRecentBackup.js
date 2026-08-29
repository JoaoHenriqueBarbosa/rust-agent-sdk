// function: findMostRecentBackup
function findMostRecentBackup(file2) {
  let fs4 = getFsImplementation(), fileBase = basename4(file2), backupDir = getConfigBackupDir();
  try {
    let mostRecent = fs4.readdirStringSync(backupDir).filter((f) => f.startsWith(`${fileBase}.backup.`)).sort().at(-1);
    if (mostRecent)
      return join20(backupDir, mostRecent);
  } catch {}
  let fileDir = dirname12(file2);
  try {
    let mostRecent = fs4.readdirStringSync(fileDir).filter((f) => f.startsWith(`${fileBase}.backup.`)).sort().at(-1);
    if (mostRecent)
      return join20(fileDir, mostRecent);
    let legacyBackup = `${file2}.backup`;
    try {
      return fs4.statSync(legacyBackup), legacyBackup;
    } catch {}
  } catch {}
  return null;
}
