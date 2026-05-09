// Original: src/utils/iTermBackup.ts
import { copyFile as copyFile12, stat as stat44 } from "fs/promises";
import { homedir as homedir38 } from "os";
import { join as join149 } from "path";
function markITerm2SetupComplete() {
  saveGlobalConfig((current) => ({
    ...current,
    iterm2SetupInProgress: !1
  }));
}
function getIterm2RecoveryInfo() {
  let config11 = getGlobalConfig();
  return {
    inProgress: config11.iterm2SetupInProgress ?? !1,
    backupPath: config11.iterm2BackupPath || null
  };
}
function getITerm2PlistPath() {
  return join149(homedir38(), "Library", "Preferences", "com.googlecode.iterm2.plist");
}
async function checkAndRestoreITerm2Backup() {
  let { inProgress, backupPath } = getIterm2RecoveryInfo();
  if (!inProgress)
    return { status: "no_backup" };
  if (!backupPath)
    return markITerm2SetupComplete(), { status: "no_backup" };
  try {
    await stat44(backupPath);
  } catch {
    return markITerm2SetupComplete(), { status: "no_backup" };
  }
  try {
    return await copyFile12(backupPath, getITerm2PlistPath()), markITerm2SetupComplete(), { status: "restored" };
  } catch (restoreError) {
    return logError2(Error(`Failed to restore iTerm2 settings with: ${restoreError}`)), markITerm2SetupComplete(), { status: "failed", backupPath };
  }
}
var init_iTermBackup = __esm(() => {
  init_config4();
  init_log3();
});
