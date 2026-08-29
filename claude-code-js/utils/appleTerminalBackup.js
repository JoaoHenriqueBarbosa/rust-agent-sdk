// Original: src/utils/appleTerminalBackup.ts
import { stat as stat33 } from "fs/promises";
import { homedir as homedir27 } from "os";
import { join as join102 } from "path";
function markTerminalSetupInProgress(backupPath) {
  saveGlobalConfig((current) => ({
    ...current,
    appleTerminalSetupInProgress: !0,
    appleTerminalBackupPath: backupPath
  }));
}
function markTerminalSetupComplete() {
  saveGlobalConfig((current) => ({
    ...current,
    appleTerminalSetupInProgress: !1
  }));
}
function getTerminalRecoveryInfo() {
  let config10 = getGlobalConfig();
  return {
    inProgress: config10.appleTerminalSetupInProgress ?? !1,
    backupPath: config10.appleTerminalBackupPath || null
  };
}
function getTerminalPlistPath() {
  return join102(homedir27(), "Library", "Preferences", "com.apple.Terminal.plist");
}
async function backupTerminalPreferences() {
  let terminalPlistPath = getTerminalPlistPath(), backupPath = `${terminalPlistPath}.bak`;
  try {
    let { code } = await execFileNoThrow("defaults", [
      "export",
      "com.apple.Terminal",
      terminalPlistPath
    ]);
    if (code !== 0)
      return null;
    try {
      await stat33(terminalPlistPath);
    } catch {
      return null;
    }
    return await execFileNoThrow("defaults", [
      "export",
      "com.apple.Terminal",
      backupPath
    ]), markTerminalSetupInProgress(backupPath), backupPath;
  } catch (error44) {
    return logError2(error44), null;
  }
}
async function checkAndRestoreTerminalBackup() {
  let { inProgress, backupPath } = getTerminalRecoveryInfo();
  if (!inProgress)
    return { status: "no_backup" };
  if (!backupPath)
    return markTerminalSetupComplete(), { status: "no_backup" };
  try {
    await stat33(backupPath);
  } catch {
    return markTerminalSetupComplete(), { status: "no_backup" };
  }
  try {
    let { code } = await execFileNoThrow("defaults", [
      "import",
      "com.apple.Terminal",
      backupPath
    ]);
    if (code !== 0)
      return { status: "failed", backupPath };
    return await execFileNoThrow("killall", ["cfprefsd"]), markTerminalSetupComplete(), { status: "restored" };
  } catch (restoreError) {
    return logError2(Error(`Failed to restore Terminal.app settings with: ${restoreError}`)), markTerminalSetupComplete(), { status: "failed", backupPath };
  }
}
var init_appleTerminalBackup = __esm(() => {
  init_config4();
  init_execFileNoThrow();
  init_log3();
});
