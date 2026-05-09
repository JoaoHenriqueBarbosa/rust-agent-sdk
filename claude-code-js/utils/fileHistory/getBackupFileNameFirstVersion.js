// function: getBackupFileNameFirstVersion
function getBackupFileNameFirstVersion(trackingPath, state3) {
  for (let snapshot2 of state3.snapshots) {
    let backup = snapshot2.trackedFileBackups[trackingPath];
    if (backup !== void 0 && backup.version === 1)
      return backup.backupFileName;
  }
  return;
}
